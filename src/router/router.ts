import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/Layouts/LayoutTS.vue'
import Home from '@/components/Pages/HomeTS.vue'
import Developer from '@/components/Pages/Developer.vue'
import NavyDoctrine from '@/components/Pages/NavyDoctrine.vue'
import PleaseReview from '@/components/Pages/PleaseReview.vue'
import ManageTerms from '@/components/Pages/ManageTerms.vue'
import AoAdministration from '@/components/AO/AOAdmin.vue'
import LibrarianAdmin from '@/components/Librarian/LibrarianAdmin.vue'
import Faq from '@/components/NWLSupport/FAQ.vue'
import POCs from '@/components/Pages/POCs.vue'
import ReqNatoAccess from '@/components/NWLSupport/ReqNatoAccess.vue'
import RequestNWLSpt from '@/components/NWLSupport/RequestNWLSpt.vue'
import Support from '@/store/modules/support'
import ReqSupport from '@/store/modules/reqsupport'
import { component } from 'vue/types/umd'

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

const archiveMenu = {
  path: '/archived',
  component: Layout,
  redirect: '/archived/pubs',
  children: [
    {
      path: 'pubs/:mode',
      name: 'Archived Publications',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Home.vue'),
      props: true
    },
    {
      path: 'pubs/all',
      name: 'All Archived Publications',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Archive.vue'),
      props: true
    }
  ]
}

const librarianMenu = {
  path: '/librarian',
  component: Layout,
  redirect: '/librarian/home',
  children: [
    {
      path: 'home/:mode',
      name: 'Librarian',
      component: () => import(/* webpackChunkName: "librarian" */ '../components/Librarian/Home.vue'),
      props: true
    },
    {
      path: 'home/admin',
      name: 'NWL Administration',
      component: () => import(/* webpackChunkName: "librarian" */ '../components/Librarian/LibrarianAdmin.vue'),
      props: true
    },
    {
      path: 'home/announcements',
      name: 'Announcements',
      component: () => import(/* webpackChunkName: "librarian" */ '../components/Librarian/Announcements.vue'),
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
    },
    {
      path: 'pubs/forms/upload',
      name: 'Upload Publication',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Forms/UploadPub.vue'),
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
      component: () => import(/* webpackChunkName: "ao" */ '../components/AO/Home.vue'),
      props: true
    },
    {
      path: 'home/aoadministration',
      name: 'AO Administration',
      component: () => import(/* webpackChunkName: "ao" */ '../components/AO/AOAdmin.vue'),
      props: true
    }
  ]
}

const reportsMenu = {
  path: '/reports',
  component: Layout,
  redirect: '/reports/home',
  children: [
    {
      path: 'home/:mode',
      name: 'Reports',
      component: () => import(/* webpackChunkName: "reports" */ '../components/Reports/Home.vue'),
      props: true
    },
    {
      path: 'home/fiscalyearreport',
      name: 'Fiscal Year Report',
      component: () => import(/* webpackChunkName: "reports" */ '../components/Reports/FiscalYearReport.vue'),
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
      name: 'Manage Terms',
      component: () => import(/* webpackChunkName: "terminology" */ '../components/Pages/ManageTerms.vue'),
      props: true
    }
  ]
}

const nwlsupportMenu = {
  path: '/nwlsupport',
  component: Layout,
  redirect: '/nwlsupport/home',
  children: [
    {
      path: 'home/:mode',
      name: 'NWL Support',
      component: () => import(/* webpackChunkName: "Support" */ '../components/NWLSupport/Home.vue'),
      props: true
    },
    {
      path: 'home/faq',
      name: 'FAQ',
      component: () => import(/* webpackChunkName: "Support" */ '../components/NWLSupport/FAQ.vue'),
      props: true
    },
    {
      path: 'home/reqnatoaccess',
      name: 'Request NATO Access',
      component: () => import(/* webpackChunkName: "Support" */ '../components/NWLSupport/ReqNatoAccess.vue'),
      props: true
    },
    {
      path: 'home/requestnwl',
      name: 'Request NWL Support',
      component: () => import(/* webpackChunkName: "Support" */ '../components/NWLSupport/ReqNWLSupport.vue'),
      props: true
    },
    {
      path: 'home/requestit',
      name: 'Request IT Support',
      component: () => import(/* webpackChunkName: "Support" */ '../components/NWLSupport/ReqITSupport.vue'),
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
  archiveMenu,
  pubsDevMenu,
  termsMenu,
  aoMenu,
  librarianMenu,
  nwlsupportMenu,
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
      },
      {
        path: 'FAQ',
        name: 'FAQ',
        component: Faq
      },
      {
        path: 'POCs',
        name: 'POCs',
        component: POCs
      },
      {
        path: 'ReqNatoAccess',
        name: 'ReqNatoAccess',
        component: ReqNatoAccess
      },
      {
        path: 'ReqSupport',
        name: 'ReqSupport',
        component: ReqSupport
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
