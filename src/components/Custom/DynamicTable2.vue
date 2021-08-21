<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-overlay :show="filtereditems.length === 0" :opacity="100" :variant="overlayVariant" :style="getStyle('table', null)">
          <b-table-simple :ref="'DynamicTable_' + tblId" hover bordered small striped :style="getStyle('table', null)" table-variant="warning">
            <b-thead>
              <b-tr>
                <b-th v-for="field in table.fields" :key="field" :style="getStyle('th', field)">{{ field.label }}</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="item in filtereditems" :key="item" :style="getStyle('tr', null)">
                <b-td v-for="field in fields" :key="field" class="text-black">
                  <span v-if="field.field === 'Actions'" :id="field.field + '_' + item.id" :ref="field.field + '_' + item.id">
                    <!-- <component v-for="comp in item.renderItems" :key="comp.id" :is="comp.component" v-bind="comp.props"></component> -->
                  </span>
                  <span v-else :id="field.field + '_' + item.id" :ref="field.field + '_' + item.id"></span>
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
          <template #overlay>
            <div class="text-center">
              <p id="busy-label">{{ overlayText }}</p>
            </div>
          </template>
        </b-overlay>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const support = namespace('support')
const users = namespace('users')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

let that: any

@Component({
  name: 'dynamic-table'
})
export default class DynamicTable extends Vue {
  @support.State
  public contentheight!: number

  @support.State
  public contentwidth!: number

  public notice!: 'Hello'
  public interval!: any
  @Prop({ default: false }) searchEnabled!: boolean
  @Prop({ default: [] }) items!: any
  @Prop({ default: [] }) filtereditems!: any
  @Prop({ default: [] }) fields!: any
  @Prop({ default: ['Add', 'Edit', 'Export', 'Filter', 'Search'] }) buttons!: any
  @Prop({ default: 20 }) pageSize!: number
  @Prop({ default: 1 }) currentPage!: number
  @Prop({ default: 20 }) rowheight!: number
  @Prop({ default: 'DynamicTable' }) tblId!: string
  @Prop({ default: 'Loading. Please Wait...' }) overlayText!: string
  @Prop({ default: 'success' }) overlayVariant!: string
  /* @Prop({ default: true }) loading!: boolean
  @Prop({ default: false }) loaded!: boolean */

  created() {
    that = this
  }

  mounted() {
    // wait for there to be items and then gitrdone
    this.interval = setInterval(this.waitForIt, 500)
  }

  public waitForIt() {
    if (this.items.length > 0) {
      clearInterval(that.interval)
      that.filtereditems = that.items // set initially to all items
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
        if (that.rowheight === 0) {
          style.height = '20px'
        } else {
          style.height = that.rowheight + 'px'
        }
        break

      case 'th':
        if (field.width) {
          style.width = field.width + 'px'
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
