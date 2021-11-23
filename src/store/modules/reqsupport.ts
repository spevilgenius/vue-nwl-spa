import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { PublicationItem } from '@/interfaces/PublicationItem'
import { ObjectItem } from '@/interfaces/ObjectItem'
// import { EventBus } from '../../main'
import axios from 'axios'
import { SupportingDocItem } from '@/interfaces/SupportingDocItem'
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
  public supportingItems: Array<ReqSupportItem> = []
  public supportingItemsloaded?: boolean = false
  public supportingItem?: any
  public supportingItemloaded?: boolean = false

  supportItemsUrl = "/_api/lists/getbytitle('Request%20Support')/items?$select=*,PubURL/Description"
  //#region MUTATIONS
  @Mutation updateDigest(digest: string): void {
    this.digest = digest
    this.digestloaded = true
  }

  @Mutation updateDigestLoaded(loaded: boolean): void {
    this.digestloaded = loaded
  }
  @Mutation
  public createSupportItems(items: Array<ReqSupportItem>): void {
    this.supportitems = items
    this.supportitemsloaded = true
  }

  @Mutation
  public updateSupportingItems(loaded: boolean): void {
    this.supportingItems = []
    this.supportingItemsloaded = loaded
  }
  @Mutation
  public updateSupportingItem(item: ReqSupportItem): void {
    this.supportingItem = item
    this.supportingItemloaded = true
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
            Rtype: j[i]['RType'],
            Details: j[i]['Details'],
            PubsURL: j[i]['PubsURL']['ServerRelativeUrl'],
            PubID: j[i]['PubID'],
            Status: j[i]['Status'],
            Resolution: j[i]['Resolution'],
            ResolutionDate: j[i]['ResolutionDate'],
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

  //#endregion
}
export default ReqSupport
