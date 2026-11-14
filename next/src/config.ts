/**
 * 文章互动区配置（Giscus · GitHub Discussions）
 *
 * 点赞 = Giscus 自带的 👍 reaction，评论 = Discussions 回复。
 * 数据存放在本站仓库的 Discussions 里，不额外引入数据库，也不做行为追踪。
 *
 * enabled 说明：
 *   false —— 文章页显示「前往讨论区」入口（Discussions 已开启，访客可直接在
 *            GitHub 上留言和点 👍），不会把 Giscus 的授权错误暴露给访客。
 *   true  —— 页面内嵌 Giscus 评论区，点赞与评论直接在文章下方完成。
 *
 * 切到 true 的前置条件：仓库所有者需在 https://github.com/apps/giscus
 * 安装 giscus App 并授权给 ZHANGChang47/BlogVuePress（OAuth 网页操作，
 * 无法用 token 自动化）。装好后改这一行、重新构建发布即可。
 */
export const giscus = {
  enabled: false,
  repo: 'ZHANGChang47/BlogVuePress',
  repoId: 'R_kgDOI3n7Yw',
  category: 'Announcements',
  categoryId: 'DIC_kwDOI3n7Y84DLH62',
  discussionsUrl: 'https://github.com/ZHANGChang47/BlogVuePress/discussions/categories/announcements',
  appUrl: 'https://github.com/apps/giscus',
};
