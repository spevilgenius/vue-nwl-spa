<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-overlay :show="!viewReady" :variant="overlayVariant" class="contentHeight">
          <b-table id="SearchTable" striped hover :items="items" :fields="fields" :per-page="perPage" :current-page="currentPage">
            <!--<template #table-caption>Search Results For.</template>-->
            <template #cell(Name)="data">
              <b-container fluid v-if="data.item.FileExtension === 'docx' || data.item.FileExtension === 'doc'">
                <b-row no-gutters>
                  <b-col cols="1">
                    <div style="width: 16px; height: 16px">
                      <img
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPldvcmRfMTZ4PC90aXRsZT48cGF0aCBkPSJNMTYsNFYxYTEsMSwwLDAsMC0xLTFINEExLDEsMCwwLDAsMywxVjRMOS41LDUuMzc5WiIgZmlsbD0iIzQxYTVlZSIvPjxwb2x5Z29uIHBvaW50cz0iMTUuOTk5IDQgMi45OTkgNCAyLjk5OSA4IDkuNSA5LjE2OCAxNS45OTkgOCAxNS45OTkgNCIgZmlsbD0iIzJiN2NkMyIvPjxwb2x5Z29uIHBvaW50cz0iMTYgOCAzIDggMyAxMiA5LjQ5OSAxMyAxNiAxMiAxNiA4IiBmaWxsPSIjMTg1YWJkIi8+PHBhdGggZD0iTTMsMTJ2M2ExLDEsMCwwLDAsMSwxSDE1YTEsMSwwLDAsMCwxLTFWMTJaIiBmaWxsPSIjMTAzZjkxIi8+PHBhdGggZD0iTTEwLDQsMyw0LDMsMTRIOWEyLDIsMCwwLDAsMi0yVjVBMSwxLDAsMCwwLDEwLDRaIiBvcGFjaXR5PSIwLjUiLz48cmVjdCB5PSIzIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHJ4PSIxIiBmaWxsPSIjMTg1YWJkIi8+PHBhdGggZD0iTTMuMzUyLDkuNTRjLjAxNy4xNDIuMDI5LjI2Ni4wMzQuMzcyaC4wMTljLjAwOC0uMS4wMjMtLjIyMi4wNDYtLjM2NHMuMDQ0LS4yNjIuMDY1LS4zNkw0LjQyOSw1SDUuNjFsLjk0NSw0LjEyNmE2LjI2Nyw2LjI2NywwLDAsMSwuMTE4Ljc3OGguMDE2YTYuMzQ4LDYuMzQ4LDAsMCwxLC4xLS43NTNMNy41NDMsNUg4LjYxOEw3LjMsMTFINi4wMzlsLS45LTMuOTc1Yy0uMDI2LS4xMTQtLjA1Ni0uMjY0LS4wODktLjQ0OHMtLjA1My0uMzE4LS4wNjEtLjRINC45NzJjLS4wMS4xLS4wMy4yNDItLjA2MS40MzVzLS4wNTQuMzM1LS4wNzIuNDI3TDMuOTkyLDExSDIuNzE2TDEuMzgyLDVIMi40NzZMMy4zLDkuMkMzLjMxOCw5LjI4MywzLjMzNSw5LjQsMy4zNTIsOS41NFoiIGZpbGw9IiNmZmYiLz48L3N2Zz4="
                        class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                      />
                    </div>
                  </b-col>
                  <b-col cols="11">
                    <b-link :href="data.item.Path">{{ data.item.Name }}</b-link>
                  </b-col>
                </b-row>
              </b-container>
              <b-container fluid v-if="data.item.FileExtension === 'xls' || data.item.FileExtension === 'xlsx'">
                <b-row no-gutters>
                  <b-col cols="1">
                    <div style="width: 16px; height: 16px">
                      <img
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPkV4Y2VsXzE2eDwvdGl0bGU+PHBhdGggZD0iTTEwLDBINEExLDEsMCwwLDAsMywxVjRsNyw0LDMsMS45NjhMMTYsOFY0WiIgZmlsbD0iIzIxYTM2NiIvPjxwb2x5Z29uIHBvaW50cz0iMTYgOCAzIDggMyAxMiAxMCAxMy40IDE2IDEyIDE2IDgiIGZpbGw9IiMxMDdjNDEiLz48cGF0aCBkPSJNMywxMnYzYTEsMSwwLDAsMCwxLDFIMTVhMSwxLDAsMCwwLDEtMVYxMloiIGZpbGw9IiMxODVjMzciLz48cGF0aCBkPSJNMTAsNEgzVjE0SDlhMiwyLDAsMCwwLDItMlY1QTEsMSwwLDAsMCwxMCw0WiIgb3BhY2l0eT0iMC41Ii8+PHJlY3QgeT0iMyIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiByeD0iMSIgZmlsbD0iIzEwN2M0MSIvPjxwYXRoIGQ9Ik0yLjI5MiwxMSw0LjIzNCw3Ljk5MiwyLjQ1NSw1SDMuODg2bC45NzEsMS45MTJjLjA4OS4xODIuMTUxLjMxNy4xODQuNDA2aC4wMTNxLjEtLjIxNy4yLS40MjNMNi4yOTIsNUg3LjYwNkw1Ljc4Miw3Ljk3NSw3LjY1MiwxMWgtMS40TDUuMTMzLDguOUExLjgwNiwxLjgwNiwwLDAsMSw1LDguNjE5SDQuOTgzYTEuMzQsMS4zNCwwLDAsMS0uMTMuMjcyTDMuNywxMVoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTYsMVY0SDEwVjBoNUExLDEsMCwwLDEsMTYsMVoiIGZpbGw9IiMzM2M0ODEiLz48L3N2Zz4="
                        class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                      />
                    </div>
                  </b-col>
                </b-row>
              </b-container>
              <b-container fluid v-if="data.item.FileExtension === 'pptx' || data.item.FileExtension === 'ppt'">
                <b-row no-gutters>
                  <b-col cols="1">
                    <div style="width: 16px; height: 16px">
                      <img
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPlBvd2VyUG9pbnRfMTZ4PC90aXRsZT48cGF0aCBkPSJNOCwwQTguMDI0LDguMDI0LDAsMCwwLDAsOGwxMCwyLjM2M1oiIGZpbGw9IiNlZDZjNDciLz48cGF0aCBkPSJNOCwwVjhsNCwyLjU5TDE2LDhBOC4wMjQsOC4wMjQsMCwwLDAsOCwwWiIgZmlsbD0iI2ZmOGY2YiIvPjxwYXRoIGQ9Ik0xNiw4QTgsOCwwLDAsMSwwLDhaIiBmaWxsPSIjZDM1MjMwIi8+PHBhdGggZD0iTTEwLDRIMS4wODZBNy45Myw3LjkzLDAsMCwwLDIuNzM1LDE0SDlhMiwyLDAsMCwwLDItMlY1QTEsMSwwLDAsMCwxMCw0WiIgb3BhY2l0eT0iMC41Ii8+PHBhdGggZD0iTTEwLDRIMS4wODZBNy45Myw3LjkzLDAsMCwwLDIuNzM1LDE0SDlhMiwyLDAsMCwwLDItMlY1QTEsMSwwLDAsMCwxMCw0WiIgb3BhY2l0eT0iMC4xIi8+PHJlY3QgeT0iMyIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiByeD0iMSIgZmlsbD0iI2M0M2UxYyIvPjxwYXRoIGQ9Ik01LjMzNiw1QTIuMjc1LDIuMjc1LDAsMCwxLDYuOSw1LjQ4MWExLjc2NiwxLjc2NiwwLDAsMSwuNTQxLDEuMzkzLDIuMDIzLDIuMDIzLDAsMCwxLS4yNjcsMS4wNDIsMS44MzYsMS44MzYsMCwwLDEtLjc2Mi43MSwyLjQ4NCwyLjQ4NCwwLDAsMS0xLjE0NC4yNTNINC4xODJWMTFIMy4wNzJWNVpNNC4xODIsNy45NjJoLjk1NkExLjIsMS4yLDAsMCwwLDUuOTgzLDcuN2ExLjAxMiwxLjAxMiwwLDAsMCwuMjg1LS43NzdxMC0uOTkxLTEuMDk0LS45OTFINC4xODJaIiBmaWxsPSIjZmZmIi8+PC9zdmc+"
                        class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                      />
                    </div>
                  </b-col>
                  <b-col cols="11">
                    <b-link :href="data.item.Path">{{ data.item.Name }}</b-link>
                  </b-col>
                </b-row>
              </b-container>
              <b-container fluid v-if="data.item.FileExtension === 'pdf'">
                <b-row no-gutters>
                  <b-col cols="1">
                    <div style="width: 16px; height: 16px">
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAInSURBVDhPpVM9SytREI2ijdqqlYq2/gDBSqy19Qf4CyzsFMROUBBsLBTRQkSwE0QLazvzZRINSEx8eY/w8r3Z3WSzu+edmU2i4b3uHTjMvXdmzp07OxvCf0IFstksyuWystZswrq/hx2Pw263Ydu20jRN1Go1lEolFAoFZDKZL4F0Oo02gy3LgisHZ2fAyYms+tCNEaFkMqlnKpBKpWAYht7kycHNDXB4KKs+uK6rAvV6XXMEfQJNlu95KgEsLQX2G8Qnl/wlIOX0KugK7O8HlXzD9wr6npBIJPRQe8AgxdUV8P4OnJ8He8IhTbLGiyRHoAJxdlwa02CnW9z7xSKwsQFcXgJ7e8D6OvzlZbQvLtA8Pobx+Ij466ukBgLRaBSVahV1VuAwwGOwx350IY9y6Gvxy1hHR6i8vSH68qI+FQhzU3QcmPx8zvY2bJ5Jue0OW74PmzS4LrNHxUZDcwQq8MT3ZsNh5DgPeQ5Vge8rCtmoEvmbLMRiyDMpx2o/np/xdH39JfAzREP6YgcHYc7Po7KwgMbiIsq0zbk51PmsXgz5S2xXIDcwAI+JztgY3OFhtE5PUXl4gHtwAGd3F9bdHapra/BGRuCMjsJj/CfZE8h3VLv0t7bUOpwFY2cH2NwMfENDvRitWgSkw7crK4hNTiIyNRVwfByR2VlEJiYQJcVGZmYC3/S0xt6urup/E/LZ3R+cgQ/OQJafSinrf7Hjl1jJ8X0ffwD6zWt+lsTfRwAAAABJRU5ErkJggg=="
                        class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                      />
                    </div>
                  </b-col>
                  <b-col cols="11">
                    <b-link :href="data.item.Path">{{ data.item.Name }}</b-link>
                  </b-col>
                </b-row>
              </b-container>
              <b-container fluid v-if="data.item.FileExtension === 'txt'">
                <b-row no-gutters>
                  <b-col cols="1">
                    <div style="width: 16px; height: 16px">
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACKUlEQVR42n3TXUiTURgH8P+7D3MfOmwy9pU4J8LUVokXQSAEUSCklUqfiAtt5EVXFQQhIkFQXXVhLKWJJBVqpYEQBUERdCEadnRg6Ybti2GTtc0t3+09vRvJ2nvxPpwHznme8/w4N4dBIQx8Xq621Dh93vV3BoPxYDQaDfM1ulerNYaCgQVLjfW4d33Nxdee8BnKDTH/huXYV+ux37pvvWDR4VOSwwG1HN54GpRSWMsV+Jpg0aKUYMIXwdLdG2v4+cPGz7G7gA1d/SuBkXv4trCIWksVfm3FwOS6NL+grdDgu3cD9qZDMPXdBCaH6/myZxdoQOdVspEH5mGz1SMYCECtVuebiUQCRpMJHs8K9jc1oyoHTD1q5FvLBeCMk6yOPoCcchALlpGgrvc68NJVDDDtvST49CFKJYwokOYojJeugc6MCoCTDhJ+NgyFTCIKpDIc9Of7Qd+4BUBrN/G/cEEll4oCSTYL81kn6Nx4MSA5cZH4p0agKpGLAzsszJ194N5OCIBj50jotRtle8SB+B8WhlMOcO+fC4CjXSQ4M4ZyZako8Hs7DWN7D7gPk8WAtOU0IdNuaJQKUSC2nUJjhwPZj68EwJE24p0dR6WmTBTYjMVhaetG9vNsMSA73EqWpsegr6wQBcKbW7B39CDzZa4I0EnrmgO3B4dkDWYdCn9MGBTL/gjuDA5ksqvzJr4Q+f/mFYm+eoApUajEXkB3Ukku7Bvit49z579vfdIRFQuqxwAAAABJRU5ErkJggg=="
                        class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                      />
                    </div>
                  </b-col>
                  <b-col cols="11">
                    <b-link :href="data.item.Path">{{ data.item.Name }}</b-link>
                  </b-col>
                </b-row>
              </b-container>
              <b-container fluid v-if="data.item.FileExtension === 'aspx'">
                <b-row no-gutters>
                  <b-col cols="1">
                    <div style="width: 16px; height: 16px">
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACKUlEQVR42n3TXUiTURgH8P+7D3MfOmwy9pU4J8LUVokXQSAEUSCklUqfiAtt5EVXFQQhIkFQXXVhLKWJJBVqpYEQBUERdCEadnRg6Ybti2GTtc0t3+09vRvJ2nvxPpwHznme8/w4N4dBIQx8Xq621Dh93vV3BoPxYDQaDfM1ulerNYaCgQVLjfW4d33Nxdee8BnKDTH/huXYV+ux37pvvWDR4VOSwwG1HN54GpRSWMsV+Jpg0aKUYMIXwdLdG2v4+cPGz7G7gA1d/SuBkXv4trCIWksVfm3FwOS6NL+grdDgu3cD9qZDMPXdBCaH6/myZxdoQOdVspEH5mGz1SMYCECtVuebiUQCRpMJHs8K9jc1oyoHTD1q5FvLBeCMk6yOPoCcchALlpGgrvc68NJVDDDtvST49CFKJYwokOYojJeugc6MCoCTDhJ+NgyFTCIKpDIc9Of7Qd+4BUBrN/G/cEEll4oCSTYL81kn6Nx4MSA5cZH4p0agKpGLAzsszJ194N5OCIBj50jotRtle8SB+B8WhlMOcO+fC4CjXSQ4M4ZyZako8Hs7DWN7D7gPk8WAtOU0IdNuaJQKUSC2nUJjhwPZj68EwJE24p0dR6WmTBTYjMVhaetG9vNsMSA73EqWpsegr6wQBcKbW7B39CDzZa4I0EnrmgO3B4dkDWYdCn9MGBTL/gjuDA5ksqvzJr4Q+f/mFYm+eoApUajEXkB3Ukku7Bvit49z579vfdIRFQuqxwAAAABJRU5ErkJggg=="
                        class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                      />
                    </div>
                  </b-col>
                  <b-col cols="11">
                    <b-link :href="data.item.Path">{{ data.item.Name }}</b-link>
                  </b-col>
                </b-row>
              </b-container>
            </template>
          </b-table>
        </b-overlay>
      </b-col>
    </b-row>
    <b-row no-gutters style="height: 50px" class="mb-7">
      <b-col cols="3">
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="my-0 p-0"></b-pagination>
      </b-col>
      <b-col cols="7">
        <div id="count" style="width: 300px; height: 38px; margin: 0px 0px 0px -1px; padding: 8px 12px; border: 3px black; color: white">{{ totalRows }} Items Found</div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { SearchItem } from '@/interfaces/SearchItem'
import { Route } from 'vue-router'
import { namespace } from 'vuex-class'
import { UserInt } from '../../interfaces/User'
import { PublicationItem } from '../../interfaces/PublicationItem'

const users = namespace('users')
const publication = namespace('publication')

@Component({
  name: 'Results'
})
export default class Results extends Vue {
  @Prop() query: any

  overlayText = 'Getting Results. Please wait...'
  overlayVariant = 'loading'
  totalRows = 0
  perPage = 10
  currentPage = 1
  interval!: any
  results: Array<SearchItem> = []
  viewReady?: boolean = false
  items: Array<SearchItem> = []

  fields = [
    //{ key: 'Rank', label: 'Rank', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 1 },
    //{ key: 'DocID', label: 'DocId', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 3 },
    //{ key: 'Title', label: 'Document Title', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 1 },
    { key: 'Name', label: 'Document Name', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 1 },
    //{ key: 'Path', label: 'Path', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 2 }
    { key: 'FileExtension', label: 'Ext', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 2 }
    //{ key: 'IsDoc', label: 'IsDoc', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 3 }
    //{ key: 'Description', label: 'Description', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 2 }
    //{ key: 'Library', label: 'Library', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 2 }
  ]

  @users.State
  public currentUser!: UserInt

  @publication.State
  public searchitems!: Array<SearchItem>

  @publication.State
  public searchitemsloaded!: boolean

  @publication.Action
  public searchAllPublications!: (data: any) => Promise<boolean>

  @publication.Action
  searchAllPubs!: (data: any) => Promise<string>

  @publication.Action
  public setSearchItemsLoaded!: (loaded: boolean) => void

  mounted() {
    const that = this
    this.$nextTick(function () {
      console.log('MOUNTED QUERY: ' + this.query)
      let data: any = {}
      data.k = this.query
      this.searchAllPublications(data)
      this.interval = setInterval(this.waitForIt, 500)
    })
  }

  public waitForIt() {
    if (this.searchitemsloaded === true) {
      clearInterval(this.interval)
      //console.log('-----------ALL SEARCH ITEMS-----------------')
      //console.log(this.searchitems)
      // add functions to filter here and set this.items to filtered values
      /* let path: any
      for (let i = 0; i < this.searchitems.length; i++) {
        if (this.searchitems[i].Library === 'ActivePublications' || this.searchitems[i].Library === 'ArchivePublications' || this.searchitems[i].Library === 'NATOPublications' || this.searchitems[i].Library === 'NATOArchive') {
          path = this.searchitems[i].Path
          if (path.indexOf('NATO') > 0 || path.indexOf('NATOPublications') > 0 || path.indexOf('NATOArchives') > 0) {
            if (this.currentUser.isNATOApprover === true || this.currentUser.isNATOLibrarian === true || this.currentUser.isNATOVisitor === true) {
              //console.log('-----------NATO------------------')
              //console.log(path)
              this.items.push({
                Rank: this.searchitems[i].Rank,
                DocId: this.searchitems[i].DocId,
                Title: this.searchitems[i].Title,
                Path: path,
                Description: this.searchitems[i].Description,
                FileExtension: this.searchitems[i].FileExtension,
                HitHighlights: this.searchitems[i].HitHighlights,
                IsDoc: this.searchitems[i].IsDoc,
                Name: this.searchitems[i].Name,
                Library: this.searchitems[i].Library,
                DocID: ''
              })
            }
          } else {
            //console.log('-----------NOT NATO------------------')
            //console.log(path)
            this.items.push({
              Rank: this.searchitems[i].Rank,
              DocId: this.searchitems[i].DocId,
              Title: this.searchitems[i].Title,
              Path: path,
              Description: this.searchitems[i].Description,
              FileExtension: this.searchitems[i].FileExtension,
              HitHighlights: this.searchitems[i].HitHighlights,
              IsDoc: this.searchitems[i].IsDoc,
              Name: this.searchitems[i].Name,
              Library: this.searchitems[i].Library,
              DocID: ''
            })
          }
        }
      } */
      console.log('-----------ALL FILTERED ITEMS-----------------')
      console.log(this.items)
      this.totalRows = this.items.length
      this.viewReady = true
    }
  }

  @Watch('$route')
  onRouteChanged(val: Route) {
    // do something if the route meta changes
    console.log('ROUTE CHANGED FROM RESULTS COMPONENT: ' + this.query)
    this.viewReady = false
    this.setSearchItemsLoaded(false)
    let data: any = {}
    data.k = this.query
    this.searchAllPublications(data)
    this.items = [{}]
    this.interval = setInterval(this.waitForIt, 500)
  }
}
</script>
