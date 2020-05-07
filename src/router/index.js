import Vue from 'vue'
import VueRouter from 'vue-router'
import NativeAt from '@/views/NativeAt.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'NativeAt',
    component: NativeAt
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
