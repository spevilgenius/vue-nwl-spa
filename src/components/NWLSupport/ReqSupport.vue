<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-modal id="ArchiveModal" size="lg" centered header-bg-variant="blue-500" header-text-variant="light" modal-class="zModal" @ok="onOk()" @show="onShow()">
      <template v-slot:modal-title>Archive reqsupport</template>
      <b-container class="p-0">
        <b-form>
          <b-row no-gutters>
            <b-col cols="4">
              <b-form-group label="Archive Type">
                <b-form-select class="form-control" v-model="archive.type" size="sm" id="ddArchive" :options="archives" ref="Archive" @change="onArchiveSelected"></b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="superceded" no-gutters>
            <b-col cols="12">
              <dynamic-modal-select id="dmsSuperceded" v-model="supercededby" :items="allreqsupports" :fields="pubsfields" :filter="pubsfilter" title="Select Superceding reqsupport" label="Superceded By"></dynamic-modal-select>
            </b-col>
          </b-row>
        </b-form>
      </b-container>
    </b-modal>
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <dynamic-table
          v-if="viewReady"
          :user="currentUser"
          :table="{
            id: tblId,
            primaryKey: primaryKey,
            buttons: buttons,
            fields: fields,
            items: filteredpubs,
            filterField: filterField,
            filterValue: filterValue,
            filterType: filterType,
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
import DynamicTable from '../Custom/DynamicTable2.vue'
import DynamicModalSelect from '../Custom/DynamicModalSelect.vue'
import { EventBus } from '../../main'
import { ReqSupportItem } from '../../interfaces/ReqSupportItem'

const users = namespace('users')
const reqsupport = namespace('reqsupport')

@Component({
  name: 'All',
  components: {
    DynamicTable,
    DynamicModalSelect
  }
})
export default class All extends Vue {
  tblId = 'AllPubs'
  primaryKey = 'docid'
  overlayText = 'Getting Support Requests. Please wait...'
  overlayVariant = 'danger'
  rowHeight = 0
  pageSize = 20
  filterField: any
  filterValue: any
  filterType: any
  interval!: any
  filteredpubs: Array<ReqSupportItem> = []
  pubs: Array<ReqSupportItem> = []
  Prfx: any
  viewReady?: boolean = false
  /* archive: any = {
    type: '',
    id: 0,
    nato: ''
  }
  superceded?: boolean = false
  supercededby = null */
  pubsfilter = ''

  pubsfields = [
    { key: 'actions', label: 'Select' },
    { key: 'Title', label: 'Title', sortable: true }
  ]

  /*   archives = [
    { value: 'Please Select...', text: 'Please Select...' },
    { value: 'Rescinded', text: 'Rescinded' },
    { value: 'Cancelled', text: 'Cancelled' },
    { value: 'Superceded', text: 'Superceded' }
  ] */

  @users.State
  public currentUser!: UserInt

  @reqsupport.State
  public allreqsupports!: Array<ReqSupportItem>

  /* @reqsupport.State
  public alldevreqsupports!: Array<ReqSupportItem> */

  /*  @reqsupport.State
  public natopubsloaded!: boolean */

  @reqsupport.State
  public pubsloaded!: boolean

  /* @reqsupport.State
  public devpubsloaded!: boolean */

  @reqsupport.State
  public allpubsloaded!: boolean

  @reqsupport.Action
  public setPubLoaded!: (loaded: boolean) => void

  @reqsupport.Action
  public getAllreqsupports!: () => Promise<boolean>

  /*  @reqsupport.Action
  public getAllNatoreqsupports!: () => Promise<boolean> */

  /* @reqsupport.Action
  public getAllDevreqsupports!: () => Promise<boolean> */

  /* @reqsupport.Action
  public getAllNatoDevreqsupports!: () => Promise<boolean> */

  @reqsupport.Action
  public createAllPubs!: () => Promise<boolean>

  /* @reqsupport.Action
  public createAllDevPubs!: () => Promise<boolean> */

  fields: any = [
    { key: 'actions', label: 'Actions', actions: ['View', 'Edit'], thClass: 'tbl-dynamic-header', tdClass: 'px80', id: 0 },
    { key: 'Branch', label: 'Branch', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px100', id: 20 },
    { key: 'Prfx', label: 'Prefix', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px100', id: 1 },
    { key: 'PubID', label: 'PubID', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px100', id: 2 },
    { key: 'Title', label: 'Title', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', id: 3 },
    { key: 'Bookshelf', label: 'Bookshelf', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px300', id: 11 },
    { key: 'Resourced', label: 'Resourced', sortable: false, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px120', id: 6 },
    { key: 'AdditionalData.PRAAbbrev', label: 'PRAAbbrev', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px150', id: 12 },
    { key: 'Class', label: 'Classification', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px200', id: 10 }
  ]

  created() {
    EventBus.$on('viewItem', args => {
      this.setPubLoaded(false)
      this.viewPub(args)
    })
    EventBus.$on('editItem', args => {
      this.setPubLoaded(false)
      this.editPub(args)
    })
    EventBus.$on('archiveItem', args => {
      this.archivePub(args)
    })
  }

  /** @method - lifecycle hook */
  mounted() {
    this.setPubLoaded(false)
    /* this.getAllNatoreqsupports() */
    this.getAllreqsupports()
    /*  this.getAllDevreqsupports() */
    this.interval = setInterval(this.waitForIt, 500)
  }

  public waitForIt() {
    if (this.pubsloaded /* && this.natopubsloaded */) {
      clearInterval(this.interval)
      this.createAllPubs()
      /* this.createAllDevPubs() */
      this.interval = setInterval(this.waitForPubs, 500)
    }
  }

  public waitForPubs() {
    if (this.allpubsloaded) {
      clearInterval(this.interval)
      if (this.$route) {
        this.filterField = this.$route.query.Field
        this.filterValue = this.$route.query.Value
        this.filterType = this.$route.query.Type
        this.filteredpubs = this.allreqsupports
        if (this.filterType === 'complex') {
          // filter pubs and send these pubs instead
          let fields: any = String(this.filterField)
          fields = fields.split(',')
          let vals: any = String(this.filterValue)
          vals = vals.split(',')
          let p = this.allreqsupports
          for (let i = 0; i < fields.length; i++) {
            let field = fields[i]
            p = p.filter(search => Vue._.isEqual(search[fields[i]], vals[i]))
          }
          this.filteredpubs = p
        }
        this.viewReady = true
      }
    }
  }

  viewPub(args: any) {
    this.$router.push({ name: 'View reqsupport', query: { Id: args.id /* Nato: args.nato */ } })
  }

  editPub(args: any) {
    this.$router.push({ name: 'Edit reqsupport', query: { Id: args.id /* Nato: args.nato  */ } })
  }

  archivePub(args: any) {
    // console.log('Archive Pub')
    /*  this.archive.id = args.id */
    /*   this.archive.nato = args.nato
    this.$bvModal.show('ArchiveModal') */
  }
  /* 
  onArchiveSelected() {
    if (this.archive.type === 'Superceded') {
      this.superceded = true
    } */
  /* }

  onOk() {
    console.log('reqsupport selected for archive: ' + this.archive.type + ', id: ' + this.archive.id)
  }

  onShow() {
    console.log('Showing modal')
  } */
}
</script>
