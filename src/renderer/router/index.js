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
        name: 'myDisk'
      },
      component: () => import('@/components/App'),
      children: [
        {
          name: 'myDisk',
          path: '/home/myDisk',
          redirect: {
            name: 'myDisk-personFile'
          },
          component: () => import('@/components/App/MyDisk'),
          children: [
            {
              name: 'myDisk-personFile',
              path: '/home/myDisk/personFile',
              component: () => import('@/components/App/MyDisk/PersonFile')
            },
            {
              name: 'myDisk-groupFile',
              path: '/home/myDisk/groupFile',
              component: () => import('@/components/App/MyDisk/GroupFile')
            },
            {
              name: 'myDisk-businessFile',
              path: '/home/myDisk/businessFile',
              component: () => import('@/components/App/MyDisk/BusinessFile')
            },
            {
              name: 'myDisk-myCollction',
              path: '/home/myDisk/myCollction',
              component: () => import('@/components/App/MyDisk/MyCollection')
            },
            {
              name: 'myDisk-pulishShare',
              path: '/home/myDisk/pulishShare',
              component: () => import('@/components/App/MyDisk/ShareFile/publish-share')
            },
            {
              name: 'myDisk-recieveShare',
              path: '/home/myDisk/recieveShare',
              component: () => import('@/components/App/MyDisk/ShareFile/recieve-share')
            }
          ]
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
