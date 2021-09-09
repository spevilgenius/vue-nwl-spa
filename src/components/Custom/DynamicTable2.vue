<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-overlay :show="filtereditems.length === 0" :variant="table.overlayVariant" class="contentHeight">
          <b-container fluid class="contentHeight m-0 p-0">
            <b-row no-gutters :class="table.headerClass" :style="getStyle('buttonrow', null)">
              <b-col cols="6" class="m-0 p-0" v-if="table.buttons.length > 0">
                <div class="flexCenter">
                  <span v-for="button in table.buttons" :key="button">
                    <b-button v-if="button == 'Add'" variant="success" class="m-1 px100 text-white"><font-awesome-icon fas icon="folder" class="icon"></font-awesome-icon>&nbsp;Add</b-button>
                    <b-button v-if="button == 'Edit'" variant="warning" class="m-1 px100 text-white"><font-awesome-icon fas icon="folder-open" class="icon"></font-awesome-icon>&nbsp;Edit</b-button>
                    <b-button v-if="button == 'Delete'" variant="danger" class="m-1 px100 text-white"><font-awesome-icon fas icon="trash-alt" class="icon"></font-awesome-icon>&nbsp;Delete</b-button>
                    <b-button v-if="button == 'Export'" variant="success" class="m-1 px100 text-white"><font-awesome-icon fas icon="download" class="icon"></font-awesome-icon>&nbsp;Export</b-button>
                  </span>
                </div>
              </b-col>
              <b-col cols="6" class="mt-1 pr-3">
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
                <b-table striped hover :items="filtereditems" :fields="table.fields" primary-key="table.primarykey" :filter="filter" :per-page="perPage" :current-page="currentPage" table-class="table-full" table-variant="light" @filtered="onFiltered">
                  <template #cell(actions)="data">
                    <b-button size="sm" variant="success" class="actionbutton text-light" @click="viewItem(data.item.Id)">
                      <font-awesome-icon v-if="String(data.item.Name).indexOf('.docx') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.doc') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.pdf') > 0" :icon="['far', 'file-pdf']" class="icon"></font-awesome-icon>
                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.txt') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.rtf') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                    </b-button>
                    <b-button v-if="currentUser.isLibrarian || currentUser.isActionOfficer" size="sm" variant="warning" class="actionbutton text-light" @click="editItem(data.item.Id)">
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { EventBus } from '../../main'
import { UserInt } from '../../interfaces/User'

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
          list: 'ActivePublications',
          primaryKey: 'id',
          buttons: ['Add', 'Edit', 'Export', 'Delete'] /* Add, Edit, Export, Delete, Search */,
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
  filter = null
  filterOn = []

  @users.State
  public currentUser!: UserInt

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
      this.filtereditems = this.$props.table.items // set initially to all items
      // TODO: calculate perPage based on counting the number of rows that will fit in the available space
      let available = this.contentheight - 100
      let amount = Math.floor(available / 30) // 30 is based on the height of the rows used by the 'small' attribute on the b-table component
      this.perPage = amount
      // format any cells that need it
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

  public viewItem(id: string) {
    EventBus.$emit('viewItem', id)
  }

  public editItem(id: string) {
    EventBus.$emit('editItem', id)
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
