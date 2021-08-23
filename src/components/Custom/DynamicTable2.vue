<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-overlay :show="filtereditems.length === 0" :variant="table.overlayVariant" class="contentHeight">
          <b-container fluid class="contentHeight m-0 p-0">
            <b-row no-gutters :style="getStyle('buttonrow', null)"></b-row>
            <b-row no-gutters :style="getStyle('tablerow', null)">
              <b-col cols="12">
                <b-table striped hover :items="filtereditems" :fields="table.fields" primary-key="table.primarykey" :per-page="perPage" :current-page="currentPage" table-class="table-full" table-variant="light">
                  <template #cell()="data">
                    <div>{{ renderElement(data) }}</div>
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const support = namespace('support')
const users = namespace('users')

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
          primaryKey: 'id',
          buttons: ['Add', 'Edit', 'Export', 'Filter', 'Search', 'Upload'] /* Add, Edit, Export, Filter, Search, Upload */,
          fields: [],
          items: [],
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
  @support.State
  public contentheight!: number

  @support.State
  public contentwidth!: number

  interval!: any
  filtereditems: Array<any> = []
  currentPage = 1
  totalRows = 0
  perPage = 20 // default

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
      this.totalRows = this.$props.table.items.length
      this.filtereditems = that.$props.table.items // set initially to all items
      // TODO: calculate perPage based on counting the number of rows that will fit in the available space
      let available = this.contentheight - 100
      let amount = Math.floor(available / 30)
      this.perPage = amount
    }
  }

  public renderElement(data) {
    let html = ''
    switch (data.field.format) {
      case 'extension':
        html = 'icon'
        break

      default:
        html = data.value
        break
    }
    return html
  }

  public getStyle(element, field) {
    let style: any = {}
    switch (element) {
      case 'table':
        style.height = that.contentheight + 'px'
        style.width = that.contentwidth + 'px'
        break

      case 'tr':
        if (that.$props.table.rowheight === 0) {
          style.height = '20px'
        } else {
          style.height = that.$props.table.rowheight + 'px'
        }
        break

      case 'th':
        if (field.width) {
          style.width = field.width + 'px'
          style.color = 'black'
        }
        break

      case 'buttonrow':
        style.background = '#ffffff'
        style.height = '50px'
        style.width = that.contentwidth + 'px'
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
}
</script>

<style lang="scss">
.dt-button-row,
.dt-paging-row {
  height: 40px !important;
}
.table-full,
.table-full td,
.table-full th {
  border: 1px solid #000000 !important;
  height: 20px;
  padding: 2px 5px !important;
}
</style>
