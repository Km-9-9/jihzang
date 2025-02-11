import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: ()=> import('../components/Login.vue') },
  {
    path: '/home',
    component: ()=> import('../views/Home.vue'),
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: ()=> import('../components/Welcome.vue') },
      { path: '/users', component: ()=> import('../components/Users.vue') },
      { path: '/list', component: ()=> import('../components/List.vue') }
    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
