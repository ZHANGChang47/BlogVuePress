// let busuanzi;
// import LastReadingPopup from './components/LastReadingPopup.vue'
// export default ({
//   Vue, // VuePress 正在使用的 Vue 构造函数
//   options, // 附加到根实例的一些选项
//   router, // 当前应用的路由实例
//   siteData, // 站点元数据
//   isServer // 当前应用配置是处于 服务端渲染 或 客户端
// }) => {
//    // 判断是否绑定时间是否绑定成功
//    let isMounted = false;
//    // 最后一次阅读位置跳转
//    Vue.component(LastReadingPopup.name, LastReadingPopup);
//    Vue.mixin({
//      // 有多少个 Vue 组件（md 文档），就执行多少次 mounted()，所以利用 if 判断只允许执行一次
//      mounted() {
//        if (!isMounted) {
//          window.addEventListener('unload', this.saveLastReading);  // 卸载窗口前，将数据存储，方便下次可以直接跳转位置
//          isMounted = true;
//        }
//      },
//      methods: {
//        saveLastReading() {
//          localStorage.setItem('lastReading', JSON.stringify({
//            path: this.$route.path,
//            scrollTop: document.documentElement.scrollTop,
//            timestamp: new Date().getTime(),
//          }))
//        }
//      }
//    });
//   /**
//    * 站点和文章页信息模块
//    */
//   if (!isServer) {
//     router.beforeEach((to, from, next) => {
//       next();
//       if (to.path !== '/' && to.path !== from.path && siteData.themeConfig.blogInfo) {  // 如果页面是非首页，# 号也会触发路由变化，这里已经排除掉
//         // 刷新页面或进入新的页面后，如果原来位置的内容还存在，则删除掉，最后重新插入渲染
//         removeElement('.page-view-js');
//         removeElement('.page-view');
//         removeElement('.book-words');
//         removeElement('.reading-time');
//         siteData.pages.forEach((itemPage) => {
//           if (itemPage.path == to.path) {
//             if (itemPage.frontmatter.article == undefined || itemPage.frontmatter.article) {  // 排除掉 article 为 false 的文章
//               const { eachFileWords, pageView, pageIteration, readingTime } = siteData.themeConfig.blogInfo;
//               // 下面两个 if 可以调换位置，从而让文章的浏览量和字数内容交换
//               if (eachFileWords) {
//                 eachFileWords.forEach((itemFile) => {
//                   if (itemFile.permalink == itemPage.frontmatter.permalink) {
//                     addPageWordsCount(itemFile.wordsCount);
//                     if (readingTime || readingTime == undefined) {
//                       addReadTimeCount(itemFile.readingTime);
//                     }
//                   }
//                 });
//               }
//               if (pageView || pageView == undefined) {
//                 addPageView();
//                 // 挂载成功需要一点时间
//                 setTimeout(() => {
//                   getPageViewCouter(pageIteration);
//                 }, 1500);
//               }

//               return;
//             }
//           }
//         })
//       }
//     })
//   }
// }
// /**
//  * 如果元素存在，则删除
//  */
// function removeElement(selector) {
//   var element = document.querySelector(selector);
//   if (element) {
//     element.parentNode.removeChild(element);
//   }
// }

// /**
//  * 文章页的访问量
//  */
// function getPageViewCouter(iterationTime = 3000) {
//   if (busuanzi) {
//     busuanzi.fetch();
//   } else {
//     busuanzi = require("busuanzi.pure.js");
//   }
//   var i = 0;
//   var defaultCouter = '9999';
//   // 如果 require 没有获取成功，则手动获取
//   // 但是容易产生访问量叠加，如果只需要第一次获取数据（可能获取失败），可注释掉，此内容是第一次获取失败后，重新获取访问量，可能导致访问量再次 + 1
//   // 取决于访问人的网络，以及 setTimeout 的时间（需求调节）
//   setTimeout(() => {
//     let interval = setInterval(() => {
//       const pageView = document.querySelector('.view-data');
//       if (pageView) {
//         i += iterationTime;
//         if (i > iterationTime * 10) {
//           pageView.innerText = defaultCouter;
//           clearInterval(interval);  // 10 秒后无法获取，则取消获取
//         }
//         if (pageView.innerText == "") {
//           // 手动获取访问量
//           busuanzi.fetch();
//         } else {
//           clearInterval(interval);
//         }
//       } else {
//         clearInterval(interval);
//       }
//     }, iterationTime);
//   }, iterationTime);
// }
// /**
//  * 添加浏览量元素
//  */
// function addPageView() {
//   // 创建访问量的元素
//   let template = document.createElement('div');
//   template.title = '浏览量';
//   template.className = 'page-view iconfont icon-view';
//   template.style.float = 'left';
//   template.style.marginLeft = '20px';
//   template.style.fontSize = '0.8rem';
//   // template.innerHTML = '<span id="busuanzi_container_page_pv" style="display: none; margin-left: 3px"><a style="color: #888" href="javascript:;" id="busuanzi_value_page_pv" class="view-data"></a></span>';
//   template.innerHTML = '<a style="color: #888; margin-left: 3px" href="javascript:;" id="busuanzi_value_page_pv" class="view-data"><i title="正在获取..." class="loading iconfont icon-loading"></i></a>';
//   mountedView(template);
//   // 添加 loading 效果
//   let style = document.createElement("style");
//   style.innerHTML = `@keyframes turn {
//     0% {
//       transform: rotate(0deg);
//     }
//     100% {
//       transform: rotate(360deg);
//     }
//   }
//   .loading {
//     display: inline-block;
//     animation: turn 1s linear infinite;
//     -webkit-animation: turn 1s linear infinite;
//   }`;
//   document.head.appendChild(style);
// }
// /**
//  * 添加当前文章页的字数元素
//  */
// function addPageWordsCount(wordsCount) {
//   if (wordsCount) {
//     let template = document.createElement('div');
//     template.title = '文章字数';
//     template.className = 'book-words iconfont icon-book';
//     template.style.float = 'left';
//     template.style.marginLeft = '20px';
//     template.style.fontSize = '0.8rem';

//     template.innerHTML = `<a href="javascript:;" style="margin-left: 3px; color: #888">${wordsCount}</a>`;
//     mountedView(template);
//   }
// }

// /**
//  * 添加预计的阅读时间
//  */
// function addReadTimeCount(readTimeCount) {
//   let template = document.createElement('div');
//   template.title = '预阅读时长';
//   template.className = 'reading-time iconfont icon-shijian';
//   template.style.float = 'left';
//   template.style.marginLeft = '20px';
//   template.style.fontSize = '0.8rem';
//   template.innerHTML = `<a href="javascript:;" style="margin-left: 3px; color: #888">${readTimeCount}</a>`;
//   mountedView(template);
// }

// /**
//  * 挂载目标到页面上
//  */
// function mountedView(template, moutedParentEvent = '.articleInfo-wrap > .articleInfo > .info') {
//   var i = 0;
//   let interval = setInterval(() => {
//     i++;
//     const parentElement = document.querySelector(moutedParentEvent);
//     if (parentElement) {
//       if (!isMountedView(template, parentElement)) {
//         parentElement.appendChild(template);
//         clearInterval(interval);
//       }
//     } else if (i > 1 * 10) {  // 10 秒后清除
//       clearInterval(interval);
//     }
//   }, 1000);
// }
// /**
//  * 目标是否已经挂载在页面上
//  */
// function isMountedView(element, parentElement) {
//   if (element.parentNode == parentElement) {
//     return true;
//   } else {
//     return false;
//   }
// }
// };

/* ============================================================
   站点交互增强 2026-11-12
   窄屏（<=1360px）把顶部导航收进抽屉，让左上角按钮真正可用。
   只克隆 DOM，不移动 Vue 管理的节点，避免与组件更新冲突。
   ============================================================ */
const WB_NAV_BREAKPOINT = 1360;

/**
 * 当前页面有没有可用的主题侧栏。
 * 判据用主题给无侧栏页面加的 no-sidebar 标记：
 * - 首页是 no-sidebar，侧栏没有任何内容，主题自带的按钮点开只有一层空蒙版；
 * - 文章页没有该标记，主题按钮开合侧栏是有用的，不该抢。
 * 不能只看 aside.sidebar 是否存在：窄屏下它只是被 translateX 移出屏幕，
 * display 仍然是 block，据此判断会把首页之外的手机端也误判成「有侧栏」。
 */
function wbHasThemeSidebar() {
  if (document.querySelector('.no-sidebar')) return false;
  const sidebar = document.querySelector('aside.sidebar');
  if (!sidebar) return false;
  const style = window.getComputedStyle(sidebar);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  return true;
}

function wbCloseDrawer() {
  document.body.classList.remove('wb-drawer-open');
}

function wbRefreshToc() {
  const box = document.querySelector('.wb-drawer-toc');
  if (!box) return;
  const toc = document.querySelector('aside.sidebar .sidebar-links');
  box.innerHTML = '';
  if (!toc) {
    box.style.display = 'none';
    return;
  }
  box.style.display = '';
  const title = document.createElement('div');
  title.className = 'wb-drawer-toc-title';
  title.textContent = '文章目录';
  box.appendChild(title);
  box.appendChild(toc.cloneNode(true));
}

function wbBuildDrawer() {
  if (document.querySelector('.wb-nav-drawer')) return;
  const navSource = document.querySelector('.navbar .links .nav-links');
  if (!navSource) return;

  const mask = document.createElement('div');
  mask.className = 'wb-nav-drawer-mask';

  const drawer = document.createElement('aside');
  drawer.className = 'wb-nav-drawer';
  drawer.setAttribute('aria-label', '站点导航');

  const head = document.createElement('div');
  head.className = 'wb-nav-drawer-head';
  head.textContent = (document.querySelector('.site-name') || {}).textContent || '导航';
  drawer.appendChild(head);

  const nav = document.createElement('nav');
  nav.appendChild(navSource.cloneNode(true));
  drawer.appendChild(nav);

  const tocBox = document.createElement('div');
  tocBox.className = 'wb-drawer-toc';
  drawer.appendChild(tocBox);

  document.body.appendChild(mask);
  document.body.appendChild(drawer);
  wbRefreshToc();

  mask.addEventListener('click', wbCloseDrawer);
  drawer.addEventListener('click', (e) => {
    const link = e.target && e.target.closest ? e.target.closest('a') : null;
    if (link && link.getAttribute('href')) wbCloseDrawer();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') wbCloseDrawer();
  });

  drawer.querySelectorAll('.dropdown-wrapper').forEach((wrap) => {
    const title = wrap.querySelector('.dropdown-title');
    if (!title) return;
    title.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      wrap.classList.toggle('wb-open');
    });
  });
}

function wbBindToggle() {
  const btn = document.querySelector('.sidebar-button');
  if (!btn || btn.dataset.wbBound === '1') return;
  btn.dataset.wbBound = '1';
  btn.title = '导航菜单';
  btn.setAttribute('aria-label', '打开导航菜单');
  // 捕获阶段拦截：页面没有侧栏时，主题自带的 toggle 只会显示一层空蒙版。
  // 有侧栏的页面不拦截，把点击留给主题去开合侧栏。
  btn.addEventListener('click', (e) => {
    if (window.innerWidth > WB_NAV_BREAKPOINT) return;
    if (wbHasThemeSidebar()) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    document.body.classList.toggle('wb-drawer-open');
  }, true);
}

function wbSetup() {
  wbBuildDrawer();
  wbBindToggle();
  wbRefreshToc();
  if (window.innerWidth > WB_NAV_BREAKPOINT) wbCloseDrawer();
}

export default ({ router, isServer }) => {
  if (isServer || typeof window === 'undefined') return;
  window.addEventListener('load', () => setTimeout(wbSetup, 0));
  setTimeout(wbSetup, 600);
  router.afterEach(() => setTimeout(wbSetup, 80));
  window.addEventListener('resize', () => {
    if (window.innerWidth > WB_NAV_BREAKPOINT) wbCloseDrawer();
  }, { passive: true });
};
