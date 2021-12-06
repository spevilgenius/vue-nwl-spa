<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-modal id="ArchiveModal" size="lg" centered header-bg-variant="blue-500" header-text-variant="light" modal-class="zModal" @ok="onOk()" @show="onShow()">
      <template v-slot:modal-title>Archive Publication</template>
      <b-container class="p-0">
        <b-form>
          <b-row no-gutters>
            <b-col cols="4">
              <b-form-group label="Archive Type">
                <b-form-select class="form-control" v-model="archive.type" size="sm" id="ddArchive" :options="archives" ref="Archive" @change="onArchiveSelected"></b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="superseded" no-gutters>
            <b-col cols="12">
              <dynamic-modal-select id="dmsSuperseded" v-model="supersededby" :items="allpublications" :fields="pubsfields" :filter="pubsfilter" title="Select Superceding Publication" label="Superseded By"></dynamic-modal-select>
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
          :ready="allpubsloaded"
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
import { NotificationItem } from '../../interfaces/NotificationItem'
import { namespace } from 'vuex-class'
import { UserInt } from '../../interfaces/User'
import { PublicationItem } from '../../interfaces/PublicationItem'
import DynamicTable from '../Custom/DynamicTable2.vue'
import DynamicModalSelect from '../Custom/DynamicModalSelect.vue'
import { EventBus } from '../../main'
import { get } from 'jquery'

const users = namespace('users')
const publication = namespace('publication')
const notify = namespace('notify')

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
  overlayText = 'Getting Publications. Please wait...'
  overlayVariant = 'danger'
  rowHeight = 0
  pageSize = 20
  filterField: any
  filterValue: any
  filterType: any
  interval!: any
  filteredpubs: Array<PublicationItem> = []
  pubs: Array<PublicationItem> = []
  Prfx: any
  FunctionalSeries: any
  viewReady?: boolean = false
  archive: any = {
    item: {},
    type: '',
    id: 0,
    nato: '',
    supersededby: ''
  }
  superseded?: boolean = false
  supersededby = ''
  pubsfilter = ''

  pubsfields = [
    { key: 'actions', label: 'Select' },
    { key: 'Title', label: 'Title', sortable: true }
  ]

  archives = [
    { value: 'None', text: 'None' },
    { value: 'Rescinded', text: 'Rescinded' },
    { value: 'Cancelled', text: 'Cancelled' },
    { value: 'Superseded', text: 'Superseded' }
  ]

  @users.State
  public currentUser!: UserInt

  @publication.State
  public allpublications!: Array<PublicationItem>

  @publication.State
  public alldevpublications!: Array<PublicationItem>

  @publication.State
  public natopubsloaded!: boolean

  @publication.State
  public pubsloaded!: boolean

  @publication.State
  public devpubsloaded!: boolean

  @publication.State
  public allpubsloaded!: boolean

  @notify.Action
  public add!: (notification: NotificationItem) => void

  @publication.Action
  public getDigest!: () => Promise<boolean>

  @publication.Action
  public setPubLoaded!: (loaded: boolean) => void

  @publication.Action
  public getAllPublications!: () => Promise<boolean>

  @publication.Action
  public getAllNatoPublications!: () => Promise<boolean>

  @publication.Action
  public getAllDevPublications!: () => Promise<boolean>

  @publication.Action
  public getAllNatoDevPublications!: () => Promise<boolean>

  @publication.Action
  public createAllPubs!: () => Promise<boolean>

  @publication.Action
  public createAllDevPubs!: () => Promise<boolean>

  @publication.Action
  public archivePublication!: (data: any) => Promise<boolean>

  fields: any = [
    { key: 'actions', field: 'actions', label: 'Actions', actions: ['View', 'Edit'], thClass: 'tbl-dynamic-header', tdClass: 'px100', id: 0, model: '', ops: [] },
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
    /* console.log('All.vue MOUNTED') */
    this.add({
      id: 'All_vue',
      type: 'success',
      title: 'Loading',
      message: 'Loading all pubs.'
    })
    this.setPubLoaded(false)
    this.getAllNatoPublications()
    this.getAllPublications()
    this.getAllDevPublications()
    this.interval = setInterval(this.waitForIt, 500)
  }

  public waitForIt() {
    if (this.pubsloaded && this.natopubsloaded) {
      clearInterval(this.interval)
      this.createAllPubs()
      this.createAllDevPubs()
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
        this.filteredpubs = this.allpublications
        // #region filters
        if (this.filterType === 'Navy') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Branch'], 'Navy'))
          this.filteredpubs = a
        }
        if (this.filterType === 'Allied') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Branch'], 'Allied'))
          this.filteredpubs = a
        }
        if (this.filterType === 'Joint') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Branch'], 'Joint'))
          this.filteredpubs = a
        }
        if (this.filterType === 'Multinational') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Branch'], 'Multinational'))
          this.filteredpubs = a
        }
        if (this.filterType === 'Other') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Branch'], 'Other'))
          this.filteredpubs = a
        }
        if (this.filterType === 'complex') {
          // filter pubs and send these pubs instead
          let fields: any = String(this.filterField)
          fields = fields.split(',')
          let vals: any = String(this.filterValue)
          vals = vals.split(',')
          let p = this.allpublications
          for (let i = 0; i < fields.length; i++) {
            let field = fields[i]
            p = p.filter(search => Vue._.isEqual(search[fields[i]], vals[i]))
          }
          this.filteredpubs = p
        }
        if (this.filterType === 'NTP') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NTP'))
          this.filteredpubs = a
        }
        if (this.filterType === 'FXP') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'FXP'))
          this.filteredpubs = a
        }
        if (this.filterType === 'NTRP') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NTRP'))
          this.filteredpubs = a
        }
        if (this.filterType === 'NTTP') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NTTP'))
          this.filteredpubs = a
        }
        if (this.filterType === 'CONOPS') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'CONOPS'))
          this.filteredpubs = a
        }
        if (this.filterType === 'OPTASK') {
          let a = this.allpublications
          a = a.filter(search => Vue._.includes(search['AdditionalData'], 'Navy Wide OPTASKs'))
          this.filteredpubs = a
        }
        if (this.filterType === 'TACMEMO') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'TACMEMO'))
          this.filteredpubs = a
        }
        if (this.filterType === 'NavyConceptPubs') {
          let a = this.allpublications
          a = Vue._.filter(a, { AdditionalData: { FunctionalSeries: 'Navy Concept Pubs' } })
          this.filteredpubs = a
        }
        if (this.filterType === 'ATP') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'ATP'))
          this.filteredpubs = a
        }
        if (this.filterType === 'AJP') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'AJP'))
          this.filteredpubs = a
        }
        if (this.filterType === 'AMP') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'AMP'))
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP105') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 1-05 Religious Ministry Support')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP110') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 1-10 Tactical Reference')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP111') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 1-11 Platform Capabilities')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP114') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 1-14 Law')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP200') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 2-0 Navy Intelligence')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP201') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 2-01 Intelligence Support')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP301') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-01 Air Defense')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP302') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-02 Amphibious Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP305') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-05 Naval Special Warfare')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP307') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-07 Military Operations Other Than War')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP309') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-09 Strike And Fire Support')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP310') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-10 Expeditionary Warfare')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP311') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-11 Nuclear, Biological, Chemical Defense')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP312') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-12 Cyberspace Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP313') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-13 Information Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP315') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-15 Mine Warfare')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP320') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-20 Surface Warfare')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP321') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-21 Undersea Warfare')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP322') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-22 Naval Aviation Warfare')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP329') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-29 Disaster Response Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP330') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-30 Naval Command And Control Of Air Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP332') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-32 Command And Control For Joint Maritime Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP356') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-56 Operational Command/Control')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP358') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-58 Military Deception')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP359') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-59 Oceanography')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP360') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-60 Targeting')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP361') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-61 Public Affairs')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP362') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-62 Seabasing')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP363') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-63 Computer Network Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP372') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-72 Nuclear Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP400') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-00 Naval Logistics')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP401') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-01 Transportation')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP402') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-02 Health Protection')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP404') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-04 Naval Engineering')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP408') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-08 Supply')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP409') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-09 Other Logistic Services')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP410') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-10 Conventional Ordnance')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP411') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-11 Environmental')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP412') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-12 Salvage')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP501') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 5-01 Operational Planning')
          this.filteredpubs = a
        }
        if (this.filterType === 'TTP') {
          let a = this.allpublications
          let b = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'TACBUL'))
          b = b.filter(search => Vue._.isEqual(search['Prfx'], 'TACMEMO'))
          a = a.concat(b)
          a = a.sort((c, d) => (c.AdditionalData.FunctionalSeries > d.AdditionalData.FunctionalSeries ? 1 : c.AdditionalData.FunctionalSeries === d.AdditionalData.FunctionalSeries ? (c.Title > d.Title ? 1 : -1) : -1))
          this.filteredpubs = a
        }
        if (this.filterType === 'TACMEMO') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'TACMEMO'))
          a = a.sort((c, d) => (c.AdditionalData.FunctionalSeries > d.AdditionalData.FunctionalSeries ? 1 : c.AdditionalData.FunctionalSeries === d.AdditionalData.FunctionalSeries ? (c.Title > d.Title ? 1 : -1) : -1))
          this.filteredpubs = a
        }
        if (this.filterType === 'Development') {
          let a = this.alldevpublications
          this.filteredpubs = a
        }
        if (this.filterType === 'WhatsNew') {
          function getCurrentFinancialYear() {
            let fiscalyear1: number
            let fiscalyear2: number
            let fromDate: any
            let toDate: any
            let today = new Date()
            if (today.getMonth() + 1 <= 3) {
              fiscalyear1 = today.getFullYear() - 1
              fiscalyear2 = today.getFullYear()
            } else {
              fiscalyear1 = today.getFullYear()
              fiscalyear2 = today.getFullYear() + 1
            }
          }
          getCurrentFinancialYear()
          let a = this.allpublications
          /* let ad = a.AdditionalData
          a.ad.EditionDate = a.ad.EditionDate.filter((item: any) => {
            return item.date.getTime() >= fromDate.getTime() && item.date.getTime() <= toDate.getTime()
          }) */
          this.filteredpubs = a
        }
        // #endregion
        this.buildFilters()
        // this.viewReady = true
      }
    }
  }

  buildFilters() {
    // build the filters for all of the fields except actions
    for (let j = 1; j < this.fields.length; j++) {
      let p: any = []
      for (let i = 0; i < this.filteredpubs.length; i++) {
        // get the current value in this iteration based on the field. Then test if it is already in the array and add it if not
        let val = ''
        let pub: PublicationItem = this.filteredpubs[i]
        if (this.fields[j].type === 'AD') {
          try {
            let fld = String(this.fields[j].field)
            val = this.filteredpubs[i]['AdditionalData'][fld]
          } catch (e) {
            console.log(e)
          }
        }
        if (this.fields[j].type === 'NWDCAO') {
          if (this.filteredpubs[i] !== null) {
            let ao: any = pub.NWDCAO
            let t: any = ao.Title
            val = t
          }
        }
        if (this.fields[j].type === 'default') {
          val = this.filteredpubs[i][this.fields[j].field]
        }
        if (p.indexOf(val) < 0) {
          p.push(val)
        }
      }
      // sort vals. TODO: build a more comprehensive sort if needed
      p.sort()
      this.fields[j].ops = p
    }
    this.viewReady = true
  }

  viewPub(args: any) {
    this.$router.push({ name: 'View Publication', query: { Id: args.id, Nato: args.nato } })
  }

  editPub(args: any) {
    this.$router.push({ name: 'Edit Publication', query: { Id: args.id, Nato: args.nato } })
  }

  archivePub(args: any) {
    // console.log('Archive Pub')
    this.archive.item = args.item
    this.archive.id = args.id
    this.archive.nato = args.nato
    this.$bvModal.show('ArchiveModal')
  }

  onArchiveSelected() {
    if (this.archive.type === 'Superseded') {
      this.superseded = true
    }
  }

  onOk() {
    console.log('Publication selected for archive: ' + this.archive.type + ', id: ' + this.archive.id)
    // Based on the selected type of archive move or copy document to archived pub library.
    const that = this
    switch (this.archive.type) {
      case 'Cancelled':
        // copy to archive library setting general status to obsolete and status to cancelled. Then delete this document.
        this.getDigest().then(response => {
          if (response) {
            this.archivePublication(this.archive).then(function() {
              console.log('ARCHIVE PUBLICATION')
            })
          }
        })
        break

      case 'Rescinded':
        // copy to archive library setting general status to obsolete and status to rescinded. Then delete this document.
        this.getDigest().then(response => {
          if (response) {
            this.archivePublication(this.archive).then(function() {
              console.log('ARCHIVE PUBLICATION')
            })
          }
        })
        break

      case 'Superseded':
        // copy to archive library setting general status to obsolete, status to superseded, and SupersededBy to the selected document. Then delete this document.
        this.archive.item.AdditionalData.SupersededBy = this.supersededby
        // console.log('Superseded By: ' + this.supersededby + ', item superceded by: ' + this.archive.item.AdditionalData.SupersededBy)
        this.getDigest().then(response => {
          if (response) {
            this.archivePublication(this.archive).then(function() {
              console.log('ARCHIVE PUBLICATION')
            })
          }
        })
        break
    }
    // remove the archived item from the array
    for (let i = 0; i < this.allpublications.length; i++) {
      if (this.allpublications[i].Id === this.archive.id) {
        // is it nato
        if (this.allpublications[i].IsNato === 'Yes') {
          if (this.archive.nato === 'Yes') {
            this.allpublications.splice(i, 1)
          }
        } else {
          // not nato
          this.allpublications.splice(i, 1)
        }
      }
    }
  }

  onShow() {
    console.log('Showing modal')
  }
}
</script>
