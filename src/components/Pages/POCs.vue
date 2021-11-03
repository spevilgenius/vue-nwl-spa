<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-overlay :show="!pocsloaded" variant="danger" class="contentHeight">
      <b-row no-gutters class="contentHeight">
        <b-col cols="12" class="m-0 p-1 bg-white contentHeight">
          <b-table :sticky-header="dHeight" :items="pocs" :fields="fields" :head-variant="bg - blue - 400"></b-table>
        </b-col>
        <!--  <b-row>
          <b-col cols="12" class="float-left">
            <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="my-0" :items="pocs" :fields="fields"></b-pagination>
          </b-col>
        </b-row> -->
      </b-row>
      <template #overlay>
        <div class="text-center">
          <p id="busy-label">Loading...</p>
        </div>
      </template>
    </b-overlay>
  </b-container>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ObjectItem } from '@/interfaces/ObjectItem'
import { PocItem } from '@/interfaces/PocItem'
import { namespace } from 'vuex-class'
import { takeRight } from 'lodash'
/* import DynamicTable from '../Custom/DynamicTable3.vue' */
/* import { faAlignCenter } from '@fortawesome/free-solid-svg-icons' */

const Pocs = namespace('poc')
const support = namespace('support')

@Component({
  name: 'poc'
})
export default class Poc extends Vue {
  @Prop({ default: process.env.VUE_APP_BASE_IMAGE_URL })
  readonly baseImageUrl!: string

  @support.State
  public contentheight!: number

  @Pocs.State
  public pocs!: Array<PocItem>

  @Pocs.State
  public pocsloaded!: boolean

  @Pocs.Action
  public getPocs!: () => Promise<boolean>

  public interval: any

  tblId = 'POC'
  primaryKey = 'Id'
  overlayText = 'Getting POCs. Please wait...'
  overlayVariant = 'danger'
  rowHeight = 0
  pageSize = 20
  dHeight = ''
  perPage = 20

  fields: any = [
    { key: 'Title', label: 'Last Name', type: 'default', format: 'text', tdClass: 'px200', thClass: 'tbl-dynamic-header', id: 18 },
    { key: 'Firstname', label: 'First Name', type: 'default', format: 'text', tdClass: 'px200', thClass: 'tbl-dynamic-header', id: 20 },
    { key: 'MI', label: 'MI', type: 'default', format: 'text', tdClass: 'px80', thClass: 'tbl-dynamic-header', id: 19 },
    { key: 'Rank', label: 'Rank', type: 'default', format: 'text', tdClass: 'px80', thClass: 'tbl-dynamic-header', id: 17 },
    { key: 'Command', label: 'Command', type: 'default', format: 'text', tdClass: 'px300', thClass: 'tbl-dynamic-header', id: 1 },
    { key: 'Code', label: 'Code', type: 'default', format: 'text', tdClass: 'px100', thClass: 'tbl-dynamic-header', id: 2 },
    { key: 'Jobtitle', label: 'Job Title', type: 'default', format: 'text', tdClass: 'px100', thClass: 'tbl-dynamic-header', id: 3 },
    { key: 'Phone', label: 'Phone', type: 'default', format: 'text', tdClass: 'px100', thClass: 'tbl-dynamic-header', id: 4 },
    { key: 'Email', label: 'Email', type: 'default', format: 'text', tdClass: 'px100', thClass: 'tbl-dynamic-header', id: 5 }
  ]
  totalRows: number | undefined

  mounted() {
    this.getPocs().then(response => {
      if (response) {
        console.log('Pocs Loaded')
        this.dHeight = this.contentheight - 100 + 'px'
        this.totalRows = this.pocs.length
      }
    })
  }

  public getSticky(element) {
    let h: any
    switch (element) {
      case 'dynamictable':
        h = this.contentheight - 100 + 'px'
        break
    }
    return h
  }
}
</script>

<style lang="scss" scoped>
#PocTitle {
  text-align: center;
  font-family: 'Arial', Gadget, sans-serif;
  font-variant: small-caps;
  font-style: italic;
  font-size: 36px;
}
.pubType {
  font-family: 'Arial';
  font-size: 14pt;
}
.pubicon {
  font-size: 65px;
}
.list-group-item {
  position: relative;
  display: block;
  padding: 0.5rem;
  background-color: $light;
  border: none;
}
.card-body-left {
  font-family: 'Arial';
  font-size: 16px;
  text-align: left !important;
}
.card-body-left li a {
  color: $dark !important;
}
.centerFlex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1ch;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin-bottom: auto;
}
</style>
