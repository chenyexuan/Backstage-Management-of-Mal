import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import router from '@/router/router'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.less'
Vue.use(ElementUI)

Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  let mytoken = localStorage.getItem('login_key_chenyexuan')
  if (mytoken || to.path === '/login') {
    next()
  } else {
    next({ path: '/login' })
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
