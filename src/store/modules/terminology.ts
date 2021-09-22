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

  termsUrl = "/_api/lists/getbytitle('bcs_NDLSTerminology')/items?$select=*,Type,Title,Definition,Service&$top=9999999"

  @Mutation
  public createTerms(items: Array<TerminologyItem>): void {
    this.terms = items
    this.termsloaded = true
    console.log('terms length: ' + items.length)
  }

  @Action
  public async getTerms(): Promise<boolean> {
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
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllTerms(url)
      } else {
        // console.log('getAllTerms Response: ' + j)
        for (let i = 0; i < j.length; i++) {
          p.push({
            Id: j[i]['Id'],
            type: j[i]['Type'],
            title: j[i]['Title'],
            service: j[i]['Service'],
            definition: j[i]['Definition']
          })
        }
        that.context.commit('createTerms', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.termsUrl
    getAllTerms(turl)
    return true
  }
}
export default Term
