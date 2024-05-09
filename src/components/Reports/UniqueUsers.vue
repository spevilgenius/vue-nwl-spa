<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <!--<b-overlay :show="!viewReady" :variant="overlayVariant" class="contentHeight">-->
        <b-table id="UniqueUserTable" striped hover :items="items" :fields="fields" :per-page="perPage" :current-page="currentPage">
          <template #cell(Title)="data">
            <b-container fluid>
              <b-row no-gutters>
                <b-col cols="5">
                  {{ data.item.Title }}
                </b-col>
              </b-row>
            </b-container>
          </template>
        </b-table>
        <!--</b-overlay>-->
      </b-col>
    </b-row>
    <b-row no-gutters style="height: 50px" class="mb-7">
      <b-col cols="3">
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="my-0 p-0"></b-pagination>
      </b-col>
      <b-col cols="7">
        <div id="count" style="width: 300px; height: 38px; margin: 0px 0px 0px -1px; padding: 8px 12px; border: 3px black; color: white">{{ totalRows }} Total Sites</div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
//import { ReportItem } from '../../interfaces/ReportItem'
import { UniqueUserReportItem } from '../../interfaces/ReportItem'
import { UserInt } from '../../interfaces/User'

const reports = namespace('reports')
const users = namespace('users')
const support = namespace('support')

@Component
export default class UniqueUsers extends Vue {
  totalRows = 0
  perPage = 10
  currentPage = 1
  viewReady?: boolean = false
  items: Array<UniqueUserReportItem> = []
  results: Array<UniqueUserReportItem> = []
  interval!: any

  fields = [
    { key: 'Title', label: 'Site', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 1 },
    { key: 'ViewsLast7DaysUniqueUsers', label: 'Last 7 Days', sortable: true, type: 'default', format: 'text', tdClass: 'text-center', id: 2 },
    { key: 'ViewsLastMonths1Unique', label: 'Last Month', sortable: true, type: 'default', format: 'text', tdClass: 'text-center', id: 3 },
    { key: 'ViewsLastMonths3Unique', label: 'Last 3 Months', sortable: true, type: 'default', format: 'text', tdClass: 'text-center', id: 4 },
    { key: 'ViewsLifetimeUniqueUsers', label: 'Life Time', sortable: true, type: 'default', format: 'text', tdClass: 'text-center', id: 5 }
    //{ key: 'Library', label: 'Library', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 2 }
  ]
  @support.Action
  public setHeaderTitle!: (title: string) => void

  @users.State
  public currentUser!: UserInt
  @reports.State
  public uniqueUsersLoaded!: boolean

  @reports.State
  public uniqueUserResults!: Array<UniqueUserReportItem>

  @reports.Action
  public getUniqueUserResults!: () => Promise<boolean>

  mounted() {
    this.setHeaderTitle('Unique Users')
    this.$nextTick(function () {
      console.log('UNIQUE USERS REPORT MOUNTED')
      this.getUniqueUserResults()
      this.interval = setInterval(this.waitForIt, 500)
    })
  }
  public waitForIt() {
    if (this.uniqueUsersLoaded === true) {
      clearInterval(this.interval)
      this.items = this.uniqueUserResults
      this.totalRows = this.items.length
      console.log(this.items)
      this.viewReady = true
    }
  }
}
</script>
