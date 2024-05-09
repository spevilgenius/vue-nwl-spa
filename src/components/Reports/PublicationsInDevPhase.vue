<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-overlay :show="!viewReady" :variant="overlayVariant" class="contentHeight">
          <b-container fluid class="contentHeight m-0 p-0">
            <b-card no-body>
              <b-tabs class="tabarea" card>
                <b-tab class="vtab all" active>
                  <template slot="title">
                    <font-awesome-icon fas :icon="tabIcon" class="icon" :class="(tabTitle = 'Report')"></font-awesome-icon>
                    {{ tabTitle }}
                  </template>
                  <b-row no-gutters :style="getStyle('tablerow', null)">
                    <b-col cols="12">
                      <b-table striped hover :items="filteredpubs" :fields="fields" primary-key="primarykey" :per-page="perPage" :current-page="currentPage" table-class="table-full" :sticky-header="getSticky('dynamictable')" table-variant="light" thead-class="blue-500 text-white">
                        <template #head()="data">
                          {{ data.field.label }}
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
  overlayVariant = 'warning'
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
  phaseDate: any
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
    { key: 'Name', field: 'Name', label: 'Name', thClass: 'blue-500', tdClass: 'px200', type: 'default', format: 'text', id: 4, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    { key: 'Development.Phase', field: 'Phase', label: 'Phase', thClass: 'blue-500', tdClass: 'px50', type: 'AD', format: 'text', id: 1 },
    { key: 'Development.DateEnteredPhase', field: 'DateEnteredPhase', label: 'Entered Phase Date', thClass: 'blue-500', tdClass: 'px50', type: 'default', format: 'text', id: 2 },
    { key: 'Development.NumberDaysInPhase', field: 'NumberDaysInPhase', label: 'Days In Current Phase', thClass: 'blue-500', tdClass: 'px50', type: 'default', format: 'text', id: 3 }
    //{ key: 'LongTitle', field: 'LongTitle', label: 'Long Title', thClass: 'blue-500', tdClass: 'px200', type: 'default', format: 'text', id: 5, sort: '', filter: false, filtervalue: '', predicate: 'S' }
    // { key: 'AdditionalData.Edition', field: 'Edition', label: 'Edition', thClass: 'blue-500', tdClass: 'px110', type: 'AD', format: 'text', id: 6, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    // { key: 'AdditionalData.CurrentPhase', field: ' CurrentPhase', label: 'Current Phase', thClass: 'blue-500', tdClass: 'px150', type: 'AD', format: 'dropdownmulti', id: 7, sort: '', ops: [], filter: false, filtervalue: [] },
    // { key: 'Additional.PhaseStart', field: 'PhaseStart', label: 'Resourced', thClass: 'blue-500', tdClass: 'px130', type: 'default', format: 'dropdown', id: 9, sort: '', ops: [], filtervalue: '' },
    // { key: 'DTIC', field: 'DTIC', label: 'DTIC', thClass: 'blue-500', tdClass: 'px120', type: 'default', format: 'dropdownmulti', id: 10, sort: '', ops: [], filter: false, filtervalue: [] },
    // { key: 'AdditionalData.GeneralStatus', field: 'GeneralStatus', label: 'GeneralStatus', thClass: 'blue-500', tdClass: 'px140', type: 'AD', format: 'dropdownmulti', id: 11, sort: '', ops: [], filter: false, filtervalue: [] },
    // { key: 'NWDCAO.Title', field: 'Title', label: 'NWDC AO', thClass: 'blue-500', tdClass: 'px150', type: 'NWDCAO', format: 'dropdownmulti', id: 12, sort: '', ops: [], filter: false, filtervalue: [] },
    // { key: 'Class', field: 'Class', label: 'Classification', thClass: 'blue-500', tdClass: 'px200', type: 'default', format: 'dropdownmulti', id: 13, sort: '', ops: [], filter: false, filtervalue: [] }
  ]
  columns: any = [
    { field: 'Name', label: 'Name', width: 200 },
    { field: 'Phase', label: 'Phase', width: 50 },
    { field: 'DateEnteredPhase', label: 'Entered Phase', width: 50 },
    { field: 'NumberDaysInPhase', label: 'Days In Current Phase', width: 50 }
    /*{ field: 'LongTitle', label: 'Long Title', width: 250 }
    { field: 'AdditionalData.Edition', label: 'Edition', width: 110 },
    { field: 'AdditionalData.PRAAbbrev', label: 'PRAAbbrev', width: 150 },
    { field: 'Resourced', label: 'Resourced', width: 130 },
    { field: 'DTIC', label: 'DTIC', width: 120 },
    { field: 'AdditionalData.GeneralStatus', label: 'GeneralStatus', width: 150 },
    { field: 'NWDCAO.Title', label: 'NWDC AO', width: 200 },
    { field: 'Class', label: 'Classification', width: 200 }*/
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
    this.setHeaderTitle('Publications In Development Phase Report')
    this.setPubLoaded(false)
    this.getDevPubsForUser()
    this.getDevNatoPubsForUser()
    this.interval = setInterval(this.waitForIt, 500)
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
    //this.filterpubs()
    let q = this.filteredpubs
    this.sortfield = 'Development.Phase'
    this.sortdir = 'asc'

    q = Vue._.orderBy(q, this.sortfield, this.sortdir)
    this.filteredpubs = q
    console.log('filtered pubs ' + this.filteredpubs)
    this.matchPhaseDate()
    //this.buildFilters()
  }
  public calcDays(val: any) {
    let startDate = val
    let date1: Date = new Date()
    let date2: Date = new Date(startDate)
    let timeInMilisec: number = date1.getTime() - date2.getTime()
    let daysBetweenDates: number = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24))
    return daysBetweenDates
  }
  public matchPhaseDate() {
    let a = this.filteredpubs

    for (let i = 0; i < a.length; i++) {
      switch (a[i].Development.Phase) {
        case 'ProjectStart':
          a[i].Development.DateEnteredPhase = a[i].Development.ProjectStart
          a[i].Development.NumberDaysInPhase = this.calcDays(a[i].Development.DateEnteredPhase)
          a[i].Development.Phase = 'Project Started'
          break
        case 'ProjectFinish':
          a[i].Development.DateEnteredPhase = a[i].Development.ProjectFinish
          a[i].Development.NumberDaysInPhase = this.calcDays(a[i].Development.DateEnteredPhase)
          a[i].Development.Phase = 'Project Finished'
          break
        case 'FirstDraft':
          a[i].Development.DateEnteredPhase = a[i].Development.FirstDraft
          a[i].Development.NumberDaysInPhase = this.calcDays(a[i].Development.DateEnteredPhase)
          a[i].Development.Phase = 'First Draft'
          break
        case 'FinalDraft':
          a[i].Development.DateEnteredPhase = a[i].Development.FinalDraft
          a[i].Development.NumberDaysInPhase = this.calcDays(a[i].Development.DateEnteredPhase)
          a[i].Development.Phase = 'Final Draft'
          break
        case 'FinalManuscript':
          a[i].Development.DateEnteredPhase = a[i].Development.FinalManuscript
          a[i].Development.NumberDaysInPhase = this.calcDays(a[i].Development.DateEnteredPhase)
          a[i].Development.Phase = 'Final Manuscript'
          break
        case 'NWDCSignature':
          a[i].Development.DateEnteredPhase = a[i].Development.NWDCSignature
          a[i].Development.NumberDaysInPhase = this.calcDays(a[i].Development.DateEnteredPhase)
          a[i].Development.Phase = 'NWDC Signature'
          break
        case 'PRAApproval':
          a[i].Development.DateEnteredPhase = a[i].Development.PRAApproval
          a[i].Development.NumberDaysInPhase = this.calcDays(a[i].Development.DateEnteredPhase)
          a[i].Development.Phase = 'PRA Approval'
          break
        case 'PhaseFinish':
          a[i].Development.DateEnteredPhase = a[i].Development.PhaseFinish
          a[i].Development.NumberDaysInPhase = this.calcDays(a[i].Development.DateEnteredPhase)
          a[i].Development.Phase = 'Phase Finish'
          break
        case 'ProgramDirective':
          a[i].Development.DateEnteredPhase = a[i].Development.ProgramDirective
          a[i].Development.NumberDaysInPhase = this.calcDays(a[i].Development.DateEnteredPhase)
          a[i].Development.Phase = 'Program Directive'
          break
        case 'SignatureDraft':
          a[i].Development.DateEnteredPhase = a[i].Development.SignatureDraft
          a[i].Development.NumberDaysInPhase = this.calcDays(a[i].Development.DateEnteredPhase)
          a[i].Development.Phase = 'Signature Draft'
          break
        default:
          a[i].Development.DateEnteredPhase = ''
          a[i].Development.NumberDaysInPhase = 0
          a[i].Development.Phase = 'Status Not Set'

          break
      }
      this.filteredpubs = a
      console.log(a)
    }
  }

  @Watch('$route')
  onRouteChanged(val: Route) {
    // do something if the route meta changes
    console.log('ROUTE CHANGED VIA WATCH MODULE - DEVELOPMENT')
    this.filterField = this.$route.params !== null ? this.$route.params.filterField : ''
    this.filterValue = this.$route.params !== null ? this.$route.params.filterValue : ''
    this.filterType = this.$route.params !== null ? this.$route.params.filterType : ''
    //this.filterpubs()
  }

  public viewItem(id: string, nato: string, docid: string, name: string) {
    this.$router.push({ path: '/pubs/development/all/view/' + id + '/' + nato + '/' + docid + '/true/' + encodeURIComponent(name) })
  }

  public getStyle(element, field) {
    let style: any = {}
    switch (element) {
      case 'buttonrow':
        style.background = '#ffffff'
        style.height = '50px'
        style.width = that.contentwidth + 'px'
        break

      case 'maintable':
        style.width = that.contentwidth - 5 + 'px'
        style.height = that.contentheight - 150 + 'px'
        break

      case 'tablerow':
        style.height = that.contentheight - 100 + 'px'
        style.width = that.contentwidth + 'px'
        break

      case 'pagingrow':
        style.height = '50px'
        style.width = that.contentwidth + 'px'
        break

      case 'branchaccordion':
        style.maxHeight = that.contentheight - 180 + 'px'
        style.overflowY = 'scroll'
        style.overflowX = 'hidden'
    }
    return style
  }

  public getSticky(element) {
    let h: any
    switch (element) {
      case 'dynamictable':
        h = that.contentheight - 100 + 'px'
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
