<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-overlay :show="filtereditems.length === 0" :variant="table.overlayVariant" :style="getStyle('table', null)">
          <!-- <b-table-simple :ref="'DynamicTable_' + table.id" hover bordered striped :style="getStyle('table', null)" table-variant="light" table-class="table-full">
            <b-thead>
              <b-tr>
                <b-th v-for="field in table.fields" :key="field.id" :style="getStyle('th', field)">{{ field.label }}</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="item in filtereditems" :key="item.id" :style="getStyle('tr', null)">
                <b-td v-for="field in table.fields" :key="field.id" class="text-black">
                  <span v-if="field.field === 'Actions'" :id="field.field + '_' + item.id" :ref="field.field + '_' + item.id">
                  </span>
                  <span v-else :id="field.field + '_' + item.id" :ref="field.field + '_' + item.id"></span>
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple> -->
          <b-table striped hover :items="filtereditems" :fields="table.fields" primary-key="table.primarykey"></b-table>
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
          rowHeight: 20,
          pageSize: 0 /* 0 default means dynamic based on space available and rowHeight */,
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
      that.filtereditems = that.$props.table.items // set initially to all items
    }
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
