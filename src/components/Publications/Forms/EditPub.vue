<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-overlay :show="!formReady" :variant="success" class="contentHeight m-0 p-0">
      <b-container v-if="formReady" fluid class="contentHeight m-0 p-0">
        <b-row no-gutters class="contentHeight">
          <b-col cols="12" class="m-0 p-0">
            <b-card no-body>
              <b-tabs v-model="rightTabs" card>
                <b-tab class="mtab" active>
                  <template slot="title">Document/Library Data</template>
                  <b-row>
                    <b-col cols="12">
                      <b-form class="mt-0">
                        <b-form-row>
                          <b-col cols="6" class="text-center text-dark p-1">
                            <b-form-group label="Title" label-for="txtTitle" :invalid-feedback="Invalid('Title')" :state="ValidateMe('Title')">
                              <b-form-input class="form-control" size="sm" id="txtTitle" v-model="publication.Title" placeholder="Enter Title" ref="Title" :state="ValidateMe('Title')"></b-form-input>
                            </b-form-group>
                          </b-col>
                          <b-col cols="2" class="text-center text-dark p-1">
                            <b-form-group label="Branch" label-for="ddBranch" :invalid-feedback="Invalid('Branch')" :state="ValidateMe('Branch')">
                              <b-form-select
                                class="form-control"
                                size="sm"
                                id="ddBranch"
                                v-model="publication.Branch"
                                :options="branches"
                                @change="onBranchSelect"
                                :state="ValidateMe('Branch')"
                                ref="branch"
                                v-b-tooltip.hover.v-dark
                                title="Indicates the branch of the library to which the publication belongs. Supports filtering of publications."
                              ></b-form-select>
                            </b-form-group>
                          </b-col>
                          <b-col cols="2" class="text-center text-dark p-1">
                            <b-form-group label="Prefix" label-for="ddPrefix" :invalid-feedback="Invalid('Prefix')" :state="ValidateMe('Prefix')">
                              <b-form-select class="form-control" size="sm" id="ddPrefix" v-model="publication.Prfx" :options="prefixes" :state="ValidateMe('Prefix')" ref="prfx"></b-form-select>
                            </b-form-group>
                          </b-col>
                          <b-col cols="2" class="text-center text-dark p-1">
                            <b-form-group label="Pub ID" label-for="txtPubID" :invalid-feedback="Invalid('PubID')" :state="ValidateMe('PubID')">
                              <b-form-input class="form-control" size="sm" id="txtPubID" v-model="publication.PubID" placeholder="Enter Pub ID" ref="pubid" :state="ValidateMe('PubID')"></b-form-input>
                            </b-form-group>
                          </b-col>
                        </b-form-row>
                        <b-form-row>
                          <b-col cols="6" class="text-center text-dark p-1">
                            <b-form-group label="Long Title" label-for="txtLongTitle">
                              <b-form-input class="form-control" size="sm" id="txtLongTitle" v-model="publication.LongTitle" placeholder="Enter Long Title" ref="ltitle"></b-form-input>
                            </b-form-group>
                          </b-col>
                          <b-col cols="6" class="text-center text-dark p-1">
                            <dynamic-modal-select v-if="formReady" id="dmsBookshelf" v-model="publication.Bookshelf" :items="bookshelves" :fields="bsfields" :filter="bsfilter" title="Select Bookshelf" label="Bookshelf"></dynamic-modal-select>
                          </b-col>
                        </b-form-row>
                        <b-form-row>
                          <b-col cols="6" class="text-center text-dark p-1">
                            <b-form-group label="Functional Series" label-for="ddFunctionalSeries">
                              <b-form-select class="form-control" size="sm" id="ddFunctionalSeries" v-model="publication.AdditionalData.FunctionalSeries" :options="functionalseries" @change="onSeriesSelect"></b-form-select>
                            </b-form-group>
                          </b-col>
                          <b-col cols="6" class="text-center text-dark p-1">
                            <b-form-group label="Functional Field" label-for="ddFunctionalField">
                              <b-form-select class="form-control" size="sm" id="ddFunctionalField" v-model="publication.AdditionalData.FunctionalField" :options="functionalfields"></b-form-select>
                            </b-form-group>
                          </b-col>
                        </b-form-row>
                        <b-form-row>
                          <b-col cols="6" class="text-center text-dark p-1">
                            <b-form-group label="Description" label-for="txtDescription">
                              <vue-editor id="txtDescription" v-model="publication.AdditionalData.Description"></vue-editor>
                            </b-form-group>
                          </b-col>
                          <b-col cols="6" class="text-center text-dark p-1">
                            <b-form-group label="Librarian Remarks" label-for="txtLibrarianRemarks">
                              <vue-editor id="txtLibrarianRemarks" v-model="publication.AdditionalData.AdminComments"></vue-editor>
                            </b-form-group>
                          </b-col>
                        </b-form-row>
                      </b-form>
                    </b-col>
                  </b-row>
                </b-tab>
                <b-tab class="mtab">
                  <template slot="title">Status</template>
                  <b-row>
                    <b-col cols="12">
                      <b-form class="mt-0">
                        <b-form-row>
                          <b-col cols="3" class="text-center text-dark p-1">
                            <b-form-group label="Edition" label-for="txtEdition">
                              <b-form-input class="form-control" size="sm" id="txtEdition" v-model="publication.AdditionalData.Edition" placeholder="Enter Edition" ref="Edition"></b-form-input>
                            </b-form-group>
                          </b-col>
                          <b-col cols="3" class="text-center text-dark p-1">
                            <b-form-group label="Change" label-for="txtChange">
                              <b-form-input class="form-control" size="sm" id="txtChange" v-model="publication.AdditionalData.Change" placeholder="Enter Change" ref="Change"></b-form-input>
                            </b-form-group>
                          </b-col>
                          <b-col cols="2" class="text-center text-dark p-1">
                            <b-form-group label="Date of Issue" label-for="txtDateofIssue">
                              <b-form-input class="form-control" size="sm" id="txtDateofIssue" v-model="publication.AdditionalData.DateofIssue" placeholder="" ref="DateofIssue" type="date"></b-form-input>
                            </b-form-group>
                          </b-col>
                          <b-col cols="2" class="text-center text-dark p-1">
                            <b-form-group label="Edition Date" label-for="txtEditionDate">
                              <b-form-input class="form-control" size="sm" id="txtEditionDate" v-model="publication.AdditionalData.EditionDate" placeholder="" ref="DateofIssue" type="date"></b-form-input>
                            </b-form-group>
                          </b-col>
                          <b-col cols="2" class="text-center text-dark p-1">
                            <b-form-group label="Resourced?" label-for="cbResourced">
                              <b-form-checkbox class="form-control" size="sm" id="cbResourced" v-model="publication.Resourced" ref="Resourced" v-b-tooltip title="When checked(Yes), indicates that the PRA has resources needed to update the publication."></b-form-checkbox>
                            </b-form-group>
                          </b-col>
                        </b-form-row>
                        <b-form-row>
                          <b-col cols="3" class="text-center text-dark p-1">
                            <b-form-group label="General Status" label-for="ddGeneralStatus">
                              <b-form-select class="form-control" size="sm" id="ddGeneralStatus" v-model="publication.AdditionalData.GeneralStatus" :options="generalstatuses" ref="GeneralStatus" @change="onGeneralStatusSelected" v-b-tooltip title="General Status of publication."></b-form-select>
                            </b-form-group>
                          </b-col>
                          <b-col cols="3" class="text-center text-dark p-1">
                            <b-form-group label="Status" label-for="ddStatus">
                              <b-form-select class="form-control" size="sm" id="ddStatus" v-model="publication.AdditionalData.Status" :options="filteredstatuses" ref="Status" v-b-tooltip title="Status of publication. Choices depend on the Branch and General Status."></b-form-select>
                            </b-form-group>
                          </b-col>
                          <b-col cols="6" class="text-center text-dark p-1">
                            <b-form-group label="Supersedes" label-for="txtReplacesLink">
                              <b-form-input class="form-control" size="sm" id="txtReplacesLink" v-model="publication.Replaces" placeholder="Link to Document" ref="ReplacesLink"></b-form-input>
                            </b-form-group>
                          </b-col>
                        </b-form-row>
                      </b-form>
                    </b-col>
                  </b-row>
                </b-tab>
                <b-tab class="mtab">
                  <template slot="title">Security/Availability</template>
                  <b-row>
                    <b-col cols="12">
                      <b-form class="mt-0">
                        <b-form-row>
                          <b-col cols="3" class="text-center text-dark p-1">
                            <b-form-group label="Classification" label-for="ddClass">
                              <b-form-select class="form-control" v-model="publication.Class" size="sm" id="ddClass" :options="classifications" ref="Classification"></b-form-select>
                            </b-form-group>
                          </b-col>
                          <b-col cols="3" class="text-center text-dark p-1">
                            <b-form-group label="Dissemination" label-for="ddDiss">
                              <b-form-select class="form-control" v-model="publication.AdditionalData.Dissemination" size="sm" id="ddDiss" :options="disseminations" ref="Dissemination"></b-form-select>
                            </b-form-group>
                          </b-col>
                          <b-col cols="3" class="text-center text-dark p-1">
                            <dynamic-modal-select v-if="formReady" :id="dmsRELTO" v-model="publication.AdditionalData.RELTO" :items="relto" :fields="reltofields" :filter="reltofilter" title="Select REL TO" label="REL TO"></dynamic-modal-select>
                          </b-col>
                          <b-col cols="3" class="text-center text-dark p-1">
                            <b-form-group label="NSN" label-for="txtNSN">
                              <b-form-input class="form-control" size="sm" id="txtNSN" v-model="publication.NSN" placeholder="National Stock Number" ref="NSN"></b-form-input>
                            </b-form-group>
                          </b-col>
                        </b-form-row>
                        <b-form-row>
                          <b-col cols="4" class="text-center text-dark p-1">
                            <b-form-group label="DTIC" label-for="ddDtic">
                              <b-form-select class="form-control" v-model="publication.DTIC" size="sm" id="ddDtic" :options="dtic" ref="DTIC"></b-form-select>
                            </b-form-group>
                          </b-col>
                          <b-col cols="4" class="text-center text-dark p-1">
                            <b-form-group label="Availability" label-for="ddAvailability">
                              <b-form-select class="form-control" v-model="publication.Availability" size="sm" id="ddAvailability" :options="availability" ref="Availability"></b-form-select>
                            </b-form-group>
                          </b-col>
                          <b-col cols="4" class="text-center text-dark p-1">
                            <dynamic-checkbox-select v-if="formReady" id="dcbsMedia" v-model="publication.Media" :options="media" name="dcbsMedia" label="Media"></dynamic-checkbox-select>
                          </b-col>
                        </b-form-row>
                      </b-form>
                    </b-col>
                  </b-row>
                </b-tab>
                <b-tab class="mtab">
                  <template slot="title">Action Officer</template>
                  <b-row>
                    <b-col cols="12">
                      <b-form>
                        <b-form-row>
                          <b-col cols="3" class="text-center text-dark p-1">
                            <b-row no-gutters>
                              <b-form-group label="Primary Review Authority" label-for="ddPRA">
                                <b-form-select class="form-control" v-model="publication.PRA" size="sm" id="ddPRA" :options="reviewauthority" ref="PRA" @change="onPRASelected"></b-form-select>
                              </b-form-group>
                            </b-row>
                          </b-col>
                          <b-col cols="2" class="text-center text-dark p-1">
                            <b-form-group label="PRA POC" label-for="ddPRAPOC">
                              <b-form-select class="form-control" v-model="publication.PRAPOC" size="sm" id="ddPRAPOC" :options="rapocs" ref="PRAPOC"></b-form-select>
                            </b-form-group>
                          </b-col>
                          <b-col cols="7" class="text-center text-dark p-1">
                            <dynamic-modal-select v-if="formReady" :id="dmsCRA" v-model="publication.CoordinatingRA" :items="reviewauthority" :fields="rafields" :filter="crafilter" title="Select Review Authority" label="Coordinating Review Authority"> </dynamic-modal-select>
                          </b-col>
                        </b-form-row>
                        <b-form-row>
                          <b-col cols="3" class="text-center text-dark p-1">
                            <b-form-group label="NWDC AO" label-for="ddNWDCAO">
                              <b-form-select class="form-control" v-model="publication.NWDCAO.Title" size="sm" id="ddNWDCAO" :options="actionofficers" ref="NWDCAO" @change="onAOSelected"></b-form-select>
                            </b-form-group>
                          </b-col>
                          <b-col cols="2" class="text-center text-dark p-1">
                            <b-form-group label="Review Date" label-for="txtReviewDate">
                              <b-form-input class="form-control" size="sm" id="txtReviewDate" v-model="publication.ReviewDate" ref="ReviewDate" type="date"></b-form-input>
                            </b-form-group>
                          </b-col>
                          <b-col cols="7" class="text-center text-dark p-1">
                            <b-form-group label="Status Comments" label-for="txtStatusComments">
                              <vue-editor id="txtStatusComments" v-model="publication.StatusComments"></vue-editor>
                            </b-form-group>
                          </b-col>
                        </b-form-row>
                      </b-form>
                    </b-col>
                  </b-row>
                </b-tab>
                <b-tab v-if="canPublish" class="mtab">
                  <template slot="title">Development</template>
                  <b-row>
                    <b-col cols="12">
                      <b-form>
                        <b-form-row>
                          <b-col cols="4" class="text-left text-dark p-1">
                            <b-row no-gutters>
                              <b-form-group label="Phase">
                                <b-form-select class="form-control" v-model="publication.Development.Phase" size="sm" id="ddPhases" :options="phases" ref="Phase" @change="onPhaseSelected"></b-form-select>
                              </b-form-group>
                            </b-row>
                          </b-col>
                          <b-col cols="8"></b-col>
                        </b-form-row>
                        <b-form-row v-for="phase in phases" :key="phase" class="pb-1">
                          <b-col cols="12">
                            <b-form-row>
                              <b-col cols="1" class="text-left text-dark p-2">
                                <span class="label font-weight-bold">{{ phase.text }}</span>
                              </b-col>
                              <b-col cols="2">
                                <b-form-input type="date" class="form-control" v-model="publication.Development[phase.value]" size="sm" v-b-tooltip.hover.v-dark :title="phase.description"></b-form-input>
                              </b-col>
                            </b-form-row>
                          </b-col>
                        </b-form-row>
                      </b-form>
                    </b-col>
                  </b-row>
                </b-tab>
              </b-tabs>
              <template #footer>
                <b-row no-gutters>
                  <b-col cols="9"></b-col>
                  <b-col cols="3">
                    <b-button-group>
                      <b-button size="sm" class="ml-1" @click="onCancel">Cancel</b-button>
                      <b-button size="sm" class="ml-1" @click="onSave" variant="success">Save</b-button>
                      <b-button v-if="canPublish" size="sm" class="ml-1" @click="onPublish" variant="success">Publish</b-button>
                    </b-button-group>
                  </b-col>
                </b-row>
              </template>
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
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { VueEditor, Quill } from 'vue2-editor'
import { UserInt } from '../../../interfaces/User'
import { PublicationItem } from '../../../interfaces/PublicationItem'
import { ObjectItem } from '@/interfaces/ObjectItem'
import DynamicModalSelect from '../../Custom/DynamicModalSelect.vue'
import DynamicCheckboxSelect from '../../Custom/DynamicCheckboxSelect.vue'

const users = namespace('users')
const publication = namespace('publication')
const support = namespace('support')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component({
  name: 'EditPub',
  components: {
    VueEditor,
    DynamicModalSelect,
    DynamicCheckboxSelect
  }
})
export default class EditPub extends Vue {
  // #region VARIABLES
  interval!: any
  invalidTitle = 'Please input a valid Title.'
  invalidBranch = 'Please select a valid Branch.'
  reltofilter = ''
  crafilter = ''
  bsfilter = ''
  dmsRELTO = 'RELTO'
  dmsCRA = 'CRA'
  perPage = 50
  totalcalls = 0
  completedcalls = 0
  formReady = false
  data: any = {}
  saveReady = false
  canPublish = false
  formfields = ['branch', 'prfx', 'pubid', 'ltitle']
  filteredstatuses: Array<ObjectItem> = []

  bsfields = [
    { key: 'actions', label: 'Select' },
    { key: 'value', label: 'Bookshelf', sortable: true }
  ]

  reltofields = [
    { key: 'actions', label: 'Select' },
    { key: 'value', label: 'RELTO', sortable: true }
  ]

  rafields = [
    { key: 'actions', label: 'Select' },
    { key: 'value', label: 'Review Authority', sortable: true }
  ]
  // #endregion

  // #region STATE
  @users.State
  public currentUser!: UserInt

  @support.State
  public bookshelves!: Array<ObjectItem>

  @publication.State
  public digestloaded!: boolean

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

  @publication.State
  public reviewauthority!: Array<ObjectItem>

  @publication.State
  public actionofficers!: Array<ObjectItem>

  @publication.State
  public rapocs!: Array<ObjectItem>
  // #endregion

  // #region ACTIONS
  @support.Action
  public getBS!: () => Promise<boolean>

  @publication.Action
  public getDigest!: () => Promise<boolean>

  @publication.Action
  public getRelto!: () => Promise<boolean>

  @publication.Action
  public getPublicationById!: (data: any) => Promise<boolean>

  @publication.Action
  public setPubLoaded!: (loaded: boolean) => void

  @publication.Action
  public getPrefixesByBranch!: (branch: string) => Promise<boolean>

  @publication.Action
  public getStatusesByBranch!: (branch: string) => Promise<boolean>

  @publication.Action
  public getFunctionalSeriesByBranch!: (branch: string) => Promise<boolean>

  @publication.Action
  public getFunctionalFieldByFunctionalSeries!: (series: string) => Promise<boolean>

  @publication.Action
  public getAO!: () => Promise<boolean>

  @publication.Action
  public getRA!: () => Promise<boolean>

  @publication.Action
  public getRAPocByRA!: (ra: string) => Promise<boolean>

  @publication.Action
  public updatePublicationById!: (data: any) => Promise<boolean>

  @publication.Action
  public requestApproval!: (data: any) => Promise<boolean>

  @publication.Action
  public approvePublication!: (data: any) => Promise<boolean>
  // #endregion

  // #region DROPDOWNS

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
    { value: 'Contact originator to obtain', text: 'Contact originator to obtain' },
    { value: 'Available in print or CD-ROM only', text: 'Available in print or CD-ROM only' }
  ]

  phases = [
    { value: 'ProjectStart', text: 'Project Start', index: 0, description: 'Record planned start date for Project Status = Not Started. Actual start date is usually PD DTG date (but could be date that first draft review commenced). Completion date should match approved publication Date of Issue.' },
    { value: 'ProgramDirective', text: 'Program Directive', index: 1, description: 'Planned/actual date that program directive issued.' },
    { value: 'FirstDraft', text: 'First Draft', index: 2, description: 'Planned/actual date that 1st draft review message/announcement issued.' },
    { value: 'FinalDraft', text: 'Final Draft', index: 3, description: 'Planned/actual date date that final draft review message/announcement issued.' },
    { value: 'FinalManuscript', text: 'Final Manuscript', index: 4, description: 'Planned/actual date that final manuscript message/announcement issued.' },
    { value: 'SignatureDraft', text: 'Signature Draft', index: 5, description: 'Planned/actual date that the draft pub is transferred to editors to prepare for PRA approval, i.e. date that final draft review is complete and all issues have been resolved.' },
    { value: 'PRAApproval', text: 'PRA Approval', index: 6, description: 'Planned/actual date of approval by PRA.' },
    { value: 'NWDCSignature', text: 'NWDC Signature', index: 7, description: 'Planned/actual date of NWDC signature date. PRA Approval and NWDC Signature dates are the same when NWDC is PRA.' },
    { value: 'PhaseFinish', text: 'Phase Finish', index: 8, description: 'Planned or actual finish date of Current Phase. (Usually the planned finish date.)' },
    { value: 'ProjectFinish', text: 'Project Finish', index: 9, description: 'Project finish date. (Actual finish date if the project is complete or cancelled, otherwise, it is the estimated finish date.)' }
  ]

  generalstatuses = [
    { value: 'Please Select...', text: 'Please Select...' },
    { value: 'Approved', text: 'Approved' },
    { value: 'Draft', text: 'Draft' },
    { value: 'Obsolete', text: 'Obsolete' }
  ]

  reltos = []

  // #endregion

  // #region METHODS

  mounted() {
    this.setPubLoaded(false)
    const that = this
    this.$nextTick(function() {
      that.getPublicationById(this.$route.query).then(response => {
        if (response) {
          that.interval = setInterval(that.loadData, 1500)
        }
      })
    })
  }

  public loadData() {
    if (this.publoaded) {
      clearInterval(this.interval)
      let ad = this.publication.AdditionalData
      const that = this
      this.totalcalls = 4
      this.getAO().then(function() {
        that.completedcalls += 1
      })
      this.getRA().then(function() {
        that.completedcalls += 1
      })
      this.getRelto().then(function() {
        that.completedcalls += 1
      })
      this.getBS().then(function() {
        that.completedcalls += 1
      })
      // is the branch available to get the prefixes and other items
      if (this.publication.Branch !== null && this.publication.Branch !== 'Please Select...') {
        this.totalcalls += 3
        this.getPrefixesByBranch(String(this.publication.Branch)).then(function() {
          that.completedcalls += 1
        })
        this.getStatusesByBranch(String(this.publication.Branch)).then(function() {
          that.completedcalls += 1
        })
        this.getFunctionalSeriesByBranch(String(this.publication.Branch)).then(function() {
          that.completedcalls += 1
        })
      }
      this.interval = setInterval(this.waitForData, 500)
    }
  }

  public waitForData() {
    // gitrdone
    if (this.completedcalls === this.totalcalls) {
      clearInterval(this.interval)
      console.log('Single Pub Loaded: ' + this.publication.RelativeURL)
      this.data.id = this.publication.Id
      this.data.nato = this.publication.IsNato
      this.formReady = true
      if (this.currentUser.isActionOfficer || this.currentUser.isLibrarian || this.currentUser.isNATOLibrarian) {
        this.canPublish = true
      }
      this.filteredstatuses = this.statuses
    } else {
      console.log('WAITING FOR FORM')
    }
  }

  public isSaveReady() {
    // test all fields
    this.saveReady = true
    for (let i = 0; i < this.formfields.length; i++) {
      let ref: any = this.$refs[this.formfields[i]]
      let state = ref.state
      if (state === false) {
        this.saveReady = false
      }
    }
  }

  public onCancel() {
    // close the form
    this.$router.push({ name: 'All Publications' })
  }

  public onSave() {
    // need to get the digest first
    this.getDigest().then(response => {
      if (response) {
        this.interval = setInterval(this.saveForm, 500)
      }
    })
  }

  public saveForm() {
    // save the form
    if (this.digestloaded) {
      console.log('DIGEST LOADED')
      clearInterval(this.interval)
      // send the data to save
      const that = this
      if (this.publication.Id !== undefined) {
        this.updatePublicationById(this.publication).then(function() {
          // wait for update to finish then reload
          that.$router.push({ name: 'View Publication', query: { Id: that.data.id, Nato: that.data.nato } })
        })
      }
    } else {
      console.log('Awaiting Digest')
    }
  }

  public onPublish() {
    // need to get the digest first
    this.getDigest().then(response => {
      if (response) {
        this.interval = setInterval(this.publishForm, 500)
      }
    })
  }

  public publishForm() {
    if (this.currentUser.isActionOfficer === true) {
      clearInterval(this.interval)
      // action officer so set request for approval and assign a task to the librarians.
      const that = this
      this.$bvModal
        .msgBoxConfirm('You must save all changes before publishing. If you are ready to publish click Yes, otherwise click No', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Yes',
          cancelTitle: 'No',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value === true) {
            // user wants to publish
            that.requestApproval(that.publication).then(function() {
              // route the user back to the view form
              that.$router.push({ name: 'View Publication', query: { Id: that.data.id, Nato: that.data.nato } })
            })
          }
        })
        .catch(err => {
          // An error occurred
        })
    } else {
      // librarian so really publish an approved version
      clearInterval(this.interval)
      const that = this
      this.$bvModal
        .msgBoxConfirm('This will publish a major version visible to all users. If you are ready to publish click Yes, otherwise click No', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Yes',
          cancelTitle: 'No',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value === true) {
            // user wants to publish
            that.publication.AdditionalData.LastPublished = new Date().toDateString()
            that.approvePublication(that.publication).then(function() {
              // route the user back to the view form
              that.$router.push({ name: 'View Publication', query: { Id: that.data.id, Nato: that.data.nato } })
            })
          }
        })
        .catch(err => {
          // An error occurred
        })
    }
  }

  public onReltoSearch() {
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
          ret = this.publication.Title === '' ? false : true
          break

        case 'Branch':
          ret = this.publication.Branch === '' || this.publication.Branch === 'Please Select...' ? false : true
          break

        case 'Prefix':
          ret = this.publication.Prfx === '' || this.publication.Prfx === 'Please Select...' ? false : true
          break

        case 'PubID':
          ret = this.publication.PubID === '' ? false : true
          break

        case 'LongTitle':
          ret = this.publication.LongTitle === '' ? false : true
          break
      }
      return ret
    } else {
      return false
    }
  }

  public Invalid(control: string) {
    if (this.formReady) {
      let ret = ''
      switch (control) {
        case 'Title':
          ret = 'Please enter a Title.'
          break
      }
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

  public onAOSelected() {
    // set the NWDCAO values based on the selected user title
    for (let i = 0; i < this.actionofficers.length; i++) {
      let ao: any = this.publication.NWDCAO
      if (this.actionofficers[i].text === ao.Title) {
        let props: any = this.actionofficers[i].props
        ao.Id = props.id
        ao.Email = props.email
      }
    }
  }

  public onPRASelected() {
    // go get the POC's for the selected RA
    let ra = this.publication.PRA
    if (ra !== undefined) {
      this.getRAPocByRA(ra)
    }
  }

  public onGeneralStatusSelected() {
    // set the NWDCAO values based on the selected user title
    let p: Array<ObjectItem> = []
    for (let i = 0; i < this.statuses.length; i++) {
      let gs: any = this.publication.AdditionalData.GeneralStatus
      let props: any = this.statuses[i].props
      console.log('testing statuses gs: ' + gs + ', prop: ' + props.generalstatus)
      if (props.generalstatus === gs) {
        // keep this selection
        p.push(this.statuses[i])
      }
      this.filteredstatuses = p
    }
  }
  // #endregion
}
</script>

<style>
.table-form {
  border: 1px solid #000000 !important;
}
.table-form td,
.table-form th {
  border: 1px solid #000000 !important;
  height: 20px !important;
  padding: 2px 5px !important;
}
</style>
