<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <dynamic-table
          v-if="pubsloaded"
          :user="currentUser"
          :table="{
            id: tblId,
            primaryKey: primaryKey,
            buttons: buttons,
            fields: fields,
            items: publications,
            overlayText: overlayText,
            overlayVariant: overlayVariant
          }"
          :searchEnabled="true"
        ></dynamic-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../interfaces/User'
import { PublicationItem } from '../../interfaces/PublicationItem'
import DynamicTable from '../Custom/DynamicTable2.vue'

const users = namespace('users')
// const support = namespace('support')
const publication = namespace('publication')

@Component({
  name: 'All',
  components: {
    DynamicTable
  }
})
export default class All extends Vue {
  interval: any
  tblId = 'AllPubs'
  primaryKey = 'docid'
  overlayText = 'Getting Publications. Please wait...'
  overlayVariant = 'danger'
  rowHeight = 0
  pageSize = 20

  @users.State
  public currentUser!: UserInt

  @publication.State
  public pubsloaded!: boolean

  @publication.State
  public publications!: Array<PublicationItem>

  @publication.Action
  public getAllPublications!: () => Promise<boolean>

  items!: any
  buttons: any = ['Add', 'Edit', 'Export']

  fields: any = [
    { key: 'actions', label: 'Actions', actions: ['View'], width: '80', id: 0 },
    { key: 'filetype', label: 'FileType', type: 'default', format: 'extension', width: '40', id: 1 },
    { key: 'docid', label: 'DocId', type: 'default', format: 'text', width: '120', id: 2 },
    { key: 'title', label: 'Name', type: 'default', format: 'text', id: 3 },
    { key: 'prefix', label: 'Prefix', type: 'default', format: 'text', width: '50', id: 4 },
    { key: 'category', label: 'Category', type: 'default', format: 'text', width: '50', id: 5 },
    { key: 'area', label: 'Mission Area', type: 'default', format: 'text', width: '50', id: 6 },
    { key: 'location', label: 'Location', type: 'default', format: 'text', width: '50', id: 7 }
  ]

  mounted() {
    // let url = "https://test.doctrine.navy.mil/_api/web/lists/getByTitle('Publications')/items?$select=*,Author/Title,File/Name,File/ServerRelativeUrl&$expand=Author,File,File/ListItemAllFields&$filter=(FSObjType ne 1)&$orderby=Title"
    this.getAllPublications().then(response => {
      if (response) {
        console.log('Publications Loaded')
        // this.interval = setInterval(this.waitForIt, 500)
      }
    })
  }
}
</script>
