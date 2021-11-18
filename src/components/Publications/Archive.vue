<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <dynamic-table
          v-if="viewReady"
          :kind="archive"
          :user="currentUser"
          :table="{
            id: tblId,
            primaryKey: primaryKey,
            buttons: buttons,
            fields: fields,
            items: filteredpubs,
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
import { NotificationItem } from '../../interfaces/NotificationItem'
import DynamicTable from '../Custom/DynamicTable2.vue'
import { EventBus } from '../../main'

const users = namespace('users')
const publication = namespace('publication')
const notify = namespace('notify')

@Component({
  name: 'Archive',
  components: {
    DynamicTable
  }
})
export default class Archive extends Vue {
  tblId = 'ArchivePubs'
  primaryKey = 'docid'
  overlayText = 'Getting Publications. Please wait...'
  overlayVariant = 'danger'
  rowHeight = 0
  pageSize = 20
  filterField: any
  filterValue: any
  filterType: any
  interval!: any
  filteredpubs: Array<PublicationItem> = []
  Prfx: any
  viewReady?: boolean = false

  @users.State
  public currentUser!: UserInt

  @publication.State
  public allarchivepublications!: Array<PublicationItem>

  @publication.State
  public natoarchivepubsloaded!: boolean

  @publication.State
  public archivepubsloaded!: boolean

  @publication.State
  public allarchivepubsloaded!: boolean

  @notify.Action
  public add!: (notification: NotificationItem) => void

  @publication.Action
  public getArchivePublications!: () => Promise<boolean>

  @publication.Action
  public getNatoArchivePublications!: () => Promise<boolean>

  @publication.Action
  public createAllArchivePubs!: () => Promise<boolean>

  fields: any = [
    { key: 'Prfx', field: 'Prfx', label: 'Prefix', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px100', id: 1, model: '', ops: [] },
    { key: 'PubID', field: 'PubID', label: 'PubID', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px90', id: 2, model: '', ops: [] },
    { key: 'Name', field: 'Name', label: 'Name', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px200', id: 3, model: '', ops: [] },
    { key: 'LongTitle', field: 'LongTitle', label: 'Long Title', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px200', id: 4, model: '', ops: [] },
    { key: 'AdditionalData.Status', field: 'Status', label: 'Status', sortable: true, type: 'AD', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px100', id: 5, model: '', ops: [] },
    { key: 'AdditionalData.Edition', field: 'Edition', label: 'Edition', sortable: true, type: 'AD', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px110', id: 6, model: '', ops: [] },
    { key: 'AdditionalData.PRAAbbrev', field: 'PRAAbbrev', label: 'PRAAbbrev', sortable: true, type: 'AD', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px150', id: 7, model: '', ops: [] },
    /* { key: 'Remarks', label: 'Remarks', sortable: false, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px120', id: 8, model: '', ops: [] }, */
    { key: 'Resourced', field: 'Resourced', label: 'Resourced', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px130', id: 9, model: '', ops: [] },
    { key: 'DTIC', field: 'DTIC', label: 'DTIC', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px120', id: 10, model: '', ops: [] },
    { key: 'AdditionalData.GeneralStatus', field: 'GeneralStatus', label: 'GeneralStatus', sortable: true, type: 'AD', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px140', id: 11, model: '', ops: [] },
    { key: 'NWDCAO.Title', field: 'Title', label: 'NWDC AO', sortable: true, type: 'NWDCAO', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px150', id: 12, model: '', ops: [] },
    { key: 'Class', field: 'GeneralStatus', label: 'Classification', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px200', id: 13, model: '', ops: [] }
  ]

  created() {
    EventBus.$on('viewItem', args => {
      this.viewPub(args)
    })
  }

  /** @method - lifecycle hook */

  mounted() {
    this.add({
      id: 'loadingarchives',
      type: 'success',
      title: 'Loading',
      message: 'Loading all archived pubs.'
    })
    this.getNatoArchivePublications()
    this.getArchivePublications()
    this.interval = setInterval(this.waitForIt, 500)
  }

  public waitForIt() {
    if (this.archivepubsloaded && this.natoarchivepubsloaded) {
      clearInterval(this.interval)
      this.createAllArchivePubs()
      this.interval = setInterval(this.waitForPubs, 500)
    }
  }

  public waitForPubs() {
    if (this.allarchivepubsloaded) {
      clearInterval(this.interval)
      this.add({
        id: 'loadedarchives',
        type: 'success',
        title: 'Loaded',
        message: 'All archived pubs loaded.'
      })
      this.filteredpubs = this.allarchivepublications
      this.viewReady = true
    }
  }

  viewPub(args: any) {
    this.$router.push({ name: 'View Publication', query: { Id: args.id, Nato: args.nato }, params: { Id: args.id } })
  }
}
</script>
