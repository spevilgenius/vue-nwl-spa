/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { SidebarItem } from '@/interfaces/SidebarItem'
import _ from 'lodash'

@Module({ namespaced: true })
class Sidebar extends VuexModule {
  public sidebaritems: Array<SidebarItem> = [
    {
      id: 50,
      isMenu: false,
      name: "What's New",
      library: 'fas',
      icon: 'newspaper',
      children: [],
      to: { path: '/pubs/reroute/new' }
    },
    {
      id: 100,
      isMenu: true,
      name: 'Approved Publications',
      to: { path: '/pubs/approved' },
      children: [
        {
          id: 107,
          name: 'All Publications',
          library: 'far',
          icon: 'file-lines',
          children: [],
          to: { path: '/pubs/reroute/all' }
        },
        {
          id: 1081,
          name: 'Navy',
          library: 'fas',
          icon: 'anchor',
          to: { path: '/pubs/reroute/grouped/Navy' }
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
          name: 'Allied',
          library: 'fas',
          icon: 'users',
          permission: 'isNATOVisitor',
          permissionvalue: false,
          children: [],
          to: { path: '/nwlsupport/home/requestnato' }
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
          name: 'All Publications (Grouped)',
          library: 'far',
          icon: 'file-lines',
          to: { path: '/pubs/reroute/grouped/All' }
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
      isMenu: false,
      children: [],
      name: 'Pubs In Development',
      to: { path: '/pubs/development/all' },
      library: 'fas',
      icon: 'pen-to-square',
      permission: 'canViewDevPubs',
      permissionvalue: true
    },
    {
      id: 300,
      isMenu: false,
      children: [],
      name: 'Naval Terminology',
      to: { path: '/terminology/home' },
      library: 'fas',
      icon: 'spell-check'
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
          name: 'TACMEMO, TACBUL, TACNOTE',
          to: { path: '/pubs/reroute/tacmemos' },
          library: 'fas',
          icon: 'newspaper'
        },
        {
          id: 502,
          name: 'Fleet CONOPS',
          to: { path: '/pubs/reroute/conops' },
          library: 'fas',
          icon: 'file-signature'
        },
        {
          id: 503,
          name: 'Navy Concept',
          to: { path: '/pubs/reroute/concept' },
          library: 'fas',
          icon: 'passport'
        },
        {
          id: 504,
          name: 'Navy-Wide OPTASKs',
          to: { path: '/pubs/reroute/optasks' },
          library: 'fas',
          icon: 'tasks'
        },
        {
          id: 505,
          name: 'Other',
          to: { path: '/pubs/reroute/other' },
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
          id: 601,
          name: 'Command List',
          to: { path: '/library/home/refreshcommandlist' },
          library: 'fas',
          icon: 'passport'
        },
        {
          id: 602,
          name: 'Doctrine POCs',
          to: { path: '/library/home/refreshpocs' },
          library: 'fas',
          icon: 'tasks'
        },
        {
          id: 603,
          name: 'Mission Area Bookshelves',
          to: { path: '/library/home/refreshbookshelves' },
          library: 'fas',
          icon: 'tasks'
        }
      ],
      library: 'fas',
      icon: 'book-open'
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
          id: 802,
          name: 'Request NWL Support',
          to: { path: '/nwlsupport/home/requestnwl' },
          library: 'fas',
          icon: 'tasks'
        },
        {
          id: 803,
          name: 'Request Portal/IT Support',
          to: { path: '/nwlsupport/home/requestit' },
          library: 'fas',
          icon: 'archive'
        },
        {
          id: 804,
          name: 'Request NATO Access',
          to: { path: '/nwlsupport/home/requestnato' },
          library: 'fas',
          icon: 'house-flag'
        }
      ],
      library: 'fas',
      icon: 'bell-concierge'
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
          name: 'Add New Publication',
          to: { path: '/pubs/development/new' },
          library: 'fas',
          icon: 'plus',
          permission: 'isLibrarian',
          permissionvalue: true
        },
        {
          id: 903,
          name: 'Announcements',
          to: { path: '/librarian/home/refreshannouncements' },
          library: 'fas',
          icon: 'bullhorn'
        }
      ],
      library: 'fas',
      icon: 'book'
    },
    {
      id: 940,
      isMenu: false,
      children: [],
      name: 'Manage Terminology',
      library: 'fas',
      icon: 'spell-check',
      to: { path: '/pages/ManageTerminology' },
      permission: 'isTerminologist',
      permissionvalue: true
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
      icon: 'briefcase'
    },
    {
      id: 1000,
      isMenu: true,
      name: 'Reports',
      permission: 'isLibrarian',
      permissionvalue: true,
      children: [
        {
          id: 1001,
          name: 'Top Publications',
          to: { path: '/reports/home/toppublications' },
          library: 'far',
          icon: 'file-lines'
        },
        {
          id: 1002,
          name: 'Top NATO Publications',
          to: { path: '/reports/home/topnatopublications' },
          library: 'far',
          icon: 'file-lines'
        },
        {
          id: 1003,
          name: 'Publications In Dev Phase',
          to: { path: '/reports/home/publicationsindevphase' },
          library: 'far',
          icon: 'file-lines'
        },
        {
          id: 1004,
          name: 'Publications Posted',
          to: { path: '/reports/home/publicationsposted' },
          library: 'far',
          icon: 'file-lines'
        },
        {
          id: 1005,
          name: 'NATO Publications Posted',
          to: { path: '/reports/home/natopublicationsposted' },
          library: 'far',
          icon: 'file-lines'
        },
        {
          id: 1006,
          name: 'Unique Users',
          to: { path: '/reports/home/uniqueusers' },
          library: 'far',
          icon: 'file-lines'
        }
      ],
      library: 'fas',
      icon: 'folder-tree'
    }
  ]
}
export default Sidebar
