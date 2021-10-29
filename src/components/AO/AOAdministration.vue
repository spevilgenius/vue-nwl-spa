<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0 accordion contentHeight" role="tablist">
        <b-card no-body class="mb-1 contentHeight">
          <b-card-header header-tag="header" class="p-1" role="tab" cols="6">
            <b-button block v-b-toggle.accordion-1 variant="info">Navy Pubs by Resourced</b-button>
          </b-card-header>
          <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-table
                striped
                hover
                :items="filterednoresourcedpubs"
                :fields="fields"
                primary-key="primarykey"
                :filter="filter"
                :filter-included-fields="filterOn"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :per-page="perPage"
                :current-page="currentPage"
                table-class="table-full"
                :sticky-header="getSticky('dynamictable')"
                table-variant="light"
                thead-class="tbl-dynamic-header"
                @filtered="onFiltered"
                caption-top
                style="max-height: 350px"
              >
                <template #table-caption>Not Resourced</template>
              </b-table>
            </b-card-body>
            <b-card-body>
              <b-table
                striped
                hover
                :items="filteredyesresourcedpubs"
                :fields="fields"
                primary-key="primarykey"
                :filter="filter"
                :filter-included-fields="filterOn"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :per-page="perPage"
                :current-page="currentPage"
                table-class="table-full"
                :sticky-header="getSticky('dynamictable')"
                table-variant="light"
                thead-class="tbl-dynamic-header"
                @filtered="onFiltered"
                caption-top
                style="max-height: 350px"
              >
                <template #table-caption>Resourced</template>
              </b-table>
            </b-card-body>
          </b-collapse>
        </b-card>
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
import { concat } from 'lodash'

const users = namespace('users')
const publication = namespace('publication')
const support = namespace('support')

@Component({
  name: 'All',
  components: {
    DynamicTable
  }
})
export default class AoAdministration extends Vue {
  tblId = 'DynamicTable'
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
  filteredresourcedpubs: Array<PublicationItem> = []
  filteredyesresourcedpubs: Array<PublicationItem> = []
  filterednoresourcedpubs: Array<PublicationItem> = []
  Prfx: any
  viewReady?: boolean = false

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

  @support.State
  public contentheight!: number

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

  fields: any = [
    { key: 'actions', label: 'Actions', actions: ['View', 'Edit'], thClass: 'tbl-dynamic-header', id: 0 },
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
    console.log('Hello World')
    EventBus.$on('viewItem', args => {
      this.viewPub(args)
    })
    EventBus.$on('editItem', args => {
      this.editPub(args)
    })
  }

  /** @method - lifecycle hook */

  mounted() {
    console.log('Hello World2')
    this.getAllNatoPublications()
    this.getAllPublications()
    this.getAllDevPublications()
    /* this.getAllNatoDevPublications() */
    this.interval = setInterval(this.waitForIt, 500)
  }

  public waitForIt() {
    console.log('Hello World3')
    if (this.pubsloaded && this.natopubsloaded) {
      clearInterval(this.interval)
      this.createAllPubs()
      this.createAllDevPubs()
      this.filterResourced()
      console.log('filter should have ran')
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
        console.log('filterField=' + this.filterField)
        console.log('filterValue=' + this.filterValue)
        console.log('filterType=' + this.filterType)
        this.filteredpubs = this.allpublications
        this.filteredresourcedpubs = this.allpublications
        console.log('FILTEREDPUBS = ' + this.filteredpubs)
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
        if (this.filterType === 'AOResourced') {
          let a = this.filteredresourcedpubs
          a = a.filter(search => Vue._.isEqual(search['Branch'], 'Navy'))
          a = a.filter(d => d.AdditionalData.ProjectStatus === 'Not Started')
          a = a.filter(d => d.Prfx !== 'TACMEMO')
          this.filteredpubs = a
        }
        this.viewReady = true
      }
    }
  }

  public getSticky(element) {
    let that = this
    let h: any
    switch (element) {
      case 'dynamictable':
        h = that.contentheight - 100 + 'px'
        break
    }
    return h
  }

  public filterResourced() {
    this.filteredresourcedpubs = this.allpublications
    let a = this.filteredresourcedpubs
    console.log('0 filter = ' + a)
    a = a.filter(search => Vue._.isEqual(search['Branch'], 'Navy'))
    console.log('1st filter = ' + a)
    console.log(a.length)
    /* console.log(JSON.stringify(a)) */
    // Project status was used in nwl 2.0, but that column did not carry over
    /* a = a.filter(search => Vue._.isEqual(search['AdditionalData.ProjectStatus'], 'Not Started')) */
    /* a = a.filter(d => d.AdditionalData.ProjectStatus === 'Not Started') */
    /* console.log('2nd filter = ' + a) */
    a = a.filter(d => d.Prfx !== 'TACMEMO')
    console.log('3rd filter = ' + a)
    let b = a
    a = a.filter(d => d.Resourced === 'No')
    b = b.filter(d => d.Resourced === 'Yes')
    this.filterednoresourcedpubs = a
    this.filteredyesresourcedpubs = b
  }

  viewPub(args: any) {
    this.$router.push({ name: 'View Publication', params: { Id: args.id, Nato: args.nato } })
  }
  editPub(args: any) {
    this.$router.push({ name: 'Edit Publication', params: { Id: args.id, Nato: args.nato } })
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
#caption {
  padding: 0;
  margin: 0;
}
</style>
