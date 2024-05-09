/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import router from '@/router/router'
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { PublicationItem } from '@/interfaces/PublicationItem'
import { SearchItem } from '@/interfaces/SearchItem'
import { ObjectItem } from '@/interfaces/ObjectItem'
import axios from 'axios'
import { SupportingDocItem } from '@/interfaces/SupportingDocItem'
import { GroupItem } from '@/interfaces/GroupItem'

// are we on a localhost demo?
let loc = String(window.location)
let local = false
let onTest = false
if (loc.indexOf('localhost') >= 0) {
  local = true
}
if (loc.indexOf('test.doctrine') >= 0) {
  onTest = true
}

let sourceId = '53a2dfb9-3b2f-4f6e-b05b-41525c2048cd'
if (onTest) {
  sourceId = '9dd3f10a-e621-4fc4-b63b-5f749d140c6c'
}

let listIds: any = [
  {
    Name: 'ActivePublications',
    Id: 'da118610-d260-4f2e-9103-24960ca55501',
    cId: '{da118610-d260-4f2e-9103-24960ca55501}'
  },
  {
    Name: 'NATOPublications',
    Id: 'eb078b7c-42c3-42e5-9c94-451f04f27807',
    cId: '{eb078b7c-42c3-42e5-9c94-451f04f27807}'
  },
  {
    Name: 'ArchivePublications',
    Id: 'c8aee94d-364b-4dc2-8c77-89c0446cb2f2',
    cId: '{c8aee94d-364b-4dc2-8c77-89c0446cb2f2}'
  },
  {
    Name: 'NATOArchive',
    Id: 'd37bf6fd-b922-4366-b209-fb8416c92b9f',
    cId: '{d37bf6fd-b922-4366-b209-fb8416c92b9f}'
  }
]

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

function getlistName(cid: string) {
  let r = ''
  for (let z = 0; z < listIds.length; z++) {
    if (listIds[z].cId === cid) {
      r = listIds[z].Name
    }
  }
  return r
}

function isJson(item: any) {
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

function FormatAD(ad: any): any {
  // console.log('checking AD id: ' + id + ', nato: ' + nato)
  let test = isJson(ad)
  if (test.ij === true && test.obj === false) {
    ad = JSON.parse(ad)
    return ad
  } else {
    // this item may already be an object
    if (test.obj === true) {
      return ad
    } else {
      console.log('AD TEST FAIL')
      return additionalData
    }
  }
}

function FormatDevelopment(dev: any): any {
  // console.log('checking DEV id: ' + id + ', nato: ' + nato)
  if (isJson(dev)) {
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

  public isdirty?: boolean = false
  public dirtyaction?: string = ''

  public loadingpubs = false
  public loadingarchivedpubs = false
  public savingpub = false

  public historyUrl?: string = ''
  public historyUrlloaded?: boolean = false

  public searchitems: Array<SearchItem> = []
  public searchitemsloaded?: boolean = false

  searchUrlStart = "/_api/search/query?querytext='"
  searchUrlEnd = "'&selectproperties='Rank,Title,Path,PrfxOWSTEXT,DocIDOWSTEXT,ListID,ListItemID,IsDocument,FileExtension,LastModifiedTime'&rowlimit=1000"

  public approvedpubsforuser: Array<PublicationItem> = [] // This will be where 'Approved' pubs are placed for the current user. May contain NATO pubs if they have access
  public approvedpubsforuserloaded!: Date
  public activepubsforuser: Array<PublicationItem> = []
  public activepubsforuserloaded = false
  public natopubsforuser: Array<PublicationItem> = []
  public natopubsforuserloaded = false
  activepubsforuserUrl = "/_api/lists/getbytitle('ActivePublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"
  natopubsforuserUrl = "/_api/lists/getbytitle('NATOPublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"

  public developmentpubsforuser: Array<PublicationItem> = [] // This will be where 'Development' pubs are placed for the current user. May contain NATO pubs if they have access
  public developmentpubsforuserloaded!: Date
  public devpubsforuser: Array<PublicationItem> = []
  public devpubsforuserloaded = false
  public devnatopubsforuser: Array<PublicationItem> = []
  public devnatopubsforuserloaded = false
  /* devpubsforuserUrl = "/_api/lists/getbytitle('ActivePublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title&$filter=OData__ModerationStatus ne 0"
  devnatopubsforuserUrl = "/_api/lists/getbytitle('NATOPublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title&$filter=OData__ModerationStatus ne 0" */
  devpubsforuserUrl = "/_api/lists/getbytitle('ActivePublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title&$filter=(InDevelopment eq 'Yes')"
  devnatopubsforuserUrl = "/_api/lists/getbytitle('NATOPublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title&$filter=(InDevelopment eq 'Yes')"

  public archivedpubsforuser: Array<PublicationItem> = [] // This will be where 'Archived' pubs are placed for the current user. May contain NATO pubs if they have access
  public archivedpubsforuserloaded!: Date
  public archivepubsforuser: Array<PublicationItem> = []
  public archivepubsforuserloaded = false
  public archivenatopubsforuser: Array<PublicationItem> = []
  public archivenatopubsforuserloaded = false
  archivepubsforuserUrl = "/_api/lists/getbytitle('ArchivePublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"
  archivenatopubsforuserUrl = "/_api/lists/getbytitle('NATOArchive')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"

  supportingDocumentUrl = "/_api/lists/getbytitle('SupportingDocuments')/items?$select=*,File/Name,File/ServerRelativeUrl&$expand=File"
  supportingDocumentNatoUrl = "/_api/lists/getbytitle('NATOSupportingDocuments')/items?$select=*,File/Name,File/ServerRelativeUrl&$expand=File"
  commentsUrl = "/_api/lists/getbytitle('Comments')/items?$select=*,Author/Title&$expand=Author"
  eurl = '/_api/SP.Utilities.Utility.SendEmail'

  public activepub: PublicationItem = {
    Title: '',
    Branch: '',
    NWDCAO: {},
    Development: {},
    AdditionalData: {}
  }

  public blankpub: PublicationItem = {
    Title: '',
    Branch: '',
    NWDCAO: {},
    Development: {},
    AdditionalData: {}
  }

  public publication?: any //PublicationItem
  public publoaded?: boolean = false // single publication
  public comments: Array<ObjectItem> = []
  public commentsloaded?: boolean = false
  public prefixes: Array<ObjectItem> = []
  public prefixesforuser: Array<ObjectItem> = []
  public prefixesforuserloaded = false
  public statuses: Array<ObjectItem> = []
  public branches: Array<ObjectItem> = []
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

  public groupedviews: any = [
    { key: 'Navy', isDirty: false, loaded: false, lastLoaded: '', items: [] },
    { key: 'Allied', isDirty: false, loaded: false, lastLoaded: '', items: [] },
    { key: 'Joint', isDirty: false, loaded: false, lastLoaded: '', items: [] },
    { key: 'Multinational', isDirty: false, loaded: false, lastLoaded: '', items: [] },
    { key: 'All', isDirty: false, loaded: false, lastLoaded: '', items: [] },
    { key: 'NTTP', isDirty: false, loaded: false, lastLoaded: '', items: [] },
    { key: 'NTRP', isDirty: false, loaded: false, lastLoaded: '', items: [] },
    { key: 'TTP', isDirty: false, loaded: false, lastLoaded: '', items: [] },
    { key: 'Air NTTP', isDirty: false, loaded: false, lastLoaded: '', items: [] },
    { key: 'CONOPS', isDirty: false, loaded: false, lastLoaded: '', items: [] }
  ]

  /* pubsUrl = "/_api/lists/getbytitle('ActivePublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"
  natoUrl = "/_api/lists/getbytitle('NATOPublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title" */
  prefixUrl = "/_api/lists/getbytitle('lu_prefix')/items?$select=*,Family/Title&$expand=Family&$filter=(Family/Title eq '"
  prefixesforuserUrl = "/_api/lists/getbytitle('lu_prefix')/items?$select=*,Family/Title&$expand=Family"
  statusUrl = "/_api/lists/getbytitle('lu_status')/items?$select=*,Family/Title&$expand=Family&$filter=(Family/Title eq '"
  branchUrl = "/_api/lists/getbytitle('lu_branch')/items?$select=*"
  functionalseriesUrl = "/_api/lists/getbytitle('lu_funcseries')/items?$select=*,Family/Title&$expand=Family&$filter=(Family/Title eq '"
  functionalfieldsUrl = "/_api/lists/getbytitle('lu_librarytree')/items?$select=*,funcSeries/Title&$expand=funcSeries&$filter=(funcSeries/Title eq '"
  functionalseriesAllUrl = "/_api/lists/getbytitle('lu_funcseries')/items?$select=*,Family/Title&$expand=Family"
  functionalfieldsAllUrl = "/_api/lists/getbytitle('lu_librarytree')/items?$select=*,funcSeries/Title&$expand=funcSeries"
  reltoUrl = "/_api/lists/getbytitle('lu_relto')/items?$select=*"
  raUrl = "/_api/lists/getbytitle('lu_pra')/items?$select=*"
  getfileUrl = "/_api/web/GetFileByServerRelativeUrl('"
  rapocUrl = "/_api/lists/getbytitle('Doctrine POCs')/items?$select=*,Command/Title&$expand=Command&$filter=(Command/Title eq '"
  updatePubUrl = "/_api/lists/getbytitle('ActivePublications')/items("
  updateNatoPubUrl = "/_api/lists/getbytitle('NATOPublications')/items("
  updateArchivedPubUrl = "/_api/lists/getbytitle('ArchivePublications')/items("
  updateArchivedNatoPubUrl = "/_api/lists/getbytitle('NATOArchive')/items("
  getPubUrl = "/_api/lists/getbytitle('ActivePublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"
  getNatoPubUrl = "/_api/lists/getbytitle('NATOPublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"
  getArchivedPubUrl = "/_api/lists/getbytitle('ArchivePublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"
  getArchivedNatoPubUrl = "/_api/lists/getbytitle('NATOArchive')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title"
  /* sdUrl = "/_api/lists/getbytitle('SupportingDocuments')/items?$select=*,File/Name,File/ServerRelativeUrl&$expand=File"
  sdNatoUrl = "/_api/lists/getbytitle('NATOSupportingDocuments')/items?$select=*,File/Name,File/ServerRelativeUrl&$expand=File" */

  branchQry = "/_api/lists/getbytitle('ActivePublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title&$expand=File,NWDCAO&$orderby=Title$$filter=(Branch eq '"
  prefixQry = "/_api/lists/getbytitle('ActivePublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title&$expand=File,NWDCAO&$orderby=Title$$filter=(Prefix eq '"

  //#region MUTATIONS
  @Mutation updateDigest(digest: string): void {
    this.digest = digest
    this.digestloaded = true
  }

  @Mutation updateDigestLoaded(loaded: boolean): void {
    this.digestloaded = loaded
  }

  @Mutation updateDirty(dirty: boolean): void {
    this.isdirty = dirty
  }

  @Mutation updateDirtyAction(action: string): void {
    this.dirtyaction = action
  }

  @Mutation updateHistoryUrl(url: string): void {
    this.historyUrl = url
    this.historyUrlloaded = true
  }

  // May not be required
  @Mutation updateHistoryUrlLoaded(loaded: boolean): void {
    this.historyUrlloaded = loaded
  }

  @Mutation updateSearchItems(data: any): void {
    this.searchitems = data.pubs
    this.searchitemsloaded = data.loaded
  }

  @Mutation updateSearchItemsLoaded(loaded: boolean): void {
    this.searchitemsloaded = loaded
  }

  @Mutation createPrefixesForUser(prefixes: any): void {
    this.prefixesforuser = prefixes
    this.prefixesforuserloaded = true
  }

  @Mutation updatePrefixesForUserLoaded(loaded: boolean): void {
    this.prefixesforuserloaded = loaded
  }

  @Mutation updateLoadingPubs(loading: boolean): void {
    this.loadingpubs = loading
  }

  @Mutation updateLoadingArchivedPubs(loading: boolean): void {
    this.loadingarchivedpubs = loading
  }

  @Mutation updateGroupedViews(views: any): void {
    this.groupedviews = views
  }

  @Mutation
  public createActivePubsForUser(items: Array<PublicationItem>): void {
    this.activepubsforuser = items
    this.activepubsforuserloaded = true
  }

  @Mutation
  public createNatoPubsForUser(items: Array<PublicationItem>): void {
    this.natopubsforuser = items
    this.natopubsforuserloaded = true
  }

  @Mutation
  public createApprovedPubsForUser(includeNATO: any): void {
    console.log('createApprovedPubsForUser - ' + includeNATO)
    if (includeNATO === 'Yes') {
      this.approvedpubsforuser = this.activepubsforuser.concat(this.natopubsforuser)
      this.approvedpubsforuserloaded = new Date()
    } else {
      this.approvedpubsforuser = this.activepubsforuser
      this.approvedpubsforuserloaded = new Date()
    }
    this.isdirty = false
    this.loadingpubs = false
  }

  @Mutation
  public createDevPubsForUser(items: Array<PublicationItem>): void {
    this.devpubsforuser = items
    this.devpubsforuserloaded = true
  }

  @Mutation
  public createDevNatoPubsForUser(items: Array<PublicationItem>): void {
    this.devnatopubsforuser = items
    this.devnatopubsforuserloaded = true
  }

  @Mutation
  public createDevelopmentPubsForUser(includeNATO: boolean): void {
    if (includeNATO === true) {
      this.developmentpubsforuser = this.devpubsforuser.concat(this.devnatopubsforuser)
      this.developmentpubsforuserloaded = new Date()
    } else {
      this.developmentpubsforuser = this.devpubsforuser
      this.developmentpubsforuserloaded = new Date()
    }
    this.isdirty = false
    this.loadingpubs = false
  }

  @Mutation
  public createArchivePubsForUser(items: Array<PublicationItem>): void {
    this.archivepubsforuser = items
    this.archivepubsforuserloaded = true
  }

  @Mutation
  public createArchiveNatoPubsForUser(items: Array<PublicationItem>): void {
    this.archivenatopubsforuser = items
    this.archivenatopubsforuserloaded = true
  }

  @Mutation
  public createArchivedPubsForUser(includeNATO: boolean): void {
    if (includeNATO === true) {
      this.archivedpubsforuser = this.archivepubsforuser.concat(this.archivenatopubsforuser)
      this.archivedpubsforuserloaded = new Date()
    } else {
      this.archivedpubsforuser = this.archivepubsforuser
      this.archivedpubsforuserloaded = new Date()
    }
    this.loadingarchivedpubs = false
  }

  @Mutation
  public createSupportingDocs(items: Array<SupportingDocItem>): void {
    this.supportingdocs = items
    this.supportingdocsloaded = true
  }

  @Mutation
  public createComments(items: Array<ObjectItem>): void {
    // console.log('MUTATION: CREATECOMMENTS')
    this.comments = items
    this.commentsloaded = true
  }

  @Mutation
  public updateSupportingDocsLoaded(loaded: boolean): void {
    this.supportingdocs = []
    this.supportingdocsloaded = loaded
  }

  //#region SupportMutations
  @Mutation
  public updatePublication(item: PublicationItem): void {
    this.activepub = item
    this.publoaded = true
  }

  @Mutation
  public clearPublication(): void {
    this.activepub = this.blankpub
  }

  @Mutation
  public updatePubLoaded(loaded: boolean): void {
    this.publoaded = loaded
  }

  @Mutation
  public updateSavingPub(saving: boolean): void {
    this.savingpub = saving
  }

  @Mutation
  public updatePubsForUser(): void {
    // update the current users pubs arrays with changes made to the active pub during save/publish.
    // this will improve performance by not requiring full reloads
    let Id = Number(router.currentRoute.params.Id)
    let IsNato = router.currentRoute.params.IsNato
    console.log('UPDATEPUBSFORUSER: ' + Id + ', ' + IsNato)
    if (IsNato === 'Yes') {
      // loop through the users Nato pubs and update the current pub by id
      if (this.approvedpubsforuser && this.approvedpubsforuser.length > 0) {
        for (let i = 0; i < this.approvedpubsforuser.length; i++) {
          if (this.approvedpubsforuser[i].Id === Id) {
            if (this.approvedpubsforuser[i].IsNato === 'Yes') {
              this.approvedpubsforuser.splice(i, 1, this.activepub)
            }
          }
        }
      }
      if (this.developmentpubsforuser && this.developmentpubsforuser.length > 0) {
        for (let i = 0; i < this.developmentpubsforuser.length; i++) {
          if (this.developmentpubsforuser[i].Id === Id) {
            if (this.developmentpubsforuser[i].IsNato === 'Yes') {
              this.developmentpubsforuser.splice(i, 1, this.activepub)
            }
          }
        }
      }
    } else {
      // loop through the users pubs and update the current pub by id
      if (this.approvedpubsforuser && this.approvedpubsforuser.length > 0) {
        for (let i = 0; i < this.approvedpubsforuser.length; i++) {
          if (this.approvedpubsforuser[i].Id === Id) {
            this.approvedpubsforuser.splice(i, 1, this.activepub)
          }
        }
      }
      if (this.developmentpubsforuser && this.developmentpubsforuser.length > 0) {
        for (let i = 0; i < this.developmentpubsforuser.length; i++) {
          if (this.developmentpubsforuser[i].Id === Id) {
            this.developmentpubsforuser.splice(i, 1, this.activepub)
          }
        }
      }
    }
    this.savingpub = false
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
  public createBranches(items: Array<ObjectItem>): void {
    this.branches = items
  }

  @Mutation
  public createFunctionalSeries(items: Array<ObjectItem>): void {
    console.log('[MUTATION: createFunctionalSeries length: ' + items.length)
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
  //#endregion

  //#endregion

  // Actions
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
  public setDirty(dirty: boolean): void {
    this.context.commit('updateDirty', dirty)
  }

  @Action
  public setDirtyAction(action: string): void {
    this.context.commit('updateDirtyAction', action)
  }

  @Action
  public setGroupedViews(views: any): void {
    this.context.commit('updateGroupedViews', views)
  }

  @Action
  public setLoadingPubs(loading: boolean): void {
    this.context.commit('updateLoadingPubs', loading)
  }

  @Action
  public setPubLoaded(loaded: boolean): void {
    console.log('ACTION: setPubLoaded: ' + loaded)
    this.context.commit('updatePubLoaded', loaded)
  }

  @Action
  public async searchAllPublications(data: any): Promise<boolean> {
    let j: any[] = []
    let p: Array<PublicationItem> = []
    let d: any = {}
    d.pubs = p
    d.loaded = false
    this.context.commit('updateSearchItems', d) // clear search items
    const that = this
    async function searchAllPubs(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      console.log('SEARCH RESULTS RESPONSE: ' + response)
      // build searchitems array with response data
      let p: any = []
      let j = response.data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results
      for (let i = 0; i < j.length; i++) {
        let fe = String(j[i].Cells.results[9].Value)
        let isdoc = String(j[i].Cells.results[8].Value)
        let listname = getlistName(String(j[i].Cells.results[6].Value))
        let docid = String(j[i].Cells.results[5].Value)
        if (fe !== 'null') {
          if (fe !== 'aspx') {
            if (isdoc === 'true') {
              if (listname.indexOf('Archive') >= 0) {
                // do not include
              } else {
                if (listname.indexOf('Publications') >= 0) {
                  if (docid !== 'null') {
                    p.push({
                      Rank: Number(j[i].Cells.results[0].Value),
                      Id: Number(j[i].Cells.results[7].Value),
                      Title: j[i].Cells.results[2].Value,
                      Path: j[i].Cells.results[3].Value,
                      FileExtension: j[i].Cells.results[9].Value,
                      IsDoc: String(j[i].Cells.results[8].Value),
                      IsNato: String(j[i].Cells.results[3].Value).indexOf('NATO') >= 0 ? 'Yes' : 'No',
                      ListID: j[i].Cells.results[6].Value,
                      ListName: getlistName(String(j[i].Cells.results[6].Value)),
                      DocID: j[i].Cells.results[5].Value
                    })
                  }
                }
              }
            }
          }
        }
      }
      if (p.length > 0) {
        let d: any = {}
        d.pubs = p
        d.loaded = true
        that.context.commit('updateSearchItems', d)
      } else {
        let d: any = {}
        d.pubs = []
        d.loaded = true
        that.context.commit('updateSearchItems', d)
      }
    }
    let surl = tp1 + slash + slash + tp2 + this.searchUrlStart + data.k + this.searchUrlEnd
    console.log('SEARCH URL: ' + surl)
    searchAllPubs(surl)
    return true
  }

  @Action
  public async getActivePubsForUser(): Promise<boolean> {
    this.context.commit('updateLoadingPubs', true)
    let j: any[] = []
    let p: Array<PublicationItem> = []
    const that = this
    async function getAllActivePubs(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      // that.context.commit('support/addActivity', JSON.stringify(response), { root: true })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllActivePubs(url)
      } else {
        for (let i = 0; i < j.length; i++) {
          if (String(j[i]['DocID']).length > 20) {
            p.push({
              Id: j[i]['Id'],
              DocID: j[i]['DocID'],
              Title: j[i]['Title'],
              value: j[i]['Title'],
              text: j[i]['Title'],
              selected: false,
              Name: j[i]['File']['Name'],
              RelativeURL: j[i]['File']['ServerRelativeUrl'],
              InDevelopment: j[i]['InDevelopment'],
              IsNato: 'No',
              IsFXP: j[i]['Prfx'] === 'FXP' ? 'Yes' : 'No',
              IsTacMemo: j[i]['Prfx'] === 'TACMEMO' || j[i]['Prfx'] === 'TACBUL' || j[i]['Prfx'] === 'TACAID' || j[i]['Prfx'] === 'TACNOTE' ? 'Yes' : 'No',
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
              ModerationStatus: j[i]['OData__ModerationStatus'],
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
              ReviewDate: new Date(j[i]['ReviewDate']).toLocaleDateString(),
              statuscomments: j[i]['statuscomments'],
              Replaces: j[i]['Replaces'],
              Bookshelf: j[i]['Bookshelf'],
              Tags: j[i]['Tags'],
              Development: j[i]['Development'] === null ? development : FormatDevelopment(j[i]['Development']),
              /* AdditionalData: FormatAD(j[i]['AdditionalData']), */
              AdditionalData: FormatAD(j[i]['AdditionalInfo']),
              type: j[i]['__metadata']['type']
            })
          }
        }
        that.context.commit('createActivePubsForUser', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.activepubsforuserUrl
    getAllActivePubs(turl)
    return true
  }

  @Action
  public async getNatoPubsForUser(): Promise<boolean> {
    this.context.commit('updateLoadingPubs', true)
    let j: any[] = []
    let p: Array<PublicationItem> = []
    const that = this
    async function getAllActiveNatoPubs(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllActiveNatoPubs(url)
      } else {
        for (let i = 0; i < j.length; i++) {
          if (String(j[i]['DocID']).length > 20) {
            p.push({
              Id: j[i]['Id'],
              DocID: j[i]['DocID'],
              Title: j[i]['Title'],
              value: j[i]['Title'],
              text: j[i]['Title'],
              selected: false,
              Name: j[i]['File']['Name'],
              RelativeURL: j[i]['File']['ServerRelativeUrl'],
              InDevelopment: j[i]['InDevelopment'],
              IsNato: 'Yes',
              IsFXP: 'No',
              IsTacMemo: 'No',
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
              ModerationStatus: j[i]['OData__ModerationStatus'],
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
              ReviewDate: new Date(j[i]['ReviewDate']).toLocaleDateString(),
              statuscomments: j[i]['statuscomments'],
              Replaces: j[i]['Replaces'],
              Bookshelf: j[i]['Bookshelf'],
              Tags: j[i]['Tags'],
              Development: j[i]['Development'] === null ? development : FormatDevelopment(j[i]['Development']),
              /* AdditionalData: FormatAD(j[i]['AdditionalData']), */
              AdditionalData: FormatAD(j[i]['AdditionalInfo']),
              type: j[i]['__metadata']['type']
            })
          }
        }
        that.context.commit('createNatoPubsForUser', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.natopubsforuserUrl
    getAllActiveNatoPubs(turl)
    return true
  }

  @Action
  public async createAllApprovedPubsForUser(includeNATO: any): Promise<boolean> {
    this.context.commit('createApprovedPubsForUser', includeNATO)
    return true
  }

  @Action
  public async getDevPubsForUser(): Promise<boolean> {
    this.context.commit('updateLoadingPubs', true)
    let j: any[] = []
    let p: Array<PublicationItem> = []
    const that = this
    async function getAllDevPubs(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      // that.context.commit('support/addActivity', JSON.stringify(response), { root: true })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllDevPubs(url)
      } else {
        for (let i = 0; i < j.length; i++) {
          if (j[i]['InDevelopment'] === 'Yes') {
            p.push({
              Id: j[i]['Id'],
              DocID: j[i]['DocID'],
              Title: j[i]['Title'],
              value: j[i]['Title'],
              text: j[i]['Title'],
              selected: false,
              Name: j[i]['File']['Name'],
              RelativeURL: j[i]['File']['ServerRelativeUrl'],
              InDevelopment: 'Yes',
              IsNato: 'No',
              IsFXP: j[i]['Prfx'] === 'FXP' ? 'Yes' : 'No',
              IsTacMemo: j[i]['Prfx'] === 'TACMEMO' || j[i]['Prfx'] === 'TACBUL' || j[i]['Prfx'] === 'TACAID' || j[i]['Prfx'] === 'TACNOTE' ? 'Yes' : 'No',
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
              ModerationStatus: j[i]['OData__ModerationStatus'],
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
              ReviewDate: new Date(j[i]['ReviewDate']).toLocaleDateString(),
              statuscomments: j[i]['statuscomments'],
              Replaces: j[i]['Replaces'],
              Bookshelf: j[i]['Bookshelf'],
              Tags: j[i]['Tags'],
              Development: j[i]['Development'] === null ? development : FormatDevelopment(j[i]['Development']),
              /* AdditionalData: j[i]['AdditionalData'] === null ? additionalData : FormatAD(j[i]['AdditionalData']), */
              /* AdditionalData: FormatAD(j[i]['AdditionalData']), */
              AdditionalData: FormatAD(j[i]['AdditionalInfo']),
              type: j[i]['__metadata']['type']
            })
          }
        }
        that.context.commit('createDevPubsForUser', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.devpubsforuserUrl
    getAllDevPubs(turl)
    return true
  }

  @Action
  public async getDevNatoPubsForUser(): Promise<boolean> {
    this.context.commit('updateLoadingPubs', true)
    let j: any[] = []
    let p: Array<PublicationItem> = []
    const that = this
    async function getAllDevNatoPubs(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllDevNatoPubs(url)
      } else {
        for (let i = 0; i < j.length; i++) {
          if (j[i]['InDevelopment'] === 'Yes') {
            p.push({
              Id: j[i]['Id'],
              DocID: j[i]['DocID'],
              Title: j[i]['Title'],
              value: j[i]['Title'],
              text: j[i]['Title'],
              selected: false,
              Name: j[i]['File']['Name'],
              RelativeURL: j[i]['File']['ServerRelativeUrl'],
              InDevelopment: 'Yes',
              IsNato: 'Yes',
              IsFXP: 'No',
              IsTacMemo: 'No',
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
              ModerationStatus: j[i]['OData__ModerationStatus'],
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
              ReviewDate: new Date(j[i]['ReviewDate']).toLocaleDateString(),
              statuscomments: j[i]['statuscomments'],
              Replaces: j[i]['Replaces'],
              Bookshelf: j[i]['Bookshelf'],
              Tags: j[i]['Tags'],
              Development: j[i]['Development'] === null ? development : FormatDevelopment(j[i]['Development']),
              /* AdditionalData: j[i]['AdditionalData'] === null ? additionalData : FormatAD(j[i]['AdditionalData']), */
              /* AdditionalData: FormatAD(j[i]['AdditionalData']), */
              AdditionalData: FormatAD(j[i]['AdditionalInfo']),
              type: j[i]['__metadata']['type']
            })
          }
        }
        that.context.commit('createDevNatoPubsForUser', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.devnatopubsforuserUrl
    getAllDevNatoPubs(turl)
    return true
  }

  @Action
  public async createAllDevelopmentPubsForUser(includeNATO: boolean): Promise<boolean> {
    this.context.commit('createDevelopmentPubsForUser', includeNATO)
    return true
  }

  @Action
  public async getArchivePubsForUser(): Promise<boolean> {
    this.context.commit('updateLoadingArchivedPubs', true)
    let j: any[] = []
    let p: Array<PublicationItem> = []
    const that = this
    async function getAllArchivePubs(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      // that.context.commit('support/addActivity', JSON.stringify(response), { root: true })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllArchivePubs(url)
      } else {
        for (let i = 0; i < j.length; i++) {
          let ad = FormatAD(j[i]['AdditionalData'])
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
            IsFXP: j[i]['Prfx'] === 'FXP' ? 'Yes' : 'No',
            IsTacMemo: j[i]['Prfx'] === 'TACMEMO' || j[i]['Prfx'] === 'TACBUL' || j[i]['Prfx'] === 'TACAID' || j[i]['Prfx'] === 'TACNOTE' ? 'Yes' : 'No',
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
            ModerationStatus: j[i]['OData__ModerationStatus'],
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
            statuscomments: j[i]['statuscomments'],
            Replaces: j[i]['Replaces'],
            Bookshelf: j[i]['Bookshelf'],
            Tags: j[i]['Tags'],
            Development: j[i]['Development'] === null ? development : FormatDevelopment(j[i]['Development']),
            /* AdditionalData: FormatAD(j[i]['AdditionalData']), */
            AdditionalData: FormatAD(j[i]['AdditionalInfo']),
            type: j[i]['__metadata']['type']
          })
        }
        that.context.commit('createArchivePubsForUser', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.archivepubsforuserUrl
    getAllArchivePubs(turl)
    return true
  }

  @Action
  public async getArchiveNatoPubsForUser(): Promise<boolean> {
    this.context.commit('updateLoadingArchivedPubs', true)
    let j: any[] = []
    let p: Array<PublicationItem> = []
    const that = this
    async function getAllArchiveNatoPubs(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllArchiveNatoPubs(url)
      } else {
        for (let i = 0; i < j.length; i++) {
          let ad = FormatAD(j[i]['AdditionalData'])
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
            IsFXP: 'No',
            IsTacMemo: 'No',
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
            ModerationStatus: j[i]['OData__ModerationStatus'],
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
            statuscomments: j[i]['statuscomments'],
            Replaces: j[i]['Replaces'],
            Bookshelf: j[i]['Bookshelf'],
            Tags: j[i]['Tags'],
            Development: j[i]['Development'] === null ? development : FormatDevelopment(j[i]['Development']),
            /* AdditionalData: FormatAD(j[i]['AdditionalData']), */
            AdditionalData: FormatAD(j[i]['AdditionalInfo']),
            type: j[i]['__metadata']['type']
          })
        }
        that.context.commit('createArchiveNatoPubsForUser', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.archivenatopubsforuserUrl
    getAllArchiveNatoPubs(turl)
    return true
  }

  @Action
  public async createAllArchivedPubsForUser(includeNATO: boolean): Promise<boolean> {
    this.context.commit('createArchivedPubsForUser', includeNATO)
    return true
  }

  @Action
  public async getHistory(): Promise<boolean> {
    let burl = "/_api/lists/getbytitle('"
    let Id = router.currentRoute.params.Id
    let IsNato = router.currentRoute.params.IsNato
    let IsArchive = router.currentRoute.params.IsArchive
    let url = tp1 + slash + slash + tp2
    let listName = 'ActivePublications'
    let guid = ''
    // console.log('GET HISTORY: ' + IsNato + ', ' + IsArchive)
    if (IsArchive === 'true') {
      if (IsNato === 'Yes') {
        listName = 'NATOArchive'
      } else {
        listName = 'ArchivePublications'
      }
    } else {
      if (IsNato === 'Yes') {
        listName = 'NATOPublications'
      }
    }
    // get the list guid from rest
    url += burl + listName + "')"
    console.log('HISTORY URL: ' + url)
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    // console.log('HISTORY RESULTS: ' + response)
    guid = response.data.d.Id
    let hurl = tp1 + slash + slash + tp2 + '/_layouts/15/Versions.aspx?list={' + guid + '}&ID=' + Id + '&IsDlg=1'
    this.context.commit('updateHistoryUrl', hurl)
    return true
  }

  @Action
  public async getPublicationById(): Promise<boolean> {
    this.context.commit('clearPublication') // set active pub to empty data
    this.context.commit('updatePubLoaded', false)
    let Id = router.currentRoute.params.Id
    let IsNato = router.currentRoute.params.IsNato
    let IsArchive = router.currentRoute.params.IsArchive
    let url = tp1 + slash + slash + tp2
    if (IsNato === 'Yes') {
      if (IsArchive === 'true') {
        url += this.getArchivedNatoPubUrl + '&$filter=(Id eq ' + Id + ')'
      } else {
        url += this.getNatoPubUrl + '&$filter=(Id eq ' + Id + ')'
      }
    } else {
      if (IsArchive === 'true') {
        url += this.getArchivedPubUrl + '&$filter=(Id eq ' + Id + ')'
      } else {
        url += this.getPubUrl + '&$filter=(Id eq ' + Id + ')'
      }
    }
    console.log('getPublicationById: ' + Id + ', ' + IsNato + ', ' + url)
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let j = response.data.d.results
    let p = {} as PublicationItem
    /* let ad = FormatAD(j[0]['AdditionalData']) */
    let ad = FormatAD(j[0]['AdditionalInfo'])
    let rurl = String(j[0]['File']['ServerRelativeUrl'])
    p.Id = j[0]['Id']
    p.DocID = j[0]['DocID']
    p.Title = j[0]['Title']
    p.value = j[0]['Title']
    p.text = j[0]['Title']
    p.Name = j[0]['File']['Name']
    p.RelativeURL = rurl
    p.InDevelopment = j[0]['InDevelopment']
    p.IsNato = IsNato
    p.IsFXP = j[0]['Prfx'] === 'FXP' ? 'Yes' : 'No'
    p.IsTacMemo = j[0]['Prfx'] === 'TACMEMO' || j[0]['Prfx'] === 'TACBUL' || j[0]['Prfx'] === 'TACAID' || j[0]['Prfx'] === 'TACNOTE' ? 'Yes' : 'No'
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
    p.ReviewDate = new Date(j[0]['ReviewDate']).toLocaleDateString()
    p.statuscomments = j[0]['statuscomments']
    p.Replaces = j[0]['Replaces']
    p.Bookshelf = j[0]['Bookshelf']
    p.Tags = j[0]['Tags']
    p.Development = j[0]['Development'] === null ? development : FormatDevelopment(j[0]['Development'])
    p.AdditionalData = ad
    p.etag = j[0]['__metadata']['etag']
    p.uri = j[0]['__metadata']['uri']
    p.type = j[0]['__metadata']['type']
    this.context.commit('updatePublication', p)
    return true
  }

  @Action
  public async getArchivedPublicationById(): Promise<boolean> {
    this.context.commit('clearPublication') // set active pub to empty data
    this.context.commit('updatePubLoaded', false)
    let Id = router.currentRoute.params.Id
    let IsNato = router.currentRoute.params.IsNato
    let url = tp1 + slash + slash + tp2
    if (IsNato === 'Yes') {
      url += this.getArchivedNatoPubUrl + '&$filter=(Id eq ' + Id + ')'
    } else {
      url += this.getArchivedPubUrl + '&$filter=(Id eq ' + Id + ')'
    }
    console.log('getArchivedPublicationById: ' + Id + ', ' + IsNato + ', ' + url)
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let j = response.data.d.results
    let p = {} as PublicationItem
    /* let ad = FormatAD(j[0]['AdditionalData']) */
    let ad = FormatAD(j[0]['AdditionalInfo'])
    let rurl = String(j[0]['File']['ServerRelativeUrl'])
    p.Id = j[0]['Id']
    p.DocID = j[0]['DocID']
    p.Title = j[0]['Title']
    p.value = j[0]['Title']
    p.text = j[0]['Title']
    p.Name = j[0]['File']['Name']
    p.RelativeURL = rurl
    p.IsNato = IsNato
    p.IsFXP = j[0]['Prfx'] === 'FXP' ? 'Yes' : 'No'
    p.IsTacMemo = j[0]['Prfx'] === 'TACMEMO' || j[0]['Prfx'] === 'TACBUL' || j[0]['Prfx'] === 'TACAID' || j[0]['Prfx'] === 'TACNOTE' ? 'Yes' : 'No'
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
    p.statuscomments = j[0]['statuscomments']
    p.Replaces = j[0]['Replaces']
    p.Bookshelf = j[0]['Bookshelf']
    p.Tags = j[0]['Tags']
    p.Development = j[0]['Development'] === null ? development : FormatDevelopment(j[0]['Development'])
    p.AdditionalData = ad
    p.etag = j[0]['__metadata']['etag']
    p.uri = j[0]['__metadata']['uri']
    p.type = j[0]['__metadata']['type']
    this.context.commit('updatePublication', p)
    return true
  }

  @Action
  public updateActivePub(pub: PublicationItem) {
    this.context.commit('updatePublication', pub)
  }

  @Action
  public async updatePublicationById(): Promise<boolean> {
    // update the publication data
    const that = this
    this.context.commit('updateSavingPub', true)
    this.context.commit('updateDirty', true)
    let Id = router.currentRoute.params.Id
    let IsNato = router.currentRoute.params.IsNato
    let IsArchive = router.currentRoute.params.IsArchive
    let url = ''
    if (IsNato === 'Yes') {
      if (IsArchive === 'true') {
        url += this.updateArchivedNatoPubUrl + Id + ')'
      } else {
        url += this.updateNatoPubUrl + Id + ')'
      }
    } else {
      if (IsArchive === 'true') {
        url += this.updateArchivedPubUrl + Id + ')'
      } else {
        url += this.updatePubUrl + Id + ')'
      }
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

    // update using the activepub data
    let itemprops = {
      __metadata: { type: this.activepub.type },
      Title: this.activepub.Title,
      Availability: this.activepub.Availability,
      BranchTitle: this.activepub.Branch,
      Class: this.activepub.Class,
      CoordinatingRA: this.activepub.CoordinatingRA,
      Distribution: this.activepub.DTIC,
      LibrarianRemarks: this.activepub.LibrarianRemarks,
      LongTitle: this.activepub.LongTitle,
      Media: {
        __metdata: { type: 'Collection(Edm.String)' },
        results: [this.activepub.Media]
      },
      NSN: this.activepub.NSN,
      NWDCAOId: this.activepub.NWDCAO !== undefined ? this.activepub.NWDCAO['Id'] : '',
      PrimaryReviewAuthority: this.activepub.PRA,
      PRAPOC: this.activepub.PRAPOC,
      Prfx: this.activepub.Prfx,
      PubID: this.activepub.PubID,
      Resourced: this.activepub.Resourced === 'Yes' ? true : false,
      ReviewDate: new Date(String(this.activepub.ReviewDate)).toISOString(),
      statuscomments: this.activepub.statuscomments,
      Replaces: this.activepub.Replaces,
      Bookshelf: this.activepub.Bookshelf,
      Tags: this.activepub.Tags,
      InDevelopment: this.activepub.InDevelopment,
      Development: JSON.stringify(this.activepub.Development),
      /* AdditionalData: JSON.stringify(this.activepub.AdditionalData) */
      AdditionalInfo: JSON.stringify(this.activepub.AdditionalData)
    }

    try {
      console.log('UPDATING PUB WITH DATA: ' + url)
      console.log('UPDATING PUB WITH DATA: ' + itemprops)
      await axios.post(url, itemprops, config).then(() => {
        that.context.commit('updatePubsForUser')
      })
    } catch (e) {
      // don't care yet
    }
    return true
  }

  @Action
  public async getComments(): Promise<boolean> {
    let DocID = router.currentRoute.params.DocID
    let p: Array<ObjectItem> = []
    let url = tp1 + slash + slash + tp2 + this.commentsUrl + "&$filter=(DocID eq '" + DocID + "')"
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    // console.log('GET COMMENTS RESPONSE: ' + JSON.stringify(response))
    let j = response.data.d.results
    for (let i = 0; i < j.length; i++) {
      p.push({
        text: j[i]['Title'],
        value: new Date(j[i]['Created']).toLocaleDateString() + ' : ' + j[i]['Author']['Title'] + ' -> ' + j[i]['OData__Comments']
      })
    }
    this.context.commit('createComments', p)
    return true
  }

  @Action async addComment(comment: any): Promise<boolean> {
    // add comment
    const that = this
    let DocID = router.currentRoute.params.DocID
    let url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('Comments')/items"
    let ao = this.activepub.NWDCAO.Email
    if (ao === undefined || ao === '') {
      ao = 'NWDC_NRFK_FLEETPUBS@navy.mil'
      // ao = 'daniel.r.walker3.ctr@navy.mil'
    }

    const headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': this.digest,
      'X-HTTP-Method': 'POST'
    }
    let pconfig = {
      headers: headers
    }
    let itemprops = {
      __metadata: { type: 'SP.Data.CommentsListItem' },
      Title: this.activepub.Title,
      DocID: DocID,
      Email: ao,
      OData__Comments: comment
    }

    try {
      let response = await axios.post(url, itemprops, pconfig)
      this.getComments()
    } catch (e) {
      // don't care yet
    }
    return true
  }

  @Action
  public async getSupportingDocs(): Promise<boolean> {
    let DocID = router.currentRoute.params.DocID
    let IsNato = router.currentRoute.params.IsNato
    let ShowHidden = router.currentRoute.params.ShowHidden
    let p: Array<SupportingDocItem> = []
    let url = tp1 + slash + slash + tp2
    if (IsNato === 'Yes') {
      url += this.supportingDocumentNatoUrl
      url += "&$filter=(DocID eq '" + DocID + "')"
    } else {
      url += this.supportingDocumentUrl
      url += "&$filter=(DocID eq '" + DocID + "')"
    }
    if (ShowHidden === 'false') {
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
        IsNato: IsNato,
        Hidden: j[i]['Hidden'] === true ? 'Yes' : 'No',
        type: j[i]['__metadata']['type']
      })
    }
    this.context.commit('createSupportingDocs', p)
    return true
  }

  @Action
  public async getBranches(): Promise<boolean> {
    const url = tp1 + slash + slash + tp2 + this.branchUrl
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
        _showDetails: false,
        props: {
          count: 0
        }
      })
    }
    this.context.commit('createBranches', p)
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
  public async getPrefixesForUser(): Promise<boolean> {
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
            text: j[i]['Title'],
            branch: j[i]['Family']['Title']
          })
        }
        that.context.commit('createPrefixesForUser', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.prefixesforuserUrl
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
    console.log('getFunctionalSeriesByBranch ' + branch)
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
            _showDetails: false
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
  public async returnFunctionalSeriesByBranch(branch: string): Promise<GroupItem> {
    console.log('getFunctionalSeriesByBranch ' + branch)
    let j: any[] = []
    const that = this
    async function getAllSeries(url: string, branch: string): Promise<GroupItem> {
      let p: Array<GroupItem> = []
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllSeries(url, branch)
      } else {
        for (let i = 0; i < j.length; i++) {
          p.push({
            type: 'Series',
            text: j[i]['Title'],
            children: [],
            items: []
          })
        }
        let results: any = {}
        results.text = branch
        results.type = 'Series'
        results.children = p
        return results
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.functionalseriesUrl
    turl += branch
    turl += "')&$orderby=Title"
    let response = await getAllSeries(turl, branch)
    return response
  }

  @Action
  public async getFunctionalFieldByFunctionalSeries(series: string): Promise<boolean> {
    console.log('getFunctionalFieldByFunctionalSeries ' + series)
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
            text: j[i]['funcField'],
            _showDetails: false
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
  public async returnFunctionalFieldByFunctionalSeries(series: string): Promise<GroupItem> {
    console.log('getFunctionalFieldByFunctionalSeries ' + series)
    let j: any[] = []
    let p: Array<GroupItem> = []
    const that = this
    async function getAllFields(url: string, series: string): Promise<GroupItem> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllFields(url, series)
      } else {
        for (let i = 0; i < j.length; i++) {
          p.push({
            type: 'Field',
            text: j[i]['funcField'],
            children: [],
            items: []
          })
        }
        let results: any = {}
        results.text = series
        results.type = 'Series'
        results.children = p
        return results
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.functionalfieldsUrl
    turl += series
    turl += "')"
    let response = await getAllFields(turl, series)
    return response
  }

  @Action
  public async returnFunctionalSeries(): Promise<GroupItem> {
    console.log('returnFunctionalSeries')
    let j: any[] = []
    let p: Array<GroupItem> = []
    const that = this
    async function getAllFields(url: string): Promise<GroupItem> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllFields(url)
      } else {
        for (let i = 0; i < j.length; i++) {
          p.push({
            type: 'Series',
            text: j[i]['Title'],
            children: [],
            items: []
          })
        }
        let results: any = {}
        results.type = 'Series'
        results.children = p
        return results
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.functionalseriesAllUrl
    let response = await getAllFields(turl)
    return response
  }

  @Action
  public async returnFunctionalFields(): Promise<GroupItem> {
    console.log('returnFunctionalFields')
    let j: any[] = []
    let p: Array<GroupItem> = []
    const that = this
    async function getAllFields(url: string): Promise<GroupItem> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllFields(url)
      } else {
        for (let i = 0; i < j.length; i++) {
          p.push({
            type: 'Field',
            text: j[i]['funcField'],
            children: [],
            items: []
          })
        }
        let results: any = {}
        results.type = 'Fields'
        results.children = p
        return results
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.functionalfieldsAllUrl
    let response = await getAllFields(turl)
    return response
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
  public async requestApproval(): Promise<boolean> {
    // build url to post and update. return true to resolve the promise
    const url = tp1 + slash + slash + tp2 + "/_api/web/getfilebyserverrelativeurl('" + this.activepub.RelativeURL + "')/publish(comment='')"
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
  public async approvePublication(): Promise<boolean> {
    // build url to post and update. return true to resolve the promise
    const url = tp1 + slash + slash + tp2 + "/_api/web/getfilebyserverrelativeurl('" + this.activepub.RelativeURL + "')/approve(comment='')"
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
  public async archivePublication(data: any): Promise<boolean> {
    // build url to post and update. return true to resolve the promise
    // console.log('archivePublication: ' + JSON.stringify(data))
    let url = ''
    if (data.nato === 'Yes') {
      url = this.updateNatoPubUrl + data.id + ')'
    } else {
      url = this.updatePubUrl + data.id + ')'
    }
    console.log('ARCHIVE URL: ' + url + ', type: ' + data.item.AdditionalData.Status)
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
      Archive: data.item.AdditionalData.Status,
      /* AdditionalData: JSON.stringify(this.activepub.AdditionalData) */
      AdditionalInfo: JSON.stringify(this.activepub.AdditionalData)
    }
    try {
      await axios.post(url, itemprops, config)
    } catch (e) {
      // don't care yet
      console.log('ERROR ARCHIVING: ' + e)
    }
    return true
  }

  @Action
  public async togglePubInDev(data: any): Promise<boolean> {
    // build url to post and update. return true to resolve the promise
    console.log('togglePubInDev: ' + JSON.stringify(data))
    let url = ''
    if (data.IsNato === 'Yes') {
      url = this.updateNatoPubUrl + data.Id + ')'
    } else {
      url = this.updatePubUrl + data.Id + ')'
    }
    console.log('TOGGLE PUB URL: ' + url)
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
      __metadata: { type: data.type },
      InDevelopment: data.InDevelopment
    }
    try {
      await axios.post(url, itemprops, config)
    } catch (e) {
      // don't care yet
    }
    return true
  }
  //#endregion
}
export default Publication
