<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-overlay :show="!formReady" :variant="success" class="contentHeight m-0 p-0">
      <b-container v-if="formReady" fluid class="contentHeight m-0 p-0">
        <b-row no-gutters class="contentHeight">
          <b-col cols="12" class="m-0 p-1">
            <b-card no-body>
              <b-form class="mt-0">
                <b-form-row>
                  <b-col cols="2" class="text-center text-dark p-1">
                    <b-form-group label="Branch" label-for="ddBranch" invalid-feedback="Please select a Branch" :state="ValidateMe('Branch')">
                      <b-form-select class="form-control" size="sm" id="ddBranch" v-model="branch" :options="branches" @change="onBranchSelect" :state="ValidateMe('Branch')" ref="branch" v-b-tooltip.hover.v-dark title="Indicates the branch of the library to which the publication belongs. Supports filtering of publications."></b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col cols="2" class="text-center text-dark p-1">
                    <b-form-group label="Prefix" label-for="ddPrefix" invalid-feedback="Please select a Prefix" :state="ValidateMe('Prefix')">
                      <b-form-select class="form-control" size="sm" id="ddPrefix" v-model="prfx" :options="prefixes" :state="ValidateMe('Prefix')" ref="prfx"></b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col cols="2" class="text-center text-dark p-1">
                    <b-form-group label="Pub ID" label-for="txtPubID" invalid-feedback="Please enter a PubID" :state="ValidateMe('PubID')">
                      <b-form-input class="form-control" size="sm" id="txtPubID" v-model="pubid" placeholder="Enter Pub ID" ref="pubid" :state="ValidateMe('PubID')"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col cols="6" class="text-center text-dark p-1">
                    <b-form-group label="Long Title" label-for="txtLongTitle" invalid-feedback="Please enter a Title" :state="ValidateMe('LongTitle')">
                      <b-form-input class="form-control" size="sm" id="txtLongTitle" v-model="ltitle" placeholder="Enter Long Title" ref="ltitle" :state="ValidateMe('LongTitle')"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-form-row>
              </b-form>
              <template #footer>
                <b-row no-gutters>
                  <b-col cols="10"></b-col>
                  <b-col cols="2">
                    <b-button-group>
                      <b-button size="sm" @click="onCancel">Cancel</b-button>
                      <b-button :disabled="!saveReady" size="sm" @click="onSave" variant="success">Save</b-button>
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
          <p id="busy-label">Loading New Publication Form</p>
        </div>
      </template>
    </b-overlay>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { PublicationItem } from '../../../interfaces/PublicationItem'
import { ObjectItem } from '@/interfaces/ObjectItem'

const publication = namespace('publication')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component
export default class NewPub extends Vue {
  interval!: any
  invalidTitle = 'Please input a valid Title.'
  invalidBranch = 'Please select a valid Branch.'
  totalcalls = 0
  completedcalls = 0
  formReady = false
  branch = ''
  prfx = ''
  pubid = ''
  ltitle = ''
  saveReady = false
  formfields = ['branch', 'prfx', 'pubid', 'ltitle']

  @publication.State
  public prefixes!: Array<ObjectItem>

  @publication.Action
  public getPrefixesByBranch!: (branch: string) => Promise<boolean>

  mounted() {
    this.formReady = true
  }

  branches = [
    { value: 'Please Select...', text: 'Please Select...' },
    { value: 'Navy', text: 'Navy' },
    { value: 'Allied', text: 'Allied' },
    { value: 'Joint', text: 'Joint' },
    { value: 'Other', text: 'Other' },
    { value: 'Multinational', text: 'Multinational' }
  ]

  public onBranchSelect() {
    if (this.branch !== '' && this.branch !== 'Please Select...') {
      // call getPrefixesByBranch
      this.getPrefixesByBranch(String(this.branch)).then(response => {
        if (response) {
          // setup timer to continuously check if all fields are valid to enable the save button
          this.interval = setInterval(this.isSaveReady, 500)
        }
      })
    }
  }

  public ValidateMe(control: string) {
    if (this.formReady) {
      let ret = false
      switch (control) {
        case 'LongTitle':
          ret = this.ltitle === '' || this.ltitle === '' ? false : true
          break

        case 'Branch':
          ret = this.branch === '' || this.branch === 'Please Select...' ? false : true
          break

        case 'Prefix':
          ret = this.prfx === '' || this.prfx === 'Please Select...' ? false : true
          break

        case 'PubID':
          ret = this.pubid === '' || this.pubid === '' ? false : true
          break
      }
      return ret
    } else {
      return false
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
}
</script>

<style></style>
