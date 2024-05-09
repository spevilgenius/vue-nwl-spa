<template>
  <b-container fluid class="contentHeight m-2 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="contentHeight m-0 p-0">
          <b-row no-gutters :class="table.headerClass" :style="getStyle('buttonrow', null)">
            <b-col cols="4" class="float-left">
              <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="my-0"></b-pagination>
            </b-col>
            <b-col v-if="currentUser.isTerminologist" cols="4">
              <b-button v-if="currentUser.isTerminologist" @click="$bvModal.show('bv-modal-addTerm')" style="height: 35px">New Term/Acronym</b-button>
              <b-modal size="xl" id="bv-modal-addTerm" :no-close-on-backdrop="true" hide-footer scrollable title="Add New Term/Acronym">
                <b-container fluid class="m-0 p-0" :style="getStyle('modalheight', null)">
                  <b-row no-gutters>
                    <b-col cols="12" class="m-0 p-1">
                      <iframe type="iframe" :style="getStyle('iframeheight', null)" width="100%" src="/terminology/Lists/Terminology/NewTerm.aspx?IsDlg=1"></iframe>
                    </b-col>
                  </b-row>
                </b-container>
              </b-modal>
            </b-col>
            <b-col cols="4" class="mt-1 pr-3">
              <b-input-group class="float-right">
                <b-form-input v-model="filter" placeholder="Search Terminology..." type="search"></b-form-input>
                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row no-gutters :style="getStyle('tablerow', null)">
            <b-col cols="12" class="p-1">
              <b-table
                striped
                hover
                :sticky-header="getSticky('dynamictable')"
                :items="filtereditems"
                :fields="table.fields"
                primary-key="table.primarykey"
                :filter="filter"
                :filter-included-fields="filterOn"
                :per-page="perPage"
                :current-page="currentPage"
                table-class="table-full"
                table-variant="light"
                :style="getStyle('tablerow', null)"
                @filtered="onFiltered"
              >
                <template #cell(definition)="data">
                  <div class="definition" :title="data.item.definition" v-b-tooltip.hover.v-dark>{{ data.item.definition }}</div>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-container>
        <template #overlay>
          <div class="text-center">
            <p id="busy-label">{{ overlayText }}</p>
          </div>
        </template>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { EventBus } from '../../main'
import { UserInt } from '../../interfaces/User'
import { ObjectItem } from '@/interfaces/ObjectItem'
import axios from 'axios'

const support = namespace('support')
const users = namespace('users')
const publication = namespace('publication')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

let that: any

@Component({
  name: 'terminology-table',
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
          id: 'dynamic-table',
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
          overlayVariant: 'loading'
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
  Bookshelf!: any
  overlayText = 'Loading New Publication Form.'
  totalcalls = 0
  completedcalls = 0
  formReady = false
  branch = ''
  prfx = ''
  pubid = ''
  ltitle = ''
  nato = false
  saveReady = false
  formfields = ['branch', 'prfx', 'pubid', 'ltitle']

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

  @publication.Action
  public getDigest!: () => Promise<boolean>

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
      const that = this
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
      let amount = Math.floor(available / 33) // (Jean changed to 33 from) 29 is based on the height of the rows used by the 'small' attribute on the b-table component
      this.perPage = amount
    }
  }

  public onBranchSelect() {
    if (this.Branch !== null && this.Branch !== 'Please Select...') {
      // call getPrefixesByBranch
      this.getPrefixesByBranch(String(this.Branch)).then((response) => {
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
  /*   public getSticky(element) {
    let h: any
    switch (element) {
      case 'dynamictable':
        h = that.contentheight - 200 + 'px'
        break
    }
    return h
  } */
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
        break

      case 'tablerow':
        style.height = that.contentheight - 200 + 'px'
        style.width = that.contentwidth + 'px'
        break

      case 'pagingrow':
        style.height = '50px'
        style.width = that.contentwidth + 'px'
        break

      case 'modalheight':
        style.height = that.contentheight - 100 + 'px'
        break

      case 'iframeheight':
        style.height = that.contentheight - 100 + 'px'
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

  public getSticky(element) {
    let h: any
    switch (element) {
      case 'dynamictable':
        h = that.contentheight - 270 + 'px'
        break
    }
    return h
  }
}
</script>

<style lang="scss">
.table-full {
  border: 1px solid #000000 !important;
  text-align: left;
}
.table-full td,
.table-full th {
  border: 1px solid #000000 !important;
  height: 20px !important;
  padding: 2px 5px !important;
}
.definition {
  max-width: 1800px;
}

.input-group > .custom-file,
.input-group > .custom-select,
.input-group > .form-control,
.input-group > .form-control-plaintext {
  max-height: 35px;
}

.input-group-append .btn,
.input-group-prepend .btn {
  max-height: 35px;
}
</style>
