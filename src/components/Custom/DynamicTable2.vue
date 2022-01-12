<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-overlay :show="!ready" :variant="table.overlayVariant" class="contentHeight">
          <b-container fluid class="contentHeight m-0 p-0">
            <b-card no-body>
              <b-tabs class="tabarea" card v-model="viewtabs">
                <b-tab class="vtab grouped">
                  <template slot="title">
                    <font-awesome-icon fas icon="layer-group" class="icon"></font-awesome-icon>
                    Grouped
                  </template>
                  <b-row>
                    <b-table :items="branches" :fields="branchfields" ref="tableGroupBranch">
                      <template #cell(actions)="row">
                        <b-button size="sm" variant="outline" class="actionbutton" @click="toggleBranchDetails(row)">
                          <font-awesome-icon v-if="row.detailsShowing" far class="ml-1" icon="minus-square" :style="{ color: 'black' }"></font-awesome-icon>
                          <font-awesome-icon v-else far class="ml-1" icon="plus-square" :style="{ color: 'black' }"></font-awesome-icon>
                        </b-button>
                      </template>
                      <template #cell(title)="row"> {{ row.item.value }} (<span v-html="getCount('branch', row.item.value, null, null)"></span>) </template>
                      <template #row-details="row">
                        <b-table :items="getSeries(row.item.value)" :fields="viewfields">
                          <template #cell(actions)="row">
                            <b-button size="sm" variant="outline" class="actionbutton" @click="toggleSeriesDetails">
                              <font-awesome-icon v-if="row.detailsShowing" far class="ml-1" icon="minus-square" :style="{ color: 'black' }"></font-awesome-icon>
                              <font-awesome-icon v-else far class="ml-1" icon="plus-square" :style="{ color: 'black' }"></font-awesome-icon>
                            </b-button>
                          </template>
                          <template #cell(title)="row"> {{ row.item.value }} (<span v-html="getCount('branch', row.item.value, null, null)"></span>) </template>
                        </b-table>
                      </template>
                    </b-table>
                  </b-row>
                </b-tab>
                <b-tab class="vtab all" active>
                  <template slot="title">
                    <font-awesome-icon fas icon="battery-full" class="icon"></font-awesome-icon>
                    All
                  </template>
                  <b-row no-gutters :class="table.headerClass" :style="getStyle('buttonrow', null)">
                    <b-col cols="8" class="mt-1 p-0"></b-col>
                    <b-col cols="4" class="mt-1 pr-3">
                      <b-input-group class="float-right">
                        <b-form-input v-model="filter" placeholder="Filter..." type="search"></b-form-input>
                        <b-input-group-append>
                          <b-button
                            :disabled="!filter"
                            @click="
                              filter = ''
                              filterOn = []
                            "
                            title="Clear filters to show all pubs."
                            >Clear</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                    </b-col>
                  </b-row>
                  <b-row no-gutters :style="getStyle('tablerow', null)">
                    <b-col cols="12">
                      <b-table
                        striped
                        hover
                        :items="filtereditems"
                        :fields="table.fields"
                        primary-key="table.primarykey"
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
                      >
                        <template #head()="data">
                          <dynamic-filter-select :id="'dfs_' + data.field.label" :ready="ready" :type="data.field.type" :ops="data.field.ops" :name="data.field.label" :label="data.field.label" :key="data.field.key" :ad="data.field.key.indexOf('Additional') > 0"></dynamic-filter-select>
                          <!-- <dynamic-filter-select v-if="this.kind === 'Active'" :id="'dfs_' + data.field.label" :ready="ready" :type="data.field.type" :ops="data.field.ops" :name="data.field.label" :label="data.field.label" :key="data.field.key" :ad="data.field.key.indexOf('Additional') > 0"></dynamic-filter-select> -->
                        </template>
                        <template #head(actions)>
                          Actions
                        </template>
                        <template #cell(actions)="data">
                          <b-button title="View" variant="white" size="lg" class="actionbutton text-dark" @click="viewItem(data.item.Id, data.item.IsNato)">
                            <font-awesome-icon v-if="String(data.item.Name).indexOf('.docx') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                            <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.doc') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                            <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.pdf') > 0" :icon="['far', 'file-pdf']" class="icon"></font-awesome-icon>
                            <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.txt') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                            <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.rtf') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                          </b-button>
                          <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" title="Edit" variant="white" size="lg" class="actionbutton text-dark" @click="editItem(data.item.Id, data.item.IsNato)">
                            <font-awesome-icon :icon="['far', 'edit']" class="icon"></font-awesome-icon>
                          </b-button>
                          <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian" title="Archive" variant="white" size="lg" class="actionbutton text-dark" @click="archiveItem(data.item.Id, data.item.IsNato, data.item)">
                            <font-awesome-icon :icon="['fas', 'sync']" class="icon"></font-awesome-icon>
                          </b-button>
                        </template>
                        <template #cell(Name)="data">
                          <!-- <b-link :to="{ name: 'View Publication', params: { Id: data.item.Id, Nato: data.item.IsNato } }">{{ data.item.Title }}</b-link> -->
                          <b-link :to="{ name: 'View Publication', query: { Id: data.item.Id, Nato: data.item.IsNato, Now: new Date().getTime() } }">{{ data.item.Name }}</b-link>
                        </template>
                        <template #cell()="data">
                          <div v-if="data.field.format === 'text'">{{ renderElement(data) }}</div>
                        </template>
                      </b-table>
                    </b-col>
                  </b-row>
                  <b-row no-gutters :style="getStyle('pagingrow', null)">
                    <b-col cols="6">
                      <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="my-0" first-number last-number></b-pagination>
                    </b-col>
                    <b-col>
                      <div class="pubcount"># Publications Found: {{ this.totalRows }}</div>
                    </b-col>
                  </b-row>
                </b-tab>
              </b-tabs>
            </b-card>
          </b-container>
          <template #overlay>
            <div class="text-center">
              <p id="busy-label">{{ table.overlayText }}</p>
            </div>
          </template>
        </b-overlay>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable vue/no-unused-vars */
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { EventBus } from '../../main'
import { UserInt } from '../../interfaces/User'
import { PublicationItem } from '@/interfaces/PublicationItem'
import { GroupItem } from '@/interfaces/GroupItem'
import { ObjectItem } from '@/interfaces/ObjectItem'

const support = namespace('support')
const users = namespace('users')
const publication = namespace('publication')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

let that: any

@Component({
  name: 'dynamic-table',
  props: {
    hascomponents: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object
    },
    kind: {
      type: String,
      default: 'Active'
    },
    ready: {
      type: Boolean,
      default: false
    },
    group: {
      type: Object,
      default: () => {
        return {
          groups: {
            Type: Number,
            default: 3 // includes grouping at branch level first
          },
          firstgroup: 'Branch',
          secondgroup: 'FunctionalSeries',
          thirdgroup: 'FunctionalField',
          branch: 'All' // includes grouping at branch level first
        }
      }
    },
    table: {
      type: Object,
      default: () => {
        return {
          id: 'DynamicTable',
          list: 'ActivePublications',
          primaryKey: 'id',
          // buttons: ['Add', 'Edit', 'Export', 'Delete'] /* Add, Edit, Export, Delete, Search */,
          fields: [],
          items: [],
          filterField: {
            Type: String,
            default: ''
          },
          filterValue: '',
          filterType: ''
        }
      }
    },
    searchEnabled: {
      type: Boolean,
      default: false
    }
  }
})
export default class DynamicTable extends Vue {
  overlayText = 'Loading. Please Wait...'
  overlayVariant = 'success'
  ready = false
  filter = ''
  filterOn: Array<any> = []
  checkBoxes: Array<any> = ['Prfx', 'Branch']
  Branch!: any
  Prfx!: any
  PubID!: any
  Title!: any
  PRAAbbrev!: any
  Bookshelf!: any

  @users.State
  public currentUser!: UserInt

  @support.State
  public contentheight!: number

  @support.State
  public contentwidth!: number

  @publication.State
  public allpublications!: Array<PublicationItem>

  @publication.State
  public prefixes!: Array<ObjectItem>

  @publication.State
  public branches!: Array<ObjectItem>

  @publication.State
  public functionalseries!: Array<ObjectItem>

  @publication.State
  public functionalfields!: Array<ObjectItem>

  @publication.Action
  public getBranches!: () => Promise<boolean>

  @publication.Action
  public getPrefixesByBranch!: (branch: string) => Promise<boolean>

  @publication.Action
  public getFunctionalSeriesByBranch!: (branch: string) => Promise<boolean>

  @publication.Action
  public returnFunctionalSeriesByBranch!: (branch: string) => Promise<GroupItem>

  @publication.Action
  public returnFunctionalFieldByFunctionalSeries!: (series: string) => Promise<GroupItem>

  @publication.Action
  public clearFunctionalSeries!: () => void

  @publication.Action
  public getFunctionalFieldByFunctionalSeries!: (series: string) => Promise<boolean>

  @support.State
  public bookshelves!: Array<ObjectItem>

  @support.Action
  public getBS!: () => Promise<boolean>

  interval!: any
  filtereditems: Array<PublicationItem> = []
  groupeditems: Array<GroupItem> = [] // will be created from the filtered items
  currentPage = 1
  totalRows = 0
  perPage = 30 // default

  branchfields: any = [
    { key: 'actions', field: 'actions', label: '    ', actions: ['View', 'Edit'], thClass: 'tbl-dynamic-header', tdClass: 'px50' },
    { key: 'title', field: 'title', label: 'Branch', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px200' }
  ]
  viewfields = this.$props.table.fields
  selected = []

  created() {
    that = this
    EventBus.$on('filterView', args => {
      this.filterView(args)
    })
  }

  mounted() {
    // wait for there to be items and then gitrdone
    this.getBranches().then(response => {
      this.interval = setInterval(this.waitForIt, 500)
    })
  }

  public waitForIt() {
    if (this.$props.table.items.length > 0) {
      const that = this
      console.log('got props items ' + this.$props.table.items.length)
      clearInterval(that.interval)
      this.getBS()
      this.totalRows = this.$props.table.items.length
      this.filtereditems = this.$props.table.items // set initially to all items
      this.buildGroupedItems()
      // Calculate perPage based on counting the number of rows that will fit in the available space
      /* let available = this.contentheight - 130
      let amount = Math.floor(available / 29) // 29 is based on the height of the rows used by the 'small' attribute on the b-table component
      this.perPage = amount */
    }
  }

  public filterView(args: any) {
    console.log('FILTERVIEW: ' + args.selected)
    let a = this.$props.table.items // .allpublications
    this.filterOn = args.key
    if (args.selected === 'clear') {
      this.filter = ''
    } else {
      this.filter = args.selected
    }
  }

  public onFiltered(filtereditems) {
    this.totalRows = filtereditems.length
    this.currentPage = 1
  }

  public toggleRow() {
    // show or hide details for row.
    // supports only showing one at a time for performance
  }

  public async buildGroupedItems() {
    // will loop through filtered items and create groupeditems array
    // empty the array first then fill it back as filters/data changes
    console.log('[BUILDING GROUPED ITEMS ARRAY]')
    this.groupeditems = []
    let a = this.filtereditems
    // if the filter type is set to All we will start at the branch level but if not we will start at the series level
    if (this.$props.table.filterType === 'All') {
      // start at branches first
      // We can assume based on data and earlier versions that every branch has at least 1 or more items
      for (let i = 0; i < this.branches.length; i++) {
        let p: GroupItem = {}
        p.type = 'Branch'
        p.text = this.branches[i].text
        let b = a.filter(search => Vue._.isEqual(search['Branch'], p.text))
        p.count = b.length
        p.children = []
        p.items = b
        this.groupeditems.push(p)
      }
      for (let i = 0; i < this.groupeditems.length; i++) {
        // get the series and fields based on each branch
        // get series for this branch
        let branch = this.groupeditems[i].text
        if (branch) {
          let response = await this.returnFunctionalSeriesByBranch(branch)
          this.groupeditems[i].children = response.children
        }
      }
      for (let i = 0; i < this.groupeditems.length; i++) {
        // get the fields now
        // only branch Navy has fields
        if (this.groupeditems[i].text === 'Navy') {
          let children = this.groupeditems[i].children
          if (children && children.length > 0) {
            for (let j = 0; j < children.length; j++) {
              let series = children[j].text
              if (series) {
                let response = await this.returnFunctionalFieldByFunctionalSeries(series)
                children[j].children = response.children
              }
            }
          }
        }
      }
    } else {
      // start at series first
    }
    this.ready = true
  }

  public getCount(type: string, branch: string | null, fSeries: string | null, fField: string | null) {
    console.log('getCount called')
    let result = 0
    let a = this.filtereditems
    switch (type) {
      case 'branch': {
        let b = a.filter(search => Vue._.isEqual(search['Branch'], branch))
        result = b.length
        break
      }
    }
    return result
  }

  public getSeries(branch: string) {
    // This function is supposed to get all the unique Functional Series based on the branch.
    // There are 2 ways that this can be done. 1: Just call the function from the store and pass in the branch. 2: Loop the actual items and retrieve the data from the filtered items
    // TODO: Determine if having empty datasets is feasible as this supports option 1 and is easier in most cases. [We are opting for option 1 until we can validate data integrity]
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

  public getSticky(element) {
    let h: any
    switch (element) {
      case 'dynamictable':
        h = that.contentheight - 150 + 'px'
        break
    }
    return h
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
        style.height = that.contentheight - 200 + 'px'
        break

      case 'tablerow':
        style.height = that.contentheight - 150 + 'px'
        style.width = that.contentwidth + 'px'
        break

      case 'pagingrow':
        style.height = '50px'
        style.width = that.contentwidth + 'px'
        break
    }
    return style
  }

  public viewItem(id: string, nato: string) {
    let args: any = {}
    args.id = id
    args.nato = nato
    EventBus.$emit('viewItem', args)
  }

  public editItem(id: string, nato: string) {
    let args: any = {}
    args.id = id
    args.nato = nato
    EventBus.$emit('editItem', args)
  }

  public archiveItem(id: string, nato: string, item: any) {
    let args: any = {}
    args.id = id
    args.nato = nato
    args.item = item
    EventBus.$emit('archiveItem', args)
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
/* .pubtitle {
  max-width: 500px;
} */
</style>
