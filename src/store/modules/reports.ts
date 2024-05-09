import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { ReportItem } from '@/interfaces/ReportItem'
import { UniqueUserReportItem } from '@/interfaces/ReportItem'
import { PubsInDevPhaseItem } from '@/interfaces/ReportItem'
import axios from 'axios'
import lodash, { lastIndexOf } from 'lodash'
import _ from 'lodash'

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

function formatDate(date: any): any {
  let stripDate = date.substr(0, date.indexOf('T'))

  let dateString = stripDate.split('-')

  return dateString[1] + '-' + dateString[2] + '-' + dateString[0]
}

@Module({ namespaced: true })
class ReportsTS extends VuexModule {
  public topPubsReportResults: Array<ReportItem> = []
  public topNatoPubsReportResults: Array<ReportItem> = []
  public topTenPubsResults: Array<ReportItem> = []
  public uniqueUserResults: Array<UniqueUserReportItem> = []
  public pubsInDevPhaseResults: Array<PubsInDevPhaseItem> = []
  public pubsPostedReportItems: Array<ReportItem> = []

  public topPubsReportloaded?: boolean = false
  public topNatoPubsReportloaded?: boolean = false
  public topTenPubsLoaded?: boolean = false
  public uniqueUsersLoaded?: boolean = false
  public pubsInDevPhaseLoaded?: boolean = false
  public postedItemsLoaded?: boolean = false

  uniqueUsersUrl =
    '/_api/search/query?querytext=%27Path:https://doctrine.navy.mil%27&selectproperties=%27Title,ViewsLast1DaysUniqueUsers,ViewsLast2DaysUniqueUsers,ViewsLast3DaysUniqueUsers,ViewsLast4DaysUniqueUsers,ViewsLast5DaysUniqueUsers,ViewsLast6DaysUniqueUsers,ViewsLast7DaysUniqueUsers,ViewsRecentUniqueUsers,ViewsLastMonths1Unique,ViewsLastMonths2Unique,ViewsLastMonths3Unique,ViewsLifetimeUniqueUsers,Path%27&orderBy=ViewsRecent:descending&trimDuplicates=false&rowlimit=20%27'
  topPubsUrl =
    '/_api/search/query?querytext=%27ListId:%7BDA118610-D260-4F2E-9103-24960CA55501%7D%27&selectproperties=%27Title,Author,Path,PrfxOWSTEXT,DocIDOWSTEXT,ListID,ListItemID,FileExtension,contentclass,ViewsLifeTime,ViewsRecent,IsDocument,LastModifiedTime,WebTemplate,RenderTemplateId%27&rowlimit=%27100%27&sortlist=%27ViewsRecent:descending%27'
  topNatoPubsUrl =
    '/_api/search/query?querytext=%27ListId:%7BEB078B7C-42C3-42E5-9C94-451F04F27807%7D%27&selectproperties=%27Title,Author,Path,PrfxOWSTEXT,DocIDOWSTEXT,ListID,ListItemID,FileExtension,contentclass,ViewsLifeTime,ViewsRecent,IsDocument,LastModifiedTime,WebTemplate,RenderTemplateId%27&rowlimit=%27100%27&sortlist=%27ViewsRecent:descending%27'
  devpubsforuserUrl = "/_api/lists/getbytitle('ActivePublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title&$filter=(InDevelopment eq 'Yes')"
  devnatopubsforuserUrl = "/_api/lists/getbytitle('NATOPublications')/items?$select=*,File/Name,File/ServerRelativeUrl,NWDCAO/Title,NWDCAO/Id,NWDCAO/EMail&$expand=File,NWDCAO&$orderby=Title&$filter=(InDevelopment eq 'Yes')"
  pubsPostedUrl = "/_api/lists/getbytitle('ActivePublications')/items?$select=*&$"
  natoPubsPostedUrl = "/_api/lists/getbytitle('NatoPublications')/items?$select=*&$"

  //displays on the home page
  @Mutation
  public createTopTenResults(items: Array<ReportItem>): void {
    this.topTenPubsResults = items
    this.topTenPubsLoaded = true
    // console.log('Top Ten Pubs length: ' + items.length)
  }

  @Action
  public async getTopTenPubsResults(): Promise<boolean> {
    console.log(' GET TOP TEN PUBS REPORT RESULTS')
    let j: any[] = []
    let p: Array<ReportItem> = []
    const that = this
    async function getTopTenResults(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      const topTenCountMax = 10
      let i = 0
      j = response.data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getTopTenResults(url)
      } else {
        //not all pubs have the GUID Id needed to render in pub view page so test if one exists.
        //Need 10 pubs to meet the top 10 requirements so use a condition in the While loop until there is 10
        //in the event a pub doesn't have the required GUID Id.
        //This also ensures there is only 10
        while (p.length < topTenCountMax) {
          if (String(j[i].Cells.results[6].Value).length > 20) {
            if (j[i].Cells.results[2].Value.lastIndexOf('smil.mil') <= 0) {
              p.push({
                ID: j[i].Cells.results[8].Value, //this is the list item id
                DocId: j[i].Cells.results[6].Value, //this is managed property 'DocIDOWSTEXT', the GUID Id need to render in pub view page
                Title: j[i].Cells.results[2].Value,
                Author: j[i].Cells.results[3].Value,
                Name: String(j[i].Cells.results[4].Value.substr(j[i].Cells.results[4].Value.lastIndexOf('/') + 1)), //this parses the path to get the name which is after the last '/'
                Path: j[i].Cells.results[4].Value,
                FileExtension: j[i].Cells.results[9].Value,
                IsDoc: j[i].Cells.results[13].Value,
                Prefix: j[i].Cells.results[5].Value, //this is managed property 'PrfxOWSTEXT'
                ListId: j[i].Cells.results[7].Value,
                ListItemID: j[i].Cells.results[8].Value,
                ViewsRecent: j[i].Cells.results[12].Value,
                ViewsLifeTime: j[i].Cells.results[11].Value
              })
            }
          }
          i++ //increment i to the next list item
        }
        that.context.commit('createTopTenResults', p)
      }
    }

    let turl = tp1 + slash + slash + tp2 + this.topPubsUrl
    // console.log('url: ' + turl)
    getTopTenResults(turl)
    // console.log(p)
    return true
  }
  //-----------------------------------------------populates most popular reports -----------------------------------------------

  //-------------------------------------------------------------------------------------------------------------------------------
  //Top pub report
  @Mutation
  public createTopPubsResults(items: Array<ReportItem>): void {
    this.topPubsReportResults = items
    this.topPubsReportloaded = true
    // console.log('Top Pubs Reports length: ' + items.length)
  }
  @Action
  public async getTopPubsResults(): Promise<boolean> {
    console.log(' GET TOP PUBS REPORT RESULTS')
    let j: any[] = []
    let p: Array<ReportItem> = []
    const that = this
    async function getTopReportResults(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })

      let count = 0
      //let i = 0
      j = response.data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getTopReportResults(url)
      } else {
        // console.log(j)
        //not all pubs have the GUID Id needed to render in pub view page so test if one exists.
        //Need 10 pubs to meet the top 10 requirements so use a condition in the While loop until there is 10
        //in the event a pub doesn't have the required GUID Id.
        //This also ensures there is only 10
        for (let i = 0; i < j.length; i++) {
          if (String(j[i].Cells.results[6].Value).length > 20 && j[i].Cells.results[13].Value === 'true') {
            count++
            p.push({
              //ID: j[i].Cells.results[8].Value, //this is the list item id
              ID: count, //this is the list item id

              //DocId: j[i].Cells.results[6].Value, //this is managed property 'DocIDOWSTEXT', the GUID Id need to render in pub view page
              Title: j[i].Cells.results[2].Value,
              //Author: j[i].Cells.results[3].Value,
              Name: String(j[i].Cells.results[4].Value.substr(j[i].Cells.results[4].Value.lastIndexOf('/') + 1)), //this parses the path to get the name which is after the last '/'
              //Path: j[i].Cells.results[4].Value,
              //FileExtension: j[i].Cells.results[9].Value,
              //IsDoc: j[i].Cells.results[13].Value,
              //Prefix: j[i].Cells.results[5].Value, //this is managed property 'PrfxOWSTEXT'
              //ListId: j[i].Cells.results[7].Value,
              ListItemID: j[i].Cells.results[8].Value,
              ViewsRecent: j[i].Cells.results[12].Value,
              ViewsLifeTime: j[i].Cells.results[11].Value
            })
          }
          //i++ //increment i to the next list item
        }

        that.context.commit('createTopPubsResults', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.topPubsUrl
    // console.log('url: ' + turl)
    getTopReportResults(turl)
    // console.log('-------- getTopPubsResults P ------------')
    // console.log(p)
    return true
  }

  //-----------------------------------------------populates most popular NATO reports -----------------------------------------------

  //-------------------------------------------------------------------------------------------------------------------------------
  //Top pub report
  @Mutation
  public createTopNatoPubsResults(items: Array<ReportItem>): void {
    this.topNatoPubsReportResults = items
    this.topNatoPubsReportloaded = true
    // console.log('Top Nato Pubs Reports length: ' + items.length)
  }
  @Action
  public async getTopNatoPubsResults(): Promise<boolean> {
    console.log(' GET TOP PUBS REPORT RESULTS')
    let j: any[] = []
    let p: Array<ReportItem> = []
    const that = this
    async function getTopNatoReportResults(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })

      let count = 0
      //let i = 0
      j = response.data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getTopNatoReportResults(url)
      } else {
        // console.log(j)
        //not all pubs have the GUID Id needed to render in pub view page so test if one exists.
        //Need 10 pubs to meet the top 10 requirements so use a condition in the While loop until there is 10
        //in the event a pub doesn't have the required GUID Id.
        //This also ensures there is only 10
        for (let i = 0; i < j.length; i++) {
          if (String(j[i].Cells.results[6].Value).length > 20 && j[i].Cells.results[13].Value === 'true') {
            count++
            p.push({
              //ID: j[i].Cells.results[8].Value, //this is the list item id
              ID: count, //this is the list item id

              //DocId: j[i].Cells.results[6].Value, //this is managed property 'DocIDOWSTEXT', the GUID Id need to render in pub view page
              Title: j[i].Cells.results[2].Value,
              //Author: j[i].Cells.results[3].Value,
              Name: String(j[i].Cells.results[4].Value.substr(j[i].Cells.results[4].Value.lastIndexOf('/') + 1)), //this parses the path to get the name which is after the last '/'
              //Path: j[i].Cells.results[4].Value,
              //FileExtension: j[i].Cells.results[9].Value,
              //IsDoc: j[i].Cells.results[13].Value,
              //Prefix: j[i].Cells.results[5].Value, //this is managed property 'PrfxOWSTEXT'
              //ListId: j[i].Cells.results[7].Value,
              ListItemID: j[i].Cells.results[8].Value,
              ViewsRecent: j[i].Cells.results[12].Value,
              ViewsLifeTime: j[i].Cells.results[11].Value
            })
          }
          //i++ //increment i to the next list item
        }

        that.context.commit('createTopNatoPubsResults', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.topNatoPubsUrl
    //console.log('Natiurl: ' + turl)
    getTopNatoReportResults(turl)
    console.log('-------- getTopNatoPubsResults P ------------')
    console.log(p)
    return true
  }

  //-----------------------------------------------populates pubs posted report -----------------------------------------------

  //-------------------------------------------------------------------------------------------------------------------------------
  //pubs posted

  @Mutation
  public createPubsPostedResults(data: any): void {
    console.log('--------------------------------------DATA---------------------------------------')
    console.log(data)
    //console.log(data)
    this.pubsPostedReportItems = data.pubs
    this.postedItemsLoaded = data.loaded
  }

  @Action({ rawError: true })
  public async getPubsPostedResults(data: any): Promise<boolean> {
    let j: any[] = []
    let p: Array<ReportItem> = []
    let d: any = {}
    d.pubs = p
    d.loaded = false
    //this.context.commit('createPubsPostedResults', d) // clear search items
    const that = this

    async function getPubsPosted(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      //console.log('GET PUBS POSTED REPORT RESULTS')
      let p: any = []
      j = response.data.d.results
      //console.log(j)

      for (let i = 0; i < j.length; i++) {
        if (j[i]['Title'] != null) {
          p.push({
            ID: j[i]['ID'], //this is the list item id
            Title: j[i]['Title'],
            DateCreated: formatDate(j[i]['Created'])
          })
        }
      }

      if (p.length > 0) {
        console.log('context here')
        let d: any = {}
        d.pubs = p
        d.loaded = true
        that.context.commit('createPubsPostedResults', d)
      } else {
        console.log('context here again')
        let d: any = {}
        d.pubs = []
        d.loaded = true
        that.context.commit('createPubsPostedResults', d)
      }
      //console.log(d)
    }

    let filter = "filter=(Created%20ge%20datetime'" + data.dateStart + "T00:00:00Z')%20and%20(Created%20le%20datetime'" + data.dateEnd + "T00:00:00Z')&$orderby=Title"

    let turl = ''
    if (data.isNato) {
      turl = tp1 + slash + slash + tp2 + this.natoPubsPostedUrl + filter
    } else {
      turl = tp1 + slash + slash + tp2 + this.pubsPostedUrl + filter
    }
    console.log('url: ' + turl)
    getPubsPosted(turl)
    //console.log('-------- getPubsPostedResults P ------------')
    //console.log(p)
    return true
  }

  //-----------------------------------------------populates unique users report -----------------------------------------------

  //-------------------------------------------------------------------------------------------------------------------------------
  //Unique User report
  @Mutation
  public createUniqueUserResults(items: Array<UniqueUserReportItem>): void {
    this.uniqueUserResults = items
    this.uniqueUsersLoaded = true
    console.log('Unique Users Report length: ' + items.length)
  }
  @Action
  public async getUniqueUserResults(): Promise<boolean> {
    console.log(' GET Unique User REPORT RESULTS')
    let j: any[] = []
    let p: Array<UniqueUserReportItem> = []
    const that = this
    async function getUniqueUserReportResults(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      const recCountMax = 50
      let count = 0
      //let i = 0
      j = response.data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getUniqueUserReportResults(url)
      } else {
        //console.log(j)

        for (let i = 0; i < j.length; i++) {
          if (j[i].Cells.results[1].Value === '18' || j[i].Cells.results[1].Value === '21') {
            count++
            p.push({
              Rank: j[i].Cells.results[0].Value,
              Title: j[i].Cells.results[2].Value,
              ViewsLast1DaysUniqueUsers: j[i].Cells.results[3].Value,
              ViewsLast2DaysUniqueUsers: j[i].Cells.results[4].Value,
              ViewsLast3DaysUniqueUsers: j[i].Cells.results[5].Value,
              ViewsLast4DaysUniqueUsers: j[i].Cells.results[6].Value,
              ViewsLast5DaysUniqueUsers: j[i].Cells.results[7].Value,
              ViewsLast6DaysUniqueUsers: j[i].Cells.results[8].Value,
              ViewsLast7DaysUniqueUsers: j[i].Cells.results[9].Value,
              ViewsRecentUniqueUsers: j[i].Cells.results[10].Value,
              ViewsLastMonths1Unique: j[i].Cells.results[11].Value,
              ViewsLastMonths2Unique: j[i].Cells.results[12].Value,
              ViewsLastMonths3Unique: j[i].Cells.results[13].Value,
              ViewsLifetimeUniqueUsers: j[i].Cells.results[14].Value,
              Path: j[i].Cells.results[15].Value
            })
          }
        }
        //i++ //increment i to the next list item

        that.context.commit('createUniqueUserResults', p)
      }
    }
    let turl = tp1 + slash + slash + tp2 + this.uniqueUsersUrl
    //console.log('url: ' + turl)
    getUniqueUserReportResults(turl)
    // console.log('-------- getUniqueUserResults P ------------')
    // console.log(p)
    return true
  }
}

export default ReportsTS
