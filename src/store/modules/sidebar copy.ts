/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { SidebarItem } from '@/interfaces/SidebarItem'
import _ from 'lodash'

@Module({ namespaced: true })
class Sidebar extends VuexModule {
  public sidebaritems: Array<SidebarItem> = [
    {
      id: 100,
      isMenu: true,
      name: 'Approved Publications',
      to: { path: '/pubs/approved' },
      children: [
        {
          id: 101,
          name: 'Whats New',
          library: 'fas',
          icon: 'newspaper',
          children: [],
          to: { path: '/pubs/reroute/new' }
          /* to: { path: '/pubs/approved/all/filtered/custom/New/New' } */
        },
        {
          id: 102,
          name: 'Navy',
          library: 'fas',
          icon: 'anchor',
          children: [],
          to: { path: '/pubs/reroute/navy' }
          /* to: { path: '/pubs/approved/all/filtered/field/Branch/Navy' } */
        },
        {
          id: 103,
          name: 'Allied',
          library: 'fas',
          icon: 'users',
          permission: 'isNATOVisitor',
          permissionvalue: true,
          children: [],
          to: { path: '/pubs/approved/allied' }
        },
        {
          id: 104,
          name: 'Joint',
          library: 'fas',
          icon: 'user-friends',
          children: [],
          to: { path: '/pubs/reroute/joint' }
          /* to: { path: '/pubs/approved/all/filtered/field/Branch/Joint' } */
        },
        {
          id: 105,
          name: 'MultiNational',
          library: 'fas',
          icon: 'user-tie',
          children: [],
          to: { path: '/pubs/reroute/multinational' }
          /* to: { path: '/pubs/approved/all/filtered/field/Branch/Multinational' } */
        },
        {
          id: 107,
          name: 'All Publications',
          library: 'far',
          icon: 'file-lines',
          children: [],
          to: { path: '/pubs/reroute/all' }
        },
        {
          id: 108,
          name: 'Grouped Views',
          library: 'fas',
          icon: 'folder-tree',
          isMenu: true,
          children: [
            {
              id: 1081,
              name: 'Navy',
              library: 'fas',
              icon: 'anchor',
              to: { path: '/pubs/reroute/grouped/Navy' }
            },
            {
              id: 1082,
              name: 'Allied',
              library: 'fas',
              icon: 'users',
              permission: 'isNATOVisitor',
              permissionvalue: true,
              to: { path: '/pubs/reroute/grouped/Allied' }
            },
            {
              id: 1083,
              name: 'Joint',
              library: 'fas',
              icon: 'user-friends',
              to: { path: '/pubs/reroute/grouped/Joint' }
            },
            {
              id: 1084,
              name: 'MultiNational',
              library: 'fas',
              icon: 'user-tie',
              to: { path: '/pubs/reroute/grouped/Multinational' }
            },
            {
              id: 1085,
              name: 'All Branches',
              library: 'far',
              icon: 'file-lines',
              to: { path: '/pubs/reroute/grouped/All' }
            }
          ]
        }
      ],
      library: 'fas',
      icon: 'file-alt'
    },
    {
      id: 150,
      isMenu: false,
      children: [],
      name: 'Archived Publications',
      to: { path: '/pubs/archived/all' },
      library: 'fas',
      icon: 'file-archive',
      permission: 'canViewArchives',
      permissionvalue: true
    },
    {
      id: 200,
      isMenu: true,
      name: 'Pubs In Development',
      children: [
        {
          id: 201,
          name: 'Add New Publication',
          to: { path: '/pubs/development/new' },
          library: 'fas',
          icon: 'plus',
          permission: 'isLibrarian',
          permissionvalue: true
        },
        {
          id: 201,
          name: 'All Dev Publications',
          to: { path: '/pubs/development/all' },
          library: 'far',
          icon: 'pen-to-square'
        }
      ],
      library: 'fas',
      icon: 'user-edit',
      permission: 'isActionOfficer',
      permissionvalue: true
    },
    {
      id: 300,
      isMenu: true,
      name: 'Naval Terminology',
      library: 'fas',
      icon: 'spell-check',
      children: [
        {
          id: 301,
          name: 'View Terminology',
          to: { path: '/terminology/home' },
          library: 'fas',
          icon: 'plus'
        },
        {
          id: 302,
          name: 'Manage Terminology',
          to: { path: '/terminology/home/manageterms' },
          library: 'fas',
          icon: 'plus',
          permission: 'isTerminologist',
          permissionvalue: true
        }
      ]
    },
    {
      id: 400,
      isMenu: false,
      children: [],
      name: 'PleaseReview',
      library: 'fas',
      icon: 'folder-open',
      to: { path: '/pages/pleasereview' }
    },
    {
      id: 500,
      isMenu: true,
      name: 'Documents',
      path: '/pubs/home',
      children: [
        {
          id: 501,
          name: 'TACMEMOS',
          to: { path: '/pubs/approved/all/filtered/field/prefix/TACMEMOS' },
          library: 'fas',
          icon: 'newspaper'
        },
        {
          id: 502,
          name: 'Fleet CONOPS',
          to: { path: '/pubs/approved/all/filtered/field/prefix/CONOPS' },
          library: 'fas',
          icon: 'file-signature'
        },
        {
          id: 503,
          name: 'Navy Concept Pubs',
          to: { path: '/pubs/approved/all/filtered/custom/Navy%20Concept%20Pubs/Navy%20Concept%20Pubs' },
          library: 'fas',
          icon: 'passport'
        },
        {
          id: 504,
          name: 'Navy-Wide OPTASKs',
          to: { path: '/pubs/approved/all/filtered/custom/Navy-Wide%20OPTASKs/Navy-Wide%20OPTASKs' },
          library: 'fas',
          icon: 'tasks'
        },
        {
          id: 505,
          name: 'Other',
          to: { path: '/pubs/approved/all/filtered/field/branch/Other/Other%20Publications' },
          library: 'fas',
          icon: 'folder'
        }
      ],
      library: 'fas',
      icon: 'folder-open'
    },
    {
      id: 600,
      isMenu: true,
      name: 'Library Information',
      path: '/library/home',
      children: [
        {
          id: 602,
          name: 'Command List',
          to: { path: '/library/home/refreshcommandlist' },
          library: 'fas',
          icon: 'passport'
        },
        {
          id: 603,
          name: 'Doctrine POCs',
          to: { path: '/library/home/refreshpocs' },
          library: 'fas',
          icon: 'tasks'
        }
      ],
      library: 'fas',
      icon: 'book-open',
      permission: 'isVisitor',
      permissionvalue: false
    },
    {
      id: 700,
      isMenu: false,
      children: [],
      name: 'Doctrine Links',
      library: 'fas',
      icon: 'link',
      to: { path: '/library/home/refreshlinks' }
    },
    {
      id: 800,
      isMenu: true,
      name: 'NWL Support',
      to: { path: '/nwlsupport/home' },
      children: [
        {
          id: 801,
          name: 'FAQ',
          to: { path: '/nwlsupport/home/refreshfaq' },
          library: 'fas',
          icon: 'newspaper'
        },
        {
          id: 804,
          name: 'Request NWL Support',
          to: { path: '/nwlsupport/home/requestnwl' },
          library: 'fas',
          icon: 'tasks'
        },
        {
          id: 805,
          name: 'Request Portal/IT Support',
          to: { path: '/nwlsupport/home/requestit' },
          library: 'fas',
          icon: 'archive'
        }
      ],
      library: 'fas',
      icon: 'question'
    },
    {
      id: 900,
      isMenu: true,
      name: 'Librarian Actions',
      to: { path: '/librarian/home' },
      permission: 'isLibrarian',
      permissionvalue: true,
      children: [
        {
          id: 901,
          name: 'NWL Administration',
          to: { path: '/librarian/home/refreshadmin' },
          library: 'fas',
          icon: 'tools'
        },
        {
          id: 902,
          name: 'Announcements',
          to: { path: '/librarian/home/refreshannouncements' },
          library: 'fas',
          icon: 'bullhorn'
        }
      ],
      library: 'fas',
      icon: 'question'
    },
    {
      id: 950,
      isMenu: true,
      name: 'AO Actions',
      to: { path: '/ao/home' },
      permission: 'isActionOfficer',
      permissionvalue: true,
      children: [
        {
          id: 951,
          name: 'AO Administration',
          to: { path: '/ao/home/aoadministration' },
          library: 'fas',
          icon: 'tools'
        }
      ],
      library: 'fas',
      icon: 'question'
    },
    {
      id: 1000,
      isMenu: false,
      children: [],
      name: 'Search',
      to: { path: '/Pages/Search' },
      library: 'fas',
      icon: 'search-plus'
    }
  ]

  /* public navigationloaded = false
  public navigation: Array<SidebarItem> = []

  @Mutation
  public addSidebarItem(item: SidebarItem): void {
    // TODO: Update to just push results from axios call as one larger function
    this.sidebaritems.push({
      ...item
    })
  }

  @Action
  public add(item: SidebarItem): void {
    this.context.commit('addSidebarItem', item)
  } */
}
export default Sidebar
