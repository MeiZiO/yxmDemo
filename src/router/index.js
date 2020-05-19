import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/page/layouts/home'
// import Dialog from './dialog'

Vue.use(VueRouter)
const routes = [
  {
    path: '/'
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
  {
    path: '/app',
    component: home
    // children: [...Dialog]
  }
]

const router = new VueRouter({
  routes
})

// 路由前卫
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    return next({
      path: '/app'
    })
  }
  return next()
})

export default router
