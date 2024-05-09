<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <!--<b-overlay :show="!viewReady" :variant="overlayVariant" class="contentHeight">-->
        <b-table id="TopPubTable" striped hover :items="items" :fields="fields" :per-page="perPage" :current-page="currentPage">
          <template #cell(Title)="data">
            <b-container fluid>
              <b-row no-gutters>
                <b-col cols="1">
                  <div style="width: 16px; height: 16px"></div>
                </b-col>
                <b-col cols="6">
                  {{ data.item.Title }}
                </b-col>
                <b-col cols="1">
                  <!-- {{ data.item.ViewsRecent }} -->
                </b-col>
                <b-col cols="1">
                  <!-- {{ data.item.ViewsLifeTime }} -->
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
        <div id="count" style="width: 300px; height: 38px; margin: 0px 0px 0px -1px; padding: 8px 12px; border: 3px black; color: white">{{ totalRows }} Items Total Documents</div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { ReportItem } from '../../interfaces/ReportItem'
import { UserInt } from '../../interfaces/User'

const reports = namespace('reports')
const users = namespace('users')
const support = namespace('support')

@Component
export default class TopPublications extends Vue {
  totalRows = 0
  perPage = 10
  currentPage = 1
  viewReady?: boolean = false
  items: Array<ReportItem> = []
  results: Array<ReportItem> = []
  interval!: any

  fields = [
    //{ key: 'Rank', label: 'Rank', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 1 },
    //{ key: 'DocID', label: 'DocId', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 3 },
    { key: 'ID', label: 'Rank', sortable: true, type: 'default', format: 'text', tdClass: 'text-center', id: 1 },
    { key: 'Title', label: 'Document Name', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 2 },
    { key: 'ViewsRecent', label: 'Recent Views', sortable: true, type: 'default', format: 'text', tdClass: 'text-center', id: 3 },
    { key: 'ViewsLifeTime', label: 'Views for Lifetime', sortable: true, type: 'default', format: 'text', tdClass: 'text-center', id: 4 }
    //{ key: 'IsDoc', label: 'IsDoc', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 3 }
    //{ key: 'Description', label: 'Description', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 2 }
    //{ key: 'Library', label: 'Library', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 2 }
  ]
  @support.Action
  public setHeaderTitle!: (title: string) => void
  @users.State
  public currentUser!: UserInt
  @reports.State
  public topPubsReportloaded!: boolean

  @reports.State
  public topPubsReportResults!: Array<ReportItem>

  @reports.Action
  public getTopPubsResults!: () => Promise<boolean>

  mounted() {
    this.setHeaderTitle('Top Publications')
    this.$nextTick(function () {
      console.log('TOP PUBS REPORT MOUNTED')
      this.getTopPubsResults()
      this.interval = setInterval(this.waitForIt, 500)
    })
  }
  public waitForIt() {
    if (this.topPubsReportloaded === true) {
      clearInterval(this.interval)
      this.items = this.topPubsReportResults
      this.totalRows = this.items.length
      console.log(this.items)
      this.viewReady = true
    }
  }
}
</script>
