import { createApp } from 'vue'
import './app.less'
import '@/style/index.less'
const App = createApp({
  onShow(options) { },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
window.$baseURL = "https://xre0y0wcr4hl.ngrok.xiaomiqiu123.top/api"
window.$currency = '元'
export default App
