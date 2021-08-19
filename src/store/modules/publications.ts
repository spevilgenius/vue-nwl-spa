/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
// import { ObjectItem } from '@/interfaces/ObjectItem'
import { PublicationItem } from '@/interfaces/PublicationItem'
// import { EventBus } from '../../main'
import axios from 'axios'

// are we on a localhost demo?
let loc = String(window.location)
let local = false
if (loc.indexOf('localhost') >= 0) {
  local = true
}

const baseUrl = process.env.VUE_APP_BASE_URL

@Module({ namespaced: true })
class Publication extends VuexModule {
  public publications: Array<PublicationItem> = []
  public pubsloaded?: false
  public pubsUrl!: "_api/lists/getbytitle('BookshelfTitles')/items?$select*&$orderby=Title"
  public pubsUrl2!: "_api/lists/getbytitle('Publications')/items?$select*,Author/Title,File/Name,File/ServerRelativeUrl&$expand=Author,File,File/ListItemAllFields&$filter=(FSObjType ne 1)"

  @Mutation
  public updatePublications(items: Array<PublicationItem>): void {
    this.publications = items
  }

  @Action
  public async getAllPublications(): Promise<boolean> {
    if (!local) {
      let allPubs: any[] = []
      let p: Array<PublicationItem> = []
      const that = this
      async function getAllPubs(url: string): Promise<void> {
        if (url === '') {
          url = baseUrl + that.pubsUrl2
        }
        const response = await axios.get(url, {
          headers: {
            accept: 'application/json;odata=verbose'
          }
        })
        allPubs = allPubs.concat(response.data.d.results)
        // recursively load items if there is a next result
        if (response.data.d.__next) {
          url = response.data.d.__next
          return getAllPubs(url)
        } else {
          for (let i = 0; i < allPubs.length; i++) {
            p.push({
              title: allPubs[i]['Title'],
              name: allPubs[i]['Name']
            })
          }
          that.context.commit('updatePublications', p)
        }
      }
      getAllPubs('')
      return true
    } else {
      /* let allPubs: any[] = []
      let p: Array<ObjectItem> = []
      let url = 'http://localhost:3000/bookshelves'
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      allPubs = response.data
      for (let i = 0; i < allPubs.length; i++) {
        p.push({
          text: allPubs[i]['text'],
          value: allPubs[i]['value']
        })
      }
      this.context.commit('updateBookshelves', p) */
      return true
    }
  }
}
export default Publication
