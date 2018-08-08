import Vue from 'vue'
import Router from 'vue-router'
const Login = () => import('@/components/Login')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      name: 'login',
      path: '/login/:reLogin',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      redirect: {
        name: 'my-disk'
      },
      component: () => import('@/components/App'),
      children: [
        {
          name: 'my-disk',
          path: '/home/my-disk',
          component: () => import('@/components/App/MyDisk')
        },
        {
          name: 'transfer',
          path: '/home/transfer',
          component: () => import('@/components/App/Transfer')
        },
        {
          name: 'backup',
          path: '/home/backup',
          component: () => import('@/components/App/Backup')
        }
      ]
    }
  ]
})
