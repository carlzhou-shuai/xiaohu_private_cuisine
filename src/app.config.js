export default defineAppConfig({
  pages: [
    'pages/Home/index',
    "pages/CateGory/index",
    "pages/Setting/index",
    "pages/Cart/index",
    "pages/My/index"
  ],
  tabBar: {
    list: [
      { "pagePath": "pages/Home/index" },
      { "pagePath": "pages/CateGory/index" },
      { "pagePath": "pages/Setting/index" },
      { "pagePath": "pages/Cart/index" },
      { "pagePath": "pages/My/index" },
    ],
    custom: true // 开启自定义 tabBar 模式
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
