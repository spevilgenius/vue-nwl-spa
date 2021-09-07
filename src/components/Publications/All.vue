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
import { EventBus } from '../../main'

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

  @publication.Action
  public getAllNatoPublications!: () => Promise<boolean>

  items!: any
  buttons: any = ['Add', 'Edit', 'Export']

  fields: any = [
    { key: 'actions', label: 'Actions', actions: ['View'], tdClass: 'px80', id: 0 },
    { key: 'Prfx', label: 'Prefix', type: 'default', format: 'text', tdClass: 'px70', id: 1 },
    { key: 'PubID', label: 'PubID', type: 'default', format: 'text', tdClass: 'px100', id: 2 },
    /* { key: 'Name', label: 'Name', type: 'default', format: 'text', tdClass: 'px200', id: 3 }, */
    { key: 'Title', label: 'Title', type: 'default', format: 'text', tdClass: 'px500', id: 3 },
    /* { key: 'Name', label: 'Name', type: 'default', format: 'text', id: 3 }, */
    { key: 'AdditionalData.Status', label: 'Status', type: 'default', format: 'text', tdClass: 'px100', id: 4 },
    { key: 'Modified', label: 'Modified', type: 'default', format: 'text', tdClass: 'px100', id: 5 },
    { key: 'Resourced', label: 'Resourced', type: 'default', format: 'text', tdClass: 'px80', id: 6 },
    { key: 'DTIC', label: 'DTIC', type: 'default', format: 'text', tdClass: 'px240', id: 7 },
    /* { key: 'Status', label: 'Status', type: 'default', format: 'text', tdClass: 'px100', id: 8 }, */
    /* { key: 'NWDCAO.Title', label: 'NWDCAO', type: 'default', format: 'text', tdClass: 'px200', id: 9 }, */
    { key: 'Class', label: 'Classification', type: 'default', format: 'text', tdClass: 'px100', id: 10 }
  ]

  created() {
    EventBus.$on('viewItem', id => {
      this.viewPub(id)
    })
  }

  mounted() {
    // let url = "https://test.doctrine.navy.mil/_api/web/lists/getByTitle('Publications')/items?$select=*,Author/Title,File/Name,File/ServerRelativeUrl&$expand=Author,File,File/ListItemAllFields&$filter=(FSObjType ne 1)&$orderby=Title"
    this.getAllPublications().then(response => {
      if (response) {
        /* this.getAllNatoPublications().then(response => {
          if (response) {
            console.log('Publications Loaded')
          }
        }) */
      }
    })
  }
  viewPub(id: string) {
    // alert(id)
    this.$router.push({ name: 'View Publication', query: { Id: id }, params: { Id: id } })
  }
}
</script>
