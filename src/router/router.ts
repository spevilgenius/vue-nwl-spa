import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/Layouts/LayoutTS.vue'
import Home from '@/components/Pages/HomeTS.vue'

Vue.use(VueRouter)

const pubsMenu = {
  path: '/pubs',
  component: Layout,
  redirect: '/pubs/home',
  children: [
    {
      path: 'home/:mode',
      name: 'Home',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Home.vue'),
      props: true
    },
    {
      path: 'page/whatsnew',
      name: 'Whats New',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/WhatsNew.vue'),
      props: true
    },
    {
      path: 'page/navy',
      name: 'Navy',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Navy.vue'),
      props: true
    }
  ]
}

const routes = [
  {
    path: '/',
    redirect: '/pages/Home'
  },
  pubsMenu,
  /* adminMenu,
  taskMenu,
  msrMenu,
  financialMenu,
  calendarMenu,
  travelMenu,
  featureMenu,
  featuresMenu,
  bugsMenu,
  personnelMenu,
  trainingMenu,
  securityMenu,
  workplanMenu,
  refreshMenu, */
  {
    path: '/pages',
    component: Layout,
    redirect: '/pages/Home',
    children: [
      {
        path: 'Home',
        name: 'Home',
        component: Home
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
