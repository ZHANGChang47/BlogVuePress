/**
 * 文章互动区配置（Giscus · GitHub Discussions）
 *
 * 点赞 = Giscus 自带的 👍 reaction，评论 = Discussions 回复。
 * 数据存放在本站仓库的 Discussions 里，不额外引入数据库，也不做行为追踪。
 *
 * enabled 说明：
 *   false —— 文章页显示「前往讨论区」入口（访客在 GitHub 上留言和点 👍）。
 *   true  —— 页面内嵌 Giscus 评论区，点赞与评论直接在文章下方完成。
 *
 * 前置条件：仓库所有者已在 https://github.com/apps/giscus 安装 giscus App
 * 并授权给 ZHANGChang47/BlogVuePress（OAuth 网页操作，token 无法自动化）；
 * 仓库 Discussions 已开启，分类与 ID 见下方配置。
 */
export const giscus = {
  enabled: true,
  repo: 'ZHANGChang47/BlogVuePress',
  repoId: 'R_kgDOI3n7Yw',
  category: 'Announcements',
  categoryId: 'DIC_kwDOI3n7Y84DLH62',
  discussionsUrl: 'https://github.com/ZHANGChang47/BlogVuePress/discussions/categories/announcements',
  appUrl: 'https://github.com/apps/giscus',
};
