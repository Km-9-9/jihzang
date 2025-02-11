import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 引入element-ui
import ElementUI from 'element-ui';  
import 'element-ui/lib/theme-chalk/index.css';

import VueParticles from 'vue-particles'  // 引入背景粒子插件

import axios from 'axios'       // 引入axios
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:5000/'  // 定义公共接口
Vue.prototype.$http = axios   // 将axios 全局挂载 vue 实例上

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueParticles)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
