/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { PocItem } from '@/interfaces/PocItem'
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
class Poc extends VuexModule {
  public pocs: Array<PocItem> = []
  public pocsloaded?: boolean = false

  pocUrl = "/_api/lists/getbytitle('Doctrine POCs')/items?$select=*,Command/PLA,Command/abbr&$expand=Command&$orderby=Title"

  @Mutation
  public createPocs(items: Array<PocItem>): void {
    this.pocs = items
    this.pocsloaded = true
    console.log('pocs length: ' + items.length)
  }

  @Action
  public async getPocs(): Promise<boolean> {
    let j: any[] = []
    let p: Array<PocItem> = []
    const that = this
    async function getAllPocs(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllPocs(url)
      } else {
        // console.log('getAllPocs Response: ' + j)
        for (let i = 0; i < j.length; i++) {
          p.push({
            Id: j[i]['Id'],
            type: j[i]['Type'],
            Firstname: j[i]['FirstName'],
            MI: j[i]['MI'],
            Title: j[i]['Title'],
            Rank: j[i]['Rank'],
            Command: j[i]['Command']['PLA'],
            Code: j[i]['Code'],
            Jobtitle: j[i]['Job_x0020_Title'],
            Phone: j[i]['phone'],
            Email: j[i]['Email']
          })
        }
        that.context.commit('createPocs', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.pocUrl
    getAllPocs(turl)
    return true
  }
}
export default Poc
