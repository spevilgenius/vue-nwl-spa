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
  public pubsloaded?: boolean = false
  public pubsUrl!: "_api/lists/getbytitle('Publications')/items?$select*&$orderby=Title"
  public natoUrl!: "_api/lists/getbytitle('NATOPublications')/items?$select*&$orderby=Title"
  public pubsUrl2!: "_api/lists/getbytitle('Publications')/items?$select*,Author/Title,File/Name,File/ServerRelativeUrl&$expand=Author,File,File/ListItemAllFields&$filter=(FSObjType ne 1)"

  @Mutation
  public createPublications(items: Array<PublicationItem>): void {
    this.publications = items
    this.pubsloaded = true
  }

  @Mutation
  public updatePublications(items: Array<PublicationItem>): void {
    let p: Array<PublicationItem>
    p = this.publications.concat(items)
    this.publications = p
    this.pubsloaded = true
  }

  @Action
  public async getAllPublications(): Promise<boolean> {
    if (!local) {
      let j: any[] = []
      let p: Array<PublicationItem> = []
      const that = this
      async function getAllPubs(url: string): Promise<void> {
        if (url === '') {
          url = baseUrl + that.pubsUrl
        }
        const response = await axios.get(url, {
          headers: {
            accept: 'application/json;odata=verbose'
          }
        })
        j = j.concat(response.data.d.results)
        // recursively load items if there is a next result
        if (response.data.d.__next) {
          url = response.data.d.__next
          return getAllPubs(url)
        } else {
          for (let i = 0; i < j.length; i++) {
            p.push({
              Id: j[i]['Id'],
              DocID: j[i]['DocID'],
              Title: j[i]['Title'],
              Name: j[i]['Name'],
              RelativeURL: j[i]['File']['ServerRelativeUrl'],
              Availability: j[i]['Availability'],
              Branch: j[i]['Branch'],
              Class: j[i]['Class'],
              ClassAbv: j[i]['ClassAbv'],
              CoordinatingRA: j[i]['CoordinatingRA'],
              CoordinatingRAAbv: j[i]['CoordinatingRAAbv'],
              DTIC: j[i]['DTIC'],
              LibrarianRemarks: j[i]['LibrarianRemarks'],
              LongTitle: j[i]['LongTitle'],
              Media: j[i]['Media'],
              MA: j[i]['MA'],
              NSN: j[i]['NSN'],
              NWDCAO: {
                Title: j[i]['NWDCAO']['Title'],
                Id: j[i]['NWDCAO']['Id'],
                Email: j[i]['NWDCAO']['EMail']
              },
              PRA: j[i]['PRA'],
              PRAPOC: j[i]['PRAPOC'],
              Prfx: j[i]['Prfx'],
              PubID: j[i]['PubID'],
              Resourced: j[i]['Resourced'],
              ReviewDate: j[i]['ReviewDate'],
              StatusComments: j[i]['StatusComments'],
              Replaces: j[i]['Replaces'],
              Bookshelf: j[i]['Bookshelf'],
              AdditionalData: j[i]['AdditionalData']
            })
          }
          that.context.commit('createPublications', p)
        }
      }
      getAllPubs('')
      return true
    } else {
      let j: any[] = []
      let p: Array<PublicationItem> = []
      let url = 'http://localhost:3000/publications'
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = response.data
      console.log(JSON.stringify(j))
      for (let i = 0; i < j.length; i++) {
        p.push({
          DocID: j[i]['docid'],
          Title: j[i]['title'],
          Name: j[i]['name'],
          Branch: j[i]['category'],
          Prfx: j[i]['prefix'],
          Bookshelf: j[i]['location']
        })
      }
      this.context.commit('createPublications', p)
      return true
    }
  }

  @Action
  public async getAllNatoPublications(): Promise<boolean> {
    if (!local) {
      let j: any[] = []
      let p: Array<PublicationItem> = []
      const that = this
      async function getAllPubs(url: string): Promise<void> {
        if (url === '') {
          url = baseUrl + that.natoUrl
        }
        const response = await axios.get(url, {
          headers: {
            accept: 'application/json;odata=verbose'
          }
        })
        j = j.concat(response.data.d.results)
        // recursively load items if there is a next result
        if (response.data.d.__next) {
          url = response.data.d.__next
          return getAllPubs(url)
        } else {
          for (let i = 0; i < j.length; i++) {
            p.push({
              Id: j[i]['Id'],
              DocID: j[i]['DocID'],
              Title: j[i]['Title'],
              Name: j[i]['Name'],
              RelativeURL: j[i]['File']['ServerRelativeUrl'],
              Availability: j[i]['Availability'],
              Branch: j[i]['Branch'],
              Class: j[i]['Class'],
              ClassAbv: j[i]['ClassAbv'],
              CoordinatingRA: j[i]['CoordinatingRA'],
              CoordinatingRAAbv: j[i]['CoordinatingRAAbv'],
              DTIC: j[i]['DTIC'],
              LibrarianRemarks: j[i]['LibrarianRemarks'],
              LongTitle: j[i]['LongTitle'],
              Media: j[i]['Media'],
              MA: j[i]['MA'],
              NSN: j[i]['NSN'],
              NWDCAO: {
                Title: j[i]['NWDCAO']['Title'],
                Id: j[i]['NWDCAO']['Id'],
                Email: j[i]['NWDCAO']['EMail']
              },
              PRA: j[i]['PRA'],
              PRAPOC: j[i]['PRAPOC'],
              Prfx: j[i]['Prfx'],
              PubID: j[i]['PubID'],
              Resourced: j[i]['Resourced'],
              ReviewDate: j[i]['ReviewDate'],
              StatusComments: j[i]['StatusComments'],
              Replaces: j[i]['Replaces'],
              Bookshelf: j[i]['Bookshelf'],
              AdditionalData: j[i]['AdditionalData']
            })
          }
          that.context.commit('updatePublications', p)
        }
      }
      getAllPubs('')
      return true
    } else {
      let j: any[] = []
      let p: Array<PublicationItem> = []
      let url = 'http://localhost:3000/publications'
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = response.data
      console.log(JSON.stringify(j))
      for (let i = 0; i < j.length; i++) {
        p.push({
          DocID: j[i]['docid'],
          Title: j[i]['title'],
          Name: j[i]['name'],
          Branch: j[i]['category'],
          Prfx: j[i]['prefix'],
          Bookshelf: j[i]['location']
        })
      }
      this.context.commit('updatePublications', p)
      return true
    }
  }
}
export default Publication
