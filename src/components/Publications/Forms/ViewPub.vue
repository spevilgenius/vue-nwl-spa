<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid v-if="publoaded" class="contentHeight m-0 p-0">
          <b-row no-gutters>
            <b-col id="FrameColumn" cols="8" class="contentHeight m-0 p-0">
              <b-overlay :show="!publoaded" variant="success" class="contentHeight">
                <iframe id="pubFrame" height="100%" width="100%"></iframe>
                <template #overlay>
                  <div class="text-center">
                    <p id="busy-label">Loading Publication</p>
                  </div>
                </template>
              </b-overlay>
            </b-col>
            <b-col cols="4" class="m-0 p-0">
              <b-card no-body>
                <b-tabs v-model="rightTabs" card>
                  <b-tab class="mtab" active>
                    <template slot="title">Data</template>
                    <b-row no-gutters>
                      <b-col cols="12">
                        <b-container fluid class="m-0 p-0">
                          <b-row no-gutters>
                            <b-col id="PRAIcon" cols="12"></b-col>
                            <!-- <b-col cols="8"></b-col> -->
                          </b-row>
                          <b-row id="Title">
                            <b-col cols="12" class="text-center mt-2"
                              ><strong>{{ publication.Title }}</strong>
                            </b-col>
                          </b-row>
                          <b-row id="Description" class="mt-2">
                            <b-col cols="12">
                              <div id="vpfdescription" class="text-left"></div>
                            </b-col>
                          </b-row>
                          <b-row class="mt-3" id="Prfx">
                            <b-col cols="4" class="text-left">Prefix</b-col>
                            <b-col cols="1"></b-col>
                            <b-col cols="7" class="text-left">{{ publication.Prfx }}</b-col>
                          </b-row>
                          <b-row id="PubID">
                            <b-col cols="4" class="text-left">Pub ID</b-col>
                            <b-col cols="1"></b-col>
                            <b-col cols="7" class="text-left">{{ publication.PubID }}</b-col>
                          </b-row>
                          <b-row id="Status">
                            <b-col cols="4" class="text-left">Status</b-col>
                            <b-col cols="1"></b-col>
                            <b-col cols="7" class="text-left">{{ publication.AdditionalData.Status }}</b-col>
                          </b-row>
                          <b-row id="LongTitle">
                            <b-col cols="4" class="text-left">Long Title</b-col>
                            <b-col cols="1"></b-col>
                            <b-col cols="7" class="text-left">{{ publication.LongTitle }}</b-col>
                          </b-row>
                          <b-row id="Edition">
                            <b-col cols="4" class="text-left">Edition</b-col>
                            <b-col cols="1"></b-col>
                            <b-col cols="7" class="text-left">{{ publication.AdditionalData.Edition }}</b-col>
                          </b-row>
                          <b-row id="Change">
                            <b-col cols="4" class="text-left">Change</b-col>
                            <b-col cols="1"></b-col>
                            <b-col cols="7" class="text-left">{{ publication.AdditionalData.Change }}</b-col>
                          </b-row>
                          <b-row id="NSN">
                            <b-col cols="4" class="text-left">NSN</b-col>
                            <b-col cols="1"></b-col>
                            <b-col cols="7" class="text-left">{{ publication.NSN }}</b-col>
                          </b-row>
                          <b-row id="PRA">
                            <b-col cols="5" class="text-left">Primary Review Authority</b-col>
                            <b-col cols="7" class="text-left">{{ publication.PRA }}</b-col>
                          </b-row>
                          <b-row id="NWDCAO">
                            <b-col cols="4" class="text-left">NWDC AO</b-col>
                            <b-col cols="1"></b-col>
                            <b-col cols="7" class="text-left">{{ publication.NWDCAO.Title }}</b-col>
                          </b-row>
                          <b-row id="LibrarianRemarks">
                            <b-col cols="4" class="text-left">Librarian Remarks</b-col>
                            <b-col cols="1"></b-col>
                            <b-col cols="7" class="text-left">{{ publication.LibrarianRemarks }}</b-col>
                          </b-row>
                          <b-row id="Classification">
                            <b-col cols="4" class="text-left">Classification</b-col>
                            <b-col cols="1"></b-col>
                            <b-col cols="7" class="text-left">{{ publication.Class }}</b-col>
                          </b-row>
                          <b-row id="DTIC">
                            <b-col cols="4" class="text-left">DTIC</b-col>
                            <b-col cols="1"></b-col>
                            <b-col cols="7" class="text-left">{{ publication.DTIC }}</b-col>
                          </b-row>
                          <b-row class="py20"></b-row>
                          <b-row>
                            <b-col cols="4" class="text-left">
                              <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" variant="success" size="sm" @click="editItem(publication.Id, publication.IsNato)">
                                Edit Properties
                              </b-button>
                            </b-col>
                            <b-col cols="8"></b-col>
                          </b-row>
                        </b-container>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <b-tab class="mtab">
                    <template slot="title">Supporting Documents</template>
                    <b-row no-gutters>
                      <b-col cols="12">
                        <b-container fluid class="m-0 p-0">
                          <b-row no-gutters style="height: calc(100vh - 300px)">
                            <b-col cols="12" v-if="currentUser.isActionOfficer || currentUser.isLibrarian || currentUser.isNATOLibrarian">
                              <b-table id="SupportingDocsTable" striped hover :items="supportingdocs" :fields="table.aofields" :per-page="perPage" :current-page="currentPage">
                                <template #cell(actions)="data">
                                  <b-button v-if="currentUser.isLibrarian || currentUser.isActionOfficer" variant="white" size="lg" class="actionbutton text-dark" @click="deleteItem(data.item.Id, data.item.IsNato)">
                                    <font-awesome-icon :icon="['fas', 'trash-alt']" class="icon"></font-awesome-icon>
                                  </b-button>
                                  <b-button v-if="currentUser.isLibrarian || currentUser.isActionOfficer" variant="white" size="lg" class="actionbutton text-dark ml-1" @click="toggleHidden(data.item)" v-b-tooltip.hover.v-dark title="Set visibility for AO and Librarians only.">
                                    <font-awesome-icon :icon="['far', 'eye']" class="icon"></font-awesome-icon>
                                  </b-button>
                                </template>
                                <template #cell(Name)="data">
                                  <b-container fluid v-if="String(data.item.Name).indexOf('.doc') > 0">
                                    <b-row no-gutters>
                                      <b-col cols="1">
                                        <div style="width: 16px; height: 16px;">
                                          <img
                                            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPldvcmRfMTZ4PC90aXRsZT48cGF0aCBkPSJNMTYsNFYxYTEsMSwwLDAsMC0xLTFINEExLDEsMCwwLDAsMywxVjRMOS41LDUuMzc5WiIgZmlsbD0iIzQxYTVlZSIvPjxwb2x5Z29uIHBvaW50cz0iMTUuOTk5IDQgMi45OTkgNCAyLjk5OSA4IDkuNSA5LjE2OCAxNS45OTkgOCAxNS45OTkgNCIgZmlsbD0iIzJiN2NkMyIvPjxwb2x5Z29uIHBvaW50cz0iMTYgOCAzIDggMyAxMiA5LjQ5OSAxMyAxNiAxMiAxNiA4IiBmaWxsPSIjMTg1YWJkIi8+PHBhdGggZD0iTTMsMTJ2M2ExLDEsMCwwLDAsMSwxSDE1YTEsMSwwLDAsMCwxLTFWMTJaIiBmaWxsPSIjMTAzZjkxIi8+PHBhdGggZD0iTTEwLDQsMyw0LDMsMTRIOWEyLDIsMCwwLDAsMi0yVjVBMSwxLDAsMCwwLDEwLDRaIiBvcGFjaXR5PSIwLjUiLz48cmVjdCB5PSIzIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHJ4PSIxIiBmaWxsPSIjMTg1YWJkIi8+PHBhdGggZD0iTTMuMzUyLDkuNTRjLjAxNy4xNDIuMDI5LjI2Ni4wMzQuMzcyaC4wMTljLjAwOC0uMS4wMjMtLjIyMi4wNDYtLjM2NHMuMDQ0LS4yNjIuMDY1LS4zNkw0LjQyOSw1SDUuNjFsLjk0NSw0LjEyNmE2LjI2Nyw2LjI2NywwLDAsMSwuMTE4Ljc3OGguMDE2YTYuMzQ4LDYuMzQ4LDAsMCwxLC4xLS43NTNMNy41NDMsNUg4LjYxOEw3LjMsMTFINi4wMzlsLS45LTMuOTc1Yy0uMDI2LS4xMTQtLjA1Ni0uMjY0LS4wODktLjQ0OHMtLjA1My0uMzE4LS4wNjEtLjRINC45NzJjLS4wMS4xLS4wMy4yNDItLjA2MS40MzVzLS4wNTQuMzM1LS4wNzIuNDI3TDMuOTkyLDExSDIuNzE2TDEuMzgyLDVIMi40NzZMMy4zLDkuMkMzLjMxOCw5LjI4MywzLjMzNSw5LjQsMy4zNTIsOS41NFoiIGZpbGw9IiNmZmYiLz48L3N2Zz4="
                                            class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                                          />
                                        </div>
                                      </b-col>
                                      <b-col cols="11">
                                        <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                                      </b-col>
                                    </b-row>
                                  </b-container>
                                  <b-container fluid v-if="String(data.item.Name).indexOf('.xls') > 0">
                                    <b-row no-gutters>
                                      <b-col cols="1">
                                        <div style="width: 16px; height: 16px;">
                                          <img
                                            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPkV4Y2VsXzE2eDwvdGl0bGU+PHBhdGggZD0iTTEwLDBINEExLDEsMCwwLDAsMywxVjRsNyw0LDMsMS45NjhMMTYsOFY0WiIgZmlsbD0iIzIxYTM2NiIvPjxwb2x5Z29uIHBvaW50cz0iMTYgOCAzIDggMyAxMiAxMCAxMy40IDE2IDEyIDE2IDgiIGZpbGw9IiMxMDdjNDEiLz48cGF0aCBkPSJNMywxMnYzYTEsMSwwLDAsMCwxLDFIMTVhMSwxLDAsMCwwLDEtMVYxMloiIGZpbGw9IiMxODVjMzciLz48cGF0aCBkPSJNMTAsNEgzVjE0SDlhMiwyLDAsMCwwLDItMlY1QTEsMSwwLDAsMCwxMCw0WiIgb3BhY2l0eT0iMC41Ii8+PHJlY3QgeT0iMyIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiByeD0iMSIgZmlsbD0iIzEwN2M0MSIvPjxwYXRoIGQ9Ik0yLjI5MiwxMSw0LjIzNCw3Ljk5MiwyLjQ1NSw1SDMuODg2bC45NzEsMS45MTJjLjA4OS4xODIuMTUxLjMxNy4xODQuNDA2aC4wMTNxLjEtLjIxNy4yLS40MjNMNi4yOTIsNUg3LjYwNkw1Ljc4Miw3Ljk3NSw3LjY1MiwxMWgtMS40TDUuMTMzLDguOUExLjgwNiwxLjgwNiwwLDAsMSw1LDguNjE5SDQuOTgzYTEuMzQsMS4zNCwwLDAsMS0uMTMuMjcyTDMuNywxMVoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTYsMVY0SDEwVjBoNUExLDEsMCwwLDEsMTYsMVoiIGZpbGw9IiMzM2M0ODEiLz48L3N2Zz4="
                                            class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                                          />
                                        </div>
                                      </b-col>
                                      <b-col cols="11">
                                        <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                                      </b-col>
                                    </b-row>
                                  </b-container>
                                  <b-container fluid v-if="String(data.item.Name).indexOf('.ppt') > 0">
                                    <b-row no-gutters>
                                      <b-col cols="1">
                                        <div style="width: 16px; height: 16px;">
                                          <img
                                            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPlBvd2VyUG9pbnRfMTZ4PC90aXRsZT48cGF0aCBkPSJNOCwwQTguMDI0LDguMDI0LDAsMCwwLDAsOGwxMCwyLjM2M1oiIGZpbGw9IiNlZDZjNDciLz48cGF0aCBkPSJNOCwwVjhsNCwyLjU5TDE2LDhBOC4wMjQsOC4wMjQsMCwwLDAsOCwwWiIgZmlsbD0iI2ZmOGY2YiIvPjxwYXRoIGQ9Ik0xNiw4QTgsOCwwLDAsMSwwLDhaIiBmaWxsPSIjZDM1MjMwIi8+PHBhdGggZD0iTTEwLDRIMS4wODZBNy45Myw3LjkzLDAsMCwwLDIuNzM1LDE0SDlhMiwyLDAsMCwwLDItMlY1QTEsMSwwLDAsMCwxMCw0WiIgb3BhY2l0eT0iMC41Ii8+PHBhdGggZD0iTTEwLDRIMS4wODZBNy45Myw3LjkzLDAsMCwwLDIuNzM1LDE0SDlhMiwyLDAsMCwwLDItMlY1QTEsMSwwLDAsMCwxMCw0WiIgb3BhY2l0eT0iMC4xIi8+PHJlY3QgeT0iMyIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiByeD0iMSIgZmlsbD0iI2M0M2UxYyIvPjxwYXRoIGQ9Ik01LjMzNiw1QTIuMjc1LDIuMjc1LDAsMCwxLDYuOSw1LjQ4MWExLjc2NiwxLjc2NiwwLDAsMSwuNTQxLDEuMzkzLDIuMDIzLDIuMDIzLDAsMCwxLS4yNjcsMS4wNDIsMS44MzYsMS44MzYsMCwwLDEtLjc2Mi43MSwyLjQ4NCwyLjQ4NCwwLDAsMS0xLjE0NC4yNTNINC4xODJWMTFIMy4wNzJWNVpNNC4xODIsNy45NjJoLjk1NkExLjIsMS4yLDAsMCwwLDUuOTgzLDcuN2ExLjAxMiwxLjAxMiwwLDAsMCwuMjg1LS43NzdxMC0uOTkxLTEuMDk0LS45OTFINC4xODJaIiBmaWxsPSIjZmZmIi8+PC9zdmc+"
                                            class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                                          />
                                        </div>
                                      </b-col>
                                      <b-col cols="11">
                                        <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                                      </b-col>
                                    </b-row>
                                  </b-container>
                                  <b-container fluid v-if="String(data.item.Name).indexOf('.pdf') > 0">
                                    <b-row no-gutters>
                                      <b-col cols="1">
                                        <div style="width: 16px; height: 16px;">
                                          <img
                                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAInSURBVDhPpVM9SytREI2ijdqqlYq2/gDBSqy19Qf4CyzsFMROUBBsLBTRQkSwE0QLazvzZRINSEx8eY/w8r3Z3WSzu+edmU2i4b3uHTjMvXdmzp07OxvCf0IFstksyuWystZswrq/hx2Pw263Ydu20jRN1Go1lEolFAoFZDKZL4F0Oo02gy3LgisHZ2fAyYms+tCNEaFkMqlnKpBKpWAYht7kycHNDXB4KKs+uK6rAvV6XXMEfQJNlu95KgEsLQX2G8Qnl/wlIOX0KugK7O8HlXzD9wr6npBIJPRQe8AgxdUV8P4OnJ8He8IhTbLGiyRHoAJxdlwa02CnW9z7xSKwsQFcXgJ7e8D6OvzlZbQvLtA8Pobx+Ij466ukBgLRaBSVahV1VuAwwGOwx350IY9y6Gvxy1hHR6i8vSH68qI+FQhzU3QcmPx8zvY2bJ5Jue0OW74PmzS4LrNHxUZDcwQq8MT3ZsNh5DgPeQ5Vge8rCtmoEvmbLMRiyDMpx2o/np/xdH39JfAzREP6YgcHYc7Po7KwgMbiIsq0zbk51PmsXgz5S2xXIDcwAI+JztgY3OFhtE5PUXl4gHtwAGd3F9bdHapra/BGRuCMjsJj/CfZE8h3VLv0t7bUOpwFY2cH2NwMfENDvRitWgSkw7crK4hNTiIyNRVwfByR2VlEJiYQJcVGZmYC3/S0xt6urup/E/LZ3R+cgQ/OQJafSinrf7Hjl1jJ8X0ffwD6zWt+lsTfRwAAAABJRU5ErkJggg=="
                                            class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                                          />
                                        </div>
                                      </b-col>
                                      <b-col cols="11">
                                        <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                                      </b-col>
                                    </b-row>
                                  </b-container>
                                </template>
                                <template #cell(Hidden)="data">
                                  <b-checkbox :checked="data.item.Hidden === 'Yes'"></b-checkbox>
                                </template>
                              </b-table>
                            </b-col>
                            <b-col cols="12" v-else>
                              <b-table id="SupportingDocsTable" striped hover :items="supportingdocs" :fields="table.fields" :per-page="perPage" :current-page="currentPage">
                                <template #cell(actions)="data">
                                  <b-button v-if="currentUser.isLibrarian || currentUser.isActionOfficer" variant="white" size="lg" class="actionbutton text-dark" @click="deleteItem(data.item.Id, data.item.IsNato)">
                                    <font-awesome-icon :icon="['fas', 'trash-alt']" class="icon"></font-awesome-icon>
                                  </b-button>
                                  <b-button v-if="currentUser.isLibrarian || currentUser.isActionOfficer" variant="white" size="lg" class="actionbutton text-dark ml-1" @click="toggleHidden(data.item)" v-b-tooltip.hover.v-dark title="Set visibility for AO and Librarians only.">
                                    <font-awesome-icon :icon="['far', 'eye']" class="icon"></font-awesome-icon>
                                  </b-button>
                                </template>
                                <template #cell(Name)="data">
                                  <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                                </template>
                                <template #cell(Hidden)="data">
                                  <b-checkbox :checked="data.item.Hidden === 'Yes'"></b-checkbox>
                                </template>
                              </b-table>
                            </b-col>
                          </b-row>
                          <b-row no-gutters style="height: 50px;">
                            <b-col cols="12">
                              <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="my-0 p-0"></b-pagination>
                            </b-col>
                          </b-row>
                          <b-row no-gutters style="height: 50px;">
                            <b-col cols="12">
                              <b-form-file v-model="file" no-drop v-if="currentUser.isLibrarian || currentUser.isActionOfficer" :state="Boolean(file1)" placeholder="Choose a new supporting document." @input="fileSelected()"></b-form-file>
                            </b-col>
                          </b-row>
                        </b-container>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <b-tab class="mtab">
                    <template slot="title">Feedback/Comments</template>
                  </b-tab>
                </b-tabs>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import crono from 'vue-crono'
import { namespace } from 'vuex-class'
import { UserInt } from '../../../interfaces/User'
import { PublicationItem } from '../../../interfaces/PublicationItem'
import { SupportingDocItem } from '../../../interfaces/SupportingDocItem'
import axios from 'axios'

const users = namespace('users')
const publication = namespace('publication')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component({
  name: 'ViewPub',
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
          id: 'SupportingDocsTable',
          aofields: [
            { key: 'actions', label: 'Actions', tdClass: 'px80' },
            { key: 'Name', label: 'Document Name', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 1 },
            { key: 'Hidden', label: 'Hidden', sortable: true, type: 'default', format: 'checkbox', id: 2 }
          ],
          fields: [{ key: 'Name', label: 'Document Name', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 1 }],
          items: [],
          overlayText: 'Loading. Please Wait...',
          overlayVariant: 'success',
          perPage: 15,
          currentPage: 1
        }
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log('BEFOREROUTELEAVE: ' + to)
    next(vm => {
      ;(vm as ViewPub).unload()
    })
  }
})
export default class ViewPub extends Vue {
  rightTabs = []
  interval!: any
  iconsource!: any
  formReady = false
  totalRows = 0
  perPage = 15
  currentPage = 1
  file?: File
  buffer?: any = null
  fileUploaded?: boolean = false
  fileDeleted?: boolean = false
  fileUpdated?: boolean = false
  docdata: any = {}

  get publoaded() {
    return this.$store.state.publication.publoaded
  }

  @users.State
  public currentUser!: UserInt

  @publication.State
  public digest!: string

  /* @publication.State
  public publoaded!: boolean */

  @publication.State
  public publication!: PublicationItem

  @publication.State
  public supportingdocsloaded!: boolean

  @publication.State
  public supportingdocs!: Array<SupportingDocItem>

  @publication.State
  public bufferloaded!: boolean

  @publication.State
  public pubBuffer!: ArrayBuffer

  @publication.Action
  public setPubLoaded!: (loaded: boolean) => void

  @publication.Action
  public getSupportingDocs!: (data: any) => Promise<boolean>

  @publication.Action
  public getPublicationById!: (data: any) => Promise<boolean>

  @publication.Action
  public getDigest!: () => Promise<boolean>

  /* beforeRouteLeave(to: any, from: any, next: any) {
    console.log('BEFOREROUTELEAVE: ' + to)
    this.setPubLoaded(false)
    next()
  } */

  mounted() {
    console.log('ViewPub Mounted!')
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

  updated() {
    console.log('ViewPub Updated!')
  }

  public unload() {
    console.log('UNLOADING PUB!')
    this.setPubLoaded(false)
  }

  public loadData() {
    if (this.publoaded) {
      clearInterval(this.interval)
      const that = this
      let data: any = {}
      data.DocID = this.publication.DocID
      data.nato = this.publication.IsNato
      if (this.currentUser.isActionOfficer || this.currentUser.isLibrarian || this.currentUser.isNATOLibrarian) {
        data.showhidden = 'Yes'
      } else {
        data.showhidden = 'No'
      }
      this.docdata = data
      this.getSupportingDocs(data).then(response => {
        if (response) {
          that.interval = setInterval(that.waitForData, 500)
        }
      })
    }
  }

  public async waitForData() {
    if (this.supportingdocsloaded) {
      console.log('Single Pub Loaded: ' + this.publication.RelativeURL)
      clearInterval(this.interval)
      let ad = this.publication.AdditionalData
      this.totalRows = this.supportingdocs.length
      try {
        let pra = ad.PRAAbbrev
        let src = tp1 + slash + slash + tp2 + '/PublishingImages/PRA/'
        src += pra
        src += '.png'
        console.log('Set Image Source: ' + src)
        let img = document.createElement('img')
        img.height = 150
        img.width = 150
        img.src = src
        document.getElementById('PRAIcon')?.appendChild(img)
      } catch (e) {
        //don't care for now
      }
      // update the decription element
      const element: HTMLDivElement = document.getElementById('vpfdescription') as HTMLDivElement
      element.innerHTML = this.publication.AdditionalData.Description
      console.log('DocID = ' + this.publication.DocID)
      // TODO: set frame to document url
      const that = this
      if (String(this.publication.RelativeURL).indexOf('.pdf') > 0) {
        // woohoo
        let getfileUrl = tp1 + slash + slash + tp2 + "/_api/web/GetFileByServerRelativeUrl('" + this.publication.RelativeURL + "')/OpenBinaryStream"
        const response = await axios.get(getfileUrl, {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/pdf'
          }
        })
        // let buff = new ArrayBuffer(response.data)
        let file = new File([response.data], 'preview.pdf')
        let buff = this.getFileBuffer(file)
        buff.then(function(b) {
          let blob = new Blob([b as Blob], { type: 'application/pdf' })
          let link = window.URL.createObjectURL(blob)
          let iframe = document.getElementById('pubFrame') as HTMLIFrameElement
          iframe.src = link
        })
      }
    }
  }

  public async refreshDocs() {
    if (this.fileUploaded || this.fileDeleted || this.fileUpdated) {
      this.fileUploaded = false
      this.fileDeleted = false
      this.fileUpdated = false
      this.getSupportingDocs(this.docdata)
    }
  }

  public editItem(id: string, nato: string) {
    this.$router.push({ name: 'Edit Publication', params: { Id: id, Nato: nato, t: new Date().getTime().toString() } })
  }

  public async deleteItem(id: string, nato: string) {
    const that = this
    this.getDigest().then(function() {
      let url = ''
      if (nato === 'Yes') {
        url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('NATOSupportingDocuments')/items(" + id + ')'
      } else {
        url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('SupportingDocuments')/items(" + id + ')'
      }
      let headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': that.digest,
        'X-HTTP-Method': 'DELETE',
        'If-Match': '*'
      }
      let config = {
        headers: headers
      }
      that.deleteFile(url, config)
    })
  }

  public async deleteFile(uri: string, config: any) {
    await axios.post(uri, null, config)
    this.fileDeleted = true
    this.refreshDocs()
  }

  public async toggleHidden(item: any) {
    const that = this
    this.getDigest().then(function() {
      let url = ''
      if (item.IsNato === 'Yes') {
        url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('NATOSupportingDocuments')/items(" + item.Id + ')'
      } else {
        url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('SupportingDocuments')/items(" + item.Id + ')'
      }
      let headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': that.digest,
        'X-HTTP-Method': 'MERGE',
        'If-Match': '*'
      }
      let config = {
        headers: headers
      }
      let itemprops = {
        __metadata: { type: item.type },
        Hidden: item.Hidden === 'Yes' ? false : true
      }
      that.updateFile(url, config, itemprops)
    })
  }

  public async updateFile(uri: string, config: any, itemprops: any) {
    await axios.post(uri, itemprops, config)
    this.fileUpdated = true
    this.refreshDocs()
  }

  public fileSelected() {
    // get the bufffer
    const that = this
    let buffer = this.getFileBuffer(this.file)
    buffer.then(function(buff: any) {
      that.buffer = buff
    })
    // get the digest so we can upload
    this.getDigest().then(response => {
      if (response) {
        this.interval = setInterval(this.uploadFile, 500)
      }
    })
  }

  public async uploadFile() {
    // get a buffer for the file and then upload to the appropriate library
    // after upload we can then set the properties of the document and then refresh the supporting docs array
    if (this.digest !== '') {
      clearInterval(this.interval)
      const that = this
      if (this.buffer !== null) {
        let url = ''
        if (this.publication.IsNato === 'Yes') {
          url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('NATOSupportingDocuments')/RootFolder/Files/Add"
        } else {
          url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('SupportingDocuments')/RootFolder/Files/Add"
        }
        url += "(url='"
        url += this.file?.name
        url += "',overwrite=true)"
        let headers = {
          Accept: 'application/json;odata=verbose',
          'X-RequestDigest': this.digest
        }
        try {
          let response = await axios({
            url: url,
            method: 'POST',
            data: this.buffer,
            headers: headers
          })
          // get the id and process the form data into the new document
          console.log('UPLOAD RESPONSE: ' + response)
          let itemlink = response.data.d.ListItemAllFields.__deferred.uri
          response = await axios({
            method: 'GET',
            url: itemlink,
            headers: {
              Accept: 'application/json;odata=verbose'
            }
          })
          let metadata = response.data.d.__metadata
          let id = response.data.d.Id
          console.log('RESPONSE METADATA: ' + metadata)
          // set the fields for updating
          let itemprops = {
            __metadata: { type: metadata.type },
            DocID: this.publication.DocID
          }
          const uheaders = {
            'Content-Type': 'application/json;odata=verbose',
            Accept: 'application/json;odata=verbose',
            'X-RequestDigest': this.digest,
            'X-HTTP-Method': 'MERGE',
            'If-Match': '*'
          }
          const config = {
            headers: uheaders
          }
          response = await axios.post(metadata.uri, itemprops, config)
          console.log('UPDATE RESPONSE: ' + response)
          this.fileUploaded = true
          this.refreshDocs()
        } catch (error) {
          console.log('Error Adding Document: ' + error)
        }
      }
    }
  }

  public getFileBuffer(file) {
    let p = new Promise(function(resolve, reject) {
      var reader = new FileReader()
      reader.onloadend = function(e) {
        resolve(e?.target?.result)
      }
      reader.onerror = function(e) {
        reject(e?.target?.error)
      }
      reader.readAsArrayBuffer(file)
    })
    return p
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
}
</script>

<style>
#vpfdescription {
  height: 100px !important;
  overflow-y: scroll;
  line-height: 16px;
}

#SupportingDocsTable > tbody td,
#SupportingDocsTable > tbody th {
  border: 1px solid #000000 !important;
  height: 20px !important;
  padding: 2px 5px !important;
}
</style>
