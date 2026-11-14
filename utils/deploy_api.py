"""Deploy a built static site to a GitHub branch via the Git Data API.

Used when the git smart-HTTP push channel through the local proxy is unreliable.
api.github.com stays reachable, so we create blobs/trees/commit and move the ref.
"""
import base64
import datetime
import json
import os
import subprocess
import tempfile

GH = r"C:\Users\26484\AppData\Local\GitHubCLI\bin\gh.exe"
REPO = "ZHANGChang47/BlogVuePress"
BRANCH = "gh-pages"
# dist 目录相对本脚本位置（utils/ -> 仓库根 -> next/dist，Astro 新版产物）
# 旧站产物 docs/.vuepress/dist 已不再是发布源；要回滚旧版直接把 gh-pages 指回旧提交。
DIST = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                      "..", "next", "dist"))
BATCH_BYTES = 256_000
INLINE_MAX_BYTES = 200_000


def api(method, path, payload=None, jq=None):
    cmd = [GH, "api", "-X", method, path]
    tmp = None
    if payload is not None:
        fd, tmp = tempfile.mkstemp(suffix=".json")
        os.close(fd)
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False)
        cmd += ["--input", tmp]
    if jq:
        cmd += ["--jq", jq]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
        if r.returncode != 0:
            raise RuntimeError("gh api %s %s failed (%s): %s" % (method, path, r.returncode, (r.stderr or "")[:600]))
        return r.stdout.strip()
    finally:
        if tmp and os.path.exists(tmp):
            os.unlink(tmp)


def main():
    files = []
    for root, dirs, names in os.walk(DIST):
        if ".git" in dirs:
            dirs.remove(".git")
        for name in names:
            full = os.path.join(root, name)
            rel = os.path.relpath(full, DIST).replace(os.sep, "/")
            with open(full, "rb") as f:
                raw = f.read()
            try:
                text = raw.decode("utf-8")
                if len(text.encode("utf-8")) <= INLINE_MAX_BYTES:
                    files.append((rel, "text", text))
                    continue
            except UnicodeDecodeError:
                pass
            # 大文本或二进制：建 blob，用 sha 引用，避免撑爆 tree 请求体
            files.append((rel, "blob", base64.b64encode(raw).decode("ascii")))
    # Jekyll processing would drop underscore-prefixed directories.
    files.append((".nojekyll", "text", "\n"))
    files.sort(key=lambda x: x[0])
    total = sum(len(v.encode("utf-8")) if k == "text" else len(v) for _, k, v in files)
    print("files=%d approx_bytes=%d" % (len(files), total), flush=True)

    blob_shas = {}
    for rel, kind, value in files:
        if kind == "blob":
            blob_shas[rel] = api("POST", "repos/%s/git/blobs" % REPO,
                                 {"content": value, "encoding": "base64"}, ".sha")
            print("blob %s -> %s" % (rel, blob_shas[rel]), flush=True)

    entries = []
    for rel, kind, value in files:
        e = {"path": rel, "mode": "100644", "type": "blob"}
        if kind == "blob":
            e["sha"] = blob_shas[rel]
        else:
            e["content"] = value
        entries.append(e)

    tree_sha = None
    batch = []
    batch_size = 0
    batch_no = 0

    def flush():
        nonlocal tree_sha, batch, batch_size, batch_no
        if not batch:
            return
        batch_no += 1
        payload = {"tree": batch}
        if tree_sha:
            payload["base_tree"] = tree_sha
        tree_sha = api("POST", "repos/%s/git/trees" % REPO, payload, ".sha")
        print("tree batch %d: %d files -> %s" % (batch_no, len(batch), tree_sha), flush=True)
        batch = []
        batch_size = 0

    for e in entries:
        size = len(json.dumps(e, ensure_ascii=False).encode("utf-8"))
        if batch and batch_size + size > BATCH_BYTES:
            flush()
        batch.append(e)
        batch_size += size
    flush()

    parent = api("GET", "repos/%s/git/ref/heads/%s" % (REPO, BRANCH), None, ".object.sha")
    print("parent=%s" % parent, flush=True)

    stamp = datetime.datetime.now().astimezone().strftime("%Y-%m-%d %H:%M %z")
    commit = api("POST", "repos/%s/git/commits" % REPO, {
        "message": "deploy: Astro 新版博客静态产物 (%s)" % stamp,
        "tree": tree_sha,
        "parents": [parent],
    }, ".sha")
    print("commit=%s" % commit, flush=True)

    api("PATCH", "repos/%s/git/refs/heads/%s" % (REPO, BRANCH), {"sha": commit, "force": False})
    print("REF UPDATED", flush=True)


if __name__ == "__main__":
    main()
