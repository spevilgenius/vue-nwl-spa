<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-overlay :show="!termsloaded" variant="danger" class="contentHeight">
      <b-row no-gutters class="contentHeight">
        <b-col cols="12" class="m-0 p-1 bg-white">
          <b-container fluid class="contentHeight m-0 p-0">
            <b-row no-gutters>
              <b-col cols="3" class="m-0 p-1 bg-white" style="height: 170px;">
                <b-card no-body header-tag="header">
                  <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                    ><h4 class="text-white p-0 mb-0">
                      DOD Dictionary
                    </h4>
                  </b-card-header>
                  <b-card-body class="p-1">
                    <b-card no-body class="p-1">
                      <b-row no-gutters>
                        <!-- <b-col cols="2">
                            <font-awesome-icon fas icon="book-open" class="pubicon text-success"></font-awesome-icon>
                          </b-col> -->
                        <b-col cols="12" class="m-1" align="center">
                          <b-card-sub-title>The DOD Dictionary of Military and Associated Terms</b-card-sub-title>
                          <b-card-title>
                            <a href="https://jdeis.js.mil/jdeis/new_pubs/dictionary.pdf">DOD Dictionary</a>
                          </b-card-title>
                        </b-col>
                      </b-row>
                    </b-card>
                  </b-card-body>
                </b-card>
              </b-col>
              <b-col cols="3" class="m-0 p-1 bg-white" style="height: 170px;">
                <b-card no-body header-tag="header">
                  <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                    ><h4 class="text-white p-0 mb-0">
                      Navy Supplement
                    </h4>
                  </b-card-header>
                  <b-card-body class="p-1">
                    <b-card no-body class="p-1">
                      <b-row no-gutters>
                        <!-- <b-col cols="2">
                          <font-awesome-icon fas icon="book-open" class="pubicon text-success"></font-awesome-icon>
                        </b-col> -->
                        <b-col cols="12" class="m-1" align="center">
                          <b-card-sub-title>Navy Supplement to the DOD Dictionary of Military and Associated Terms</b-card-sub-title>
                          <b-card-title mb-0>
                            <a href="https://doctrine.navy.mil/pubs/NTRP%201-02,%20Navy%20Supplement%20to%20the%20DOD%20Dictionary%20of%20Military%20and%20Associated%20Terms/NTRP_1-02.pdf">NTRP 1-02</a>
                          </b-card-title>
                        </b-col>
                      </b-row>
                    </b-card>
                  </b-card-body>
                </b-card>
              </b-col>
              <b-col cols="3" class="m-0 p-1 bg-white" style="height: 170px;">
                <b-card no-body header-tag="header">
                  <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                    ><h4 class="text-white p-0 mb-0">
                      Marine Corps Supplement
                    </h4></b-card-header
                  >
                  <b-card-body class="p-1">
                    <b-card no-body class="p-1">
                      <b-row no-gutters>
                        <b-row align="center">
                          <!-- <b-col cols="2">
                            <font-awesome-icon fas icon="book-open" class="pubicon text-success"></font-awesome-icon>
                          </b-col> -->
                          <b-col cols="12" class="p-1" align="center">
                            <b-card-sub-title>Marine Corps Supplement to the DOD Dictionary of Military and Associated Terms</b-card-sub-title>
                            <b-card-title>
                              <a href="https://doctrine.navy.mil/pubs/MCRP%201-10.2,%20Marine%20Corps%20Terminology/MCRP_1-10.2.pdf">MCRP 1-10.2</a>
                            </b-card-title>
                          </b-col>
                        </b-row>
                      </b-row>
                    </b-card>
                  </b-card-body>
                </b-card>
              </b-col>
              <b-col cols="3" class="m-0 p-1 bg-white" style="height: 170px;">
                <b-card no-body header-tag="header">
                  <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0">
                    <h4 class="text-white p-0 mb-0">
                      Joint Supplement
                    </h4>
                  </b-card-header>
                  <b-card-body class="p-1">
                    <b-card no-body class="p-1">
                      <b-row no-gutters>
                        <b-row align="center">
                          <!-- <b-col cols="2">
                            <font-awesome-icon fas icon="book-open" class="pubicon text-success"></font-awesome-icon>
                          </b-col> -->
                          <b-col cols="12" class="p-1" align="center">
                            <b-card-sub-title>Joint Doctrine, Education & Training Electronic Information System (JDEIS) Terminology Program</b-card-sub-title>
                            <b-card-title>
                              <a href="https://jdeis.js.mil/jdeis/index.jsp?">JDEIS</a>
                            </b-card-title>
                          </b-col>
                        </b-row>
                      </b-row>
                    </b-card>
                  </b-card-body>
                </b-card>
              </b-col>
              <b-row>
                <dynamic-table
                  v-if="termsloaded"
                  :table="{
                    id: tblId,
                    primaryKey: primaryKey,
                    fields: fields,
                    items: terms,
                    overlayText: overlayText,
                    overlayVariant: overlayVariant
                  }"
                  :searchEnabled="true"
                ></dynamic-table>
              </b-row>
            </b-row>
          </b-container>
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
import { TerminologyItem } from '@/interfaces/TerminologyItem'
import { namespace } from 'vuex-class'
import TerminologyTable from '../Custom/TerminologyTable.vue'
import { faAlignCenter } from '@fortawesome/free-solid-svg-icons'

const terminology = namespace('terminology')

@Component({
  name: 'Terminology',
  components: {
    TerminologyTable
  }
})
export default class Terminology extends Vue {
  @Prop({ default: process.env.VUE_APP_BASE_IMAGE_URL })
  readonly baseImageUrl!: string

  @terminology.State
  public terms!: Array<TerminologyItem>

  @terminology.State
  public termsloaded!: boolean

  @terminology.Action
  public getTerms!: () => Promise<boolean>

  public interval: any

  tblId = 'AllTerms'
  primaryKey = 'Id'
  overlayText = 'Getting Terms. Please wait...'
  overlayVariant = 'danger'
  rowHeight = 0
  pageSize = 20

  fields: any = [
    { key: 'type', label: 'Type', type: 'default', format: 'text', tdClass: 'px80', thClass: 'tbl-dynamic-header', id: 20 },
    { key: 'title', label: 'Title', type: 'default', format: 'text', tdClass: 'px250', thClass: 'tbl-dynamic-header', id: 1 },
    { key: 'definition', label: 'Definition', type: 'default', format: 'text', tdClass: 'px600', thClass: 'tbl-dynamic-header', id: 2 },
    { key: 'service', label: 'Service', type: 'default', format: 'text', tdClass: 'px100', thClass: 'tbl-dynamic-header', id: 3 }
  ]

  mounted() {
    this.getTerms().then(response => {
      if (response) {
        console.log('Terms Loaded')
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
