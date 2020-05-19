import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import localeEN from 'element-ui/lib/locale/lang/en'
import localeCN from 'element-ui/lib/locale/lang/zh-CN'

Vue.config.productionTip = false

localStorage.setItem('lang', 'zh')
if (localStorage.lang === 'en') {
  Vue.use(ElementUI, { localeEN })
} else {
  Vue.use(ElementUI, { localeCN })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
