<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <!-- <b-overlay :show="!viewReady" :variant="overlayVariant" class="contentHeight"> -->
        <b-container fluid class="contentHeight m-0 p-0">
          <b-card no-body>
            <b-tabs class="tabarea" card>
              <b-tab class="vtab all" active>
                <template slot="title">
                  <font-awesome-icon fas :icon="tabIcon" class="icon" :class="(tabTitle = 'Report')"></font-awesome-icon>
                  {{ tabTitle }}
                </template>
                <b-row no-gutters>
                  <b-col cols="2">
                    <b-form-datepicker id="dateStart" placeholder="Select a Start date" size="sm" v-model="dateStart" today-variant="dark" today-button reset-button close-button locale="en-US"></b-form-datepicker>
                  </b-col>
                  <b-col cols="2">
                    <b-form-datepicker id="dateEnd" placeholder="Select an End date" size="sm" v-model="dateEnd" today-variant="dark" today-button reset-button close-button locale="en-US"></b-form-datepicker>
                  </b-col>
                  <b-col cols="2">
                    <b-button variant="success" @click="getData">Search</b-button>
                  </b-col>
                </b-row>
                <container>
                  <b-row no-gutters>
                    <b-col cols="12" v-if="pubsPostedReportItems.length > 0"></b-col>
                    <b-col cols="12" v-else :show="showAlert">
                      <span id="noDataMsg">No Publications Found In This Date Range</span>
                    </b-col>
                  </b-row>
                </container>
                <b-row no-gutters v-if="pubsPostedReportItems.length > 0" :show="dataReady">
                  <b-col cols="12">
                    <b-table striped hover :items="items" :fields="fields" primary-key="primarykey" :per-page="perPage" :current-page="currentPage" table-class="table-full" table-variant="light" thead-class="blue-500 text-white">
                      <template #cell(Title)="data">
                        <b-container fluid>
                          <b-row no-gutters>
                            <b-col cols="12">
                              {{ data.item.Title }}
                            </b-col>
                            <!-- <b-col cols="3">
                                {{ data.item.DateCreated }}
                              </b-col> -->
                          </b-row>
                        </b-container>
                      </template>
                    </b-table>
                  </b-col>
                </b-row>

                <b-row no-gutters :show="dataReady">
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
                  <excel-export-button :data="items" :columns="columns" :file-name="'Export'" :file-type="'xlsx'" :sheet-name="'Export'"></excel-export-button>
                </li>
              </template>
            </b-tabs>
          </b-card>
        </b-container>
        <!-- <template #overlay :show="!viewReady">
              <div class="text-center">
                <p id="busy-label">{{ overlayText }}</p>
              </div>
            </template> -->
        <!-- </b-overlay> -->
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { ReportItem } from '../../interfaces/ReportItem'
import { UserInt } from '../../interfaces/User'
import ExcelExportButton from '../Custom/ExcelExportButton.vue'
import { Route } from 'vue-router'

const reports = namespace('reports')
const users = namespace('users')
const support = namespace('support')

let that: any

@Component({
  name: 'PublicationsPosted',
  components: {
    ExcelExportButton
  }
})
export default class PublicationsPosted extends Vue {
  @Prop() filterFields: any
  @Prop() filterField: any
  @Prop() filterValue: any
  @Prop() filterType: any
  @Prop() Title: any

  totalRows = 0
  perPage = 15
  currentPage = 1
  viewReady?: boolean = false
  dataReady?: boolean = false
  noData?: boolean = false
  showAlert?: boolean = false
  items: Array<ReportItem> = []
  interval!: any
  dateStart!: any
  dateEnd!: any
  tabTitle = 'All'
  tabIcon = 'battery-full'
  rowHeight = 0
  pageSize = 20
  primaryKey = 'ID'
  overlayText = 'Getting Publications. Please wait...'
  overlayVariant = 'warning'
  noPubsfound = 'No Publications Found In This Date Range'

  filter = ''

  fields: any = [
    { key: 'Title', field: 'Title', label: 'Document Name', thClass: 'blue-500', tdClass: 'px700', type: 'default', format: 'text', id: 1, sortable: true, items: '', predicate: 'S' },
    { key: 'DateCreated', field: 'DateCreated', label: 'Date Posted', thClass: 'blue-500', tdClass: 'px75', type: 'default', format: 'text', id: 2, sortable: true, filter: false, items: '', predicate: 'S' }
  ]
  columns: any = [
    { field: 'Title', label: 'Document Name', width: 700 },
    { field: 'DateCreated', label: 'Date Created', width: 75 }
  ]
  @users.State
  public currentUser!: UserInt

  @reports.State
  public postedItemsLoaded!: boolean

  @reports.State
  public pubsPostedReportItems!: Array<ReportItem>

  @support.Action
  public setHeaderTitle!: (title: string) => void

  @reports.Action
  public getPubsPostedResults!: (data: any) => Promise<boolean>

  getData() {
    //this.clear()
    this.setHeaderTitle('NATO Publications Posted Between ' + this.dateStart + ' & ' + this.dateEnd)
    this.$nextTick(function () {
      console.log('PUB POSTED REPORT MOUNTED')
      let data: any = {}
      if (this.dateStart == '' || this.dateEnd == '') {
        this.showAlert = true
        //alert('A Valid Start Date or End Date Has Not Been Selected')
      }
      data.dateStart = this.dateStart
      data.dateEnd = this.dateEnd
      data.isNato = true
      this.getPubsPostedResults(data)
      this.interval = setInterval(this.waitForIt, 500)
    })
  }
  clear() {
    clearInterval(this.interval)
    this.items = [{}]
    this.totalRows = 0
    this.noData = false
    this.dataReady = false
    this.viewReady = false
    this.dateStart = ''
    this.dateEnd = ''
  }
  mounted() {
    this.dateStart = '' //'2021-06-20'
    this.dateEnd = '' //'2022-08-20'
    this.setHeaderTitle('NATO Publications Posted')
  }
  public waitForIt() {
    if (this.postedItemsLoaded === true) {
      clearInterval(this.interval)
      this.items = this.pubsPostedReportItems
      this.totalRows = this.items.length
      console.log(this.items)
      this.noData = false
      this.dataReady = true
      this.viewReady = true
    } else if (this.totalRows == 0) {
      this.noData = true
    }
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

#noDataMsg {
  font-size: 1.2em;
  font-weight: bold;
  color: red;
}
</style>
