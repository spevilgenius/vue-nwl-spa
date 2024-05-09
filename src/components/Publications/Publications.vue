<template>
  <b-container fluid class="m-0 p-0">
    <b-modal v-if="viewReady" id="ArchiveModal" size="xl" centered header-bg-variant="blue-500" header-text-variant="light" modal-class="zModal" @ok="onOk()" @show="onShow()" @cancel="onCancelled()" @hide="onCancelled()">
      <template v-slot:modal-title>Archive Publication</template>
      <b-container class="p-0">
        <b-form>
          <b-row no-gutters>
            <b-col cols="4">
              <b-form-group label="Archive Type">
                <b-form-select class="form-control" v-model="archive.archivetype" size="sm" id="ddArchive" :options="archives" ref="ArchiveType" @change="onArchiveSelected"></b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="superseded" no-gutters>
            <b-col cols="12">
              <b-row no-gutters :style="getStyle('pagingrow', null)" class="px500">
                <b-col cols="12">
                  <b-form-group label="Filter" label-cols-sm="3" label-align-sm="right" label-size="sm" class="mb-0">
                    <b-input-group size="sm">
                      <b-form-input v-model="filter" type="search" placeholder="Search..."></b-form-input>
                      <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row no-gutters :style="getStyle('tablerowarchive', null)">
                <b-col cols="12">
                  <b-table :items="archivepubs" :fields="archivefields" primary-key="primarykey" :filter="filter" :per-page="perPageArchive" :current-page="currentPageArchive" table-class="table-archive table-full" :sticky-header="getSticky('dynamictablearchive')" table-variant="light" thead-class="blue-500 text-white">
                    <template #head()="data">
                      {{ data.field.label }}
                    </template>
                    <template #head(actions)> Actions </template>
                    <template #cell(actions)="row">
                      <b-form-checkbox v-model="row.item.selected" @change="selectSuperseded()"></b-form-checkbox>
                    </template>
                    <template #cell()="row">
                      <div>{{ row.item.Name }}</div>
                    </template>
                  </b-table>
                </b-col>
              </b-row>
              <b-row no-gutters :style="getStyle('pagingrow', null)">
                <b-col cols="12">
                  <b-pagination v-model="currentPageArchive" :total-rows="totalRowsArchive" :per-page="perPageArchive" class="my-0" first-number last-number></b-pagination>
                </b-col>
              </b-row>
              <b-row no-gutters :style="getStyle('pagingrow', null)" class="px500">
                <b-col cols="3">SELECTED PUBs:</b-col>
                <b-col cols="9">
                  <b-form-input disabled v-model="supersededby" type="text" style="width: 850px; font-size: 12px"></b-form-input>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-form>
      </b-container>
    </b-modal>
    <b-row no-gutters>
      <b-col cols="12" class="m-0 p-0">
        <b-overlay :show="!viewReady" :variant="overlayVariant">
          <b-container fluid class="m-0 p-0">
            <b-sidebar id="sidebar-filter" title="Filter Pubs" shadow width="450px" v-model="showFilter" sidebar-class="border-left border-danger bg-blue-500 text-white" right>
              <template #default>
                <b-overlay :show="!filterReady" rounded="sm" variant="loading">
                  <div class="text-white">
                    <ul class="accordion nav" role="tablist">
                      <li v-for="field in fields" :key="field" class="nav-item px450">
                        <template v-if="field.key !== 'actions'">
                          <div class="px450 m-0 p-0">
                            <div class="container-fluid m-0 p-0">
                              <div class="row no-gutters">
                                <div class="col-3">
                                  <span class="sidebar-icon">
                                    <a v-b-toggle="'menu' + field.id" class="m-0 p-0">
                                      <b-button size="sm" class="btn-blue-500 text-white" :class="field.filter ? null : 'collapsed'" :aria-expanded="field.filter ? 'true' : 'false'" :aria-controls="getid('collapse', field.key)" @click="field.filter = !field.filter">
                                        <font-awesome-icon fas icon="filter" class="icon"></font-awesome-icon>
                                      </b-button>
                                    </a>
                                    <b-button size="sm" class="btn-blue-500 text-white ml-1" :class="field.sort == 'desc' ? 'sorted' : ''" :id="getid('sortdown', field.key)" @click="sortit(field.key, 'desc')" title="Sort Descending">
                                      <font-awesome-icon fas icon="arrow-down" class="icon"></font-awesome-icon>
                                    </b-button>
                                    <b-button size="sm" class="btn-blue-500 text-white ml-1" :class="field.Sort == 'asc' ? 'sorted' : ''" :id="getid('sortup', field.key)" @click="sortit(field.key, 'asc')" title="Sort Ascending">
                                      <font-awesome-icon fas icon="arrow-up" class="icon"></font-awesome-icon>
                                    </b-button>
                                  </span>
                                </div>
                                <div class="col-9 text-left">
                                  <span class="sidebar-text text-left">{{ field.label }}</span>
                                  <b class="caret"></b>
                                </div>
                              </div>
                            </div>
                          </div>
                          <b-collapse class="px450" :id="'menu' + field.id" accordion="filter-accordion" role="tabpanel">
                            <ul class="nav px450">
                              <li v-if="field.format == 'text'" class="nav-item px450">
                                <div class="container-fluid m-0 p-0">
                                  <div class="row no-gutters">
                                    <div class="col-12">
                                      <b-form-select class="pw100" v-model="field.predicate" :options="textpredicate"></b-form-select>
                                    </div>
                                  </div>
                                </div>
                              </li>
                              <li class="nav-item px450">
                                <div class="container-fluid m-0 p-0">
                                  <div class="row no-gutters">
                                    <div class="col-12">
                                      <b-input-group class="pw100" v-if="field.format == 'dropdownmulti'">
                                        <b-form-input :id="getid('bfi', field.id)" size="sm" class="form-control" :value="field.filtervalue"></b-form-input>
                                        <template #prepend>
                                          <b-dropdown variant="blue-700" @show="onShow" size="sm" text="Select" right>
                                            <b-form-checkbox v-for="option in field.ops" v-model="field.filtervalue" :key="option" :value="option.value" :name="field.label">
                                              {{ option.text }}
                                            </b-form-checkbox>
                                          </b-dropdown>
                                        </template>
                                        <template #append>
                                          <b-button size="sm" variant="success" :id="getid('filter', field.key)" class="float-right" @click="setfilter(field.key)">Filter</b-button>
                                          <b-button size="sm" variant="danger" :id="getid('clear', field.key)" class="float-right ml-1" @click="clearfilter(field.key)">Clear</b-button>
                                        </template>
                                      </b-input-group>
                                      <b-input-group class="pw100" v-if="field.format == 'dropdown'">
                                        <b-form-select :options="field.ops" v-model="field.filtervalue"></b-form-select>
                                        <template #append>
                                          <b-button size="sm" variant="success" :id="getid('filter', field.key)" class="float-right" @click="setfilter(field.key)">Filter</b-button>
                                          <b-button size="sm" variant="danger" :id="getid('clear', field.key)" class="float-right ml-1" @click="clearfilter(field.key)">Clear</b-button>
                                        </template>
                                      </b-input-group>
                                      <b-input-group class="pw100" v-if="field.format == 'text'">
                                        <b-form-input v-if="field.format == 'text'" v-model="field.filtervalue"></b-form-input>
                                        <template #append>
                                          <b-button size="sm" variant="success" :id="getid('filter', field.key)" class="float-right" @click="setfilter(field.key)">Filter</b-button>
                                          <b-button size="sm" variant="danger" :id="getid('clear', field.key)" class="float-right ml-1" @click="clearfilter(field.key)">Clear</b-button>
                                        </template>
                                      </b-input-group>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </b-collapse>
                        </template>
                      </li>
                    </ul>
                  </div>
                </b-overlay>
              </template>
              <template #footer>
                <div class="d-flex bg-blue-800 text-white align-items-center px-3 py-2">
                  <b-button variant="danger" @click="closeFilters">Close</b-button>
                </div>
              </template>
            </b-sidebar>
            <b-card no-body>
              <b-tabs class="tabarea" card>
                <b-tab class="vtab all" active>
                  <template slot="title">
                    <font-awesome-icon fas :icon="tabIcon" class="icon" :class="tabTitle !== 'All' ? 'text-warning' : 'text-success'"></font-awesome-icon>
                    {{ tabTitle }}
                  </template>
                  <b-row no-gutters>
                    <b-col cols="12">
                      <b-table responsive striped hover :items="filteredpubs" :fields="fields" primary-key="primarykey" :per-page="perPage" :current-page="currentPage" table-class="table-full" sticky-header table-variant="light" thead-class="blue-500 text-white">
                        <template #head()="data">
                          {{ data.field.label }}
                        </template>
                        <template #head(actions)> Actions </template>
                        <template #cell(actions)="data">
                          <b-button title="View" variant="white" size="lg" class="actionbutton text-dark" @click="viewItem(data.item.Id, data.item.IsNato, data.item.DocID, data.item.Name)">
                            <font-awesome-icon v-if="String(data.item.Name).indexOf('.docx') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                            <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.doc') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                            <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.pdf') > 0" :icon="['far', 'file-pdf']" class="icon"></font-awesome-icon>
                            <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.txt') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                            <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.rtf') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                          </b-button>
                          <b-button v-if="currentUser.isLibrarian || currentUser.isActionOfficer" title="Edit" variant="white" size="lg" class="actionbutton text-dark" @click="editItem(data.item.Id, data.item.IsNato, data.item.Name)">
                            <font-awesome-icon :icon="['far', 'edit']" class="icon"></font-awesome-icon>
                          </b-button>
                          <b-button v-if="currentUser.isLibrarian || currentUser.isActionOfficer" :title="data.item.InDevelopment === 'Yes' ? 'Remove Pub from Dev Status' : 'Place Pub in Dev Status'" variant="white" size="lg" class="actionbutton text-dark" @click="toggleItemDev(data.item)">
                            <font-awesome-icon :icon="['far', 'file-lines']" class="icon" :class="data.item.InDevelopment === 'Yes' ? 'text-success' : 'text-black'"></font-awesome-icon>
                          </b-button>
                          <b-button v-if="currentUser.isLibrarian && data.item.ModerationStatus === 0 && data.item.InDevelopment !== 'Yes'" title="Archive" variant="white" size="lg" class="actionbutton text-dark" @click="archiveItem(data.item.Id, data.item.IsNato, data.item)">
                            <font-awesome-icon :icon="['fas', 'sync']" class="icon"></font-awesome-icon>
                          </b-button>
                        </template>
                        <template #cell(Name)="data">
                          <b-link v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" :to="{ path: '/pubs/approved/all/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + true + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                          <b-link v-else :to="{ path: '/pubs/approved/all/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + false + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                        </template>
                        <template #cell()="data">
                          <div>{{ data.value }}</div>
                        </template>
                      </b-table>
                    </b-col>
                  </b-row>
                  <b-row no-gutters :style="getStyle('pagingrow', null)">
                    <b-col cols="6">
                      <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="my-0" first-number last-number></b-pagination>
                    </b-col>
                    <b-col>
                      <div class="pubcount"># Publications Found: {{ totalRows }}</div>
                    </b-col>
                  </b-row>
                </b-tab>
                <template #tabs-end>
                  <li role="presentation" class="nav-item nav-btn-export">
                    <excel-export-button :data="filteredpubs" :columns="columns" :file-name="'Export'" :file-type="'xlsx'" :sheet-name="'Export'"></excel-export-button>
                  </li>
                  <li role="presentation" class="nav-item nav-btn-filter"><b-button class="btn-filter" variant="success" @click="showFilters">Filter</b-button></li>
                  <li role="presentation" class="nav-item nav-btn-clear"><b-button class="btn-clear-filter" variant="danger" @click="clearFilters" title="Clear filters to show all pubs.">Clear</b-button></li>
                </template>
              </b-tabs>
            </b-card>
          </b-container>
          <template #overlay>
            <div class="text-center">
              <p id="busy-label">{{ overlayText }}</p>
            </div>
          </template>
        </b-overlay>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { NotificationItem } from '../../interfaces/NotificationItem'
import { namespace } from 'vuex-class'
import { UserInt } from '../../interfaces/User'
import { PublicationItem } from '../../interfaces/PublicationItem'
import { ObjectItem } from '../../interfaces/ObjectItem'
import { isDate } from 'lodash'
import { EventBus } from '../../main'
import DynamicModalSelect from '../Custom/DynamicModalSelect.vue'
import ExcelExportButton from '../Custom/ExcelExportButton.vue'

const users = namespace('users')
const publication = namespace('publication')
const notify = namespace('notify')
const support = namespace('support')

let that: any

@Component({
  name: 'Publications',
  components: {
    DynamicModalSelect,
    ExcelExportButton
  }
})
export default class Publications extends Vue {
  @Prop() filterFields: any
  @Prop() filterField: any
  @Prop() filterValue: any
  @Prop() filterType: any
  @Prop() Title: any
  @Prop() ShowTacMemos: any
  @Prop() ShowFXP: any

  // #region variables
  tblId = 'AllPubs'
  primaryKey = 'docid'
  overlayText = 'Getting Publications. Please wait...'
  overlayVariant = 'loading'
  tabTitle = 'All'
  tabIcon = 'battery-full'
  rowHeight = 0
  interval!: any
  branch = 'Navy'
  filteredpubs: Array<PublicationItem> = []
  archpubs: Array<ObjectItem> = []
  currentPage = 1
  totalRows = 0
  perPage = 30 // default
  currentPageArchive = 1
  totalRowsArchive = 0
  perPageArchive = 24 // default
  pubs: Array<PublicationItem> = []
  Prfx: any
  FunctionalSeries: any
  viewReady?: boolean = false
  archive: any = {
    item: {},
    archivetype: '',
    id: 0,
    nato: '',
    supersededby: ''
  }
  superseded?: boolean = false
  supersededby = ''
  pubsfilter = ''
  filterfields!: any
  filteritems!: any
  showFilter = false
  filterReady = false
  sortfield!: any
  sortdir!: any
  filter = ''
  selected = []

  pubsfields = [
    { key: 'actions', label: 'Select' },
    { key: 'Title', label: 'Title' }
  ]

  archives = [
    { value: 'None', text: 'None' },
    { value: 'Rescinded', text: 'Rescinded' },
    { value: 'Cancelled', text: 'Cancelled' },
    { value: 'Superseded', text: 'Superseded' }
  ]

  public ddfields: ObjectItem = { text: 'text', value: 'value', index: 'index' }
  public textpredicate: Array<ObjectItem> = [
    { text: 'Select...', value: 'S' },
    { text: 'Starts With', value: 'SW' },
    { text: 'Ends With', value: 'EW' },
    { text: 'Contains', value: 'C' },
    { text: 'Equal', value: 'E' },
    { text: 'Not Equal', value: 'NE' }
  ]
  public datepredicate: Array<ObjectItem> = [
    { text: 'Select...', value: 'S' },
    { text: 'Greater Than', value: 'GT' },
    { text: 'Less Than', value: 'LT' },
    { text: 'Equal', value: 'E' },
    { text: 'Between', value: 'B' }
  ]
  public numberpredicate: Array<ObjectItem> = [
    { text: 'Select...', value: 'S' },
    { text: 'Greater Than', value: 'GT' },
    { text: 'Less Than', value: 'LT' },
    { text: 'Equal', value: 'E' }
  ]

  fields: any = [
    { key: 'actions', label: 'Actions', actions: ['View', 'Edit'], thClass: 'blue-500', tdClass: 'px100', id: 0 },
    { key: 'Prfx', field: 'Prfx', label: 'Prefix', thClass: 'blue-500', tdClass: 'px100', type: 'default', format: 'dropdownmulti', id: 1, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'PubID', field: 'PubID', label: 'PubID', thClass: 'blue-500', tdClass: 'px90', type: 'default', format: 'text', id: 2, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    { key: 'Name', field: 'Name', label: 'Name', thClass: 'blue-500', tdClass: 'px200', type: 'default', format: 'text', id: 3, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    { key: 'LongTitle', field: 'LongTitle', label: 'Long Title', thClass: 'blue-500', tdClass: 'px200', type: 'default', format: 'text', id: 4, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    { key: 'AdditionalData.Status', field: 'Status', label: 'Status', thClass: 'blue-500', tdClass: 'px100', type: 'AD', format: 'dropdownmulti', id: 5, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'AdditionalData.Edition', field: 'Edition', label: 'Edition', thClass: 'blue-500', tdClass: 'px110', type: 'AD', format: 'dropdownmulti', id: 6, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'AdditionalData.PRAAbbrev', field: 'PRAAbbrev', label: 'PRAAbbrev', thClass: 'blue-500', tdClass: 'px150', type: 'AD', format: 'dropdownmulti', id: 7, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'Resourced', field: 'Resourced', label: 'Resourced', thClass: 'blue-500', tdClass: 'px130', type: 'default', format: 'dropdown', id: 9, sort: '', ops: [], filtervalue: '' },
    { key: 'DTIC', field: 'DTIC', label: 'DTIC', thClass: 'blue-500', tdClass: 'px120', type: 'default', format: 'dropdownmulti', id: 10, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'AdditionalData.GeneralStatus', field: 'GeneralStatus', label: 'GeneralStatus', thClass: 'blue-500', tdClass: 'px140', type: 'AD', format: 'dropdownmulti', id: 11, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'NWDCAO.Title', field: 'NWDCAO', label: 'NWDC AO', thClass: 'blue-500', tdClass: 'px150', type: 'NWDCAO', format: 'dropdownmulti', id: 12, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'Class', field: 'Class', label: 'Classification', thClass: 'blue-500', tdClass: 'px200', type: 'default', format: 'dropdownmulti', id: 13, sort: '', ops: [], filter: false, filtervalue: [] }
  ]

  columns: any = [
    { field: 'Prfx', label: 'Prefix', width: 100 },
    { field: 'PubID', label: 'PubID', width: 100 },
    { field: 'Name', label: 'Name', width: 200 },
    { field: 'LongTitle', label: 'Long Title', width: 250 },
    { field: 'AdditionalData.Status', label: 'Status', width: 100 },
    { field: 'AdditionalData.Edition', label: 'Edition', width: 110 },
    { field: 'AdditionalData.PRAAbbrev', label: 'PRAAbbrev', width: 150 },
    { field: 'Resourced', label: 'Resourced', width: 130 },
    { field: 'DTIC', label: 'DTIC', width: 120 },
    { field: 'AdditionalData.GeneralStatus', label: 'GeneralStatus', width: 150 },
    { field: 'NWDCAO.Title', label: 'NWDC AO', width: 200 },
    { field: 'Class', label: 'Classification', width: 200 }
  ]

  archivefields: any = [
    { key: 'actions', label: 'Actions', actions: ['View', 'Edit'], thClass: 'blue-500', tdClass: 'px50', id: 0 },
    { key: 'Name', field: 'Name', label: 'Name', thClass: 'blue-500', tdClass: 'px900', type: 'default', format: 'text', id: 3, sort: '', filter: false, filtervalue: '', predicate: 'S' }
  ]
  // #endregion

  // #region store data

  @users.State
  public currentUser!: UserInt

  /*   @support.State
  public contentheight!: number

  @support.State
  public contentwidth!: number */

  @support.State
  public history!: string

  @publication.State
  public loadingpubs!: boolean

  @publication.State
  public approvedpubsforuser!: Array<PublicationItem>

  @publication.State
  public activepubsforuserloaded!: boolean

  @publication.State
  public natopubsforuserloaded!: boolean

  @publication.State
  public approvedpubsforuserloaded!: Date

  @publication.State
  public branches!: Array<ObjectItem>

  @publication.State
  public archivepubs!: Array<ObjectItem>

  @support.Action
  public addActivity!: (activity: any) => void

  @support.Action
  public setHeaderTitle!: (title: string) => void

  @notify.Action
  public add!: (notification: NotificationItem) => void

  @publication.Action
  public getDigest!: () => Promise<boolean>

  @publication.Action
  public getBranches!: () => Promise<boolean>

  @publication.Action
  public getActivePubsForUser!: () => Promise<boolean>

  @publication.Action
  public getNatoPubsForUser!: () => Promise<boolean>

  @publication.Action
  public createAllApprovedPubsForUser!: (includeNATO: any) => Promise<boolean>

  @publication.Action
  public archivePublication!: (data: any) => Promise<boolean>

  @publication.Action
  public togglePubInDev!: (data: any) => Promise<boolean>

  // #endregion

  public getid(text: any, idx: any) {
    return text + '_' + idx
  }

  /** @method - lifecycle hook */
  created() {
    that = this
    EventBus.$on('showFilter', (args) => {
      this.showFilter = args
    })
  }

  /** @method - lifecycle hook */
  mounted() {
    console.log('SHOW TACMEMOS: ' + this.ShowTacMemos)
    this.loadstuff()
  }

  loadstuff() {
    // this.setHeaderTitle('All Publications')
    // do we already have pubs and when were they last loaded. Also check to be sure we are not already loading pubs
    if (!this.loadingpubs) {
      if (this.approvedpubsforuserloaded && isDate(this.approvedpubsforuserloaded)) {
        // if the data is not too old (1 hour) just keep it. for testing set the check for different times to validate
        const date1 = this.approvedpubsforuserloaded.getTime()
        const date2 = new Date().getTime()
        let diff = date2 - date1
        diff = diff / 1000
        if (diff > 3600) {
          // time is in seconds so set to whatever to test. 3600 = 1 hour
          if (this.currentUser.isNATOVisitor) {
            // the test for isNATOVisitor is simply used to be sure a user can view NATO pubs since the SharePoint groups split. This applies for all tests for isNATOVisitor
            this.getActivePubsForUser()
            this.getNatoPubsForUser()
            this.interval = setInterval(this.waitForIt, 500)
          } else {
            this.getActivePubsForUser()
            this.interval = setInterval(this.waitForIt, 500)
          }
        } else {
          // pubs loaded so just move on
          this.pubsloaded()
        }
      } else {
        // need to load the pubs for the user
        if (this.currentUser.isNATOVisitor) {
          // the test for isNATOVisitor is simply used to be sure a user can view NATO pubs since the SharePoint groups split. This applies for all tests for isNATOVisitor
          this.getActivePubsForUser()
          this.getNatoPubsForUser()
          this.interval = setInterval(this.waitForIt, 500)
        } else {
          this.getActivePubsForUser()
          this.interval = setInterval(this.waitForIt, 500)
        }
      }
    }
  }

  public waitForIt() {
    if (this.activepubsforuserloaded) {
      if (this.currentUser.isNATOVisitor) {
        if (this.natopubsforuserloaded) {
          clearInterval(this.interval)
          that.createAllApprovedPubsForUser('Yes').then(() => {
            that.interval = setInterval(this.waitForPubs, 500)
          })
        }
      } else {
        clearInterval(this.interval)
        that.createAllApprovedPubsForUser('No').then(() => {
          that.interval = setInterval(this.waitForPubs, 500)
        })
      }
    }
  }

  public waitForPubs() {
    if (this.approvedpubsforuserloaded) {
      clearInterval(this.interval)
      this.pubsloaded()
    }
  }

  public pubsloaded() {
    this.viewReady = true // TODO: Remove when testing complete
    this.totalRows = this.approvedpubsforuser.length
    this.filteredpubs = this.approvedpubsforuser
    this.totalRowsArchive = this.archivepubs.length
    this.filterpubs()
  }

  public filterpubs() {
    this.filterReady = false
    this.Title = 'All Publications'
    let a = this.filteredpubs
    if (this.ShowTacMemos === 'No') {
      a = a.filter((search) => Vue._.isEqual(search['IsTacMemo'], 'No'))
      this.filteredpubs = a
    }
    a = this.filteredpubs
    if (this.ShowFXP === 'No') {
      a = a.filter((search) => Vue._.isEqual(search['IsFXP'], 'No'))
      this.filteredpubs = a
    }
    console.log('FILTERING PUBS ON: ' + this.filterType + ', ' + this.filterField + ', ' + this.filterValue)
    switch (this.filterType) {
      case 'field': {
        switch (this.filterField) {
          case 'FunctionalSeries': {
            this.Title = this.filterValue
            a = Vue._.filter(a, { AdditionalData: { FunctionalSeries: this.filterValue } })
            // a = a.filter((d) => d.AdditionalData.FunctionalSeries === this.filterValue)
            this.filteredpubs = a
            break
          }
          case 'FunctionalField': {
            this.Title = this.filterValue
            a = Vue._.filter(a, { AdditionalData: { FunctionalField: this.filterValue } })
            // a = a.filter((d) => d.AdditionalData.FunctionalField === this.filterValue)
            this.filteredpubs = a
            break
          }
          case 'Tags': {
            this.Title = this.filterValue
            a = a.filter((search) => Vue._.includes(search[this.filterField], this.filterValue))
            this.filteredpubs = a
            break
          }
          default: {
            this.Title = this.filterValue
            a = a.filter((search) => Vue._.isEqual(search[this.filterField], this.filterValue))
            this.filteredpubs = a
            break
          }
        }
        break
      }
      case 'custom': {
        // here the name of the complex filter is passed on the filterField prop
        switch (this.filterField) {
          case 'New': {
            // what's new?
            this.Title = 'New Publications'
            const sixtydays = 5184000000
            let start = new Date(new Date().getTime() - sixtydays)
            a = a.filter((search) => {
              let b = String(search['Modified'])
              let c = new Date(b)
              return c >= start
            })
            // moderation status-- 0 = Approved 3 = Draft
            a = a.filter((search) => Vue._.isEqual(search['ModerationStatus'], 0))
            this.filteredpubs = a
            break
          }
        }
        break
      }
      case 'complex': {
        // this is passed as an array of fields by the custom filter or from another route
        // will need to check if any fields are actually being filtered. If not, need to reload all pubs
        this.Title = 'Filtered Publications'
        console.log('COMPLEX FILTER CALLED')
        let hasfilter = false
        if (this.filterFields && this.filterFields.length > 0) {
          // does this work? Can we pass the fields through a route? Will it be easier to do it this way?
          console.log('COMPLEX FILTERING VIA ROUTE')
          this.fields = this.filterFields
        }
        for (let j = 1; j < this.fields.length; j++) {
          if (this.fields[j].filter === true || this.fields[j].sort !== '') {
            hasfilter = true
          }
        }
        if (hasfilter) {
          console.log('hasfilter is set')
          // loop through the fields array and filter accordingly
          for (let j = 1; j < this.fields.length; j++) {
            let q = this.filteredpubs
            if (this.fields[j].sort !== '') {
              this.sortfield = this.fields[j].key
              this.sortdir = this.fields[j].sort
            }
            if (this.fields[j].filtervalue && this.fields[j].filtervalue.length >= 1) {
              // is this a dropdown or text?
              switch (this.fields[j].format) {
                case 'text': {
                  // text - use the predicate and filtervalue
                  switch (this.fields[j].predicate) {
                    case 'SW': {
                      // Starts With
                      let that = this
                      q = q.filter(function (search) {
                        return Vue._.startsWith(String(search[that.fields[j].key]).toLowerCase(), String(that.fields[j].filtervalue).toLowerCase())
                      })
                      break
                    }
                    case 'EW': {
                      // Ends With
                      let that = this
                      q = q.filter(function (search) {
                        return Vue._.endsWith(String(search[that.fields[j].key]).toLowerCase(), String(that.fields[j].filtervalue).toLowerCase())
                      })
                      break
                    }
                    case 'C': {
                      // Contains
                      let that = this
                      q = q.filter(function (search) {
                        return Vue._.includes(String(search[that.fields[j].key]).toLowerCase(), String(that.fields[j].filtervalue).toLowerCase())
                      })
                      break
                    }
                    case 'E': {
                      // Equals
                      let that = this
                      q = q.filter(function (search) {
                        return Vue._.isEqual(String(search[that.fields[j].key]).toLowerCase(), String(that.fields[j].filtervalue).toLowerCase())
                      })
                      break
                    }
                    case 'NE': {
                      // Not Equals
                      let that = this
                      q = q.filter(function (search) {
                        return Vue._.without(String(search[that.fields[j].key]).toLowerCase(), String(that.fields[j].filtervalue).toLowerCase())
                      })
                      break
                    }
                  }
                  break
                }
                case 'dropdown': {
                  // dropdown - predicate will only be 'equals' only 1 choice
                  q = q.filter((search) => search[this.fields[j].key] == this.fields[j].filtervalue)
                  break
                }
                case 'dropdownmulti': {
                  // dropdownmulti - predicate will only be 'equals' 1 or more choices
                  if (this.fields[j].filtervalue.length === 1) {
                    // only 1 selection
                    if (this.fields[j].type === 'AD' || this.fields[j].type === 'NWDCAO') {
                      let f = this.fields[j].field
                      let fv = this.fields[j].filtervalue[0]
                      switch (f) {
                        case 'Status': {
                          q = Vue._.filter(q, { AdditionalData: { Status: fv } })
                          break
                        }
                        case 'Edition': {
                          q = Vue._.filter(q, { AdditionalData: { Edition: fv } })
                          break
                        }
                        case 'PRAAbbrev': {
                          q = Vue._.filter(q, { AdditionalData: { PRAAbbrev: fv } })
                          break
                        }
                        case 'GeneralStatus': {
                          q = Vue._.filter(q, { AdditionalData: { GeneralStatus: fv } })
                          break
                        }
                        case 'NWDCAO': {
                          console.log('NWDCAO ' + fv)
                          q = Vue._.filter(q, { NWDCAO: { Title: fv } })
                        }
                      }
                    } else {
                      q = q.filter((search) => search[this.fields[j].key] == this.fields[j].filtervalue[0])
                    }
                  } else {
                    let b: Array<PublicationItem> = []
                    if (this.fields[j].type === 'AD' || this.fields[j].type === 'NWDCAO') {
                      for (let k = 0; k < this.fields[j].filtervalue.length; k++) {
                        let c: Array<PublicationItem> = []
                        if (k == 0) {
                          let f = this.fields[j].field
                          let fv = this.fields[j].filtervalue[k]
                          switch (f) {
                            case 'Status': {
                              c = Vue._.filter(q, { AdditionalData: { Status: fv } })
                              break
                            }
                            case 'Edition': {
                              c = Vue._.filter(q, { AdditionalData: { Edition: fv } })
                              break
                            }
                            case 'PRAAbbrev': {
                              c = Vue._.filter(q, { AdditionalData: { PRAAbbrev: fv } })
                              break
                            }
                            case 'GeneralStatus': {
                              c = Vue._.filter(q, { AdditionalData: { GeneralStatus: fv } })
                              break
                            }
                            case 'NWDCAO': {
                              console.log('NWDCAO ' + fv)
                              c = Vue._.filter(q, { NWDCAO: { Title: fv } })
                            }
                          }
                          b = c
                        } else {
                          let f = this.fields[j].field
                          let fv = this.fields[j].filtervalue[k]
                          switch (f) {
                            case 'Status': {
                              c = Vue._.filter(q, { AdditionalData: { Status: fv } })
                              break
                            }
                            case 'Edition': {
                              c = Vue._.filter(q, { AdditionalData: { Edition: fv } })
                              break
                            }
                            case 'PRAAbbrev': {
                              c = Vue._.filter(q, { AdditionalData: { PRAAbbrev: fv } })
                              break
                            }
                            case 'GeneralStatus': {
                              c = Vue._.filter(q, { AdditionalData: { GeneralStatus: fv } })
                              break
                            }
                            case 'NWDCAO': {
                              console.log('NWDCAO ' + fv)
                              c = Vue._.filter(q, { NWDCAO: { Title: fv } })
                            }
                          }
                          b = b.concat(c)
                        }
                      }
                    } else {
                      for (let k = 0; k < this.fields[j].filtervalue.length; k++) {
                        let c: Array<PublicationItem> = []
                        if (k == 0) {
                          c = q.filter((search) => search[this.fields[j].key] == this.fields[j].filtervalue[k])
                          b = c
                        } else {
                          c = q.filter((search) => search[this.fields[j].key] == this.fields[j].filtervalue[k])
                          b = b.concat(c)
                        }
                      }
                    }
                    q = b
                  }
                  break
                }
              }
            }
            // let's sort if requested
            if (this.sortfield && this.sortdir !== '') {
              q = Vue._.orderBy(q, this.sortfield, this.sortdir)
            }
            this.filteredpubs = q
            this.buildFilters()
          }
        } else {
          this.$router.push({ path: '/pubs/reroute/all' })
        }
        break
      }
      case 'TTP': {
        this.Title = 'TTP'
        let b = this.filteredpubs
        let c = this.filteredpubs
        let d = this.filteredpubs
        a = a.filter((search) => Vue._.isEqual(search['Prfx'], 'TACBUL'))
        b = b.filter((search) => Vue._.isEqual(search['Prfx'], 'TACMEMO'))
        c = c.filter((search) => Vue._.isEqual(search['Prfx'], 'TACAID'))
        d = d.filter((search) => Vue._.isEqual(search['Prfx'], 'TACNOTE'))
        a = a.concat(b)
        a = a.concat(c)
        a = a.concat(d)
        a = Vue._.orderBy(a, 'Prfx', 'asc')
        this.filteredpubs = a
        break
      }
      case 'FXP': {
        a = a.filter((search) => Vue._.isEqual(search['Prfx'], 'FXP'))
        this.filteredpubs = a
        break
      }
      case 'Commander Handbooks': {
        this.Title = "Commander's Handbooks"
        a = Vue._.filter(a, { AdditionalData: { FunctionalSeries: "Commander's Handbooks" } })
        this.filteredpubs = a
        break
      }
      case 'NWP': {
        this.Title = 'NWP'
        a = a.filter((search) => Vue._.isEqual(search['Prfx'], 'NWP'))
        a = Vue._.filter(a, { AdditionalData: { FunctionalField: this.filterValue } })
        this.filteredpubs = a
        break
      }
    }
    this.totalRows = this.filteredpubs.length
    // this.archivepubs = this.filteredpubs
    if (this.filteredpubs.length < this.approvedpubsforuser.length) {
      this.tabTitle = 'Filtered'
      this.tabIcon = 'battery-half'
    } else {
      this.tabTitle = 'All'
      this.tabIcon = 'battery-full'
    }
    this.setHeaderTitle(this.Title)
  }

  @Watch('$route')
  onRouteChanged(val: Route) {
    // do something if the route meta changes
    console.log('ROUTE CHANGED VIA WATCH MODULE - PUBLICATIONS')
    this.filterField = this.$route.params !== undefined ? this.$route.params.filterField : ''
    this.filterValue = this.$route.params !== undefined ? this.$route.params.filterValue : ''
    this.filterType = this.$route.params !== undefined ? this.$route.params.filterType : ''
    this.filterpubs()
  }

  buildFilters() {
    // build the filters for all of the fields except actions
    console.log('BUILDING FILTERS: ' + this.filteredpubs.length)
    this.filterReady = false
    for (let j = 1; j < this.fields.length; j++) {
      // let p: any = []
      let p: Array<ObjectItem> = []
      for (let i = 0; i < this.filteredpubs.length; i++) {
        // get the current value in this iteration based on the field. Then test if it is already in the array and add it if not
        let val = ''
        let pub: PublicationItem = this.filteredpubs[i]
        if (this.fields[j].format === 'dropdown' || this.fields[j].format === 'dropdownmulti') {
          if (this.fields[j].type === 'AD') {
            try {
              let fld = String(this.fields[j].field)
              val = pub.AdditionalData[fld] !== undefined || pub.AdditionalData[fld] !== null ? pub.AdditionalData[fld] : ''
              // console.log('ADDITIONALDATA: fld-' + fld + ', val-' + val)
            } catch (e) {
              // console.log('ADDITIONALDATA FAILED: ' + e)
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
          if (val && val.length > 1) {
            if (p.length > 0) {
              let found = false
              for (let z = 0; z < p.length; z++) {
                if (p[z].text === val) {
                  found = true
                }
              }
              if (!found) {
                p.push({
                  text: val,
                  value: val
                })
              }
            } else {
              p.push({
                text: val,
                value: val
              })
            }
          }
        }
        // sort vals. TODO: build a more comprehensive sort if needed
        p = Vue._.orderBy(p, 'text', 'asc')
        this.fields[j].ops = p
      }
    }
    this.filterReady = true
  }

  public selectSuperseded() {
    let result = ''
    for (let i = 0; i < this.archivepubs.length; i++) {
      console.log('SELECTED: ' + this.archivepubs[i].selected)
      if (this.archivepubs[i].selected) {
        if (result === '') {
          result = this.archivepubs[i].text
        } else {
          result += ', ' + this.archivepubs[i].text
        }
      }
    }
    this.supersededby = result
  }

  public getRowClass(item: any, type: any) {
    if (type === 'row' && item.InDevelopment === 'Yes') {
      if (this.currentUser.canViewDevPubs === true) {
        return 'table-success'
      }
    }
  }

  public viewItem(id: string, nato: string, docid: string, name: string) {
    let showhidden = false
    if (this.currentUser.isActionOfficer || this.currentUser.isLibrarian || this.currentUser.isNATOLibrarian) {
      showhidden = true
    }
    this.$router.push({ path: '/pubs/approved/all/view/' + id + '/' + nato + '/' + docid + '/' + showhidden + '/' + encodeURIComponent(name) })
  }

  public editItem(id: string, nato: string, name: string) {
    this.$router.push({ path: '/pubs/approved/all/edit/' + id + '/' + nato + '/' + true + '/' + encodeURIComponent(name) })
  }

  public showFilters() {
    // show the filter dialog after building the filters
    this.buildFilters()
    this.showFilter = true
  }

  public clearFilters() {
    // reset all filter objects and set filteredpubs back to approvedpubsforuser
    // TODO: then reset based on current route or outer filter
    this.showFilter = false
    this.$router.push({ path: '/pubs/reroute/all' })
  }

  public closeFilters() {
    this.showFilter = false
  }

  public setfilter(key: string) {
    // set the field tp be filtered and then call the complex filter
    for (let j = 1; j < this.fields.length; j++) {
      if (this.fields[j].key === key) {
        this.fields[j].filter = true
      }
    }
    this.$router.push({ name: 'RerouteSimple', params: { route: 'filter', filterType: 'complex', filterFields: this.fields } })
  }

  public clearfilter(key: string) {
    // set the field tp be filtered and then call the complex filter
    for (let j = 1; j < this.fields.length; j++) {
      if (this.fields[j].key === key) {
        this.fields[j].filter = false
        if (this.fields[j].format === 'dropdownmulti') {
          this.fields[j].filtervalue = []
        } else {
          this.fields[j].filtervalue = ''
        }
      }
    }
    this.$router.push({ name: 'RerouteSimple', params: { route: 'filter', filterType: 'complex', filterFields: this.fields } })
  }

  public sortit(key: string, direction: string) {
    for (let j = 1; j < this.fields.length; j++) {
      if (this.fields[j].key === key) {
        this.fields[j].sort = direction
      } else {
        this.fields[j].sort = ''
      }
    }
    let a = this.filteredpubs
    if (direction === 'asc') {
      a = Vue._.orderBy(a, key, 'asc')
    } else {
      a = Vue._.orderBy(a, key, 'desc')
    }
    this.filteredpubs = a
    // this.$router.push({ name: 'RerouteSimple', params: { route: 'filter', filterType: 'complex', filterFields: this.fields } })
  }

  public getStyle(element, field) {
    let style: any = {}
    switch (element) {
      case 'buttonrow':
        style.background = '#ffffff'
        style.height = '50px'
        break

      case 'tablerowarchive':
        style.height = '600px'
        break

      case 'pagingrow':
        style.height = '50px'
        break

      case 'branchaccordion':
        style.maxHeight = '600px'
        style.overflowY = 'auto'
        style.overflowX = 'hidden'
    }
    return style
  }

  public getSticky(element) {
    let h: any
    switch (element) {
      case 'dynamictablearchive':
        h = '600px'
        break

      case 'accordiontable':
        h = '800px'
    }
    return h
  }

  toggleItemDev(item: PublicationItem) {
    const that = this
    let indev = ''
    if (item.InDevelopment === 'Yes') {
      indev = 'No'
      item.InDevelopment = 'No'
    } else {
      indev = 'Yes'
      item.InDevelopment = 'Yes'
    }
    this.getDigest().then((response) => {
      if (response) {
        that.togglePubInDev(item).then(function () {
          console.log('PUBLICATION TOGGLED')
        })
      }
    })
    for (let i = 0; i < this.approvedpubsforuser.length; i++) {
      if (this.approvedpubsforuser[i].Id === item.Id) {
        // is nato
        if (this.approvedpubsforuser[i].IsNato === 'Yes') {
          if (item.IsNato === 'Yes') {
            this.approvedpubsforuser[i].InDevelopment = indev
          }
        } else {
          // is not nato
          this.approvedpubsforuser[i].InDevelopment = indev
        }
      }
    }
    this.pubsloaded()
  }

  archiveItem(id: string, nato: string, item: any) {
    // console.log('Archive Pub')
    this.archive.item = item
    this.archive.id = id
    this.archive.nato = nato
    this.$bvModal.show('ArchiveModal')
  }

  onArchiveSelected() {
    if (this.archive.archivetype === 'Superseded') {
      this.superseded = true
      this.archpubs = this.archivepubs
    }
  }

  onCancelled() {
    this.archive.archivetype = ''
    this.supersededby = ''
    this.superseded = false
    for (let i = 0; i < this.archivepubs.length; i++) {
      this.archivepubs[i].selected = false
    }
  }

  onOk() {
    console.log('Publication selected for archive: ' + this.archive.archivetype + ', id: ' + this.archive.id)
    // Based on the selected archivetype of archive move or copy document to archived pub library.
    const that = this
    switch (this.archive.archivetype) {
      case 'Cancelled':
        // copy to archive library setting general status to obsolete and status to cancelled. Then delete this document.
        this.archive.item.AdditionalData.Status = 'Cancelled'
        this.getDigest().then((response) => {
          if (response) {
            that.archivePublication(that.archive).then(function () {
              console.log('ARCHIVE PUBLICATION')
            })
          }
        })
        break

      case 'Rescinded':
        // copy to archive library setting general status to obsolete and status to rescinded. Then delete this document.
        this.archive.item.AdditionalData.Status = 'Rescinded'
        this.getDigest().then((response) => {
          if (response) {
            that.archivePublication(that.archive).then(function () {
              console.log('ARCHIVE PUBLICATION')
            })
          }
        })
        break

      case 'Superseded':
        // copy to archive library setting general status to obsolete, status to superseded, and SupersededBy to the selected document. Then delete this document.
        this.archive.item.AdditionalData.Status = 'Superseded'
        this.archive.item.AdditionalData.SupersededBy = this.supersededby
        console.log('Superseded By: ' + this.supersededby + ', item superseded by: ' + this.archive.item.AdditionalData.SupersededBy)
        this.getDigest().then((response) => {
          if (response) {
            that.archivePublication(that.archive).then(function () {
              console.log('ARCHIVE PUBLICATION')
            })
          }
        })
        break
    }
    // remove the archived item from the array
    for (let i = 0; i < this.approvedpubsforuser.length; i++) {
      if (this.approvedpubsforuser[i].Id === this.archive.id) {
        // is it nato
        if (this.approvedpubsforuser[i].IsNato === 'Yes') {
          if (this.archive.nato === 'Yes') {
            this.approvedpubsforuser.splice(i, 1)
          }
        } else {
          // not nato
          this.approvedpubsforuser.splice(i, 1)
        }
      }
    }
    this.pubsloaded()
  }

  onShow() {
    console.log('Showing modal')
  }
}
</script>

<style lang="scss">
.nav-btn-export {
  position: absolute;
  right: 225px;
}
.nav-btn-filter {
  position: absolute;
  right: 125px;
}
.nav-btn-clear {
  position: absolute;
  right: 25px;
}
#ArchiveModal .b-table-sticky-header {
  max-width: 1020px;
}
.table-archive {
  max-width: 1000px;
}
.table-full {
  border: 1px solid #000000 !important;
}
.table-full td,
.table-full th {
  border: 1px solid #000000 !important;
  height: 20px !important;
  padding: 2px 5px !important;
}
.pubcount {
  border: 1px solid #ffffff !important;
  padding: 2px 2px !important;
  color: $pagination-color;
}
.collapsed > .while-open,
.not-collapsed > .while-closed {
  display: none;
}
#ulFields {
  list-style-type: none;
  width: 100%;
  margin-bottom: 0px;
  font-size: 16px !important;
  padding: 0;
}

#ulFields li {
  list-style-type: none;
  margin-bottom: 5px !important;
}
</style>
