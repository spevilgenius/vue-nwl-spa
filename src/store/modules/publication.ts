/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { PublicationItem } from '@/interfaces/PublicationItem'
import { ObjectItem } from '@/interfaces/ObjectItem'
// import { EventBus } from '../../main'
import axios from 'axios'
import { SupportingDocItem } from '@/interfaces/SupportingDocItem'
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
  LastPublished: '',
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

let development: any = {
  Phase: '',
  ProjectStart: '',
  ProgramDirective: '',
  FirstDraft: '',
  FinalDraft: '',
  FinalManuscript: '',
  SignatureDraft: '',
  PRAApproval: '',
  NWDCSignature: '',
  PhaseFinish: '',
  ProjectFinish: ''
}

function isJson(item: any, type: string) {
  let ij = false
  let obj = false
  let ret: any = {}
  if (typeof item === 'string') {
    try {
      JSON.parse(item)
      ij = true
    } catch (e) {
      ij = false
    }
  } else {
    // console.log('ITEM is not a string: ' + typeof item)
    if (typeof item === 'object') {
      obj = true
      try {
        item = JSON.stringify(item)
        JSON.parse(item)
        ij = true
      } catch (e) {
        ij = false
      }
    }
  }
  ret.ij = ij
  ret.obj = obj
  return ret
}

function FormatAD(ad: any, id: any, nato: any): any {
  // console.log('checking AD id: ' + id + ', nato: ' + nato)
  let test = isJson(ad, 'AD')
  if (test.ij === true && test.obj === false) {
    ad = JSON.parse(ad)
    return ad
  } else {
    // this item may already an object
    if (test.obj === true) {
      return ad
      /* console.log('ITEM ID: ' + id + ', NATO: ' + nato + ' is an Object so convert and test.')
      try {
        let item = JSON.stringify(ad)
        item = JSON.parse(item)
        return item
      } catch (e) {
        return additionalData
      } */
    }
  }
}

function FormatDevelopment(dev: any, id: any, nato: any): any {
  // console.log('checking DEV id: ' + id + ', nato: ' + nato)
  if (isJson(dev, 'DEV')) {
    dev = JSON.parse(dev)
    return dev
  } else {
    return JSON.parse(development)
  }
}

function formatMedia(media: any) {
  if (media !== null && media !== '') {
    let ops = String(media)
    let lion = ops.split(',')
    let zebra: any = ''
    for (let i = 0; i < lion.length; i++) {
      if (i === 0) {
        zebra = lion[i]
      } else {
        if (lion[i] !== '') {
          zebra += ',' + lion[i]
        }
      }
    }
    return zebra
  } else {
    return ''
  }
}

@Module({ namespaced: true })
class Publication extends VuexModule {
  public digest?: string = ''
  public digestloaded?: boolean = false
  public publications: Array<PublicationItem> = []
  public natopublications: Array<PublicationItem> = []
  public allpublications: Array<PublicationItem> = []
  public alldevpublications: Array<PublicationItem> = []
  public devpublications: Array<PublicationItem> = []
  public natodevpublications: Array<PublicationItem> = []
  public natoarchivepublications: Array<PublicationItem> = []
  public archivepublications: Array<PublicationItem> = []
  public pubsloaded?: boolean = false
  public devpublication?: PublicationItem
  public devpubsloaded?: boolean = false
  public natopubsloaded?: boolean = false
  public natodevpubsloaded?: boolean = false
  public archivepubsloaded?: boolean = false
  public natoarchivepubsloaded?: boolean = false
  public allpubsloaded?: boolean = false
  public alldevpubsloaded?: boolean = false
  public publication?: any //PublicationItem
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
  public actionofficers: Array<ObjectItem> = []
  public rapocs: Array<ObjectItem> = []
  public supportingdocs: Array<SupportingDocItem> = []
  public supportingdocsloaded?: boolean = false

  devpubsUrl = "/_api/lists/getbytitle('ActivePublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title&$filter=OData__ModerationStatus ne 0"
  natodevpubsUrl = "/_api/lists/getbytitle('NATOPublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title&$filter=OData__ModerationStatus ne 0"
  pubsUrl = "/_api/lists/getbytitle('ActivePublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"
  pubsArchiveUrl = "/_api/lists/getbytitle('ArchivePublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"
  natoUrl = "/_api/lists/getbytitle('NATOPublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"
  natoArchiveUrl = "/_api/lists/getbytitle('NATOArchive')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"
  prefixUrl = "/_api/lists/getbytitle('lu_prefix')/items?$select=*,Family/Title&$expand=Family&$filter=(Family/Title eq '"
  statusUrl = "/_api/lists/getbytitle('lu_status')/items?$select=*,Family/Title&$expand=Family&$filter=(Family/Title eq '"
  functionalseriesUrl = "/_api/lists/getbytitle('lu_funcseries')/items?$select=*,Family/Title&$expand=Family&$filter=(Family/Title eq '"
  functionalfieldsUrl = "/_api/lists/getbytitle('lu_librarytree')/items?$select=*,funcSeries/Title&$expand=funcSeries&$filter=(funcSeries/Title eq '"
  reltoUrl = "/_api/lists/getbytitle('lu_relto')/items?$select=*"
  raUrl = "/_api/lists/getbytitle('lu_pra')/items?$select=*"
  getfileUrl = "/_api/web/GetFileByServerRelativeUrl('"
  rapocUrl = "/_api/lists/getbytitle('poc')/items?$select=*,Command/Title&$expand=Command&$filter=(Command/Title eq '"
  updatePubUrl = "/_api/lists/getbytitle('ActivePublications')/items("
  updateNatoPubUrl = "/_api/lists/getbytitle('NATOPublications')/items("
  sdUrl = "/_api/lists/getbytitle('SupportingDocuments')/items?$select=*,File/Name,File/ServerRelativeUrl&$expand=File"
  sdNatoUrl = "/_api/lists/getbytitle('NATOSupportingDocuments')/items?$select=*,File/Name,File/ServerRelativeUrl&$expand=File"

  //#region MUTATIONS
  @Mutation updateDigest(digest: string): void {
    this.digest = digest
    this.digestloaded = true
  }

  @Mutation updateDigestLoaded(loaded: boolean): void {
    this.digestloaded = loaded
  }

  @Mutation
  public createPublications(items: Array<PublicationItem>): void {
    this.publications = items
    this.pubsloaded = true
  }

  @Mutation
  public createNatoPublications(items: Array<PublicationItem>): void {
    this.natopublications = items
    this.natopubsloaded = true
  }

  @Mutation
  public createSupportingDocs(items: Array<SupportingDocItem>): void {
    this.supportingdocs = items
    this.supportingdocsloaded = true
  }

  @Mutation
  public updateSupportingDocsLoaded(loaded: boolean): void {
    this.supportingdocs = []
    this.supportingdocsloaded = loaded
  }

  @Mutation
  public createAllPublications(): void {
    let p: Array<PublicationItem>
    p = this.publications.concat(this.natopublications)
    this.allpublications = p
    this.allpubsloaded = true
  }

  @Mutation
  public createDevPublications(items: Array<PublicationItem>): void {
    this.devpublications = items
    this.devpubsloaded = true
  }

  @Mutation
  public createNatoDevPublications(items: Array<PublicationItem>): void {
    this.natodevpublications = items
    this.natodevpubsloaded = true
  }

  @Mutation
  public createAllDevPublications(): void {
    let p: Array<PublicationItem>
    p = this.devpublications.concat(this.natodevpublications)
    this.alldevpublications = p
    this.alldevpubsloaded = true
  }

  @Mutation
  public createAllArchivePublications(): void {
    let p: Array<PublicationItem>
    p = this.archivepublications.concat(this.natoarchivepublications)
    this.allpublications = p
    this.allpubsloaded = true
  }

  @Mutation
  public updatePublication(item: PublicationItem): void {
    this.publication = item
    this.publoaded = true
    console.log('MUTATION updatePublication: true')
  }

  @Mutation
  public updatePubLoaded(loaded: boolean): void {
    this.publication = null
    this.publoaded = loaded
    console.log('MUTATION updatePubLoaded: ' + loaded)
  }

  @Mutation
  public updateDevPublication(item: PublicationItem): void {
    this.devpublication = item
    this.devpubsloaded = true
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

  @Mutation
  public createRAPocs(items: Array<ObjectItem>): void {
    this.rapocs = items
  }

  @Mutation
  public createArchivePublications(items: Array<PublicationItem>): void {
    this.archivepublications = items
    this.archivepubsloaded = true
  }

  @Mutation
  public createNatoArchivePublications(items: Array<PublicationItem>): void {
    this.natoarchivepublications = items
    this.natoarchivepubsloaded = true
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

  @Action
  public setPubLoaded(loaded: boolean): void {
    console.log('ACTION: setPubLoaded: ' + loaded)
    this.context.commit('updatePubLoaded', loaded)
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
        for (let i = 0; i < j.length; i++) {
          p.push({
            Id: j[i]['Id'],
            DocID: j[i]['DocID'],
            Title: j[i]['Title'],
            value: j[i]['Title'],
            text: j[i]['Title'],
            selected: false,
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
            Media: j[i]['Media'] !== null ? j[i]['Media']['results'] : '',
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
            Development: j[i]['Development'] === null ? development : FormatDevelopment(j[i]['Development'], j[i]['Id'], 'No'),
            AdditionalData: FormatAD(j[i]['AdditionalData'], j[i]['Id'], 'No'),
            type: j[i]['__metadata']['type']
          })
        }
        that.context.commit('createPublications', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.pubsUrl
    getAllPubs(turl)
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
        for (let i = 0; i < j.length; i++) {
          p.push({
            Id: j[i]['Id'],
            DocID: j[i]['DocID'],
            Title: j[i]['Title'],
            value: j[i]['Title'],
            text: j[i]['Title'],
            selected: false,
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
            Media: j[i]['Media'] !== null ? j[i]['Media']['results'] : '', // returns array of multiple choices
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
            Development: j[i]['Development'] === null ? development : FormatDevelopment(j[i]['Development'], j[i]['Id'], 'Yes'),
            AdditionalData: FormatAD(j[i]['AdditionalData'], j[i]['Id'], 'Yes'),
            type: j[i]['__metadata']['type']
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
  public async getPublicationById(data: any): Promise<boolean> {
    this.context.commit('updatePubLoaded', false)
    this.context.commit('updateSupportingDocsLoaded', false)
    let url = tp1 + slash + slash + tp2 // + this.pubsUrl + '&$filter=(Id eq ' + id + ')'
    if (data.Nato === 'Yes') {
      url += this.natoUrl + '&$filter=(Id eq ' + data.Id + ')'
    } else {
      url += this.pubsUrl + '&$filter=(Id eq ' + data.Id + ')'
    }
    console.log('getPublicationById: ' + data.Id + ', ' + data.Nato + ', ' + url)
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let j = response.data.d.results
    let p = {} as PublicationItem
    let ad = FormatAD(j[0]['AdditionalData'], j[0]['Id'], data.Nato)
    p.Id = j[0]['Id']
    p.DocID = j[0]['DocID']
    p.Title = j[0]['Title']
    /* p.value = j[0]['Title']
    p.text = j[0]['Title']
    p.selected = false */
    p.Name = j[0]['Name']
    p.RelativeURL = j[0]['File']['ServerRelativeUrl']
    p.IsNato = data.nato
    p.Availability = j[0]['Availability']
    p.Branch = j[0]['BranchTitle'] === null || j[0]['BranchTitle'] === '' || j[0]['BranchTitle'] === undefined ? 'Please Select...' : j[0]['BranchTitle']
    p.Class = j[0]['Class']
    p.ClassAbv = j[0]['ClassAbv']
    p.CoordinatingRA = j[0]['CoordinatingRA']
    p.CoordinatingRAAbv = j[0]['CoordinatingRAAbv']
    p.DTIC = j[0]['Distribution']
    p.LibrarianRemarks = j[0]['LibrarianRemarks']
    p.LongTitle = j[0]['LongTitle']
    p.Media = j[0]['Media'] !== null ? formatMedia(j[0]['Media']['results']) : ''
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
    p.Resourced = j[0]['Resourced'] === true ? 'Yes' : 'No'
    p.ReviewDate = j[0]['ReviewDate']
    p.StatusComments = j[0]['StatusComments']
    p.Replaces = j[0]['Replaces']
    p.Bookshelf = j[0]['Bookshelf']
    p.Development = j[0]['Development'] === null ? development : FormatDevelopment(j[0]['Development'], j[0]['Id'], data.nato)
    p.AdditionalData = ad
    p.ActionButtons = []
    p.etag = j[0]['__metadata']['etag']
    p.uri = j[0]['__metadata']['uri']
    p.type = j[0]['__metadata']['type']
    this.context.commit('updatePublication', p)
    return true
  }

  @Action
  public async updatePublicationById(data: any): Promise<boolean> {
    // update the publication data
    let url = ''
    if (data.IsNato) {
      url = this.updateNatoPubUrl + data.Id + ')'
    } else {
      url = this.updatePubUrl + data.Id + ')'
    }
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
      Availability: data.Availability,
      BranchTitle: data.Branch,
      Class: data.Class,
      // ClassAbv: data.Availability,
      CoordinatingRA: data.CoordinatingRA,
      // CoordinatingRAAbv: data.Availability,
      Distribution: data.DTIC,
      LibrarianRemarks: data.LibrarianRemarks,
      LongTitle: data.LongTitle,
      Media: {
        __metdata: { type: 'Collection(Edm.String)' },
        results: [data.Media]
      },
      // MA: string
      NSN: data.NSN,
      NWDCAOId: data.NWDCAO.Id,
      PrimaryReviewAuthority: data.PRA,
      PRAPOC: data.PRAPOC,
      Prfx: data.Prfx,
      PubID: data.PubID,
      Resourced: data.Resourced === 'Yes' ? true : false, // TODO: checkbox so fix it
      ReviewDate: data.ReviewDate,
      StatusComments: data.StatusComments,
      Replaces: data.Replaces,
      Bookshelf: data.Bookshelf,
      Development: JSON.stringify(data.Development),
      AdditionalData: JSON.stringify(data.AdditionalData)
    }

    try {
      await axios.post(url, itemprops, config)
    } catch (e) {
      // don't care yet
    }

    return true
  }

  @Action
  public async getSupportingDocs(data: any): Promise<boolean> {
    let p: Array<SupportingDocItem> = []
    let url = tp1 + slash + slash + tp2
    if (data.nato === 'Yes') {
      url += this.sdNatoUrl
      url += "&$filter=(DocID eq '" + data.DocID + "')"
    } else {
      url += this.sdUrl
      url += "&$filter=(DocID eq '" + data.DocID + "')"
    }
    if (data.showhidden === 'No') {
      url += ' and (Hidden ne 1)'
    }
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let j = response.data.d.results
    for (let i = 0; i < j.length; i++) {
      p.push({
        Id: j[i]['Id'],
        DocID: j[i]['DocID'],
        Title: j[i]['Title'],
        Name: j[i]['File']['Name'],
        RelativeURL: j[i]['File']['ServerRelativeUrl'],
        IsNato: data.nato,
        Hidden: j[i]['Hidden'] === true ? 'Yes' : 'No',
        type: j[i]['__metadata']['type']
      })
    }
    this.context.commit('createSupportingDocs', p)
    return true
  }

  @Action
  public async getArchivePublications(): Promise<boolean> {
    let j: any[] = []
    let p: Array<PublicationItem> = []
    const that = this
    async function getArchivePubs(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getArchivePubs(url)
      } else {
        for (let i = 0; i < j.length; i++) {
          p.push({
            Id: j[i]['Id'],
            DocID: j[i]['DocID'],
            Title: j[i]['Title'],
            value: j[i]['Title'],
            text: j[i]['Title'],
            selected: false,
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
            Media: j[i]['Media'] !== null ? j[i]['Media']['results'] : '', // returns array of multiple choices
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
            Development: j[i]['Development'] === null ? development : FormatDevelopment(j[i]['Development'], j[i]['Id'], 'No'),
            AdditionalData: FormatAD(j[i]['AdditionalData'], j[i]['Id'], 'No')
          })
        }
        that.context.commit('createPublications', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.pubsUrl
    getArchivePubs(turl)
    return true
  }

  @Action
  public async getAllNatoArchivePublications(): Promise<boolean> {
    let j: any[] = []
    let p: Array<PublicationItem> = []
    const that = this
    async function getAllNatoArchivePubs(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllNatoArchivePubs(url)
      } else {
        for (let i = 0; i < j.length; i++) {
          p.push({
            Id: j[i]['Id'],
            DocID: j[i]['DocID'],
            Title: j[i]['Title'],
            value: j[i]['Title'],
            text: j[i]['Title'],
            selected: false,
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
            Media: j[i]['Media'] !== null ? j[i]['Media']['results'] : '', // returns array of multiple choices
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
            Development: j[i]['Development'] === null ? development : FormatDevelopment(j[i]['Development'], j[i]['Id'], 'Yes'),
            AdditionalData: FormatAD(j[i]['AdditionalData'], j[i]['Id'], 'Yes')
          })
        }
        that.context.commit('createNatoArchivePublications', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.natoUrl
    getAllNatoArchivePubs(turl)
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
        for (let i = 0; i < j.length; i++) {
          p.push({
            value: j[i]['Title'],
            text: j[i]['Title'],
            props: {
              generalstatus: j[i]['GeneralStatus']
            }
          })
        }
        that.context.commit('createStatuses', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.statusUrl
    turl += branch
    turl += "')"
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
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllRelto(url)
      } else {
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
    getAllRA(turl)
    return true
  }

  @Action
  public async getRAPocByRA(ra: string): Promise<boolean> {
    let j: any[] = []
    let p: Array<ObjectItem> = []
    const that = this
    async function getAllRAPoc(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllRAPoc(url)
      } else {
        for (let i = 0; i < j.length; i++) {
          p.push({
            value: j[i]['FullName'],
            text: j[i]['FullName']
          })
        }
        that.context.commit('createRAPocs', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.rapocUrl
    turl += ra
    turl += "')"
    getAllRAPoc(turl)
    return true
  }

  @Action
  public async createAllPubs(): Promise<boolean> {
    this.context.commit('createAllPublications')
    return true
  }

  @Action
  public async createAllDevPubs(): Promise<boolean> {
    this.context.commit('createAllDevPublications')
    return true
  }

  @Action
  public async createAllArchivePubs(): Promise<boolean> {
    this.context.commit('createAllArchivePublications')
    return true
  }

  @Action
  public async getAllDevPublications(): Promise<boolean> {
    let j: any[] = []
    let p: Array<PublicationItem> = []
    const that = this
    async function getAllDevPubs(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllDevPubs(url)
      } else {
        for (let i = 0; i < j.length; i++) {
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
            Media: j[i]['Media'] !== null ? j[i]['Media']['results'] : '',
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
            Development: FormatDevelopment(j[i]['Development'], j[i]['Id'], 'No'),
            AdditionalData: FormatAD(j[i]['AdditionalData'], j[i]['Id'], 'No')
          })
        }
        that.context.commit('createDevPublications', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.devpubsUrl
    getAllDevPubs(turl)
    return true
  }

  @Action
  public async getAllNatoDevPublications(): Promise<boolean> {
    let j: any[] = []
    let p: Array<PublicationItem> = []
    const that = this
    async function getAllDevPubs(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllDevPubs(url)
      } else {
        for (let i = 0; i < j.length; i++) {
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
            Media: j[i]['Media'] !== null ? j[i]['Media']['results'] : '',
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
            Development: FormatDevelopment(j[i]['Development'], j[i]['Id'], 'Yes'),
            AdditionalData: FormatAD(j[i]['AdditionalData'], j[i]['Id'], 'Yes')
          })
        }
        that.context.commit('updateDevPublications', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.natodevpubsUrl
    getAllDevPubs(turl)
    return true
  }

  @Action
  public async requestApproval(data: any): Promise<boolean> {
    // build url to post and update. return true to resolve the promise
    const url = tp1 + slash + slash + tp2 + "/_api/web/getfilebyserverrelativeurl('" + data.RelativeURL + "')/publish(comment='')"
    const headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': this.digest,
      'X-HTTP-Method': 'POST'
    }
    const config = {
      headers: headers
    }
    try {
      await axios.post(url, null, config)
    } catch (e) {
      // don't care yet
    }
    return true
  }

  @Action
  public async approvePublication(data: any): Promise<boolean> {
    // build url to post and update. return true to resolve the promise
    const url = tp1 + slash + slash + tp2 + "/_api/web/getfilebyserverrelativeurl('" + data.RelativeURL + "')/approve(comment='')"
    const headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': this.digest,
      'X-HTTP-Method': 'POST'
    }
    const config = {
      headers: headers
    }
    let itemprops = {
      __metadata: { type: data.type },
      AdditionalData: JSON.stringify(data.AdditionalData)
    }
    try {
      await axios.post(url, itemprops, config)
    } catch (e) {
      // don't care yet
    }
    return true
  }

  @Action
  public async archivePublication(data: any): Promise<boolean> {
    // build url to post and update. return true to resolve the promise
    console.log('archivePublication passed superseded by: ' + data.item.AdditionalData.SupersededBy)
    let url = ''
    if (data.nato === 'Yes') {
      url = this.updateNatoPubUrl + data.id + ')'
    } else {
      url = this.updatePubUrl + data.id + ')'
    }
    console.log('ARCHIVE URL: ' + url + ', type: ' + data.type)
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
    let itemprops = {
      __metadata: { type: data.item.type },
      Archive: data.type,
      AdditionalData: JSON.stringify(data.item.AdditionalData)
    }
    try {
      await axios.post(url, itemprops, config)
    } catch (e) {
      // don't care yet
      console.log('ERROR ARCHIVING: ' + e)
    }
    return true
  }
  //#endregion
}
export default Publication
