<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-modal id="modalRelto" ref="modalRelto" centered header-bg-variant="blue-300" size="sm" header-text-variant="light" modal-class="zModal">
      <template v-slot:modal-title>Select Rel To</template>
      <b-container class="p-0">
        <b-row>
          <b-col cols="12">
            <b-form-group label="Filter" label-cols-sm="3" label-align-sm="right" label-size="sm" class="mb-0">
              <b-input-group size="sm">
                <b-form-input id="relto-filter-input" v-model="reltofilter" type="search" placeholder="Search Rel Tos"></b-form-input>
                <b-input-group-append>
                  <b-button :disabled="!reltofilter" @click="reltofilter = ''">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <b-table v-model="reltodata" :id="table_relto" :ref="table_relto" :items="relto" :fields="reltofields" :current-page="currentPage" no-provider-paging="true" no-provider-filtering="true" no-provider-sorting="true" :per-page="perPage" show-empty small @filtered="onReltoFiltered">
              <template #cell(actions)="row">
                <b-form-checkbox v-model="row.item.selected" @input.native="toggleRelto(row.item, $event)"></b-form-checkbox>
              </template>
            </b-table>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm" class="my-0"></b-pagination>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-overlay :show="!formReady" :variant="success" class="contentHeight">
          <b-container v-if="formReady" fluid class="contentHeight m-0 p-0">
            <b-row no-gutters>
              <b-col cols="12" class="m-0 p-0">
                <b-card no-body>
                  <b-tabs v-model="rightTabs" card>
                    <b-tab class="mtab" active>
                      <template slot="title">Document/Library Data</template>
                      <b-row no-gutters>
                        <b-col cols="12">
                          <b-form class="mt-0">
                            <b-row class="m-1">
                              <b-col cols="6" class="text-center text-light py20 bg-blue-800">Title</b-col>
                              <b-col cols="2" class="text-center text-light py20 bg-blue-800">Branch</b-col>
                              <b-col cols="2" class="text-center text-light py20 bg-blue-800">Prefix</b-col>
                              <b-col cols="2" class="text-center text-light py20 bg-blue-800">Pub ID</b-col>
                            </b-row>
                            <b-row class="m-1">
                              <b-col cols="6">
                                <b-form-input class="form-control" size="sm" id="txtTitle" v-model="publication.Title" placeholder="Enter Title" ref="Title" :state="ValidateMe('Title')"></b-form-input>
                                <b-form-invalid-feedback>Please input a title.</b-form-invalid-feedback>
                              </b-col>
                              <b-col cols="2">
                                <b-form-select
                                  class="form-control"
                                  size="sm"
                                  id="ddBranch"
                                  v-model="publication.Branch"
                                  :options="branches"
                                  @change="onBranchSelect"
                                  :state="ValidateMe('Branch')"
                                  ref="Branch"
                                  v-b-tooltip.hover.v-dark
                                  title="Indicates the branch of the library to which the publication belongs. Supports filtering of publications."
                                ></b-form-select>
                                <b-form-invalid-feedback>Please select a valid branch.</b-form-invalid-feedback>
                              </b-col>
                              <b-col cols="2">
                                <b-form-select class="form-control" size="sm" id="ddPrefix" v-model="publication.Prfx" :options="prefixes" :state="ValidateMe('Prefix')" ref="Prefix"></b-form-select>
                                <b-form-invalid-feedback>Please select a valid prefix.</b-form-invalid-feedback>
                              </b-col>
                              <b-col cols="2">
                                <b-form-input class="form-control" size="sm" id="txtPubID" v-model="publication.PubID" placeholder="Enter Pub ID" ref="PubID" :state="ValidateMe('PubID')"></b-form-input>
                                <b-form-invalid-feedback>Please input a valid Pub ID.</b-form-invalid-feedback>
                              </b-col>
                            </b-row>
                            <b-row class="m-1">
                              <b-col cols="6" class="text-center text-light py20 bg-blue-800">Long Title</b-col>
                              <b-col cols="6" class="text-center text-light py20 bg-blue-800">Bookshelf</b-col>
                            </b-row>
                            <b-row class="m-1">
                              <b-col cols="6">
                                <b-form-input class="form-control" size="sm" id="txtLongTitle" v-model="publication.LongTitle" placeholder="Enter Long Title" ref="LongTitle"></b-form-input>
                              </b-col>
                              <b-col cols="6">
                                <b-form-select multiple class="form-control" size="sm" id="ddBookshelf" v-model="publication.Bookshelf" :options="bookshelves"></b-form-select>
                              </b-col>
                            </b-row>
                            <b-row class="m-1">
                              <b-col cols="6" class="text-center text-light py20 bg-blue-800">Functional Series</b-col>
                              <b-col cols="6" class="text-center text-light py20 bg-blue-800">Functional Field</b-col>
                            </b-row>
                            <b-row class="m-1">
                              <b-col cols="6" class="text-center text-dark">
                                <b-form-select class="form-control" size="sm" id="ddFunctionalSeries" v-model="publication.AdditionalData.FunctionalSeries" :options="functionalseries" @change="onSeriesSelect"></b-form-select>
                              </b-col>
                              <b-col cols="6" class="text-center text-dark">
                                <b-form-select class="form-control" size="sm" id="ddFunctionalField" v-model="publication.AdditionalData.FunctionalField" :options="functionalfields"></b-form-select>
                              </b-col>
                            </b-row>
                            <b-row class="m-1">
                              <b-col cols="6" class="text-center text-light py20 bg-blue-800">Description</b-col>
                              <b-col cols="6" class="text-center text-light py20 bg-blue-800">Admin Comments</b-col>
                            </b-row>
                            <b-row class="m-1">
                              <b-col cols="6" class="text-center text-dark">
                                <b-form-textarea class="form-control" rows="8" id="txtDescription" v-model="publication.AdditionalData.Description" size="sm" placeholder="Description"></b-form-textarea>
                              </b-col>
                              <b-col cols="6" class="text-center text-dark">
                                <b-form-textarea class="form-control" rows="8" id="txtAdminComments" v-model="publication.AdditionalData.AdminComments" size="sm" placeholder="Admin Comments"></b-form-textarea>
                              </b-col>
                            </b-row>
                          </b-form>
                        </b-col>
                      </b-row>
                    </b-tab>
                    <b-tab class="mtab">
                      <template slot="title">Status</template>
                      <b-row no-gutters>
                        <b-col cols="12">
                          <b-form class="mt-0">
                            <b-row>
                              <b-col cols="2" class="text-center text-light py20 bg-blue-800">Edition</b-col>
                              <b-col cols="3" class="text-center text-light py20 bg-blue-800">Change</b-col>
                              <b-col cols="2" class="text-center text-light py20 bg-blue-800">Date of Issue</b-col>
                              <b-col cols="2" class="text-center text-light py20 bg-blue-800">Resourced?</b-col>
                              <b-col cols="3" class="text-center text-light py20 bg-blue-800">Status</b-col>
                            </b-row>
                            <b-row class="mb-1">
                              <b-col cols="2">
                                <b-form-input class="form-control" size="sm" id="txtEdition" v-model="publication.AdditionalData.Edition" placeholder="Enter Edition" ref="Edition"></b-form-input>
                              </b-col>
                              <b-col cols="3">
                                <b-form-input class="form-control" size="sm" id="txtChange" v-model="publication.AdditionalData.Change" placeholder="Enter Change" ref="Change"></b-form-input>
                              </b-col>
                              <b-col cols="2">
                                <b-form-input class="form-control" size="sm" id="txtDateofIssue" v-model="publication.DateofIssue" placeholder="" ref="DateofIssue" type="date"></b-form-input>
                              </b-col>
                              <b-col cols="2">
                                <b-form-checkbox class="form-control" size="sm" id="cbResourced" v-model="publication.Resourced" ref="Resourced" v-b-tooltip title="When checked(Yes), indicates that the PRA has resources needed to update the publication."></b-form-checkbox>
                              </b-col>
                              <b-col cols="3">
                                <b-form-select class="form-control" size="sm" id="ddStatus" v-model="publication.Status" :options="statuses" ref="Status" v-b-tooltip title="Status of publication. Choices depend on the Branch."></b-form-select>
                              </b-col>
                            </b-row>
                            <b-row>
                              <b-col cols="6" class="text-center text-light py20 bg-blue-800">Status Comments</b-col>
                              <b-col cols="6" class="text-center text-light py20 bg-blue-800">Supersedes</b-col>
                            </b-row>
                            <b-row class="mb-1">
                              <b-col cols="6">
                                <b-form-textarea class="form-control" rows="8" id="txtStatusComments" v-model="publication.StatusComments" size="sm" placeholder="Status Comments"></b-form-textarea>
                              </b-col>
                              <b-col cols="6">
                                <b-row no-gutters>
                                  <b-form-input class="form-control" size="sm" id="txtReplacesLink" v-model="publication.Replaces" placeholder="Link to Document" ref="ReplacesLink"></b-form-input>
                                </b-row>
                              </b-col>
                            </b-row>
                          </b-form>
                        </b-col>
                      </b-row>
                    </b-tab>
                    <b-tab class="mtab">
                      <template slot="title">Security/Availability</template>
                      <b-row no-gutters>
                        <b-col cols="12">
                          <b-form class="mt-0">
                            <b-row no-gutters>
                              <b-col cols="3" class="text-center text-light py20 bg-blue-800">Classification</b-col>
                              <b-col cols="3" class="text-center text-light py20 bg-blue-800">Dissemination</b-col>
                              <b-col cols="3" class="text-center text-light py20 bg-blue-800">REL TO</b-col>
                              <b-col cols="3" class="text-center text-light py20 bg-blue-800">DTIC</b-col>
                            </b-row>
                            <b-row no-gutters>
                              <b-col cols="3">
                                <b-form-select class="form-control" v-model="publication.Class" size="sm" id="ddClass" :options="classifications" ref="Classification"></b-form-select>
                              </b-col>
                              <b-col cols="3">
                                <b-form-select class="form-control" v-model="publication.AdditionalData.Dissemination" size="sm" id="ddDiss" :options="disseminations" ref="Dissemination"></b-form-select>
                              </b-col>
                              <b-col cols="3">
                                <b-input-group>
                                  <b-form-input class="form-control" v-model="publication.AdditionalData.RELTO"></b-form-input>
                                  <template #append>
                                    <!-- <b-button variant="blue-700" @click="onReltoSearch">
                                      <font-awesome-icon fas icon="search" class="icon txt-light"></font-awesome-icon>
                                    </b-button> -->
                                    <b-dropdown split-button-type=""></b-dropdown>
                                  </template>
                                </b-input-group>
                              </b-col>
                              <b-col cols="3"></b-col>
                              <b-col cols="3"></b-col>
                            </b-row>
                          </b-form>
                        </b-col>
                      </b-row>
                    </b-tab>
                    <b-tab class="mtab">
                      <template slot="title">Action Officer</template>
                      <b-row no-gutters>
                        <b-col cols="12"></b-col>
                      </b-row>
                    </b-tab>
                  </b-tabs>
                </b-card>
              </b-col>
            </b-row>
          </b-container>
          <template #overlay>
            <div class="text-center">
              <p id="busy-label">Loading Publication Form</p>
            </div>
          </template>
        </b-overlay>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../../interfaces/User'
import { PublicationItem } from '../../../interfaces/PublicationItem'
import { ObjectItem } from '@/interfaces/ObjectItem'

const users = namespace('users')
const publication = namespace('publication')
const support = namespace('support')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component
export default class EditPub extends Vue {
  interval!: any
  invalidTitle = 'Please input a valid Title.'
  invalidBranch = 'Please select a valid Branch.'
  reltofilter = ''
  reltodata!: any
  currentPage = 0
  perPage = 50
  formReady = false

  reltofields = [
    { key: 'actions', label: 'Select' },
    { key: 'value', label: 'RELTO', sortable: true }
  ]

  @users.State
  public currentUser!: UserInt

  @support.State
  public bookshelves!: Array<ObjectItem>

  @publication.State
  public publoaded!: boolean

  @publication.State
  public publication!: PublicationItem

  @publication.State
  public prefixes!: Array<ObjectItem>

  @publication.State
  public statuses!: Array<ObjectItem>

  @publication.State
  public relto!: Array<ObjectItem>

  @publication.State
  public functionalseries!: Array<ObjectItem>

  @publication.State
  public functionalfields!: Array<ObjectItem>

  @support.Action
  public getBS!: () => Promise<boolean>

  @publication.Action
  public getRelto!: () => Promise<boolean>

  @publication.Action
  public getPublicationById!: (id: string, nato: string) => Promise<boolean>

  @publication.Action
  public getPrefixesByBranch!: (branch: string) => Promise<boolean>

  @publication.Action
  public getStatusesByBranch!: (branch: string) => Promise<boolean>

  @publication.Action
  public getFunctionalSeriesByBranch!: (branch: string) => Promise<boolean>

  @publication.Action
  public getFunctionalFieldByFunctionalSeries!: (series: string) => Promise<boolean>

  branches = [
    { value: 'Please Select...', text: 'Please Select...' },
    { value: 'Navy', text: 'Navy' },
    { value: 'Allied', text: 'Allied' },
    { value: 'Joint', text: 'Joint' },
    { value: 'Other', text: 'Other' },
    { value: 'Multinational', text: 'Multinational' }
  ]

  media = [
    { value: 'uNDLS', text: 'uNDLS' },
    { value: 'cNDLS', text: 'cNDLS' },
    { value: 'CAS', text: 'CAS' },
    { value: 'NWEL', text: 'NWEL' },
    { value: 'APEL', text: 'APEL' },
    { value: 'MPEL', text: 'MPEL' },
    { value: 'POD', text: 'POD' },
    { value: 'Print', text: 'Print' },
    { value: 'Other', text: 'Other' }
  ]

  classifications = [
    { value: 'Unclassified,U', text: 'Unclassified' },
    { value: 'Controlled Unclassified Information,CUI', text: 'Controlled Unclassified Information' },
    { value: 'Secret,S', text: 'Secret' },
    { value: 'Confidential,C', text: 'Confidential' },
    { value: 'NATO Standard,NN', text: 'NATO Standard' },
    { value: 'NATO Unclassified,NU', text: 'NATO Unclassified' },
    { value: 'NATO Confidential,NC', text: 'NATO Confidential' },
    { value: 'NATO Restricted,NR', text: 'NATO Restricted' }
  ]

  disseminations = [
    { value: 'Authorized For Release To,REL TO', text: 'Authorized For Release To' },
    { value: 'Controlled Unclassified Information,CUI', text: 'Controlled Unclassified Information' },
    { value: 'For Official Use Only,FOUO', text: 'For Official Use Only' },
    { value: 'Limited Distribution,LIMDIS', text: 'Limited Distribution' },
    { value: 'Not Applicable,N/A', text: 'Not Applicable' },
    { value: 'Not Releasable to Foreign Nationals,NOFORN', text: 'Not Releasable to Foreign Nationals' },
    { value: 'Originator Controlled Information,ORCON', text: 'Originator Controlled Information' }
  ]

  dtic = [
    { value: 'Please Select...', text: 'Please Select...' },
    { value: 'A - Approved for public release', text: 'A - Approved for public release' },
    { value: 'B - U.S. Government only', text: 'B - U.S. Government only' },
    { value: 'C - U.S. Government and contractors', text: 'C - U.S. Government and contractors' },
    { value: 'D - DOD and DOD contractors', text: 'D - DOD and DOD contractors' },
    { value: 'E - DOD only', text: 'E - DOD only' },
    { value: 'F - Only as directed by originator', text: 'F - Only as directed by originator' }
  ]

  availability = [
    { value: 'N/A', text: 'N/A' },
    { value: 'Posted on SIPRNET only', text: 'Posted on SIPRNET only' },
    /* { value: 'Posted to URL below', text: 'Posted to URL below' }, */
    { value: 'Contact originator to obtain', text: 'Contact originator to obtain' },
    { value: 'Available in print or CD-ROM only', text: 'Available in print or CD-ROM only' }
  ]

  reltos = []

  mounted() {
    if (this.$route) {
      let id = this.$route.query.Id
      let nato = this.$route.query.Nato
      if (id !== null) {
        console.log('TEST B')
        this.getPublicationById(String(id), String(nato)).then(response => {
          if (response) {
            this.interval = setInterval(this.waitForIt, 500)
          }
        })
      } else {
        console.log('TEST A')
      }
    }
  }

  public waitForIt() {
    if (this.publoaded) {
      console.log('Single Pub Loaded: ' + this.publication.RelativeURL)
      clearInterval(this.interval)
      let ad = this.publication.AdditionalData
      // is the branch available to get the prefixes
      if (this.publication.Branch !== null && this.publication.Branch !== 'Please Select...') {
        this.getPrefixesByBranch(String(this.publication.Branch)).then(response => {
          if (response) {
            this.getStatusesByBranch(String(this.publication.Branch)).then(response => {
              if (response) {
                this.getFunctionalSeriesByBranch(String(this.publication.Branch)).then(response => {
                  if (response) {
                    this.getRelto().then(response => {
                      if (response) {
                        this.getBS()
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
      this.formReady = true
    }
  }

  public onReltoSearch() {
    console.log('onReltoSearch')
    this.$bvModal.show('modalRelto')
    let modal = document.getElementById('modalRelto___BV_modal_outer_')
    modal?.classList.add('zModal')
  }

  public getStyle(element) {
    let style: any = {}
    switch (element) {
      case 'bdd':
        style.background = '#ffffff'
        style.height = '300px'
        style.overflow = 'auto'
        break
    }
    return style
  }

  public ValidateMe(control: string) {
    if (this.formReady) {
      let ret = false
      switch (control) {
        case 'Title':
          ret = this.publication.Title === null || this.publication.Title === '' ? false : true
          break

        case 'Branch':
          ret = this.publication.Branch === null || this.publication.Branch === 'Please Select...' ? false : true
          break

        case 'Prefix':
          ret = this.publication.Prfx === null || this.publication.Prfx === 'Please Select...' ? false : true
          break

        case 'PubID':
          ret = this.publication.PubID === null || this.publication.PubID === '' ? false : true
          break

        case 'LongTitle':
          ret = this.publication.LongTitle === null || this.publication.LongTitle === '' ? false : true
          break
      }
      return ret
    } else {
      return false
    }
  }

  public onBranchSelect() {
    if (this.publication.Branch !== null && this.publication.Branch !== 'Please Select...') {
      // call getPrefixesByBranch
      this.getPrefixesByBranch(String(this.publication.Branch)).then(response => {
        if (response) {
          this.getStatusesByBranch(String(this.publication.Branch)).then(response => {
            if (response) {
              this.getFunctionalSeriesByBranch(String(this.publication.Branch)).then(response => {
                if (response) {
                  /* dont care here */
                }
              })
            }
          })
        }
      })
    }
  }

  public onSeriesSelect() {
    if (this.publication.Branch !== null && this.publication.Branch !== 'Please Select...') {
      if (this.publication.AdditionalData.FunctionalSeries !== null && this.publication.AdditionalData.FunctionalSeries !== 'Please Select...') {
        this.getFunctionalFieldByFunctionalSeries(String(this.publication.AdditionalData.FunctionalSeries)).then(response => {
          if (response) {
            /* dont care here */
          }
        })
      }
    }
  }
}
</script>

<style></style>
