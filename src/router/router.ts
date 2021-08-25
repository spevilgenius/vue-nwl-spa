import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/Layouts/LayoutTS.vue'
import Home from '@/components/Pages/HomeTS.vue'
import Developer from '@/components/Pages/Developer.vue'

Vue.use(VueRouter)

const pubsMenu = {
  path: '/pubs',
  component: Layout,
  redirect: '/pubs/home',
  children: [
    {
      path: 'home/:mode',
      name: 'Publications',
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
    },
    {
      path: 'page/allied',
      name: 'Allied',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Allied.vue'),
      props: true
    },
    {
      path: 'page/joint',
      name: 'Joint',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Joint.vue'),
      props: true
    },
    {
      path: 'page/multinational',
      name: 'MultiNational',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/MultiNational.vue'),
      props: true
    },
    {
      path: 'page/all',
      name: 'All Publications',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/All.vue'),
      props: true
    },
    {
      path: 'page/development',
      name: 'Pubs In Development',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Development.vue'),
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
      },
      {
        path: 'Developer',
        name: 'Developer',
        component: Developer
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
