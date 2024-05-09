<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <!-- @ts-ignore -->
        <b-overlay :show="!viewReady" :variant="overlayVariant" class="contentHeight">
          <b-container fluid class="contentHeight m-0 p-0">
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
                          <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" title="Edit" variant="white" size="lg" class="actionbutton text-dark" @click="editItem(data.item.Id, data.item.IsNato, data.item.Name)">
                            <font-awesome-icon :icon="['far', 'edit']" class="icon"></font-awesome-icon>
                          </b-button>
                        </template>
                        <template #cell(Name)="data">
                          <b-link v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" :to="{ path: '/pubs/development/all/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + true + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                          <b-link v-else :to="{ path: '/pubs/development/all/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + false + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
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
import { GroupItem } from '@/interfaces/GroupItem'
import { isDate } from 'lodash'
import ExcelExportButton from '../Custom/ExcelExportButton.vue'

const users = namespace('users')
const publication = namespace('publication')
const notify = namespace('notify')
const support = namespace('support')

let that: any

@Component({
  name: 'Development',
  components: {
    ExcelExportButton
  }
})
export default class Development extends Vue {
  @Prop() filterFields: any
  @Prop() filterField: any
  @Prop() filterValue: any
  @Prop() filterType: any
  @Prop() Title: any

  // #region variables
  tblId = 'AllPubs'
  primaryKey = 'docid'
  overlayText = 'Getting Publications. Please wait...'
  overlayVariant = 'loading'
  tabTitle = 'All'
  tabIcon = 'battery-full'
  rowHeight = 0
  pageSize = 20
  interval!: any
  branch = 'Navy'
  filteredpubs: Array<PublicationItem> = []
  groupeditems: Array<GroupItem> = [] // will be created from the filtered items
  currentPage = 1
  totalRows = 0
  perPage = 30 // default
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
  showFilter = false
  filterReady = false
  sortfield!: any
  sortdir!: any

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
    { key: 'AdditionalData.PRAAbbrev', field: 'PRAAbbrev', label: 'PRA Abbrev', thClass: 'blue-500', tdClass: 'px150', type: 'AD', format: 'dropdownmulti', id: 7, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'AdditionalData.Change', field: 'Change', label: 'Change', thClass: 'blue-500', tdClass: 'px150', type: 'AD', format: 'text', id: 8, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    { key: 'DTIC', field: 'DTIC', label: 'Distribution', thClass: 'blue-500', tdClass: 'px120', type: 'default', format: 'dropdownmulti', id: 10, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'AdditionalData.GeneralStatus', field: 'GeneralStatus', label: 'General Status', thClass: 'blue-500', tdClass: 'px140', type: 'AD', format: 'dropdownmulti', id: 11, sort: '', ops: [], filter: false, filtervalue: [] },
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
    { field: 'AdditionalData.PRAAbbrev', label: 'PRA Abbrev', width: 150 },
    { field: 'AdditionalData.Change', label: 'Change', width: 150 },
    { field: 'DTIC', label: 'Distribution', width: 120 },
    { field: 'AdditionalData.GeneralStatus', label: 'General Status', width: 150 },
    { field: 'NWDCAO.Title', label: 'NWDC AO', width: 200 },
    { field: 'Class', label: 'Classification', width: 200 }
  ]
  // #endregion

  // #region store data

  @users.State
  public currentUser!: UserInt

  @support.State
  public contentheight!: number

  @support.State
  public contentwidth!: number

  @publication.State
  public loadingpubs!: boolean

  @publication.State
  public developmentpubsforuser!: Array<PublicationItem>

  @publication.State
  public devpubsforuserloaded!: boolean

  @publication.State
  public devnatopubsforuserloaded!: boolean

  @publication.State
  public developmentpubsforuserloaded!: Date

  @support.Action
  public addActivity!: (activity: any) => void

  @support.Action
  public setHeaderTitle!: (title: string) => void

  @notify.Action
  public add!: (notification: NotificationItem) => void

  @publication.Action
  public getDigest!: () => Promise<boolean>

  @publication.Action
  public setPubLoaded!: (loaded: boolean) => void

  @publication.Action
  public getDevPubsForUser!: () => Promise<boolean>

  @publication.Action
  public getDevNatoPubsForUser!: () => Promise<boolean>

  @publication.Action
  public createAllDevelopmentPubsForUser!: (includeNATO: boolean) => Promise<boolean>

  // #endregion

  public getid(text: any, idx: any) {
    return text + '_' + idx
  }

  /** @method - lifecycle hook */
  created() {
    that = this
  }

  /** @method - lifecycle hook */
  mounted() {
    this.setHeaderTitle('Development Publications')
    this.setPubLoaded(false)
    // do we already have pubs and when were they last loaded. Also check to be sure we are not already loading pubs
    if (!this.loadingpubs) {
      // need to load the pubs for the user
      if (this.currentUser.isNATOVisitor) {
        // the test for isNATOVisitor is simply used to be sure a user can view NATO pubs since the SharePoint groups split. This applies for all tests for isNATOVisitor
        this.getDevPubsForUser()
        this.getDevNatoPubsForUser()
        this.interval = setInterval(this.waitForIt, 500)
      } else {
        this.getDevPubsForUser()
        this.interval = setInterval(this.waitForIt, 500)
      }
    }
  }

  public waitForIt() {
    if (this.devpubsforuserloaded) {
      if (this.currentUser.isNATOVisitor) {
        if (this.devnatopubsforuserloaded) {
          clearInterval(this.interval)
          that.createAllDevelopmentPubsForUser(true).then(() => {
            that.interval = setInterval(this.waitForPubs, 500)
          })
        }
      } else {
        clearInterval(this.interval)
        that.createAllDevelopmentPubsForUser(false).then(() => {
          that.interval = setInterval(this.waitForPubs, 500)
        })
      }
    }
  }

  public waitForPubs() {
    if (this.developmentpubsforuser && this.developmentpubsforuser.length > 0) {
      clearInterval(this.interval)
      this.pubsloaded()
    }
  }

  public pubsloaded() {
    this.viewReady = true // TODO: Remove when testing complete
    this.totalRows = this.developmentpubsforuser.length
    this.filteredpubs = this.developmentpubsforuser
    console.log(this.filteredpubs)
    this.addActivity('<div class="bg-white">' + JSON.stringify(this.developmentpubsforuser) + '</div>')
    this.filterpubs()
  }

  public filterpubs() {
    this.filterReady = false
    let a = this.filteredpubs
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
            this.Title = 'New'
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
        this.Title = ' > Filtered Publications'
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
        let b = this.filteredpubs
        a = a.filter((search) => Vue._.isEqual(search['Prfx'], 'TACBUL'))
        b = b.filter((search) => Vue._.isEqual(search['Prfx'], 'TACMEMO'))
        a = a.concat(b)
        a = Vue._.orderBy(a, 'Prfx', 'asc')
        this.filteredpubs = a
        break
      }
    }
    this.totalRows = this.filteredpubs.length
    if (this.filteredpubs.length < this.developmentpubsforuser.length) {
      // this.setHeaderTitle('Filtered Publications')

      this.tabTitle = 'Filtered'
      this.setHeaderTitle(this.tabTitle + ' Publications')
      this.tabIcon = 'battery-half'
    } else {
      this.tabTitle = 'All'
      this.setHeaderTitle(this.tabTitle + ' Dev Publications')
      this.tabIcon = 'battery-full'
    }
  }

  @Watch('$route')
  onRouteChanged(val: Route) {
    // do something if the route meta changes
    console.log('ROUTE CHANGED VIA WATCH MODULE - DEVELOPMENT')
    this.filterField = this.$route.params !== null ? this.$route.params.filterField : ''
    this.filterValue = this.$route.params !== null ? this.$route.params.filterValue : ''
    this.filterType = this.$route.params !== null ? this.$route.params.filterType : ''
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

  public viewItem(id: string, nato: string, docid: string, name: string) {
    this.$router.push({ path: '/pubs/development/all/view/' + id + '/' + nato + '/' + docid + '/true/' + encodeURIComponent(name) })
  }

  public editItem(id: string, nato: string, name: string) {
    this.$router.push({ path: '/pubs/development/all/edit/' + id + '/' + nato + '/' + true + '/' + encodeURIComponent(name) })
  }

  public showFilters() {
    // show the filter dialog after building the filters
    this.buildFilters()
    this.showFilter = true
  }

  public clearFilters() {
    this.showFilter = false
    this.$router.push({ path: '/pubs/reroute/dev' })
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
    this.$router.push({ name: 'RerouteSimple', params: { route: 'devfilter', filterType: 'complex', filterFields: this.fields } })
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
    this.$router.push({ name: 'RerouteSimple', params: { route: 'devfilter', filterType: 'complex', filterFields: this.fields } })
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
  }

  public getStyle(element, field) {
    let style: any = {}
    switch (element) {
      case 'buttonrow':
        style.background = '#ffffff'
        style.height = '50px'
        break

      case 'pagingrow':
        style.height = '50px'
        break
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

  public getCount(type: string, branch: string | null) {
    console.log('getCount called')
    let result = 0
    let a = this.filteredpubs
    switch (type) {
      case 'branch': {
        let b = a.filter((search) => Vue._.isEqual(search['Branch'], branch))
        result = b.length
        break
      }
    }
    return result
  }

  public renderElement(data) {
    let html = ''
    switch (data.field.format) {
      default:
        html = data.value
        break
    }
    return html
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

  onShow() {
    console.log('Showing modal')
  }
}
</script>

<style lang="scss">
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
</style>
