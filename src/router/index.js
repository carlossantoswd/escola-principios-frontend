import { createRouter, createWebHistory } from 'vue-router'
import Turmas from '@/views/turmas/Turmas.vue'
import MySupports from '@/views/supports/MySupports.vue'
import Modules from '@/views/modules/Modules.vue'
import Lessons from '@/views/lessons/Lessons.vue'
import Auth from '@/views/auth/Auth.vue'
import ForgetPassword from '@/views/auth/ForgetPassword.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'
import Presenca from '@/views/lessons/Presenca.vue'
import PresencaSucesso from '@/views/lessons/PresencaSucesso.vue'

import store from "@/store"
import { TOKEN_NAME } from "@/configs"

const routes = [    
    {
      path: '/campus',
      component: () => import('@/layouts/DefaultTemplate.vue'),
      children: [
        {
          path: 'modulos',
          name: 'campus.modules',
          component: Modules
        },
        {
          path: 'aula',
          name: 'campus.aulas',
          component: Lessons
        },
        {
          path: 'minhas-duvidas',
          name: 'campus.my.supports',
          component: MySupports,
        },
        {
          path: '',
          name: 'campus.home',
          component: Turmas
        }, 
        {
          path: '/presenca-sucesso',
          name: 'campus.presenca',
          component: PresencaSucesso
        },
      ]
    },
    {
      path: '/',
      name: 'auth',
      component: Auth
    },
    {
      path: '/recuperar-senha',
      name: 'forget.password',
      component: ForgetPassword
    },
    {
      path: '/reset/:token',
      name: 'reset.password',
      component: ResetPassword,
      props: true,
    },
    {
      path: '/presenca/:aula',
      name: 'presenca.aula',
      component: Presenca,
      props: true,
    },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, _, next) => {
  const loggedIn = store.state.users.loggedIn
  if (to.name != 'reset.password' && to.name != 'presenca.aula' && !loggedIn) {
    const token = await localStorage.getItem(TOKEN_NAME)
    if (!token && to.name != 'auth' && to.name != 'forget.password') {
      return router.push({name: 'auth'})
    }

    await store.dispatch('getMe')
                .catch(() => {
                  if (to.name != 'auth') return router.push({name: 'auth'})
                })
  }

  next()
})

export default router
