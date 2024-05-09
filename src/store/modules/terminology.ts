/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { TerminologyItem } from '@/interfaces/TerminologyItem'
import { ObjectItem } from '@/interfaces/ObjectItem'
import axios from 'axios'

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
class Term extends VuexModule {
  public terms: Array<TerminologyItem> = []
  public termsloaded?: boolean = false
  public termscount?: number
  public currentcount?: number

  // termsUrl = "/_api/lists/getbytitle('bcs_NDLSTerminology')/items?$select=*,Type,Title,Definition,Service&$top=9999999"
  // termsUrl = "https://doctrine.navy.mil/terminology/_api/lists/getbytitle('Terminology')/items?$select=Disposition,TermType,Title,Definition,Service1&$top=9999999&$filter=Disposition eq 'Include'"
  termsUrl = "https://doctrine.navy.mil/terminology/_api/lists/getbytitle('Terminology')/items?$select=Disposition,TermType,Title,Definition,Service1&$filter=Disposition eq 'Include'"
  termsCountUrl = "https://doctrine.navy.mil/terminology/_vti_bin/listdata.svc/Terminology/$count?$filter=(DispositionValue eq 'Include')"

  @Mutation
  public createTerms(items: Array<TerminologyItem>): void {
    this.terms = items
    this.termsloaded = true
    console.log('terms length: ' + items.length)
  }

  @Mutation
  public createTermsCount(count: number) {
    this.termscount = count
  }

  @Mutation
  public updateCurrentCount(count: number) {
    this.currentcount = count
  }

  @Action
  public async getTerms(): Promise<boolean> {
    // get the count of terms first before loading them
    const response = await axios.get(this.termsCountUrl)
    // console.log('GET COUNT RESULT: ' + response)
    this.context.commit('createTermsCount', Number(response.data))
    let j: any[] = []
    let p: Array<TerminologyItem> = []
    const that = this
    async function getAllTerms(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      that.context.commit('updateCurrentCount', j.length)
      console.log('CURRENTCOUNT: ' + that.currentcount)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllTerms(url)
      } else {
        // console.log('getAllTerms Response: ' + j)
        for (let i = 0; i < j.length; i++) {
          p.push({
            Id: j[i]['Id'],
            type: j[i]['TermType'],
            title: j[i]['Title'],
            service: j[i]['Service1']['results'],
            definition: j[i]['Definition']
          })
        }
        that.context.commit('createTerms', p)
      }
    }
    // let turl = tp1 + slash + slash + tp2 + this.termsUrl
    getAllTerms(this.termsUrl)
    return true
  }
}
export default Term
