<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-overlay :show="!publoaded" :variant="success" class="contentHeight">
          <b-container fluid class="contentHeight m-0 p-0">
            <b-row no-gutters>
              <b-col cols="12" class="m-0 p-0">
                <b-card no-body>
                  <b-tabs v-model="rightTabs" card>
                    <b-tab class="mtab" active>
                      <template slot="title">Metadata</template>
                      <b-row no-gutters>
                        <b-col cols="12">
                          <b-form>
                            <b-form-group id="input-group-title" label="Title:" label-for="txtTitle" :state="ValidateMe('Title')" :invalid-feedback="invalidTitle">
                              <b-form-input class="form-control-sm" id="txtTitle" v-model="publication.Title" placeholder="Enter Title" required :state="ValidateMe('Title')" ref="Title"></b-form-input>
                              <b-form-invalid-feedback>
                                Enter a title for this publication
                              </b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group id="input-group-branch" label="Branch:" label-for="ddBranch" :state="ValidateMe('Branch')" :invalid-feedback="invalidBranch" description="Indicates the branch of the library to which the publication belongs. Supports filtering of publications.">
                              <b-form-select class="form-control-sm" id="ddBranch" v-model="publication.Branch" :options="branches" required :state="ValidateMe('Branch')" ref="Branch"></b-form-select>
                            </b-form-group>
                          </b-form>
                        </b-col>
                      </b-row>
                    </b-tab>
                    <b-tab class="mtab">
                      <template slot="title">Status</template>
                      <b-row no-gutters>
                        <b-col cols="12"></b-col>
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
                    <b-tab class="mtab">
                      <template slot="title">Library Data</template>
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

const users = namespace('users')
const publication = namespace('publication')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component
export default class EditPub extends Vue {
  interval!: any
  invalidTitle = 'Please input a valid Title.'
  invalidBranch = 'Please select a valid Branch.'

  @users.State
  public currentUser!: UserInt

  @publication.State
  public publoaded!: boolean

  @publication.State
  public publication!: PublicationItem

  @publication.Action
  public getPublicationById!: (id: string) => Promise<boolean>

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
      if (id !== null) {
        console.log('TEST B')
        this.getPublicationById(String(id)).then(response => {
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
    }
  }

  public ValidateMe(control: string) {
    let ret = false

    switch (control) {
      case 'Title':
        ret = this.publication.Title !== null ? true : false
        break

      case 'Branch':
        ret = this.publication.Branch !== null || this.publication.Branch !== 'Please Select...' ? true : false
        break
    }
    return ret
  }
}
</script>

<style scoped></style>
