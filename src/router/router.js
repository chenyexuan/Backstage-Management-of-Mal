import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login.vue'
import home from '@/views/home.vue'
import categories from '@/views/goods/categories.vue'
import goods from '@/views/goods/goods.vue'
import params from '@/views/goods/params.vue'
import orders from '@/views/orders/orders.vue'
import reports from '@/views/reports/reports.vue'
import users from '@/views/users/users.vue'
import rights from '@/views/rights/rights.vue'
import roles from '@/views/rights/roles.vue'
Vue.use(VueRouter)
export default new VueRouter({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: login
    },
    {
      name: 'home',
      path: '/home',
      component: home,
      children: [
        {
          name: 'rights',
          path: 'rights',
          component: rights
        },
        {
          name: 'roles',
          path: 'roles',
          component: roles
        },
        {
          name: 'goods',
          path: 'goods',
          component: goods
        },
        {
          name: 'categories',
          path: 'categories',
          component: categories
        },
        {
          name: 'params',
          path: 'params',
          component: params
        },
        {
          name: 'orders',
          path: 'orders',
          component: orders
        },
        {
          name: 'reports',
          path: 'reports',
          component: reports
        }, {
          name: 'users',
          path: 'users',
          component: users
        }
      ]
    },
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    }
  ]
})
