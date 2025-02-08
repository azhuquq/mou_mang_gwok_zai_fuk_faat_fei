import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: () => import('../layout/index.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('../views/Home.vue'),
          meta: {
            title: 'home'
          }
        },
        {
          path: '/how-to-get-serial-number',
          name: 'getsnguide',
          component: () => import('../views/GetSNGuide.vue'),
          meta: {
            title: 'getsnguide'
          }
        },
        {
          path: '/access-code',
          name: 'accesscode',
          component: () => import('../views/AccessCode.vue'),
          meta: {
            title: 'accessCode'
          }
        },
        {
          path: '/give-ticket',
          name: 'giveticket',
          component: () => import('../views/GiveTicket.vue'),
          meta: {
            title: 'giveticket'
          }
        },
        {
          path: '/debug',
          name: 'debug',
          component: () => import('../views/Debug.vue'),
          meta: {
            title: 'debug'
          }
        }
      ]
    },
  ],
})

export default router
