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
import Reports from '@/components/Reports/FiscalYearReport.vue'
import Faq from '@/components/Pages/FAQ.vue'
import POCs from '@/components/Pages/POCs.vue'
import Search from '@/components/Pages/Search.vue'
import Results from '@/components/Pages/Results.vue'

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

const libraryInformationMenu = {
  path: '/library',
  component: Layout,
  redirect: '/librarian/home',
  children: [
    {
      path: 'home/:mode',
      name: 'Libraryinformation',
      component: () => import(/* webpackChunkName: "libraryinformation" */ '../components/LibraryInformation/Home.vue'),
      props: true
    },
    {
      path: 'home/commandlist',
      name: 'Command List',
      component: () => import(/* webpackChunkName: "libraryinformation" */ '../components/LibraryInformation/CommandList.vue'),
      props: true
    },
    {
      path: 'home/doctrinepoc',
      name: 'NWL Administration',
      component: () => import(/* webpackChunkName: "libraryinformation" */ '../components/LibraryInformation/DoctrinePOCs.vue'),
      props: true
    },
    {
      path: 'home/links',
      name: 'Doctrine Links',
      component: () => import(/* webpackChunkName: "libraryinformation" */ '../components/LibraryInformation/DoctrineLinks.vue'),
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

const documentsMenu = {
  path: '/approved',
  component: Layout,
  redirect: '/approved/pubs',
  children: [
    {
      path: 'pubs/:mode',
      name: 'Documents',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Home.vue'),
      props: true
    },
    {
      path: 'pubs/TACMEMOS',
      name: 'TACMEMOS',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/All.vue'),
      props: true
    },
    {
      path: 'pubs/fleet',
      name: 'Fleet Conops',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Pages/Allied.vue'),
      props: true
    },
    {
      path: 'pubs/concept',
      name: 'Navy Concept Pubs',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Forms/ViewPub.vue'),
      props: true
    },
    {
      path: 'pubs/optasks',
      name: 'Navy-Wide Optasks',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Forms/ViewPub.vue'),
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
  libraryInformationMenu,
  reportsMenu,
  documentsMenu,
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
        path: 'Search',
        name: 'Search',
        component: Search
      },
      {
        path: 'Results',
        name: 'Search Results',
        component: Results
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
