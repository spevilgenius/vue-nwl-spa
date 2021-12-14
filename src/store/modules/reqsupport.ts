import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
/* import { PublicationItem } from '@/interfaces/PublicationItem' */
/* import { ObjectItem } from '@/interfaces/ObjectItem' */
// import { EventBus } from '../../main'
import axios from 'axios'
/* import { SupportingDocItem } from '@/interfaces/SupportingDocItem' */
import { ReqSupportItem } from '@/interfaces/ReqSupportItem'
import Support from './support'

// are we on a localhost demo?
let loc = String(window.location)
let local = false
if (loc.indexOf('localhost') >= 0) {
  local = true
}

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Module({ namespaced: true })
class ReqSupport extends VuexModule {
  public digest?: string = ''
  public digestloaded?: boolean = false
  public supportitems: Array<ReqSupportItem> = []
  public supportitemsloaded?: boolean = false
  public pubBlob?: Blob
  public blobloaded?: boolean = false
  public supportingItems?: any
  /*public supportingItemsloaded?: boolean = false
  public supportingItemloaded?: boolean = false */

  supportItemsUrl = "/_api/lists/getbytitle('Request%20Support')/items?$select=*,PubURL/Description"
  updatesupportItemsUrl = "/_api/lists/getbytitle('Request%20Support')/items("
  supportingItem:
    | ReqSupportItem
    //#region MUTATIONS
    /* @Mutation updateDigest(digest: string): void {
    this.digest = digest
    this.digestloaded = true
  } */
    /*  @Mutation updateDigestLoaded(loaded: boolean): void {
     this.digestloaded = loaded
   } */
    | undefined
  //#region MUTATIONS
  /* @Mutation updateDigest(digest: string): void {
    this.digest = digest
    this.digestloaded = true
  } */

  /*  @Mutation updateDigestLoaded(loaded: boolean): void {
    this.digestloaded = loaded
  } */
  @Mutation
  public createSupportItems(items: Array<ReqSupportItem>): void {
    this.supportitems = items
    this.supportitemsloaded = true
  }

  /*  @Mutation
  public updateSupportingItems(loaded: boolean): void {
    this.supportingItems = []
    this.supportingItemsloaded = loaded
  } */
  @Mutation
  public updateSupportingItem(item: ReqSupportItem): void {
    this.supportingItem = item
    /*  this.supportingItemloaded = true */
  }

  //#endregion

  //#region Actions
  @Action
  public async getDigest(): Promise<boolean> {
    const response = await axios.request({
      url: tp1 + slash + slash + tp2 + '/_api/contextinfo',
      method: 'POST',
      headers: { Accept: 'application/json; odata=verbose' }
    })
    this.context.commit('updateDigest', response.data.d.GetContextWebInformation.FormDigestValue)
    return true
  }

  /* @Action
  public setPubLoaded(loaded: boolean): void {
    console.log('ACTION: setPubLoaded: ' + loaded)
    this.context.commit('updatePubLoaded', loaded)
  } */

  @Action
  public async getAllReqSupportItems(): Promise<boolean> {
    let j: any[] = []
    let p: Array<ReqSupportItem> = []
    const that = this
    async function getAllReqSupportItems(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllReqSupportItems(url)
      } else {
        for (let i = 0; i < j.length; i++) {
          p.push({
            Title: j[i]['Title'],
            Rtype: {
              TechnicalIssue: j[i]['Rtype']['Title'],
              LibraryContent: j[i]['Rtype']['Library Content'],
              DocumentContent: j[i]['Rtype']['Document Content'],
              Enhancement: j[i]['Rtype']['Enhancement'],
              Training: j[i]['Rtype']['Training']
            },
            Details: j[i]['Details'],
            PubID: j[i]['PubID'],
            Status: {
              Submitted: j[i]['Status']['Submitted'],
              Open: j[i]['Status']['Open'],
              Resolved: j[i]['Status']['Resolved']
            },
            Resolution: j[i]['Resolution'],
            ResolutionDate: j[i]['Resolution Date'],
            PubsURL: j[i]['PubsURL']['ServerRelativeUrl'],
            Modified: j[i]['Modified'],
            Created: j[i]['Created'],
            Author: j[i]['Author'],
            Editor: j[i]['Editor']
          })
        }
        that.context.commit('createSupportItems', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.supportItemsUrl
    getAllReqSupportItems(turl)
    return true
  }
  //Update Request
  @Action
  public async updateRequestById(data: any): Promise<boolean> {
    // update the publication data
    let url = ''
    url = this.updatesupportItemsUrl + data.Id + ')'

    const headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': this.digest,
      'X-HTTP-Method': 'MERGE',
      'If-Match': '*'
    }
    const config = {
      headers: headers
    }

    // update the fields with the passed in data
    let itemprops = {
      __metadata: { type: data.type },
      Title: data.Title,
      Subject: data.Subject,
      RequestType: data.RequestType,
      Details: data.Details
    }

    try {
      await axios.post(url, itemprops, config)
    } catch (e) {
      // don't care yet
    }

    return true
  }
  //use for New Request? copied from publication.ts
  @Action
  public async getAllreqsupports(): Promise<boolean> {
    let j: any[] = []
    let p: Array<ReqSupportItem> = []
    const that = this
    async function getAllRequests(url: string): Promise<void> {
      const Response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(Response.data.d.results)
      // recursively load items if there is a next result
      if (Response.data.d.__next) {
        url = Response.data.d.__next
        return getAllRequests(url)
      } else {
        for (let i = 0; i < j.length; i++) {
          p.push({
            Title: j[i]['Title'],
            Rtype: {
              TechnicalIssue: j[i]['Rtype']['Title'],
              LibraryContent: j[i]['Rtype']['Library Content'],
              DocumentContent: j[i]['Rtype']['Document Content'],
              Enhancement: j[i]['Rtype']['Enhancement'],
              Training: j[i]['Rtype']['Training']
            },
            Details: j[i]['Details'],
            Status: {
              Submitted: j[i]['Status']['Submitted'],
              Open: j[i]['Status']['Open'],
              Resolved: j[i]['Status']['Resolved']
            },
            Resolution: j[i]['Resolution'],
            ResolutionDate: j[i]['Resolution Date'],
            PubsURL: j[i]['PubsURL']['ServerRelativeUrl'],
            PubID: j[i]['PubID'],
            Modified: j[i]['Modified'],
            Created: j[i]['Created'],
            Author: j[i]['Author'],
            Editor: j[i]['Editor']
          })
        }
        that.context.commit('createPublications', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.supportItemsUrl
    /*  getAllRequests(turl) */
    getAllRequests(turl)
    return true
  }

  //#endregion
}
export default ReqSupport
function Details(data: any, any: any) {
  throw new Error('Function not implemented.')
}

function PubsURL(turl: string) {
  throw new Error('Function not implemented.')
}

function getAllReqSupportItems(turl: string) {
  throw new Error('Function not implemented.')
}

function updateRequestById(data: any, any: any) {
  throw new Error('Function not implemented.')
}

function data(data: any, any: any) {
  throw new Error('Function not implemented.')
}

function url(url: any, itemprops: any, config: any) {
  throw new Error('Function not implemented.')
}

function itemprops(url: any, itemprops: any, config: any) {
  throw new Error('Function not implemented.')
}

function config(url: any, itemprops: any, config: any) {
  throw new Error('Function not implemented.')
}

function getAllRequests() {
  throw new Error('Function not implemented.')
}

function p(arg0: string, p: any) {
  throw new Error('Function not implemented.')
}

function getAllPubs(turl: string) {
  throw new Error('Function not implemented.')
}

function Status(data: any, any: any) {
  throw new Error('Function not implemented.')
}

function Modified(data: any, any: any) {
  throw new Error('Function not implemented.')
}

function Resolution(data: any, any: any) {
  throw new Error('Function not implemented.')
}

function ResolutionDate(data: any, any: any) {
  throw new Error('Function not implemented.')
}

function Created(data: any, any: any) {
  throw new Error('Function not implemented.')
}

function Author(data: any, any: any) {
  throw new Error('Function not implemented.')
}

function Editor(data: any, any: any) {
  throw new Error('Function not implemented.')
}

function PubID(data: any, any: any) {
  throw new Error('Function not implemented.')
}

function getAllreqsupports(turl: string) {
  throw new Error('Function not implemented.')
}
