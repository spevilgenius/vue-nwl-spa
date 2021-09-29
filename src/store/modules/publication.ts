/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { PublicationItem } from '@/interfaces/PublicationItem'
import { ObjectItem } from '@/interfaces/ObjectItem'
// import { EventBus } from '../../main'
import axios from 'axios'
import { MonthWeekdayFn } from 'moment'

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

let additionalData: any = {
  AdminComments: '',
  Archived: '',
  ArchivedRemarks: '',
  Cancel: '',
  CancelDate: '',
  CancelRemarks: '',
  Change: '',
  CoordinatingRAPLA: '',
  CreatedRemarks: '',
  CurrentPhase: '',
  DateofIssue: '',
  Description: '',
  Dissemination: '',
  DisseminationAbbrev: '',
  DraftDate: '',
  Edition: '',
  EditionDate: '',
  EnterpriseKeywords: '',
  FinalDraft: '',
  FinalManuscript: '',
  FirstDraft: '',
  FunctionalField: '',
  FunctionalSeries: '',
  Hidden: '',
  NewPub: '',
  NWDCSignature: '',
  OldShortTitles: '',
  ParentWDC: '',
  PDDTG: '',
  PhaseFinish: '',
  PhaseStart: '',
  PRAAbbrev: '',
  PRAApproval: '',
  PRAID: '',
  PRAPLA: '',
  ProgramDirective: '',
  ProjectFinish: '',
  ProjectStatus: '',
  PubCategory: '',
  RELTO: '',
  Remarks: '',
  Reviewed: '',
  SignatureDraft: '',
  Status: '',
  GeneralStatus: '',
  SupersededBy: '',
  Update: ''
}

let filetype: any

function isJson(item) {
  item = typeof item !== 'string' ? JSON.stringify(item) : item
  try {
    item = JSON.parse(item)
  } catch (e) {
    return false
  }
  if (typeof item === 'object' && item !== null) {
    return true
  }
  return false
}

function FormatAD(ad: any, id: any, nato: any): any {
  if (isJson(ad)) {
    ad = JSON.parse(ad)
    // fixup some elements that are stored as strings
    if (ad.RELTO && ad.RELTO.length > 0) {
      console.log(id + ' has RELTO: ' + ad.RELTO)
    }
    return ad
  } else {
    console.log('Error parsing JSON for item ID: ' + id + ', isNato: ' + nato)
    return JSON.parse(additionalData)
  }
}

function makeArray(data: string) {
  if (data !== null && data.length > 1) {
    let zebra: any = []
    // there may only be one so test that
    if (data.indexOf(',') > 0) {
      // there are more that one
      let snake = data.split(',')
      for (let v = 0; v < snake.length; v++) {
        zebra.push(snake[v])
      }
    } else {
      zebra.push(data)
    }
    // console.log('ARRAY CREATED: ' + snake.length)
    return zebra
  } else {
    return []
  }
}
@Module({ namespaced: true })
class Publication extends VuexModule {
  public publications: Array<PublicationItem> = []
  public natopublications: Array<PublicationItem> = []
  public allpublications: Array<PublicationItem> = []
  public publication?: PublicationItem
  public pubsloaded?: boolean = false
  public natopubsloaded?: boolean = false
  public allpubsloaded?: boolean = false
  public publoaded?: boolean = false // single publication
  public prefixes: Array<ObjectItem> = []
  public statuses: Array<ObjectItem> = []
  public functionalseries: Array<ObjectItem> = []
  public functionalfields: Array<ObjectItem> = []
  public relto: Array<ObjectItem> = []
  public reviewauthority: Array<ObjectItem> = [] // use for PRA and CRA
  public pubBlob?: Blob
  public blobloaded?: boolean = false
  public pubBuffer?: ArrayBuffer
  public bufferloaded?: boolean = false
  public filetype?: any
  public actionofficers: Array<ObjectItem> = []

  pubsUrl = "/_api/lists/getbytitle('ActivePublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"
  natoUrl = "/_api/lists/getbytitle('NATOPublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"
  prefixUrl = "/_api/lists/getbytitle('lu_prefix')/items?$select=*,Family/Title&$expand=Family&$filter=(Family/Title eq '"
  statusUrl = "/_api/lists/getbytitle('lu_status')/items?$select=*,Family/Title&$expand=Family&$filter=(Family/Title eq '"
  functionalseriesUrl = "/_api/lists/getbytitle('lu_funcseries')/items?$select=*,Family/Title&$expand=Family&$filter=(Family/Title eq '"
  functionalfieldsUrl = "/_api/lists/getbytitle('lu_librarytree')/items?$select=*,funcSeries/Title&$expand=funcSeries&$filter=(funcSeries/Title eq '"
  reltoUrl = "/_api/lists/getbytitle('lu_relto')/items?$select=*"
  raUrl = "/_api/lists/getbytitle('lu_pra')/items?$select=*"
  getfileUrl = "/_api/web/GetFileByServerRelativeUrl('"

  @Mutation
  public createPublications(items: Array<PublicationItem>): void {
    this.publications = items
    this.pubsloaded = true
    console.log('publications length: ' + items.length)
  }

  @Mutation
  public createNatoPublications(items: Array<PublicationItem>): void {
    this.natopublications = items
    this.natopubsloaded = true
    console.log('Nato publications length: ' + items.length)
  }

  @Mutation
  public createAllPublications(): void {
    let p: Array<PublicationItem>
    p = this.publications.concat(this.natopublications)
    this.allpublications = p
    this.allpubsloaded = true
  }

  @Mutation
  public updatePublication(item: PublicationItem): void {
    this.publication = item
    this.publoaded = true
  }

  @Mutation
  public createPrefixes(items: Array<ObjectItem>): void {
    this.prefixes = items
  }

  @Mutation
  public createStatuses(items: Array<ObjectItem>): void {
    this.statuses = items
  }

  @Mutation
  public createFunctionalSeries(items: Array<ObjectItem>): void {
    this.functionalseries = items
  }

  @Mutation
  public createFunctionalField(items: Array<ObjectItem>): void {
    this.functionalfields = items
  }

  @Mutation
  public createRelto(items: Array<ObjectItem>): void {
    this.relto = items
  }

  @Mutation
  public createAO(items: Array<ObjectItem>): void {
    this.actionofficers = items
  }

  @Mutation
  public createRA(items: Array<ObjectItem>): void {
    this.reviewauthority = items
  }

  @Action
  public async getAllPublications(): Promise<boolean> {
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
        //console.log('getAllPublications Response: ' + j)
        for (let i = 0; i < j.length; i++) {
          // let ad = that.FormatAD(j[i]['AdditionalData']) // JSON.parse(j[i]['AdditionalData'])
          p.push({
            Id: j[i]['Id'],
            DocID: j[i]['DocID'],
            Title: j[i]['Title'],
            Name: j[i]['File']['Name'],
            RelativeURL: j[i]['File']['ServerRelativeUrl'],
            IsNato: 'No',
            Availability: j[i]['Availability'],
            Branch: j[i]['BranchTitle'] === null || j[i]['BranchTitle'] === '' || j[i]['BranchTitle'] === undefined ? 'Please Select...' : j[i]['BranchTitle'],
            Class: j[i]['Class'],
            ClassAbv: j[i]['ClassAbv'],
            CoordinatingRA: j[i]['CoordinatingRA'],
            CoordinatingRAAbv: j[i]['CoordinatingRAAbv'],
            DTIC: j[i]['Distribution'],
            LibrarianRemarks: j[i]['LibrarianRemarks'],
            LongTitle: j[i]['LongTitle'],
            Media: makeArray(j[0]['Media']),
            Modified: new Date(j[i]['Modified']).toLocaleDateString(),
            MA: j[i]['MA'],
            NSN: j[i]['NSN'],
            NWDCAO: {
              Title: j[i]['NWDCAO']['Title'],
              Id: j[i]['NWDCAO']['Id'],
              Email: j[i]['NWDCAO']['EMail']
            },
            PRA: j[i]['PrimaryReviewAuthority'],
            PRAPOC: j[i]['PRAPOC'],
            Prfx: j[i]['Prfx'] === null || j[i]['Prfx'] === '' || j[i]['Prfx'] === undefined ? 'Please Select...' : j[i]['Prfx'],
            PubID: j[i]['PubID'],
            Resourced: j[i]['Resourced'] === true ? 'Yes' : 'No',
            ReviewDate: j[i]['ReviewDate'],
            StatusComments: j[i]['statuscomments'],
            Replaces: j[i]['Replaces'],
            Bookshelf: j[i]['Bookshelf'],
            AdditionalData: FormatAD(j[i]['AdditionalData'], j[i]['Id'], 'No')
          })
        }
        that.context.commit('createPublications', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.pubsUrl
    // console.log('getAllPublications URL: ' + turl)
    getAllPubs(turl)
    return true
  }

  @Action
  public async getAllPublicationsByQuery(query: string): Promise<boolean> {
    let j: any[] = []
    let p: Array<PublicationItem> = []
    const that = this
    async function getAllPubsByQuery(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllPubsByQuery(url)
      } else {
        //console.log('getAllPublications Response: ' + j)
        for (let i = 0; i < j.length; i++) {
          // let ad = that.FormatAD(j[i]['AdditionalData']) // JSON.parse(j[i]['AdditionalData'])
          p.push({
            Id: j[i]['Id'],
            DocID: j[i]['DocID'],
            Title: j[i]['Title'],
            Name: j[i]['File']['Name'],
            RelativeURL: j[i]['File']['ServerRelativeUrl'],
            IsNato: 'No',
            Availability: j[i]['Availability'],
            Branch: j[i]['BranchTitle'] === null || j[i]['BranchTitle'] === '' || j[i]['BranchTitle'] === undefined ? 'Please Select...' : j[i]['BranchTitle'],
            Class: j[i]['Class'],
            ClassAbv: j[i]['ClassAbv'],
            CoordinatingRA: j[i]['CoordinatingRA'],
            CoordinatingRAAbv: j[i]['CoordinatingRAAbv'],
            DTIC: j[i]['Distribution'],
            LibrarianRemarks: j[i]['LibrarianRemarks'],
            LongTitle: j[i]['LongTitle'],
            Media: makeArray(j[0]['Media']), // returns array of multiple choices
            Modified: new Date(j[i]['Modified']).toLocaleDateString(),
            MA: j[i]['MA'],
            NSN: j[i]['NSN'],
            NWDCAO: {
              Title: j[i]['NWDCAO']['Title'],
              Id: j[i]['NWDCAO']['Id'],
              Email: j[i]['NWDCAO']['EMail']
            },
            PRA: j[i]['PrimaryReviewAuthority'],
            PRAPOC: j[i]['PRAPOC'],
            Prfx: j[i]['Prfx'] === null || j[i]['Prfx'] === '' || j[i]['Prfx'] === undefined ? 'Please Select...' : j[i]['Prfx'],
            PubID: j[i]['PubID'],
            Resourced: j[i]['Resourced'] === true ? 'Yes' : 'No',
            ReviewDate: j[i]['ReviewDate'],
            StatusComments: j[i]['statuscomments'],
            Replaces: j[i]['Replaces'],
            Bookshelf: j[i]['Bookshelf'],
            AdditionalData: FormatAD(j[i]['AdditionalData'], j[i]['Id'], 'No')
          })
        }
        that.context.commit('createPublications', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + query
    // console.log('getAllPublications URL: ' + turl)
    getAllPubsByQuery(turl)
    return true
  }

  @Action
  public async getAllNatoPublications(): Promise<boolean> {
    let j: any[] = []
    let p: Array<PublicationItem> = []
    const that = this
    async function getAllNatoPubs(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllNatoPubs(url)
      } else {
        //console.log('getAllNatoPublications Response: ' + j)
        for (let i = 0; i < j.length; i++) {
          p.push({
            Id: j[i]['Id'],
            DocID: j[i]['DocID'],
            Title: j[i]['Title'],
            Name: j[i]['File']['Name'],
            RelativeURL: j[i]['File']['ServerRelativeUrl'],
            IsNato: 'Yes',
            Availability: j[i]['Availability'],
            Branch: j[i]['BranchTitle'] === null || j[i]['BranchTitle'] === '' || j[i]['BranchTitle'] === undefined ? 'Please Select...' : j[i]['BranchTitle'],
            Class: j[i]['Class'],
            ClassAbv: j[i]['ClassAbv'],
            CoordinatingRA: j[i]['CoordinatingRA'],
            CoordinatingRAAbv: j[i]['CoordinatingRAAbv'],
            DTIC: j[i]['Distribution'],
            LibrarianRemarks: j[i]['LibrarianRemarks'],
            LongTitle: j[i]['LongTitle'],
            Media: makeArray(j[0]['Media']), // returns array of multiple choices
            Modified: new Date(j[i]['Modified']).toLocaleDateString(),
            MA: j[i]['MA'],
            NSN: j[i]['NSN'],
            NWDCAO: {
              Title: j[i]['NWDCAO']['Title'],
              Id: j[i]['NWDCAO']['Id'],
              Email: j[i]['NWDCAO']['EMail']
            },
            PRA: j[i]['PrimaryReviewAuthority'],
            PRAPOC: j[i]['PRAPOC'],
            Prfx: j[i]['Prfx'] === null || j[i]['Prfx'] === '' || j[i]['Prfx'] === undefined ? 'Please Select...' : j[i]['Prfx'],
            PubID: j[i]['PubID'],
            Resourced: j[i]['Resourced'] === true ? 'Yes' : 'No',
            ReviewDate: j[i]['ReviewDate'],
            StatusComments: j[i]['statuscomments'],
            Replaces: j[i]['Replaces'],
            Bookshelf: j[i]['Bookshelf'],
            AdditionalData: FormatAD(j[i]['AdditionalData'], j[i]['Id'], 'Yes')
          })
        }
        that.context.commit('createNatoPublications', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.natoUrl
    getAllNatoPubs(turl)
    return true
  }

  @Action
  public async getPublicationById(id: string, nato: string): Promise<boolean> {
    let url = tp1 + slash + slash + tp2 // + this.pubsUrl + '&$filter=(Id eq ' + id + ')'
    if (nato === 'Yes') {
      url += this.natoUrl + '&$filter=(Id eq ' + id + ')'
    } else {
      url += this.pubsUrl + '&$filter=(Id eq ' + id + ')'
    }
    console.log('getPublicationById url: ' + url)
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let j = response.data.d.results
    let p = {} as PublicationItem
    let ad = JSON.parse(j[0]['AdditionalData'])
    p.Id = j[0]['Id']
    p.DocID = j[0]['DocID']
    p.Title = j[0]['Title']
    p.Name = j[0]['Name']
    p.RelativeURL = j[0]['File']['ServerRelativeUrl']
    p.IsNato = nato
    p.Availability = j[0]['Availability']
    p.Branch = j[0]['BranchTitle'] === null || j[0]['BranchTitle'] === '' || j[0]['BranchTitle'] === undefined ? 'Please Select...' : j[0]['BranchTitle']
    p.Class = j[0]['Class']
    p.ClassAbv = j[0]['ClassAbv']
    p.CoordinatingRA = j[0]['CoordinatingRA']
    p.CoordinatingRAAbv = j[0]['CoordinatingRAAbv']
    p.DTIC = j[0]['DTIC']
    p.LibrarianRemarks = j[0]['LibrarianRemarks']
    p.LongTitle = j[0]['LongTitle']
    p.Media = makeArray(j[0]['Media'])
    p.MA = j[0]['MA']
    p.NSN = j[0]['NSN']
    p.NWDCAO = {
      Title: j[0]['NWDCAO']['Title'],
      Id: j[0]['NWDCAO']['Id'],
      Email: j[0]['NWDCAO']['EMail']
    }
    p.PRA = j[0]['PrimaryReviewAuthority']
    p.PRAPOC = j[0]['PRAPOC']
    p.Prfx = j[0]['Prfx'] === null || j[0]['Prfx'] === '' || j[0]['Prfx'] === undefined ? 'Please Select...' : j[0]['Prfx']
    p.PubID = j[0]['PubID']
    p.Resourced = j[0]['Resourced']
    p.ReviewDate = j[0]['ReviewDate']
    p.StatusComments = j[0]['StatusComments']
    p.Replaces = j[0]['Replaces']
    p.Bookshelf = j[0]['Bookshelf']
    p.AdditionalData = ad
    p.ActionButtons = []
    this.context.commit('updatePublication', p)
    return true
  }

  @Action
  public async getPrefixesByBranch(branch: string): Promise<boolean> {
    let j: any[] = []
    let p: Array<ObjectItem> = []
    const that = this
    async function getAllPrefixes(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllPrefixes(url)
      } else {
        // console.log('getPrefixesByBranch results: ' + JSON.stringify(j))
        for (let i = 0; i < j.length; i++) {
          p.push({
            value: j[i]['Title'],
            text: j[i]['Title']
          })
        }
        that.context.commit('createPrefixes', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.prefixUrl
    turl += branch
    turl += "')"
    console.log('getPrefixesByBranch URL: ' + turl)
    getAllPrefixes(turl)
    return true
  }

  @Action
  public async getStatusesByBranch(branch: string): Promise<boolean> {
    let j: any[] = []
    let p: Array<ObjectItem> = []
    const that = this
    async function getAllStatuses(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllStatuses(url)
      } else {
        // console.log('getPrefixesByBranch results: ' + JSON.stringify(j))
        for (let i = 0; i < j.length; i++) {
          p.push({
            value: j[i]['Title'],
            text: j[i]['Title']
          })
        }
        that.context.commit('createStatuses', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.statusUrl
    turl += branch
    turl += "')"
    console.log('getStatusesByBranch URL: ' + turl)
    getAllStatuses(turl)
    return true
  }

  @Action
  public async getFunctionalSeriesByBranch(branch: string): Promise<boolean> {
    let j: any[] = []
    let p: Array<ObjectItem> = []
    const that = this
    async function getAllStatuses(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllStatuses(url)
      } else {
        // console.log('getPrefixesByBranch results: ' + JSON.stringify(j))
        for (let i = 0; i < j.length; i++) {
          p.push({
            value: j[i]['Title'],
            text: j[i]['Title']
          })
        }
        that.context.commit('createFunctionalSeries', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.functionalseriesUrl
    turl += branch
    turl += "')"
    console.log('getFunctionalSeriesByBranch URL: ' + turl)
    getAllStatuses(turl)
    return true
  }

  @Action
  public async getFunctionalFieldByFunctionalSeries(series: string): Promise<boolean> {
    let j: any[] = []
    let p: Array<ObjectItem> = []
    const that = this
    async function getAllStatuses(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllStatuses(url)
      } else {
        // console.log('getPrefixesByBranch results: ' + JSON.stringify(j))
        for (let i = 0; i < j.length; i++) {
          p.push({
            value: j[i]['funcField'],
            text: j[i]['funcField']
          })
        }
        that.context.commit('createFunctionalField', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.functionalfieldsUrl
    turl += series
    turl += "')"
    console.log('getFunctionalFieldByFunctionalSeries URL: ' + turl)
    getAllStatuses(turl)
    return true
  }

  @Action
  public async getRelto(): Promise<boolean> {
    let j: any[] = []
    let p: Array<ObjectItem> = []
    const that = this
    async function getAllRelto(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      // console.log('getAllRelto Initial Response: ' + response)
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllRelto(url)
      } else {
        // console.log('getAllRelto Response: ' + j)
        for (let i = 0; i < j.length; i++) {
          p.push({
            value: j[i]['Title'],
            text: j[i]['Title'],
            selected: false
          })
        }
        that.context.commit('createRelto', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.reltoUrl
    console.log('getAllPublications URL: ' + turl)
    getAllRelto(turl)
    return true
  }

  @Action
  public async getAO(): Promise<boolean> {
    const url = tp1 + slash + slash + tp2 + "/_api/Web/SiteGroups/GetByName('Doctrine Action Officers')/users"
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let j = response.data.d.results
    // if (console) console.log('GET AO RESPONSE: ' + JSON.stringify(j))
    let p: Array<ObjectItem> = []
    for (let i = 0; i < j.length; i++) {
      p.push({
        text: j[i]['Title'],
        value: j[i]['Title'],
        props: {
          id: j[i]['Id'],
          email: j[i]['Email']
        }
      })
    }
    this.context.commit('createAO', p)
    return true
  }

  @Action
  public async getRA(): Promise<boolean> {
    let j: any[] = []
    let p: Array<ObjectItem> = []
    const that = this
    async function getAllRA(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllRA(url)
      } else {
        // console.log('getAllRA Response: ' + j)
        for (let i = 0; i < j.length; i++) {
          p.push({
            value: j[i]['Title'],
            text: j[i]['Title'],
            selected: false,
            props: {
              pla: j[i]['PLA'],
              abbr: j[i]['abbr']
            }
          })
        }
        that.context.commit('createRA', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.raUrl
    console.log('getAllRA URL: ' + turl)
    getAllRA(turl)
    return true
  }

  @Action
  public async createAllPubs(): Promise<boolean> {
    this.context.commit('createAllPublications')
    return true
  }
}
export default Publication
