<!-- eslint-disable vue/no-unused-vars -->
<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-overlay :show="filtereditems.length === 0" :variant="table.overlayVariant" class="contentHeight">
          <b-container fluid class="contentHeight m-0 p-0">
            <b-row no-gutters :class="table.headerClass" :style="getStyle('buttonrow', null)">
              <b-col cols="8" class="mt-1 p-0">
                <!-- <b-container fluid class="m-0 p-0">
                  <b-row no-gutters>
                    <b-form-select class="form-control px100" size="sm" id="ddBranch" v-model="Branch" :options="branches" @change="onBranchSelect" ref="Branch" v-b-tooltip.hover.v-dark title="Indicates the branch of the library to which the publication belongs. Supports filtering of publications."></b-form-select>
                    <b-form-select class="form-control px100 ml-1" size="sm" id="ddPrefix" v-model="Prfx" :options="prefixes" @change="onPrfxSelect" ref="Prefix"></b-form-select>
                  </b-row>
                </b-container> -->
              </b-col>
              <b-col cols="4" class="mt-1 pr-3">
                <!-- <b-form v-if="searchEnabled" @submit="onSubmit"> -->
                <b-input-group class="float-right">
                  <b-form-input v-model="filter" placeholder="Filter..." type="search"></b-form-input>
                  <b-input-group-append>
                    <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
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
                  :style="getStyle('maintable', null)"
                  table-variant="light"
                  @filtered="onFiltered"
                >
                  <template #thead-top="">
                    <b-tr>
                      <b-th>Filters</b-th>
                      <b-th><b-form-select class="form-control px100" size="sm" id="ddBranch" v-model="Branch" :options="branches" @change="onBranchSelect" ref="Branch" v-b-tooltip.hover.v-dark title="Indicates the branch of the library to which the publication belongs. Supports filtering of publications."></b-form-select></b-th>
                      <b-th
                        ><b-form-select class="form-control px100 ml-1" size="sm" id="ddPrefix" v-model="Prfx" :options="prefixes" @change="onPrfxSelect" ref="Prefix"
                          ><template #first>
                            <b-form-select-option value="" disabled>Select Branch</b-form-select-option>
                          </template></b-form-select
                        ></b-th
                      >
                      <b-th><b-form-input class="form-control" size="sm" v-model="PubID" @input="onPubIDSelected"></b-form-input></b-th>
                      <b-th><b-form-input class="form-control" size="sm" v-model="Title" @input="onTitleSelected"></b-form-input></b-th>
                      <b-th><b-form-select class="form-control-bookshelf" v-model="Bookshelf" :options="bookshelves" ref="Bookshelves" @change="onBookshelfSelected"></b-form-select></b-th>
                      <b-th></b-th>
                      <b-th><b-form-input class="form-control p-r-20" size="sm" v-model="PRAAbbrev" @input="onPRAAbbrevSelected"></b-form-input></b-th>
                    </b-tr>
                  </template>
                  <template #cell(actions)="data">
                    <b-button size="sm" variant="success" class="actionbutton text-light" @click="viewItem(data.item.Id, data.item.IsNato)">
                      <font-awesome-icon v-if="String(data.item.Name).indexOf('.docx') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.doc') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.pdf') > 0" :icon="['far', 'file-pdf']" class="icon"></font-awesome-icon>
                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.txt') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.rtf') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                    </b-button>
                    <b-button v-if="currentUser.isLibrarian || currentUser.isActionOfficer" size="sm" variant="warning" class="actionbutton text-light" @click="editItem(data.item.Id, data.item.IsNato)">
                      <font-awesome-icon :icon="['far', 'edit']" class="icon"></font-awesome-icon>
                    </b-button>
                  </template>
                  <template #cell()="data">
                    <div v-if="data.field.format === 'text'">{{ renderElement(data) }}</div>
                    <!-- <div v-if="data.field.key === 'actions'">
                      <component v-for="comp in data.item.ActionButtons" :key="comp.id" :is="comp.component" v-bind="comp.props"></component>
                    </div> -->
                  </template>
                </b-table>
              </b-col>
            </b-row>
            <b-row no-gutters :style="getStyle('pagingrow', null)">
              <b-col cols="12">
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="my-0"></b-pagination>
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
  filter = null
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
  perPage = 20 // default

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
  }

  mounted() {
    // wait for there to be items and then gitrdone
    this.interval = setInterval(this.waitForIt, 500)
  }

  public waitForIt() {
    if (this.$props.table.items.length > 0) {
      console.log('got props items ' + this.$props.table.items.length)
      clearInterval(that.interval)
      this.getBS()
      this.totalRows = this.$props.table.items.length
      this.filtereditems = this.$props.table.items // set initially to all items
      if (this.$props.table.filterField !== null && this.$props.table.filterField !== '') {
        this.filter = this.$props.table.filterValue
        this.filterOn.push(this.$props.table.filterField)
      }
      // Calculate perPage based on counting the number of rows that will fit in the available space
      let available = this.contentheight - 130
      let amount = Math.floor(available / 29) // 29 is based on the height of the rows used by the 'small' attribute on the b-table component
      this.perPage = amount
    }
  }

  public onBranchSelect() {
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

  public getStyle(element, field) {
    let style: any = {}
    switch (element) {
      case 'buttonrow':
        style.background = '#ffffff'
        style.height = '50px'
        style.width = that.contentwidth + 'px'
        break

      /* case 'maintable':
        style.width = that.contentwidth - 5 + 'px'
        break */

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
}
</script>

<style lang="scss">
.table-full,
.table-full td,
.table-full th {
  border: 1px solid #000000 !important;
  height: 20px;
  padding: 2px 5px !important;
}
</style>
