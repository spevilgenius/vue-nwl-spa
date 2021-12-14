import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { PublicationItem } from '@/interfaces/PublicationItem'
import { ObjectItem } from '@/interfaces/ObjectItem'
import { EventBus } from '../../main'
import axios from 'axios'
import { SupportingDocItem } from '@/interfaces/SupportingDocItem'
import Support from './support'

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

let searchurl = ''
let searchTerm = ''

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
    // this item may already be an object
    if (test.obj === true) {
      return ad
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
class SearchTS extends VuexModule {
  public searchResults: Array<PublicationItem> = []
  public searchloaded?: boolean = false

  searchUrl = '/_api/search/query?querytext=%27' + searchTerm + '%27&properties=%27SourceName:ResultSourceSearch,SourceLevel:SPSiteCollection%27'

  @Mutation
  public createSearchResults(items: Array<PublicationItem>): void {
    this.searchResults = items
    this.searchloaded = true
    console.log('terms length: ' + items.length)
  }

  @Action
  public async getSearchResults(): Promise<boolean> {
    let j: any[] = []
    let p: Array<PublicationItem> = []
    const that = this
    async function getAllSearchResults(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllSearchResults(url)
      } else {
        console.log('getAllSearchResults Response: ' + j)
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
        that.context.commit('createSearchResults', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.searchUrl
    getAllSearchResults(turl)
    return true
  }
}
export default SearchTS
