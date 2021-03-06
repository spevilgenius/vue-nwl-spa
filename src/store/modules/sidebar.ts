/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { SidebarItem } from '@/interfaces/SidebarItem'
import axios from 'axios'
import _ from 'lodash'

declare const _spPageContextInfo: any

// are we on a localhost demo?
let loc = String(window.location)
let local = false
if (loc.indexOf('localhost') >= 0) {
  local = true
}
let baseUrl = null
if (!local) {
  baseUrl = _spPageContextInfo.webServerRelativeUrl
}

function formatNavigation(j: any): Array<SidebarItem> {
  const p: Array<SidebarItem> = []
  // loop through the items
  for (let i = 0; i < j.length; i++) {
    // we know that any item that has isMenu set to true is a root item so we are going to set those up first
    if (j[i]['isMenu'] == true) {
      // add this item to the array
      p.push({
        id: Number(j[i]['Id']),
        isMenu: true,
        name: j[i]['Title'],
        path: j[i]['path'],
        children: [],
        library: j[i]['library'],
        icon: j[i]['icon'],
        permission: j[i]['permission'],
        permissionvalue: j[i]['permissionvalue']
      })
    }
  }
  // we now should have an array of main menu items
  // add the children
  for (let i = 0; i < j.length; i++) {
    // we know that items with a parent set should be added to their respective parent
    if (j[i]['parent']) {
      // add this item to the array
      let parent = Number(j[i]['parent'])
      for (let k = 0; k < p.length; k++) {
        if (p[k]['id'] == parent) {
          p[k].children?.push({
            id: Number(j[i]['Id']),
            name: j[i]['Title'],
            path: j[i]['path'],
            library: j[i]['library'],
            icon: j[i]['icon'],
            filtertype: j[i]['filtertype'],
            permission: j[i]['permission'],
            permissionvalue: j[i]['permissionvalue']
          })
        }
      }
    }
  }
  return p
}

@Module({ namespaced: true })
class Sidebar extends VuexModule {
  public sidebaritems: Array<SidebarItem> = [
    {
      id: 100,
      isMenu: true,
      name: 'Approved Publications',
      path: '/pubs/home',
      children: [
        {
          id: 101,
          name: 'Whats New',
          path: '/pubs/home/refreshnew',
          library: 'fas',
          icon: 'newspaper'
        },
        {
          id: 102,
          name: 'Navy',
          path: '/pubs/home/refreshnavy',
          library: 'fas',
          icon: 'anchor'
        },
        {
          id: 103,
          name: 'Allied',
          path: '/pubs/home/refreshallied',
          library: 'fas',
          icon: 'users'
        },
        {
          id: 104,
          name: 'Joint',
          path: '/pubs/home/refreshjoint',
          library: 'fas',
          icon: 'user-friends'
        },
        {
          id: 105,
          name: 'MultiNational',
          path: '/pubs/home/refreshmulti',
          library: 'fas',
          icon: 'user-tie'
        },
        {
          id: 106,
          name: 'All Publications',
          path: '/pubs/home/refreshall',
          library: 'fas',
          icon: 'user-shield'
        }
      ],
      library: 'fas',
      icon: 'file-alt'
    },
    {
      id: 200,
      isMenu: false,
      children: [],
      name: 'Pubs In Development',
      library: 'fas',
      icon: 'user-edit',
      path: '/pubs/home/refreshdevelopment'
    },
    {
      id: 300,
      isMenu: false,
      children: [],
      name: 'Naval Terminology',
      library: 'fas',
      icon: 'spell-check',
      path: '/terminology/home'
    },
    {
      id: 400,
      isMenu: false,
      children: [],
      name: 'PleaseReview',
      library: 'fas',
      icon: 'folder-open',
      path: '/review/home'
    },
    {
      id: 500,
      isMenu: true,
      name: 'Documents',
      path: '/docs/home',
      children: [
        {
          id: 501,
          name: 'TACMEMOS',
          path: '/docs/home/refreshtacmemos',
          library: 'fas',
          icon: 'newspaper'
        },
        {
          id: 502,
          name: 'Fleet CONOPS',
          path: '/docs/home/refreshfleet',
          library: 'fas',
          icon: 'file-signature'
        },
        {
          id: 503,
          name: 'Navy Concept Pubs',
          path: '/docs/home/refreshconcept',
          library: 'fas',
          icon: 'passport'
        },
        {
          id: 504,
          name: 'Navy-Wide OPTASKs',
          path: '/docs/home/refreshoptasks',
          library: 'fas',
          icon: 'tasks'
        },
        {
          id: 505,
          name: 'Archived Documents',
          path: '/docs/home/refresharchived',
          library: 'fas',
          icon: 'archive'
        },
        {
          id: 506,
          name: 'Other',
          path: '/docs/home/refreshother',
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
          name: 'Bookshelves',
          path: '/library/home/refreshshelves',
          library: 'fas',
          icon: 'newspaper'
        },
        {
          id: 602,
          name: 'Announcements',
          path: '/library/home/refreshfleet',
          library: 'fas',
          icon: 'file-signature'
        },
        {
          id: 603,
          name: 'Command List',
          path: '/library/home/refreshlist',
          library: 'fas',
          icon: 'passport'
        },
        {
          id: 604,
          name: 'Doctrine POCs',
          path: '/library/home/refreshpocs',
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
      path: '/links/home'
    },
    {
      id: 800,
      isMenu: true,
      name: 'Support',
      path: '/support/home',
      children: [
        {
          id: 801,
          name: 'FAQ',
          path: '/support/home/refreshfaq',
          library: 'fas',
          icon: 'newspaper'
        },
        {
          id: 802,
          name: 'My NATO Status',
          path: '/support/home/natostatus',
          library: 'fas',
          icon: 'file-signature'
        },
        {
          id: 803,
          name: 'Request NATO Access',
          path: '/support/home/requestnato',
          library: 'fas',
          icon: 'passport'
        },
        {
          id: 804,
          name: 'Request NWL Support',
          path: '/support/home/requestnwl',
          library: 'fas',
          icon: 'tasks'
        },
        {
          id: 805,
          name: 'Request Portal/IT Support',
          path: '/support/home/requestit',
          library: 'fas',
          icon: 'archive'
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
      path: '/search/home',
      library: 'fas',
      icon: 'search-plus'
    },
    {
      id: 1500,
      isMenu: false,
      children: [],
      name: 'Developer',
      path: '/pages/Developer',
      library: 'fas',
      icon: 'user-shield',
      permission: 'isDeveloper',
      permissionvalue: true
    }
  ]

  public navigationloaded = false
  public navigation: Array<SidebarItem> = []

  @Mutation
  public addSidebarItem(item: SidebarItem): void {
    // TODO: Update to just push results from axios call as one larger function
    this.sidebaritems.push({
      ...item
    })
  }

  @Mutation
  public updateNavigation(navigation: Array<SidebarItem>): void {
    this.navigation = navigation
    this.sidebaritems = navigation
  }

  @Mutation
  public updateNavigationLoaded(loaded: boolean): void {
    this.navigationloaded = loaded
  }

  @Action
  public add(item: SidebarItem): void {
    this.context.commit('addSidebarItem', item)
  }

  @Action
  public async getNavigation(): Promise<boolean> {
    if (!local) {
      const nurl = baseUrl + "/_api/lists/getbytitle('Navigation')/items?$select=*&$orderby=OrderID"
      let allNavigation: any[] = []
      let p: Array<SidebarItem> = []
      const that = this
      async function getAllNavigation(url: string): Promise<void> {
        if (url === '') {
          url = nurl
        }
        const response = await axios.get(url, {
          headers: {
            accept: 'application/json;odata=verbose'
          }
        })
        allNavigation = allNavigation.concat(response.data.d.results)
        // recursively load items if there is a next result
        if (response.data.d.__next) {
          url = response.data.d.__next
          return getAllNavigation(url)
        } else {
          // call a function from here?
          p = formatNavigation(allNavigation)
          that.context.commit('updateNavigation', p)
          that.context.commit('updateNavigationLoaded', true)
        }
      }
      getAllNavigation('')
      return true
    } else {
      console.log('Setting Sidebar Items: ' + this.sidebaritems.length)
      this.context.commit('updateNavigation', this.sidebaritems)
      this.context.commit('updateNavigationLoaded', true)
      return true
    }
  }
}
export default Sidebar
