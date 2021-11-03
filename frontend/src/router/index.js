import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/catalog/:catalogid',
    name: 'Catalog',
    component: () => import('../views/Catalog.vue')
  },
  {
    path: '/product/:productid',
    name: 'Product',
    component: () => import('../views/Product.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: { guess: true },
    component: () => import('../views/login.vue')
  }, {
    path: '/register',
    name: 'Register',
    meta: { guess: true },
    component: () => import('../views/Register.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: { login: true },
    component: () => import('../views/profile.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token')

  if (to.meta.login && !isLoggedIn) {
    alert('Please login first!')
    next({ path: '/login' })
  }

  if (to.meta.guess && isLoggedIn) {
    alert("You've already logged in")
    next({ path: '/' })
  }

  next()
})



export default router