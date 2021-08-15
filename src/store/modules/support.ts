/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { LegendItem } from '@/interfaces/LegendItem'
import { ObjectItem } from '@/interfaces/ObjectItem'
import { EventBus } from '../../main'
import axios from 'axios'
// import { ThemeName } from '@/themes/theme.types'

// are we on a localhost demo?
let loc = String(window.location)
let local = false
if (loc.indexOf('localhost') >= 0) {
  local = true
}

const baseUrl = process.env.VUE_APP_BASE_URL
@Module({ namespaced: true })
class Support extends VuexModule {
  public rect!: DOMRect
  public isShown?: boolean = true
  public isThemeSelectorShown?: boolean = false
  // public theme: ThemeName = ThemeName.DEFAULT
  public contentrect!: DOMRect
  public contentwidth!: number
  public legendItems: Array<LegendItem> = []
  public legendLoaded = false
  public legendLoading = false
  public bookshelves: Array<ObjectItem> = []
  public bsUrl!: "_api/lists/getbytitle('BookshelfTitles')/items?$select*&$orderby=Title"

  @Mutation
  public updateRect(newVal: DOMRect): void {
    this.contentrect = newVal
    this.contentwidth = newVal.width
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

  @Action
  public setRect(): void {
    const element = document.getElementById('maincontent')!
    this.rect = element.getBoundingClientRect()
    this.context.commit('updateRect', this.rect)
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
        if (url === '') {
          url = baseUrl + that.bsUrl
        }
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
      getAllBS('')
      return true
    } else {
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
