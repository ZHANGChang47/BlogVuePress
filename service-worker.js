/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "06569aca99e9ba3acb2f4d7a4c1ac2a6"
  },
  {
    "url": "archives/index.html",
    "revision": "a9624ac3b679880f1a99c76c70bbe209"
  },
  {
    "url": "assets/css/0.styles.79be46fe.css",
    "revision": "04bb4d6258ccdcb3a14cb25d8457b7a4"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.68c0c324.js",
    "revision": "b5f973dcec4593c2ae6d543abdc2142f"
  },
  {
    "url": "assets/js/11.ef1511e2.js",
    "revision": "6801d3a3f0328e51d0dc1640468c5e6b"
  },
  {
    "url": "assets/js/12.da9b2478.js",
    "revision": "5914f509f922f314332247774a277c18"
  },
  {
    "url": "assets/js/13.9b1b1c77.js",
    "revision": "3f2b8c0fcee3e770e86244ab9aa506de"
  },
  {
    "url": "assets/js/14.e2f4930c.js",
    "revision": "d839b03e0928c43cb970c0dc464d6b87"
  },
  {
    "url": "assets/js/15.cd646c33.js",
    "revision": "c1a9fa0e9f3bf3240e9df3d81553e9f6"
  },
  {
    "url": "assets/js/16.3ec04fab.js",
    "revision": "7290a61fc928273b858d025ee10fe1fc"
  },
  {
    "url": "assets/js/17.6e9ef9cc.js",
    "revision": "88084ee8a9911098c3ba0753ff878393"
  },
  {
    "url": "assets/js/18.493ad1ad.js",
    "revision": "543f86183bda33fdf9637f7e39537235"
  },
  {
    "url": "assets/js/19.e0f986d5.js",
    "revision": "15aadee4b0b8aaea4b2c4921f23593f9"
  },
  {
    "url": "assets/js/2.108e92a1.js",
    "revision": "1ab4258e7de44fe025615b76c4b49850"
  },
  {
    "url": "assets/js/20.b8528c67.js",
    "revision": "3ffd8921d1da42cb9b0c1b89d287665e"
  },
  {
    "url": "assets/js/21.fad22d46.js",
    "revision": "229c0ce2fd22156528bae778ad29c399"
  },
  {
    "url": "assets/js/22.8b0c4122.js",
    "revision": "285e532290a8cf3d1c44d4a32fbe1d8c"
  },
  {
    "url": "assets/js/23.3e372155.js",
    "revision": "99e4456a0f974e4ad5a6722cfb6e6411"
  },
  {
    "url": "assets/js/24.3b7e2a1d.js",
    "revision": "743f58f2121a3de5a3063519eef079eb"
  },
  {
    "url": "assets/js/25.9a80a2fa.js",
    "revision": "4dfdfe4990e21b3262fec9a76974e37f"
  },
  {
    "url": "assets/js/26.a83bf322.js",
    "revision": "3cceee4054cf49926855732a979e03bf"
  },
  {
    "url": "assets/js/27.592a3fdd.js",
    "revision": "d5fe6bc7dec0c0bef996910cf244523f"
  },
  {
    "url": "assets/js/28.a8d69689.js",
    "revision": "912753b548fe4b03182d4abe259ef098"
  },
  {
    "url": "assets/js/29.bb969429.js",
    "revision": "5754ed5acce4350e158cbadc56e2ab7d"
  },
  {
    "url": "assets/js/3.c65ee6b2.js",
    "revision": "abd4745024e52941946504765a68fb85"
  },
  {
    "url": "assets/js/30.7d78332c.js",
    "revision": "12d2605cc802b9027905057e7cfade2f"
  },
  {
    "url": "assets/js/31.3f6e4842.js",
    "revision": "944d5e3c4f5f8c317a5f36ad6a53d6d8"
  },
  {
    "url": "assets/js/32.b52e67f7.js",
    "revision": "e6cb006e3864e38ee73d4d2ba494ccf6"
  },
  {
    "url": "assets/js/33.1a666e7d.js",
    "revision": "3c3fbce9e33b989954086a7049460647"
  },
  {
    "url": "assets/js/34.4b8f1385.js",
    "revision": "655f2b830609e883c05f6e9ea42e0c79"
  },
  {
    "url": "assets/js/35.87ca92cc.js",
    "revision": "519c7dfff426f5d95ce3ccfe11e32195"
  },
  {
    "url": "assets/js/36.fc40f016.js",
    "revision": "22c4a62d0c2c918be10c24e7cbc1dbea"
  },
  {
    "url": "assets/js/37.be3bf444.js",
    "revision": "d4996f0fc675e364a726fe7ade4fe63f"
  },
  {
    "url": "assets/js/38.eeafc53c.js",
    "revision": "12d723e94891646f84d7b0d32603c80f"
  },
  {
    "url": "assets/js/39.f34be6d8.js",
    "revision": "dbc8744f5e1245789d1b95e196eda6d5"
  },
  {
    "url": "assets/js/4.c0fd3b18.js",
    "revision": "b83a9d1501732d9ac78265f02491ec7d"
  },
  {
    "url": "assets/js/40.9791c200.js",
    "revision": "141c1cf4c05607914c6e49ca7d3dee6f"
  },
  {
    "url": "assets/js/41.020877c5.js",
    "revision": "9c3e9c28a51733fe37b161d6064db78b"
  },
  {
    "url": "assets/js/42.45c39e58.js",
    "revision": "09d09f66413d59b67781044cb46a766a"
  },
  {
    "url": "assets/js/43.d9e8ef5e.js",
    "revision": "b1c8f8221a7a57e385672c78357c8a67"
  },
  {
    "url": "assets/js/44.464ccf3b.js",
    "revision": "03886c5f9bb9cdaf421607ea1a83f7eb"
  },
  {
    "url": "assets/js/45.cb64e9da.js",
    "revision": "fb17887323e1cd772f68fe4ca35886dc"
  },
  {
    "url": "assets/js/46.0c9a8ead.js",
    "revision": "14865a302bce822dd1611700bde9d1ff"
  },
  {
    "url": "assets/js/47.a2e35d4f.js",
    "revision": "7c53cf36e028b84e10b7184a8d98e701"
  },
  {
    "url": "assets/js/48.098763ec.js",
    "revision": "7d37171ff131128a2a4b80fb01b0be1c"
  },
  {
    "url": "assets/js/49.07c62b3b.js",
    "revision": "5bd74f7bf4fefe1ba870e814f23bfa72"
  },
  {
    "url": "assets/js/5.73b07204.js",
    "revision": "59455e8dd86af085b9989aa20b72e252"
  },
  {
    "url": "assets/js/50.fc5f88a3.js",
    "revision": "793284bb4bccc40232d60c6ac0ce4984"
  },
  {
    "url": "assets/js/51.e2f578ac.js",
    "revision": "b448283587d6393c4f42cd00e6407565"
  },
  {
    "url": "assets/js/52.9e3e4056.js",
    "revision": "a6e1f51314f42c6642ff235697aac48f"
  },
  {
    "url": "assets/js/53.f916bd38.js",
    "revision": "55d1282c22c3b1a62128f63624ae8342"
  },
  {
    "url": "assets/js/54.e7c11e98.js",
    "revision": "ff64e31121bb3013144c766fe690a45c"
  },
  {
    "url": "assets/js/55.0e0a561a.js",
    "revision": "c617511be83549b56e18616d89a5bab2"
  },
  {
    "url": "assets/js/56.b2f3577e.js",
    "revision": "5569b25f425d5abdc8c817369b638d3b"
  },
  {
    "url": "assets/js/57.9e884be2.js",
    "revision": "9966d0c55fbcb5deca23140982211a3d"
  },
  {
    "url": "assets/js/58.2fac2650.js",
    "revision": "412091a92e4524abd7de2d7d1ea6bed4"
  },
  {
    "url": "assets/js/59.3b25f511.js",
    "revision": "4b623b0b2c75fa7053363da622664704"
  },
  {
    "url": "assets/js/6.ed952e3d.js",
    "revision": "ce5c9d673688dc46896c893ac68e190b"
  },
  {
    "url": "assets/js/60.bf607c06.js",
    "revision": "9b952c04b36b1361e5292057d354aa95"
  },
  {
    "url": "assets/js/61.d726e61a.js",
    "revision": "634ed54a7d2761804c866e6ca9e24c42"
  },
  {
    "url": "assets/js/62.edf6d32a.js",
    "revision": "992a5b5c19f6d62fcaf7dc386ae11f0b"
  },
  {
    "url": "assets/js/63.e30fdc11.js",
    "revision": "ce3a4573cc1b1887605cb858f6023655"
  },
  {
    "url": "assets/js/64.922b4a17.js",
    "revision": "9cd6d6df3a6e8e2f9bf70dde1c0c8f9a"
  },
  {
    "url": "assets/js/65.9a3b347a.js",
    "revision": "7df4ae02151f8ea15df619eff5036d79"
  },
  {
    "url": "assets/js/66.5ef4606b.js",
    "revision": "4e77cd6f070d5a3cf9d3ffa47b364713"
  },
  {
    "url": "assets/js/67.d90678f1.js",
    "revision": "ff32d31897927611c67569495fc4d2ec"
  },
  {
    "url": "assets/js/68.91fa461c.js",
    "revision": "72406818ea34262ba6f7a726322a74bd"
  },
  {
    "url": "assets/js/69.1957f6af.js",
    "revision": "b962490b9f34e2630f976ebe8c6781a0"
  },
  {
    "url": "assets/js/7.355266c2.js",
    "revision": "08307c508230ad0bda53ffcd3dd2c1a1"
  },
  {
    "url": "assets/js/70.6ebb8af5.js",
    "revision": "977b450174af1ae21629233525b87fdf"
  },
  {
    "url": "assets/js/71.eee0b217.js",
    "revision": "7fed0fc2ab003fd0d17d5ee187cba0d5"
  },
  {
    "url": "assets/js/72.39ed8920.js",
    "revision": "fa24ae52c7ca0a3cb74506d3a9ad78d9"
  },
  {
    "url": "assets/js/73.47121ddc.js",
    "revision": "375a84df3a1a45631935dda65341f524"
  },
  {
    "url": "assets/js/74.87a10f99.js",
    "revision": "e02a54d496ad5764280adbbec5b47d49"
  },
  {
    "url": "assets/js/75.0b311495.js",
    "revision": "83781fb91e48bdb77a7a95c7925424f3"
  },
  {
    "url": "assets/js/76.268ef349.js",
    "revision": "203a66171decf9b2612f1e12a47fd06b"
  },
  {
    "url": "assets/js/77.58de46fb.js",
    "revision": "ab95a41b76e02f90264e922f45f86e2b"
  },
  {
    "url": "assets/js/78.25b31166.js",
    "revision": "a7e6a8237bc9d7f5ffa5ad31a43fa71c"
  },
  {
    "url": "assets/js/79.d4ff4d30.js",
    "revision": "130ffc172e4d9e6927adc5f3849064b8"
  },
  {
    "url": "assets/js/8.f50cf6d8.js",
    "revision": "b6aec1db5e4324e464e48b9d831ae3e3"
  },
  {
    "url": "assets/js/80.c33be335.js",
    "revision": "80676ad8d13a9d2e6b22067cf3f4e5b2"
  },
  {
    "url": "assets/js/81.a24132da.js",
    "revision": "d155c10f42257caaa8f859357868f91e"
  },
  {
    "url": "assets/js/83.c39146f0.js",
    "revision": "e299610705bb0c277dbdf7a749687074"
  },
  {
    "url": "assets/js/84.7c66fe01.js",
    "revision": "a1598cd5213abc412e13f6d580b09bc1"
  },
  {
    "url": "assets/js/85.c2a04d1e.js",
    "revision": "b8bc796e84ba42943e6095a2a51a9d02"
  },
  {
    "url": "assets/js/86.b42a4e19.js",
    "revision": "672e5438b2367e80003d11ed6c55d785"
  },
  {
    "url": "assets/js/87.bdc4c3c8.js",
    "revision": "aafcea9d7293088414a643ca88bc83d2"
  },
  {
    "url": "assets/js/88.deac45a6.js",
    "revision": "51548f27633bafd51e52d475031a8796"
  },
  {
    "url": "assets/js/89.8f2d6a69.js",
    "revision": "d70ba4316fd80df0008fd0cdc4dd92d6"
  },
  {
    "url": "assets/js/9.5b9b4ae3.js",
    "revision": "fe890e70e9d675163e6759817289ea8e"
  },
  {
    "url": "assets/js/90.e5dd302c.js",
    "revision": "b164e2096f9def4753449732962b7b9f"
  },
  {
    "url": "assets/js/91.bbe5babf.js",
    "revision": "c8a8fdc70ce89843208ec3f57e36a2b0"
  },
  {
    "url": "assets/js/92.74872263.js",
    "revision": "566a0a04513e3c310495aa23e52ef94e"
  },
  {
    "url": "assets/js/93.8b3117a7.js",
    "revision": "58ef8dd7a9ef7c1286a13298e29e0043"
  },
  {
    "url": "assets/js/94.b33e3700.js",
    "revision": "95e56f9cd88a49bb9079bb643511f67b"
  },
  {
    "url": "assets/js/95.1ce3db13.js",
    "revision": "847e6b078bac8f472e4d482bec772615"
  },
  {
    "url": "assets/js/96.6fda4bae.js",
    "revision": "2875f8e0bf14082823883b1b8edd0aa3"
  },
  {
    "url": "assets/js/app.bb5e25c9.js",
    "revision": "fc1c89472f247d03bf0fdc8332167225"
  },
  {
    "url": "categories/index.html",
    "revision": "8fc248e962ea9a7d0630be8568695213"
  },
  {
    "url": "css/style.css",
    "revision": "ec672a3c63174fc2457e405e763af041"
  },
  {
    "url": "img/wx.png",
    "revision": "26b5a0326ac7c3c1547c90541c728867"
  },
  {
    "url": "index.html",
    "revision": "f89d640140df4db98939241ad3b11a8b"
  },
  {
    "url": "js/index.js",
    "revision": "6ecdebb6e143f97463617084ff591b1d"
  },
  {
    "url": "js/main.js",
    "revision": "f29496a061e1feae73db9d38bf2be190"
  },
  {
    "url": "pages/0256e7/index.html",
    "revision": "3e7eb5b945384d322d348677e8156d91"
  },
  {
    "url": "pages/09eb89/index.html",
    "revision": "0e231a629b74830b0efd490fcb781552"
  },
  {
    "url": "pages/0e14a8/index.html",
    "revision": "3dedbd4ca8102b1cfae9890710ad87d1"
  },
  {
    "url": "pages/0f87fe/index.html",
    "revision": "9475de45b0166a7bf8c2723178e7a55d"
  },
  {
    "url": "pages/111f25/index.html",
    "revision": "7df8967b04a1351b1e660dfa683c4325"
  },
  {
    "url": "pages/1c8947/index.html",
    "revision": "91fd4a9b53536ba25f9e39fcf1554fac"
  },
  {
    "url": "pages/1f9618/index.html",
    "revision": "f8330b9c18ff36ba1ef462685684badb"
  },
  {
    "url": "pages/22bfed/index.html",
    "revision": "91470ecbe536e8da010f1f4a11c4ebb2"
  },
  {
    "url": "pages/23ea98/index.html",
    "revision": "8699c7a1ae38c64e9d2da6da3c5e2ac5"
  },
  {
    "url": "pages/29120b/index.html",
    "revision": "a74785de5209315868b0fa4c753e5e2a"
  },
  {
    "url": "pages/2d1eb8/index.html",
    "revision": "0955893bc10019f9971579ebf371a17e"
  },
  {
    "url": "pages/2ea7d4/index.html",
    "revision": "53772bb4875f4f56a41efbb98d2725fb"
  },
  {
    "url": "pages/30428a/index.html",
    "revision": "7b7eb781351b96732e2f3df79e56324e"
  },
  {
    "url": "pages/340e6a/index.html",
    "revision": "3db9f2055283ad8408778adef3290551"
  },
  {
    "url": "pages/345105/index.html",
    "revision": "30a7fe7043940c17b0b9cacf8e3e57a2"
  },
  {
    "url": "pages/34f4ad/index.html",
    "revision": "33fca75116eccefd398fe44b2f10c6a5"
  },
  {
    "url": "pages/35ef2b/index.html",
    "revision": "ce23c4d9291dbb5e6045f8adabb4e9e5"
  },
  {
    "url": "pages/361b6c/index.html",
    "revision": "91a002f1e071c0f4cc6e848685083294"
  },
  {
    "url": "pages/36e053/index.html",
    "revision": "a909a6de1b2b62983e39fd8d04f83c46"
  },
  {
    "url": "pages/370782/index.html",
    "revision": "677b72c3ca400f55acf3c67805fdef12"
  },
  {
    "url": "pages/3a64a7/index.html",
    "revision": "54775dcf7c5dc2736c2af3c2eeaa6f8c"
  },
  {
    "url": "pages/3c627b/index.html",
    "revision": "17506cb2f10a82454b2feb44806bb42f"
  },
  {
    "url": "pages/3d2055/index.html",
    "revision": "8b6e2dc9e1ca7cccc5e84ffbe092aa74"
  },
  {
    "url": "pages/3d32a9/index.html",
    "revision": "466640dbde55e8a0d75f83c98ad73b7f"
  },
  {
    "url": "pages/3d4050/index.html",
    "revision": "1a11f705108dc226511884f329c03409"
  },
  {
    "url": "pages/3ea999/index.html",
    "revision": "fe5db92b818e74600c72305c7d22a6ae"
  },
  {
    "url": "pages/3fcc1f/index.html",
    "revision": "f794eb45e61382c7dec25427d40a51dc"
  },
  {
    "url": "pages/3ffb20/index.html",
    "revision": "13c199e9d30c7ec90989a2d830305e53"
  },
  {
    "url": "pages/4264b6/index.html",
    "revision": "968f29bbc0a3bc32e97787fb4054b4a6"
  },
  {
    "url": "pages/461e7b/index.html",
    "revision": "48ade77545a4d799b90f41c686f693f1"
  },
  {
    "url": "pages/500803/index.html",
    "revision": "6d26c9305b0458f86a0c0db9e4775c3e"
  },
  {
    "url": "pages/50e216/index.html",
    "revision": "9ac1831d89ce47388055b7024e74262b"
  },
  {
    "url": "pages/5d2c89/index.html",
    "revision": "5ab8fe08c80d4d623c44792cb6f348b5"
  },
  {
    "url": "pages/613e0b/index.html",
    "revision": "0d0d0a552b342b24c48e8e3de0d4e362"
  },
  {
    "url": "pages/61f2f95fd7da14fd/index.html",
    "revision": "7a1cb97b94567a194e5fe629b6e5cfe7"
  },
  {
    "url": "pages/64cd56/index.html",
    "revision": "c25e921522c4b93e3a3f72e17c4328be"
  },
  {
    "url": "pages/690a89/index.html",
    "revision": "daf26d54e6d839f360b2de4fbfe4649f"
  },
  {
    "url": "pages/74f538/index.html",
    "revision": "f74a5ffe61b915d0c7a8205d21e94b96"
  },
  {
    "url": "pages/76949c/index.html",
    "revision": "93de44b0a3bd1c2d34d703f0a2b48645"
  },
  {
    "url": "pages/7844fa/index.html",
    "revision": "8d8f46db11e846a82899c6952adb668e"
  },
  {
    "url": "pages/7890a5/index.html",
    "revision": "4b8254ef618a6873273179cb446d4b75"
  },
  {
    "url": "pages/7e884d/index.html",
    "revision": "97501389e95d966e373d2387e02d8f56"
  },
  {
    "url": "pages/7ec675/index.html",
    "revision": "d1f503bcda035284bae4f402ba10823c"
  },
  {
    "url": "pages/835bb1/index.html",
    "revision": "683c02d254f93846c1b6336345819b9e"
  },
  {
    "url": "pages/836a39/index.html",
    "revision": "e7622130953d83b384dbe412de1d7c21"
  },
  {
    "url": "pages/837fb2/index.html",
    "revision": "30f68d0c14d06dcac19736a597f8d0c3"
  },
  {
    "url": "pages/8e514a/index.html",
    "revision": "97152adb0402e1302b059edaef47fe9f"
  },
  {
    "url": "pages/91b51f/index.html",
    "revision": "f7ef15b224ece3ef62f461cade957da8"
  },
  {
    "url": "pages/963caf/index.html",
    "revision": "baee14ef86bac8e758fb98069cdb5b14"
  },
  {
    "url": "pages/97fb35/index.html",
    "revision": "228a427bf9bd9f6028105451278fdcb6"
  },
  {
    "url": "pages/995716/index.html",
    "revision": "a749bffd1528b59819b2b8352a7fd6ce"
  },
  {
    "url": "pages/9a24a9/index.html",
    "revision": "68d3ff05c5bb4c66c65c0042756e6176"
  },
  {
    "url": "pages/9b7514/index.html",
    "revision": "b34882c9b61ca765cd5e1d013cbec3ac"
  },
  {
    "url": "pages/9ba533/index.html",
    "revision": "bef648277a6027d18698027ba54ae6e3"
  },
  {
    "url": "pages/9c7fd4/index.html",
    "revision": "5a54f7a6ff10c2aebc6d595dd18cb398"
  },
  {
    "url": "pages/9da414/index.html",
    "revision": "87ea1c42a73c49c10ff96469cfb9c36a"
  },
  {
    "url": "pages/9fc071/index.html",
    "revision": "03da91f49d24e69df53b34ac2ed46748"
  },
  {
    "url": "pages/a0057c/index.html",
    "revision": "e15f8f01e460f87934542e6bb64d749c"
  },
  {
    "url": "pages/a105cd/index.html",
    "revision": "64cb03b1de1314b0332bbf6f3cf94f8c"
  },
  {
    "url": "pages/a87d95/index.html",
    "revision": "c9bedbf6e837823c53835d6a6c1a4f48"
  },
  {
    "url": "pages/b29dd1/index.html",
    "revision": "762a691f4493cb242fd7e49f03dfca70"
  },
  {
    "url": "pages/b43704/index.html",
    "revision": "01ed933e1b9a5fc1cc390ea5620d5882"
  },
  {
    "url": "pages/b968c9/index.html",
    "revision": "4902766ec1037f4e240265d925356613"
  },
  {
    "url": "pages/c2b2ed/index.html",
    "revision": "1be4da1e23324e7a5cb68e85b36245fd"
  },
  {
    "url": "pages/c584dd/index.html",
    "revision": "ed04b4feca670459cef119e84a3b1ae4"
  },
  {
    "url": "pages/c63fab/index.html",
    "revision": "12db8df93fa8ddeae0874dc87f2e576a"
  },
  {
    "url": "pages/c820f1/index.html",
    "revision": "55f8e0d1fabdc49fee4b7ae2e296ce86"
  },
  {
    "url": "pages/c9ad6e/index.html",
    "revision": "9d97e058eb96ae13dd7b1df38ea785c3"
  },
  {
    "url": "pages/cb4b56/index.html",
    "revision": "fc8231a987b1ba5720ab96407f3c230d"
  },
  {
    "url": "pages/cbaa60/index.html",
    "revision": "7dffc450a5eab89ab5a9cf6c09510746"
  },
  {
    "url": "pages/d1bf35/index.html",
    "revision": "49fb3bf343357ea79881742cfd99d550"
  },
  {
    "url": "pages/d7b60a/index.html",
    "revision": "f752320b008c4e218490cb8260a0c3a2"
  },
  {
    "url": "pages/e5ad3a/index.html",
    "revision": "f6abd90542dfa7bfdd160327ccd74a2b"
  },
  {
    "url": "pages/e9816e/index.html",
    "revision": "6da28da826562ae5e8948b057561248d"
  },
  {
    "url": "pages/f3f5b3/index.html",
    "revision": "87eeabf10c77055e6774c1ce4a43f09b"
  },
  {
    "url": "pages/fe76cd/index.html",
    "revision": "834742e59aadecf5707ec037ff6f38cf"
  },
  {
    "url": "tags/index.html",
    "revision": "d249e0f70c6f9feeb6ddd12e02b9eb7e"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
