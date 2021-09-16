<template>
  <b-container fluid class="contentHeight m-0 p-0">
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
                            <b-row>
                              <b-col cols="6" class="text-center text-dark">Title</b-col>
                              <b-col cols="2" class="text-center text-dark">Branch</b-col>
                              <b-col cols="2" class="text-center text-dark">Prefix</b-col>
                              <b-col cols="2" class="text-center text-dark">Pub ID</b-col>
                            </b-row>
                            <b-row class="mb-1">
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
                            <b-row>
                              <b-col cols="6" class="text-center text-dark">Long Title</b-col>
                              <b-col cols="6" class="text-center text-dark">Description</b-col>
                            </b-row>
                            <b-row class="mb-1">
                              <b-col cols="6">
                                <b-form-input class="form-control" size="sm" id="txtLongTitle" v-model="publication.LongTitle" placeholder="Enter Long Title" ref="LongTitle"></b-form-input>
                              </b-col>
                              <b-col cols="6">
                                <b-form-textarea class="form-control" rows="8" id="txtDescription" v-model="publication.AdditionalData.Description" size="sm" placeholder="Description"></b-form-textarea>
                              </b-col>
                            </b-row>
                            <b-row>
                              <b-col cols="6" class="text-center text-dark">Functional Series</b-col>
                              <b-col cols="6" class="text-center text-dark">Functional Field</b-col>
                            </b-row>
                            <b-row class="mb-1">
                              <b-col cols="6" class="text-center text-dark">
                                <b-form-select class="form-control" size="sm" id="ddFunctionalSeries" v-model="publication.AdditionalData.FunctionalSeries" :options="functionalseries" @change="onSeriesSelect"></b-form-select>
                              </b-col>
                              <b-col cols="6" class="text-center text-dark">
                                <b-form-select class="form-control" size="sm" id="ddFunctionalField" v-model="publication.AdditionalData.FunctionalField" :options="functionalfields"></b-form-select>
                              </b-col>
                            </b-row>
                            <b-row>
                              <b-col cols="6" class="text-center text-dark">Bookshelf</b-col>
                              <b-col cols="6" class="text-center text-dark">Admin Comments</b-col>
                            </b-row>
                            <b-row>
                              <b-col cols="6" class="text-center text-dark">
                                <b-form-select multiple class="form-control" size="sm" id="ddBookshelf" v-model="publication.Bookshelf" :options="bookshelves"></b-form-select>
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
                              <b-col cols="2" class="text-center text-dark">Edition</b-col>
                              <b-col cols="3" class="text-center text-dark">Change</b-col>
                              <b-col cols="2" class="text-center text-dark">Date of Issue</b-col>
                              <b-col cols="2" class="text-center text-dark">Resourced?</b-col>
                              <b-col cols="3" class="text-center text-dark">Status</b-col>
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
                                <b-form-checkbox class="form-control" size="sm" id="cbResourced" v-model="publication.Resourced" ref="Resourced" v-b-tooltip.hover.v-dark title="When checked(Yes), indicates that the PRA has resources needed to update the publication."></b-form-checkbox>
                              </b-col>
                              <b-col cols="3">
                                <b-form-select class="form-control" size="sm" id="ddStatus" v-model="publication.Status" :options="statuses" :state="ValidateMe('Status')" ref="Status" v-b-tooltip.hover.v-dark title="Status of publication. Choices depend on the Branch."></b-form-select>
                              </b-col>
                            </b-row>
                            <b-row>
                              <b-col cols="6" class="text-center text-dark">Status Comments</b-col>
                              <b-col cols="6" class="text-center text-dark">Supersedes</b-col>
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
                      <template slot="title">Security</template>
                      <b-row no-gutters>
                        <b-col cols="12"></b-col>
                      </b-row>
                    </b-tab>
                    <b-tab class="mtab">
                      <template slot="title">Availability</template>
                      <b-row no-gutters>
                        <b-col cols="12"></b-col>
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
  formReady = false

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
  public functionalseries!: Array<ObjectItem>

  @publication.State
  public functionalfields!: Array<ObjectItem>

  @support.Action
  public getBS!: () => Promise<boolean>

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
                    this.getBS()
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

<style scoped></style>
