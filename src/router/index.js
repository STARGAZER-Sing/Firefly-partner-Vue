import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Index from '@/pages/Index.vue'
import UserProfile from '@/pages/UserProfile.vue'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/index', component: Index },
    { path: '/user', component: UserProfile }
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('username')
    if ((to.path === '/index' || to.path === '/user') && !loggedIn) {
        next('/login') // 未登录访问受限页，重定向
    } else {
        next()
    }
})

export default router
