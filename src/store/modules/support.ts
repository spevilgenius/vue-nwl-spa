/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { ObjectItem } from '@/interfaces/ObjectItem'
import { Announcement } from '@/interfaces/Announcement'
import { Alert } from '@/interfaces/Alert'
import { EventBus } from '../../main'
import axios from 'axios'
import { SupportingDocItem } from '@/interfaces/SupportingDocItem'

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
  public contentrect!: DOMRect
  public contentwidth!: number
  public contentheight!: number
  public terminologyheight!: number
  public bookshelves: Array<ObjectItem> = []
  public tags: Array<ObjectItem> = []
  public announcements: Array<Announcement> = []
  public alerts: Array<Alert> = []
  today = new Date().toISOString()
  public bsUrl = "_api/lists/getbytitle('BookshelfTitles')/items?$select*&$orderby=Title"
  public tUrl = "_api/lists/getbytitle('Tags')/items?$select*&$orderby=Title"
  public aUrl = "_api/lists/getbytitle('Announcements')/items?$select=*,Editor/Id,Editor/Title,Editor/EMail&$expand=Editor&$filter=Expires ge '" + this.today + "'"
  public AlertUrl = "_api/lists/getbytitle('Alerts')/items?$select*&$orderby=Title&$filter=Active eq 1"
  public supportingdocs: Array<SupportingDocItem> = []
  public supportingdocsloaded?: boolean = false
  public supportingdoc?: SupportingDocItem
  public activity = ''
  public headertitle = 'Home'
  public history = ''

  sdUrl = "_api/lists/getbytitle('SupportingDocuments')/items"

  @Mutation
  public updateHeaderTitle(title: string): void {
    console.log('Committing Header Title: ' + title)
    this.headertitle = title
  }

  @Mutation
  public updateHistory(path: string): void {
    this.history = path
  }

  @Mutation
  public updateRect(newVal: DOMRect): void {
    this.contentrect = newVal
    this.contentwidth = newVal.width
    this.contentheight = newVal.height
    this.terminologyheight = this.contentheight - 120
    console.log('SIDEBAR VISIBLE: ' + this.isShown + ', WIDTH: ' + this.contentwidth)
    EventBus.$emit('SidebarChanged', this.contentwidth)
  }

  @Mutation
  public updateBookshelves(items: Array<ObjectItem>): void {
    this.bookshelves = items
  }

  @Mutation
  public updateTags(items: Array<ObjectItem>): void {
    this.tags = items
  }

  @Mutation
  public updateAnnouncements(items: Array<Announcement>): void {
    this.announcements = items
  }

  @Mutation
  public updateAlerts(items: Array<Alert>): void {
    this.alerts = items
  }

  @Mutation
  public updateActivity(activity: string): void {
    if (this.activity && this.activity === '') {
      this.activity = '<div>' + activity + '</div>'
    } else {
      this.activity += '<br/>' + activity
    }
  }

  @Action
  public setHeaderTitle(title: string): void {
    console.log('Setting Header Title: ' + title)
    this.context.commit('updateHeaderTitle', title)
  }

  @Action
  public setHistory(path: string): void {
    this.context.commit('updateHistory', path)
  }

  @Action
  public setRect(): void {
    const element = document.getElementById('maincontent')!
    this.rect = element.getBoundingClientRect()
    this.context.commit('updateRect', this.rect)
  }

  @Action
  public addActivity(activity: string): void {
    this.context.commit('updateActivity', activity)
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

  @Mutation
  public updateShown(newVal: boolean): void {
    this.isShown = newVal
  }

  @Action
  public setShown(newVal: boolean): void {
    const that = this
    this.context.commit('updateShown', newVal)
    window.setTimeout(function () {
      that.context.dispatch('setRect')
    }, 500)
  }

  @Action async getAlerts(): Promise<boolean> {
    let allAlerts: any[] = []
    let p: Array<Alert> = []
    const that = this
    async function getAllAlerts(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      allAlerts = allAlerts.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllAlerts(url)
      } else {
        for (let i = 0; i < allAlerts.length; i++) {
          p.push({
            Id: allAlerts[i]['Id'],
            Active: 'Yes',
            Text: allAlerts[i]['BriefDescription'],
            Body: allAlerts[i]['FullDescription'],
            AlertType: allAlerts[i]['AlertType']
          })
        }
        that.context.commit('updateAlerts', p)
      }
    }
    let turl = baseUrl + this.AlertUrl
    getAllAlerts(turl)
    return true
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
  public async getTags(): Promise<boolean> {
    let allTags: any[] = []
    let p: Array<ObjectItem> = []
    const that = this
    async function getAllTags(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      allTags = allTags.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllTags(url)
      } else {
        for (let i = 0; i < allTags.length; i++) {
          p.push({
            text: allTags[i]['Title'],
            value: allTags[i]['Title']
          })
        }
        that.context.commit('updateTags', p)
      }
    }
    let turl = baseUrl + this.tUrl
    getAllTags(turl)
    return true
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
      let j: any[] = []
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
          Id: j[i]['Id'],
          Title: j[i]['Title'],
          Body: j[i]['Body'],
          Info: 'WOOHOO',
          Expires: 'WOOHOO',
          Sticky: 'false',
          Modified: j[i]['Modified'],
          ModifiedBy: {
            Title: j[i]['ModifiedBy']['Title'],
            Id: j[i]['ModifiedBy']['Id'],
            Email: j[i]['ModifiedBy']['EMail']
          }
        })
      }
      this.context.commit('updateAnnouncements', p)
      return true
    }
  }
}
export default Support
