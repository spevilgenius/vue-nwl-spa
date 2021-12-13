/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { LegendItem } from '@/interfaces/LegendItem'
import { ObjectItem } from '@/interfaces/ObjectItem'
import { Announcement } from '@/interfaces/Announcement'
import { EventBus } from '../../main'
import axios from 'axios'
import { SupportingDocItem } from '@/interfaces/SupportingDocItem'
// import { ThemeName } from '@/themes/theme.types'

// are we on a localhost demo?
let loc = String(window.location)
let local = false
if (loc.indexOf('localhost') >= 0) {
  local = true
}

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

const baseUrl = process.env.VUE_APP_BASE_URL
@Module({ namespaced: true })
class Support extends VuexModule {
  public rect!: DOMRect
  public isShown?: boolean = true
  public isThemeSelectorShown?: boolean = false
  // public theme: ThemeName = ThemeName.DEFAULT
  public contentrect!: DOMRect
  public contentwidth!: number
  public contentheight!: number
  public legendItems: Array<LegendItem> = []
  public legendLoaded = false
  public legendLoading = false
  public bookshelves: Array<ObjectItem> = []
  public announcements: Array<Announcement> = []
  today = new Date().toISOString()
  public bsUrl = "_api/lists/getbytitle('BookshelfTitles')/items?$select*&$orderby=Title"
  public aUrl = "_api/lists/getbytitle('Announcements')/items?$select=*,Editor/Id,Editor/Title,Editor/EMail&$expand=Editor&$filter=Expires ge '" + this.today + "'"
  public supportingdocs: Array<SupportingDocItem> = []
  public supportingdocsloaded?: boolean = false
  public supportingdoc?: SupportingDocItem

  sdUrl = "_api/lists/getbytitle('SupportingDocuments')/items"

  @Mutation
  public updateRect(newVal: DOMRect): void {
    this.contentrect = newVal
    this.contentwidth = newVal.width
    this.contentheight = newVal.height
    console.log('SIDEBAR VISIBLE: ' + this.isShown + ', WIDTH: ' + this.contentwidth)
    EventBus.$emit('SidebarChanged', this.contentwidth)
  }

  @Mutation
  public updateLegendItems(items: Array<LegendItem>): void {
    this.legendItems = items
  }

  @Mutation
  public updateBookshelves(items: Array<ObjectItem>): void {
    this.bookshelves = items
  }

  @Mutation
  public updateAnnouncements(items: Array<Announcement>): void {
    this.announcements = items
  }

  @Action
  public setRect(): void {
    const element = document.getElementById('maincontent')!
    this.rect = element.getBoundingClientRect()
    this.context.commit('updateRect', this.rect)
  }

  @Action
  public async getAllSupportingDocsByDocID(): Promise<boolean> {
    let j: any[] = []
    let p: Array<SupportingDocItem> = []
    const that = this
    async function getSupportDocsByDocID(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getSupportDocsByDocID(url)
      } else {
        //console.log('getAllSupportingDocs Response: ' + j)
        for (let i = 0; i < j.length; i++) {
          p.push({
            Id: j[i]['Id'],
            DocID: j[i]['DocID'],
            Title: j[i]['Title'],
            Name: j[i]['File']['Name'],
            RelativeURL: j[i]['File']['ServerRelativeUrl'],
            IsNato: 'No'
          })
        }
        that.context.commit('createSupportingDocuments', p)
      }
    }
    let turl = tp1 + slash + slash + tp2
    // console.log('getAllPublications URL: ' + turl)
    getSupportDocsByDocID(turl)
    return true
  }

  @Action
  public setLegendItems(items: Array<LegendItem>): void {
    this.context.commit('updateLegendItems', items)
  }

  @Mutation
  public updateShown(newVal: boolean): void {
    this.isShown = newVal
  }

  @Action
  public setShown(newVal: boolean): void {
    const that = this
    this.context.commit('updateShown', newVal)
    window.setTimeout(function() {
      that.context.dispatch('setRect')
    }, 500)
  }

  @Mutation
  public updateThemeSelectorShown(newVal: boolean): void {
    this.isThemeSelectorShown = newVal
  }

  @Action
  public setThemeSelectorShown(newVal: boolean): void {
    this.context.commit('updateThemeSelectorShown', newVal)
  }

  @Action
  public async getBS(): Promise<boolean> {
    if (!local) {
      let allBS: any[] = []
      let p: Array<ObjectItem> = []
      const that = this
      async function getAllBS(url: string): Promise<void> {
        const response = await axios.get(url, {
          headers: {
            accept: 'application/json;odata=verbose'
          }
        })
        allBS = allBS.concat(response.data.d.results)
        // recursively load items if there is a next result
        if (response.data.d.__next) {
          url = response.data.d.__next
          return getAllBS(url)
        } else {
          for (let i = 0; i < allBS.length; i++) {
            p.push({
              text: allBS[i]['Title'],
              value: allBS[i]['Title']
            })
          }
          that.context.commit('updateBookshelves', p)
        }
      }
      let turl = baseUrl + this.bsUrl
      getAllBS(turl)
      return true
    } else {
      console.log('LOCAL')
      let allBS: any[] = []
      let p: Array<ObjectItem> = []
      let url = 'http://localhost:3000/bookshelves'
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      allBS = response.data
      for (let i = 0; i < allBS.length; i++) {
        p.push({
          text: allBS[i]['text'],
          value: allBS[i]['value']
        })
      }
      this.context.commit('updateBookshelves', p)
      return true
    }
  }

  @Action
  public async getAnnouncements(): Promise<boolean> {
    if (!local) {
      let j: any[] = []
      let p: Array<Announcement> = []
      let url = baseUrl + this.aUrl
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = response.data.d.results
      for (let i = 0; i < j.length; i++) {
        p.push({
          Id: j[i]['Id'],
          Title: j[i]['Title'],
          Body: j[i]['Body'],
          // Info: j[i]['Body'],
          Info: j[i]['Body'],
          // Info: this.limitText(String(j[i]['Body'])),
          Modified: new Date(j[i]['Modified']).toLocaleDateString(),
          Expires: new Date(j[i]['Expires']).toLocaleDateString(),
          Sticky: j[i]['Sticky'],
          ModifiedBy: {
            Title: j[i]['Editor']['Title'],
            Id: j[i]['Editor']['Id'],
            Email: j[i]['Editor']['EMail']
          }
        })
      }
      this.context.commit('updateAnnouncements', p)
      return true
    } else {
      /* let j: any[] = []
      let p: Array<Announcement> = []
      let url = 'http://localhost:3000/announcements'
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = response.data
      for (let i = 0; i < j.length; i++) {
        p.push({
          id: j[i]['id'],
          title: j[i]['title'],
          link: j[i]['link'],
          date: j[i]['date'],
          author: j[i]['author'],
          description: j[i]['description']
        })
      }
      this.context.commit('updateAnnouncements', p) */
      return true
    }
  }

  /* @Mutation
  private SET_THEME(theme: ThemeName): void {
    this.theme = theme
  }
  @Action
  public setTheme(theme: ThemeName): void {
    this.context.commit('SET_THEME', theme)
  } */
}
export default Support
