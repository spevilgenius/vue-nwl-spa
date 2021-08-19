<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <!-- <dynamic-table
          v-if="pubsloaded"
          :user="currentUser"
          :table="{
            id: id,
            list: list,
            items: publications,
            headerClass: headerClass,
            buttons: buttons,
            fields: fields,
            isLibrary: isLibrary,
            rowHeight: rowHeight,
            allowPaging: allowPaging,
            pageSize: pageSize,
            height: height,
            width: width
          }"
          :searchEnabled="true"
        ></dynamic-table> -->
        <b-table
          v-model="shownData"
          :id="'table_' + id"
          :ref="'table_' + id"
          :items="getItems"
          :fields="fields"
          :current-page="currentPage"
          no-provider-paging="true"
          no-provider-filtering="true"
          no-provider-sorting="true"
          :per-page="perPage"
          :filter="filter"
          :filter-included-fields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          show-empty
          small
          @filtered="onFiltered"
        ></b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../interfaces/User'
// import { PublicationItem } from '@/interfaces/PublicationItem'
// import DynamicTable from '../Custom/DynamicTable.vue'
import axios from 'axios'

// const publication = namespace('publication')
const users = namespace('users')

@Component({
  name: 'All'
})
export default class All extends Vue {
  @users.State
  public currentUser!: UserInt

  /*  @publication.State
  public publications!: Array<PublicationItem>

  @publication.State
  public pubsloaded!: boolean

  @publication.Action
  public getAllPublications!: () => Promise<boolean> */

  searchPlaceholder!: 'Type to search.'
  items!: []
  selected!: []
  shownData!: []
  headerClass!: 'text-left bg-light-blue'
  fields: any = [
    { key: 'actions', label: 'Select' },
    { key: 'name', label: 'Name' },
    { key: 'author', label: 'Uploaded By' }
  ]
  TotalRows!: 1
  currentPage!: 1
  perPage!: 15
  sortBy!: 'name'
  sortDesc!: false
  sortDirection!: 'asc'
  filter!: null
  filterOn!: []

  /* mounted() {
    this.getAllPublications().then(response => {
      if (response) {
        console.log('Publications Loaded.')
      }
    })
  } */
  public async getItems(ctx) {
    let that = this
    let url = "https://test.doctrine.navy.mil/_api/web/lists/getByTitle('Publications')/items?$select=*,Author/Title,File/Name,File/ServerRelativeUrl&$expand=Author,File,File/ListItemAllFields&$filter=(FSObjType ne 1)"
    let promise = this.getAllItems(url)
    const j = await promise
    // if (console) console.log('RESPONSE: ' + JSON.stringify(j))
    let z: any = []
    for (let i = 0; i < j.length; i++) {
      z.push({
        name: j[i]['File']['Name'],
        id: j[i]['Id'],
        author: j[i]['Author']['Title']
      })
    }
    this.TotalRows = z.length
    return z
  }
  public async getAllItems(iurl) {
    let allItems = []
    async function getAllItems(purl) {
      let response = await axios.get(purl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      let results = response.data.d.results
      allItems = allItems.concat(results)
      // recursively load
      if (response.data.d.__next) {
        purl = response.data.d.__next
        return getAllItems(purl)
      } else {
        return allItems
      }
    }
    return getAllItems(iurl)
  }
  public onFiltered(items) {
    this.TotalRows = items.length
    this.currentPage = 1
  }
}
</script>

<style scoped></style>
