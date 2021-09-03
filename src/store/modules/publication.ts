/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
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
  public publication?: PublicationItem
  public pubsloaded?: boolean = false
  public publoaded?: boolean = false // single publication
  pubsUrl = "_api/lists/getbytitle('ActivePublications')/items?$select=*,File/Name,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"
  natoUrl = "_api/lists/getbytitle('NATOPublications')/items?$select=*,File/Name,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"
  pubsUrl2 = "_api/lists/getbytitle('Publications')/items?$select=*,Author/Title,File/Name,File/ServerRelativeUrl&$expand=Author,File,File/ListItemAllFields&$filter=(FSObjType ne 1)"

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

  @Mutation
  public updatePublication(item: PublicationItem): void {
    this.publication = item
    this.publoaded = true
  }

  @Action
  public async getAllPublications(): Promise<boolean> {
    if (!local) {
      let j: any[] = []
      let p: Array<PublicationItem> = []
      const that = this
      async function getAllPubs(url: string): Promise<void> {
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
          console.log('getAllPublications Response: ' + j)
          for (let i = 0; i < j.length; i++) {
            p.push({
              Id: j[i]['Id'],
              DocID: j[i]['DocID'],
              Title: j[i]['Title'],
              Name: j[i]['File']['Name'],
              RelativeURL: j[i]['File']['ServerRelativeUrl'],
              Availability: j[i]['Availability'],
              Branch: j[i]['BranchTitle'],
              Class: j[i]['Class'],
              ClassAbv: j[i]['ClassAbv'],
              CoordinatingRA: j[i]['CoordinatingRA'],
              CoordinatingRAAbv: j[i]['CoordinatingRAAbv'],
              DTIC: j[i]['Distribution'],
              LibrarianRemarks: j[i]['LibrarianRemarks'],
              LongTitle: j[i]['LongTitle'],
              Media: j[i]['Media'], // returns array of multiple choices
              Modified: new Date(j[i]['Modified']).toLocaleDateString(),
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
              Resourced: j[i]['Resourced'] === true ? 'Yes' : 'No',
              ReviewDate: j[i]['ReviewDate'],
              StatusComments: j[i]['statuscomments'],
              Replaces: j[i]['Replaces'],
              Bookshelf: j[i]['Bookshelf'],
              AdditionalData: JSON.parse(j[i]['AdditionalData'])
            })
          }
          that.context.commit('createPublications', p)
        }
      }
      let turl = baseUrl + this.pubsUrl
      console.log('getAllPublications URL: ' + turl)
      getAllPubs(turl)
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

  @Action
  public async getPublicationById(id: string): Promise<boolean> {
    if (!local) {
      let url = baseUrl + this.pubsUrl + '&$filter=(Id eq ' + id + ')'
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      console.log('GETPUBLICATIONBYID RESPONSE: ' + response)
      let j = response.data.d.results[0]
      let p = {} as PublicationItem

      p.Id = j[0]['Id']
      p.DocID = j[0]['DocID']
      p.Title = j[0]['Title']
      p.Name = j[0]['Name']
      p.RelativeURL = j[0]['File']['ServerRelativeUrl']
      p.Availability = j[0]['Availability']
      p.Branch = j[0]['BranchTitle']
      p.Class = j[0]['Class']
      p.ClassAbv = j[0]['ClassAbv']
      p.CoordinatingRA = j[0]['CoordinatingRA']
      p.CoordinatingRAAbv = j[0]['CoordinatingRAAbv']
      p.DTIC = j[0]['DTIC']
      p.LibrarianRemarks = j[0]['LibrarianRemarks']
      p.LongTitle = j[0]['LongTitle']
      p.Media = j[0]['Media']
      p.MA = j[0]['MA']
      p.NSN = j[0]['NSN']
      p.NWDCAO = {
        Title: j[0]['NWDCAO']['Title'],
        Id: j[0]['NWDCAO']['Id'],
        Email: j[0]['NWDCAO']['EMail']
      }
      p.PRA = j[0]['PRA']
      p.PRAPOC = j[0]['PRAPOC']
      p.Prfx = j[0]['Prfx']
      p.PubID = j[0]['PubID']
      p.Resourced = j[0]['Resourced']
      p.ReviewDate = j[0]['ReviewDate']
      p.StatusComments = j[0]['StatusComments']
      p.Replaces = j[0]['Replaces']
      p.Bookshelf = j[0]['Bookshelf']
      p.AdditionalData = j[0]['AdditionalData']
      p.ActionButtons = []
      this.context.commit('updatePublication', p)
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
}
export default Publication
