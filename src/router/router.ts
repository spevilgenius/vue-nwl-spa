import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/Layouts/LayoutTS.vue'
import Home from '@/components/Pages/HomeTS.vue'
import Developer from '@/components/Pages/Developer.vue'
import NavyDoctrine from '@/components/Pages/NavyDoctrine.vue'
import Archive from '@/components/Pages/Archive.vue'
import PleaseReview from '@/components/Pages/PleaseReview.vue'
import ManageTerms from '@/components/Pages/ManageTerms.vue'

Vue.use(VueRouter)

const pubsMenu = {
  path: '/approved',
  component: Layout,
  redirect: '/approved/pubs',
  children: [
    {
      path: 'pubs/:mode',
      name: 'Publications',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Home.vue'),
      props: true
    },
    {
      path: 'pubs/all',
      name: 'All Publications',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/All.vue'),
      props: true
    },
    {
      path: 'pubs/archive',
      name: 'Archive Publications',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Archive.vue'),
      props: true
    },
    {
      path: 'pubs/Allied',
      name: 'Allied Publications',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Pages/Allied.vue'),
      props: true
    },
    {
      path: 'pubs/view',
      name: 'View Publication',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Forms/ViewPub.vue'),
      props: true
    }
  ]
}

const pubsDevMenu = {
  path: '/development',
  component: Layout,
  redirect: '/development/pubs',
  children: [
    {
      path: 'pubs/:mode',
      name: 'Publications',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Development.vue'),
      props: true
    },
    {
      path: 'pubs/all',
      name: 'All Publications In Development',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/All.vue'),
      props: true
    },
    {
      path: 'pubs/view',
      name: 'View Publication',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Forms/ViewPub.vue'),
      props: true
    },
    {
      path: 'pubs/forms/edit',
      name: 'Edit Publication',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Forms/EditPub.vue'),
      props: true
    },
    {
      path: 'pubs/forms/new',
      name: 'Add New Publication',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Forms/NewPub.vue'),
      props: true
    }
  ]
}

const aoMenu = {
  path: '/ao',
  component: Layout,
  redirect: '/ao/home',
  children: [
    {
      path: 'home/:mode',
      name: 'AO Actions',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Home.vue'),
      props: true
    },
    {
      path: 'page/development',
      name: 'Pubs In Development',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Development.vue'),
      props: true
    },
    {
      path: 'forms/view',
      name: 'View Publication',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Forms/ViewPub.vue'),
      props: true
    },
    {
      path: 'forms/edit',
      name: 'Edit Publication',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Forms/EditPub.vue'),
      props: true
    },
    {
      path: 'forms/new',
      name: 'New Publication',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Forms/NewPub.vue'),
      props: true
    }
  ]
}

const termsMenu = {
  path: '/terminology',
  component: Layout,
  redirect: '/terminology/home',
  children: [
    {
      path: 'home',
      name: 'Terminology',
      component: () => import(/* webpackChunkName: "terminology" */ '../components/Pages/Terminology.vue'),
      props: true
    },
    {
      path: 'home/manageterms',
      name: 'ManageTerms',
      component: () => import(/* webpackChunkName: "terminology" */ '../components/Pages/ManageTerms.vue'),
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
  pubsDevMenu,
  termsMenu,
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
      },
      {
        path: 'NavyDoctrine',
        name: 'NavyDoctrine',
        component: NavyDoctrine
      },
      {
        path: 'PleaseReview',
        name: 'PleaseReview',
        component: PleaseReview
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
