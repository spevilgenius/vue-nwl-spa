<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-overlay :show="!termsloaded" variant="danger" class="contentHeight">
      <b-row no-gutters class="contentHeight">
        <b-col cols="12" class="m-0 p-1 bg-white">
          <template #overlay>
            <div class="text-center">
              <p id="busy-label">Loading...</p>
            </div>
          </template>
        </b-col>
      </b-row>
    </b-overlay>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ObjectItem } from '@/interfaces/ObjectItem'
import { PocItem } from '@/interfaces/PocItem'
import { namespace } from 'vuex-class'
import DynamicTable from '../Custom/DynamicTable3.vue'
import { faAlignCenter } from '@fortawesome/free-solid-svg-icons'

const Pocs = namespace('poc')

@Component({
  name: 'poc',
  components: {
    DynamicTable
  }
})
export default class Poc extends Vue {
  @Prop({ default: process.env.VUE_APP_BASE_IMAGE_URL })
  readonly baseImageUrl!: string

  @Poc.State
  public pocs!: Array<PocItem>

  @Poc.State
  public pocsloaded!: boolean

  @Poc.Action
  public getPocs!: () => Promise<boolean>

  public interval: any

  tblId = 'POC'
  primaryKey = 'Id'
  overlayText = 'Getting POCs. Please wait...'
  overlayVariant = 'danger'
  rowHeight = 0
  pageSize = 20

  fields: any = [
    { key: 'firstname', label: 'First Name', type: 'default', format: 'text', tdClass: 'px80', thClass: 'tbl-dynamic-header', id: 20 },
    { key: 'MI', label: 'Middle Initial', type: 'default', format: 'text', tdClass: 'px80', thClass: 'tbl-dynamic-header', id: 20 },
    { key: 'lastname', label: 'Last Name', type: 'default', format: 'text', tdClass: 'px80', thClass: 'tbl-dynamic-header', id: 20 },
    { key: 'rank', label: 'Rank', type: 'default', format: 'text', tdClass: 'px80', thClass: 'tbl-dynamic-header', id: 20 },
    { key: 'command', label: 'Command', type: 'default', format: 'text', tdClass: 'px250', thClass: 'tbl-dynamic-header', id: 1 },
    { key: 'code', label: 'Code', type: 'default', format: 'text', tdClass: 'px600', thClass: 'tbl-dynamic-header', id: 2 },
    { key: 'jobtitle', label: 'Job Title', type: 'default', format: 'text', tdClass: 'px100', thClass: 'tbl-dynamic-header', id: 3 },
    { key: 'phone', label: 'Phone', type: 'default', format: 'text', tdClass: 'px100', thClass: 'tbl-dynamic-header', id: 4 },
    { key: 'email', label: 'Email', type: 'default', format: 'text', tdClass: 'px100', thClass: 'tbl-dynamic-header', id: 5 },
    { key: 'enterprisekeywords', label: 'Enterprise Keywords', type: 'default', format: 'text', tdClass: 'px100', thClass: 'tbl-dynamic-header', id: 6 }
  ]

  mounted() {
    this.getPocs().then(response => {
      if (response) {
        console.log('Pocs Loaded')
      }
    })
  }
}
</script>

<style lang="scss" scoped>
#NWLTitle {
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
