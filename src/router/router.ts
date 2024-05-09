import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/Layouts/Layout.vue'
// import Publications from '@/components/Publications/Publications.vue'
import Publications from '@/components/Publications/Publications2.vue'
import Publication from '@/components/Publications/Publication.vue'
import Development from '@/components/Publications/Development.vue'
import SearchResults from '@/components/Publications/SearchResults.vue'
import View from '@/components/Publications/Forms/View.vue'
import Edit from '@/components/Publications/Forms/Edit.vue'
import New from '@/components/Publications/Forms/New.vue'
import Upload from '@/components/Publications/Forms/Upload.vue'
import Home from '@/components/Pages/Home.vue'
import Reroute from '@/components/Pages/Reroute.vue'
import Grouped from '@/components/Publications/Grouped.vue'
import Allied from '@/components/Publications/Allied.vue'
import Archive from '@/components/Publications/Archive.vue'
import NavyDoctrine from '@/components/Pages/NavyDoctrine.vue'
import PleaseReview from '@/components/Pages/PleaseReview.vue'
import Terminology from '@/components/Pages/Terminology.vue'
import ManageTerms from '@/components/Pages/ManageTerms.vue'
import Faq from '@/components/NWLSupport/FAQ.vue'
import POCs from '@/components/Pages/POCs.vue'
import Search from '@/components/Pages/Search.vue'
import ReqNatoAccess from '@/components/NWLSupport/ReqNatoAccess.vue'
import ReqSupport from '@/store/modules/reqsupport'
import ManageTerminology from '@/components/Pages/ManageTerminology.vue'

const NotFound = { template: '<div>That link can not be found</div>' }
const Rejected = { template: '<div/div' }

Vue.use(VueRouter)

const approvedPubsMenu = {
  path: '/pubs',
  component: Layout,
  children: [
    {
      path: 'reroute/:route',
      name: 'RerouteSimple',
      component: Reroute,
      props: true
    },
    {
      path: 'reroute/:route/:view',
      name: 'RerouteComplex',
      component: Reroute,
      props: true
    },
    {
      path: 'reroute/:route/:filter/:value/:title',
      name: 'RerouteComplex',
      component: Reroute,
      props: true
    },
    {
      path: 'approved',
      component: Publication,
      props: true,
      children: [
        {
          path: 'reroute/:route',
          name: 'Reroute',
          components: {
            content: Reroute
          },
          meta: {
            showModal: false
          },
          props: true
        },
        {
          path: 'all',
          name: 'All Publications',
          components: {
            content: Publications
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'No',
            ShowFXP: 'No'
          },
          props: true
        },
        {
          path: 'all/filtered/complex',
          name: 'Complex Filtered Publications',
          components: {
            content: Publications
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'No',
            ShowFXP: 'No'
          },
          props: true
        },
        {
          path: 'all/filtered/:filterType',
          name: 'Filtered Publications',
          components: {
            content: Publications
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'No',
            ShowFXP: 'No'
          },
          props: true
        },
        {
          path: 'all/filtered/TTP',
          name: 'TTP',
          components: {
            content: Publications
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'Yes',
            ShowFXP: 'No'
          },
          props: true
        },
        {
          path: 'all/filtered/FXP',
          name: 'FXP',
          components: {
            content: Publications
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'No',
            ShowFXP: 'Yes'
          },
          props: true
        },
        {
          path: 'all/filtered/:filterType/:filterField/:filterValue',
          name: 'Filtered Publications',
          components: {
            content: Publications
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'No',
            ShowFXP: 'No'
          },
          props: true
        },
        {
          path: 'all/filtered/:filterType/:filterField/:filterValue/:grouped/:groupedby',
          name: 'Filtered Publications',
          components: {
            content: Publications
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'No',
            ShowFXP: 'No'
          },
          props: true
        },
        {
          path: 'all/view/:Id/:IsNato/:DocID/:ShowHidden/:Title',
          name: 'ViewPub',
          components: {
            content: Publications,
            dialog: View
          },
          meta: {
            showModal: true
          },
          props: true
        },
        {
          path: 'all/edit/:Id/:IsNato/:FromView/:Title',
          name: 'EditPub',
          components: {
            content: Publications,
            dialog: Edit
          },
          meta: {
            showModal: true
          },
          props: true
        },
        {
          path: 'all/upload/:Id/:IsNato/:FromView/:Title',
          name: 'UploadPub',
          components: {
            content: Publications,
            dialog: Upload
          },
          meta: {
            showModal: true
          },
          props: true
        },
        {
          path: 'allied',
          name: 'Allied Publications',
          components: {
            content: Allied
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'No',
            ShowFXP: 'No'
          },
          props: true
        },
        {
          path: 'allied/filtered/:filterType/:filterField/:filterValue',
          name: 'Filtered Allied Publications',
          components: {
            content: Publications
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'No',
            ShowFXP: 'No'
          },
          props: true
        },
        {
          path: 'allied/filtered/Meteorology',
          name: 'Meteorology',
          components: {
            content: Publications
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'No',
            ShowFXP: 'No'
          },
          props: true
        },
        {
          path: 'grouped/:view',
          name: 'Grouped Publications',
          components: {
            content: Grouped
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'No',
            ShowFXP: 'No'
          },
          props: true
        },
        {
          path: 'grouped/view/:Id/:IsNato/:DocID/:ShowHidden/:Title',
          name: 'ViewPub',
          components: {
            content: Grouped,
            dialog: View
          },
          meta: {
            showModal: true
          },
          props: true
        },
        {
          path: 'grouped/edit/:Id/:IsNato/:FromView/:Title',
          name: 'EditPub',
          components: {
            content: Grouped,
            dialog: Edit
          },
          meta: {
            showModal: true
          },
          props: true
        },
        {
          path: 'grouped/upload/:Id/:IsNato/:FromView/:Title',
          name: 'UploadPub',
          components: {
            content: Grouped,
            dialog: Upload
          },
          meta: {
            showModal: true
          },
          props: true
        }
      ]
    },
    {
      path: 'development',
      component: Publication,
      props: true,
      children: [
        {
          path: 'all',
          name: 'All Development Publications',
          components: {
            content: Development
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'Yes',
            ShowFXP: 'Yes'
          },
          props: true
        },
        {
          path: 'all/filtered/complex',
          name: 'Complex Filtered Dev Publications',
          components: {
            content: Development
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'Yes',
            ShowFXP: 'Yes'
          },
          props: true
        },
        {
          path: 'all/filtered/:filterType/:filterField/:filterValue',
          name: 'Filtered Development Publications',
          components: {
            content: Development
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'Yes',
            ShowFXP: 'Yes'
          },
          props: true
        },
        {
          path: 'all/view/:Id/:IsNato/:DocID/:ShowHidden/:Title',
          name: 'ViewPub',
          components: {
            content: Development,
            dialog: View
          },
          meta: {
            showModal: true
          },
          props: true
        },
        {
          path: 'all/edit/:Id/:IsNato/:FromView/:Title',
          name: 'EditPub',
          components: {
            content: Development,
            dialog: Edit
          },
          meta: {
            showModal: true
          },
          props: true
        },
        {
          path: 'new',
          name: 'NewPub',
          components: {
            content: Development,
            dialog: New
          },
          meta: {
            showModal: true
          },
          props: true
        }
      ]
    },
    {
      path: 'archived',
      component: Publication,
      props: true,
      children: [
        {
          path: 'all',
          name: 'All Archived Publications',
          components: {
            content: Archive
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'Yes',
            ShowFXP: 'Yes'
          },
          props: true
        },
        {
          path: 'all/filtered/complex',
          name: 'Complex Filtered Archive Publications',
          components: {
            content: Archive
          },
          meta: {
            showModal: false
          },
          props: true
        },
        {
          path: 'all/filtered/:filterType/:filterField/:filterValue',
          name: 'Filtered Archived Publications',
          components: {
            content: Archive
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'Yes',
            ShowFXP: 'Yes'
          },
          props: true
        },
        {
          path: 'all/view/:Id/:IsNato/:DocID/:ShowHidden/:IsArchive/:Title',
          name: 'ViewPub',
          components: {
            content: Archive,
            dialog: View
          },
          meta: {
            showModal: true
          },
          props: true
        },
        {
          path: 'all/edit/:Id/:IsNato/:FromView/:IsArchive/:Title',
          name: 'EditPub',
          components: {
            content: Archive,
            dialog: Edit
          },
          meta: {
            showModal: true
          },
          props: true
        }
      ]
    },
    {
      path: 'pubs/forms/new',
      component: () => import(/* webpackChunkName: "publications" */ '../components/Publications/Forms/New.vue'),
      meta: { title: 'New Publication' },
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
      name: 'Doctrine POCs',
      component: () => import(/* webpackChunkName: "libraryinformation" */ '../components/LibraryInformation/DoctrinePOCs.vue'),
      props: true
    },
    {
      path: 'home/bookshelves',
      name: 'Mission Area Bookshelves',
      component: () => import(/* webpackChunkName: "libraryinformation" */ '../components/LibraryInformation/Bookshelves.vue'),
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
    },
    {
      path: 'home/toppublications',
      name: 'Top Publications',
      component: () => import(/* webpackChunkName: "reports" */ '../components/Reports/TopPublications.vue'),
      props: true
    },
    {
      path: 'home/topnatopublications',
      name: 'Top NATO Publications',
      component: () => import(/* webpackChunkName: "reports" */ '../components/Reports/TopNatoPublications.vue'),
      props: true
    },
    {
      path: 'home/uniqueusers',
      name: 'Unique Users',
      component: () => import(/* webpackChunkName: "reports" */ '../components/Reports/UniqueUsers.vue'),
      props: true
    },
    {
      path: 'home/publicationsindevphase',
      name: 'Publications In Dev Phase',
      component: () => import(/* webpackChunkName: "reports" */ '../components/Reports/PublicationsInDevPhase.vue'),
      props: true
    },
    {
      path: 'home/publicationsposted',
      name: 'Publications Posted',
      component: () => import(/* webpackChunkName: "reports" */ '../components/Reports/PublicationsPosted.vue'),
      props: true
    },
    {
      path: 'home/natopublicationsposted',
      name: 'NATO Publications Posted',
      component: () => import(/* webpackChunkName: "reports" */ '../components/Reports/NatoPublicationsPosted.vue'),
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
      component: Terminology,
      props: true
    },
    {
      path: 'home/manageterms',
      name: 'Manage Terms',
      component: ManageTerms,
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
      path: 'home/natostatus',
      name: 'My NATO Status',
      component: () => import(/* webpackChunkName: "Support" */ '../components/NWLSupport/MyNatoStatus.vue'),
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

const searchMenu = {
  path: '/search',
  component: Layout,
  children: [
    {
      path: 'results',
      component: Publication,
      props: true,
      children: [
        {
          path: 'query/:query',
          name: 'Search Results',
          components: {
            content: SearchResults
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'Yes',
            ShowFXP: 'Yes'
          },
          props: true
        },
        {
          path: 'query/:query/refined/complex',
          name: 'Refined Search Results',
          components: {
            content: SearchResults
          },
          meta: {
            showModal: false,
            ShowTacMemos: 'Yes',
            ShowFXP: 'Yes'
          },
          props: true
        },
        {
          path: 'query/view/:Id/:IsNato/:DocID/:ShowHidden/:Title',
          name: 'ViewPub',
          components: {
            content: SearchResults,
            dialog: View
          },
          meta: {
            showModal: true
          },
          props: true
        },
        {
          path: 'query/edit/:Id/:IsNato/:FromView/:Title',
          name: 'EditPub',
          components: {
            content: SearchResults,
            dialog: Edit
          },
          meta: {
            showModal: true
          },
          props: true
        }
      ]
    }
  ]
}

const routes = [
  {
    path: '/',
    redirect: '/pages/Home'
  },
  searchMenu,
  approvedPubsMenu,
  termsMenu,
  aoMenu,
  librarianMenu,
  libraryInformationMenu,
  reportsMenu,
  nwlsupportMenu,
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
        path: 'ManageTerminology',
        name: 'ManageTerminology',
        component: ManageTerminology
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
      },
      {
        path: 'Search',
        name: 'Search',
        component: Search
      }
    ]
  },
  { path: '*', component: NotFound },
  { path: '/rejected', component: Rejected }
]

const router = new VueRouter({
  routes
})

export default router
