<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-overlay :show="filtereditems.length === 0" :variant="table.overlayVariant" class="contentHeight">
          <b-container fluid class="contentHeight m-0 p-0">
            <b-row no-gutters :class="table.headerClass" :style="getStyle('buttonrow', null)">
              <b-col cols="8" class="mt-1 p-0"></b-col>
              <b-col cols="4" class="mt-1 pr-3">
                <!-- <b-form v-if="searchEnabled" @submit="onSubmit"> -->
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
                <!-- </b-form> -->
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
                    <!-- <b-dropdown split split-variant="light" variant="light" size="sm" :text="data.field.label" toggle-class="text-decoration-none" @show="drawFilterData(data.field.key)"></b-dropdown> -->
                    <dynamic-filter-select :id="'dfs_' + data.field.label" :ready="ready" :type="data.field.type" :ops="data.field.ops" :name="data.field.label" :label="data.field.label" :key="data.field.key" :ad="data.field.key.indexOf('Additional') > 0"></dynamic-filter-select>
                  </template>
                  <!-- <template #head(actions)="data">
                    Actions
                  </template> -->
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
                    <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian" title="Archive" variant="white" size="lg" class="actionbutton text-dark" @click="archiveItem(data.item.Id, data.item.IsNato)">
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
import { ObjectItem } from '@/interfaces/ObjectItem'
import DynamicFilterSelect from './DynamicFilterSelect.vue'

const support = namespace('support')
const users = namespace('users')
const publication = namespace('publication')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

let that: any

@Component({
  name: 'dynamic-table',
  components: {
    DynamicFilterSelect
  },
  props: {
    hascomponents: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object
    },
    ready: {
      type: Boolean,
      default: false
    },
    table: {
      type: Object,
      default: () => {
        return {
          id: 'DynamicTable',
          list: 'ActivePublications',
          primaryKey: 'id',
          buttons: ['Add', 'Edit', 'Export', 'Delete'] /* Add, Edit, Export, Delete, Search */,
          fields: [],
          items: [],
          filterField: {
            Type: String,
            default: ''
          },
          filterValue: '',
          filterType: '',
          overlayText: 'Loading. Please Wait...',
          overlayVariant: 'success'
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
  filter = ''
  filterOn: Array<any> = []
  checkBoxes: Array<any> = ['Prfx', 'Branch']
  Branch!: any
  Prfx!: any
  PubID!: any
  Title!: any
  PRAAbbrev!: any
  Bookshelf!: any
  FunctionalSeries!: any

  @users.State
  public currentUser!: UserInt

  @support.State
  public contentheight!: number

  @support.State
  public contentwidth!: number

  @publication.State
  public prefixes!: Array<ObjectItem>

  @publication.Action
  public getPrefixesByBranch!: (branch: string) => Promise<boolean>

  @support.State
  public bookshelves!: Array<ObjectItem>

  @support.Action
  public getBS!: () => Promise<boolean>

  interval!: any
  filtereditems: Array<any> = []
  currentPage = 1
  totalRows = 0
  perPage = 30 // default

  branches = [
    { value: 'Please Select...', text: 'Please Select...' },
    { value: 'Navy', text: 'Navy' },
    { value: 'Allied', text: 'Allied' },
    { value: 'Joint', text: 'Joint' },
    { value: 'Other', text: 'Other' },
    { value: 'Multinational', text: 'Multinational' }
  ]

  created() {
    that = this
    EventBus.$on('filterView', args => {
      this.filterView(args)
    })
  }

  mounted() {
    // wait for there to be items and then gitrdone
    this.interval = setInterval(this.waitForIt, 500)
  }

  public waitForIt() {
    if (this.$props.table.items.length > 0) {
      const that = this
      console.log('got props items ' + this.$props.table.items.length)
      clearInterval(that.interval)
      this.getBS()
      this.totalRows = this.$props.table.items.length
      this.filtereditems = this.$props.table.items // set initially to all items
      /* if (this.$props.table.filterType === 'NTP') {
        this.Branch = 'Other'
        that.getPrefixesByBranch('Other').then(response => {
          if (response) {
            this.Prfx = 'NTP'
            this.filter = this.Prfx
            this.filterOn = ['Prfx']
          }
        })
      }
      if (this.$props.table.filterType === 'FXP') {
        this.Branch = 'Navy'
        that.getPrefixesByBranch('Navy').then(response => {
          if (response) {
            this.Prfx = 'FXP'
            this.filter = this.Prfx
            this.filterOn = ['Prfx']
          }
        })
      }
      if (this.$props.table.filterType === 'NTRP') {
        this.Branch = 'Navy'
        that.getPrefixesByBranch('Navy').then(response => {
          if (response) {
            this.Prfx = 'NTRP'
            this.filter = this.Prfx
            this.filterOn = ['Prfx']
          }
        })
      }
      if (this.$props.table.filterType === 'NTTP') {
        this.Branch = 'Navy'
        that.getPrefixesByBranch('Navy').then(response => {
          if (response) {
            this.Prfx = 'NTTP'
            this.filter = this.Prfx
            this.filterOn = ['Prfx']
          }
        })
      }
      if (this.$props.table.filterType === 'CONOPS') {
        this.Branch = 'Other'
        that.getPrefixesByBranch('Other').then(response => {
          if (response) {
            this.Prfx = 'CONOPS'
            this.filter = this.Prfx
            this.filterOn = ['Prfx']
          }
        })
      }
      if (this.$props.table.filterType === 'OPTASK') {
        this.Branch = 'Other'
        that.getPrefixesByBranch('Other').then(response => {
          if (response) {
            this.Prfx = 'OPTASK'
            this.filter = this.Prfx
            this.filterOn = ['Prfx']
          }
        })
      }
      if (this.$props.table.filterType === 'Allied') {
        this.Branch = 'Allied'
        that.getPrefixesByBranch('Allied').then(response => {
          if (response) {
            this.filter = this.Branch
            this.filterOn = ['Branch']
          }
        })
      }
      if (this.$props.table.filterType === 'Joint') {
        this.Branch = 'Joint'
        that.getPrefixesByBranch('Joint').then(response => {
          if (response) {
            this.filter = this.Branch
            this.filterOn = ['Branch']
          }
        })
      }
      if (this.$props.table.filterType === 'Multinational') {
        this.Branch = 'Multinational'
        that.getPrefixesByBranch('Multinational').then(response => {
          if (response) {
            this.filter = this.Branch
            this.filterOn = ['Branch']
          }
        })
      }
      if (this.$props.table.filterType === 'Other') {
        this.Branch = 'Other'
        that.getPrefixesByBranch('Other').then(response => {
          if (response) {
            this.filter = this.Branch
            this.filterOn = ['Branch']
          }
        })
      }
      if (this.$props.table.filterType === 'Navy') {
        this.Branch = 'Navy'
        that.getPrefixesByBranch('Navy').then(response => {
          if (response) {
            this.filter = this.Branch
            this.filterOn = ['Branch']
          }
        })
      }
      if (this.$props.table.filterType === 'ATP') {
        this.Branch = 'Allied'
        that.getPrefixesByBranch('Allied').then(response => {
          if (response) {
            this.Prfx = 'ATP'
            this.filter = this.Prfx
            this.filterOn = ['Prfx']
          }
        })
      }
      if (this.$props.table.filterType === 'AJP') {
        this.Branch = 'Allied'
        that.getPrefixesByBranch('Allied').then(response => {
          if (response) {
            this.Prfx = 'AJP'
            this.filter = this.Prfx
            this.filterOn = ['Prfx']
          }
        })
      }
      if (this.$props.table.filterType === 'AMP') {
        this.Branch = 'Allied'
        that.getPrefixesByBranch('Allied').then(response => {
          if (response) {
            this.Prfx = 'AMP'
            this.filter = this.Prfx
            this.filterOn = ['Prfx']
          }
        })
      } */
      /* if (this.$props.table.filterField !== null && this.$props.table.filterField !== '') {
        this.filter = this.$props.table.filterValue
        this.filterOn.push(this.$props.table.filterField)
      } */
      // Calculate perPage based on counting the number of rows that will fit in the available space
      /* let available = this.contentheight - 130
      let amount = Math.floor(available / 29) // 29 is based on the height of the rows used by the 'small' attribute on the b-table component
      this.perPage = amount */
    }
  }

  /* public waitForBranch() {
    console.log('WAITING FOR BRANCH, ')
    if (this.Branch.length > 0) {
      console.log('Branch Loaded')
      clearInterval(that.interval)
    }
  }

  public onBranchSelect() {
    console.log('BRANCH SELECTED')
    if (this.Branch !== null && this.Branch !== 'Please Select...') {
      // call getPrefixesByBranch
      this.getPrefixesByBranch(String(this.Branch)).then(response => {
        if (response) {
          this.filter = this.Branch
          this.filterOn = ['Branch']
        }
      })
    }
  }

  public onPrfxSelect() {
    if (this.Prfx !== null && this.Prfx !== 'Please Select...') {
      this.filter = this.Prfx
      this.filterOn = ['Prfx']
    }
  }

  public onPubIDSelected() {
    if (this.PubID !== null && this.PubID !== '') {
      this.filter = this.PubID
      this.filterOn = ['PubID']
    }
  }

  public onPRAAbbrevSelected() {
    if (this.PRAAbbrev !== null && this.PRAAbbrev !== '') {
      this.filter = this.PRAAbbrev
      this.filterOn = ['AdditionalData.PRAAbbrev']
    }
  }

  public onFunctionalSeriesSelected() {
    if (this.FunctionalSeries !== null && this.FunctionalSeries !== '') {
      this.filter = this.FunctionalSeries
      this.filterOn = ['AdditionalData.FunctionalSeries']
    }
  }

  public onTitleSelected() {
    if (this.Title !== null && this.Title !== '') {
      this.filter = this.Title
      this.filterOn = ['Title']
    }
  }

  public onBookshelfSelected() {
    if (this.Bookshelf !== null && this.Bookshelf !== '') {
      this.filter = this.Bookshelf
      this.filterOn = ['Bookshelf']
    }
  } */

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
        h = that.contentheight - 100 + 'px'
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

  public archiveItem(id: string, nato: string) {
    let args: any = {}
    args.id = id
    args.nato = nato
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
