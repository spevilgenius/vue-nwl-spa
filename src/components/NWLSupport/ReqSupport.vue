<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-overlay :show="!formReady" :variant="success" class="contentHeight m-0 p-0">
      <b-container v-if="formReady" fluid class="contentHeight m-0 p-0">
        <b-row no-gutters class="contentHeight">
          <b-col cols="6" class="m-0 p-1">
            <b-card no-body>
              <b-form class="mt-0">
                <b-form-row>
                  <b-col cols="2" class="text-center text-dark p-1"></b-col>
                  <b-col cols="12"> <label>Subject:</label> <input type="subject" required v-model="subject" /> </b-col>
                </b-form-row>
                <p></p>
                <b-form-row>
                  <b-col cols="12">
                    <b-form-group class="add-style" v-slot="{ ariaDescribedby }">
                      <b-col cols="2" class="text-center text-dark p-1"></b-col>
                      <label style="color: black; background-color: white;">Request Type: </label>
                      <!-- edit background and text color in _forms.scss reference class "requesttype"-->
                      <b-form-checkbox-group id="checkbox-group-1" v-model="selected" :options="options" :aria-describedby="ariaDescribedby" name="flavour-1" class="requesttype"> </b-form-checkbox-group>
                    </b-form-group>
                  </b-col>
                </b-form-row>
                <b-form-row>
                  <b-col cols="12">
                    <b-col cols="2" class="text-center text-dark p-1"></b-col>
                    <label>Details:</label>
                    <b-form-textarea id="textarea" variant="dark" v-model="text" placeholder="Enter details..." rows="3" max-rows="6"> </b-form-textarea>
                  </b-col>
                </b-form-row>
                <b-form-row>
                  <b-col cols="10"></b-col>
                  <b-col cols="2">
                    <b-button-group>
                      <b-button size="sm" @click="onCancel">Cancel</b-button>
                      <b-button :disabled="!saveReady" size="sm" @click="onSave" variant="success">Save</b-button>
                    </b-button-group>
                  </b-col>
                </b-form-row>
              </b-form>
            </b-card>
          </b-col>
          <b-col cols="6"></b-col>
        </b-row>
      </b-container>
      <template #overlay>
        <div class="text-center">
          <p id="busy-label">{{ overlayText }}</p>
        </div>
      </template>
    </b-overlay>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../interfaces/User'
import DynamicTable from '../Custom/DynamicTable2.vue'
import DynamicModalSelect from '../Custom/DynamicModalSelect.vue'
import { EventBus } from '../../main'
import { ReqSupportItem } from '../../interfaces/ReqSupportItem'
/* import { ObjectItem } from '@/interfaces/ObjectItem' */
import axios from 'axios'

const users = namespace('users')
const reqsupport = namespace('reqsupport')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component({
  name: 'All',
  components: {
    DynamicTable,
    DynamicModalSelect
  }
})
export default class All extends Vue {
  tblId = 'AllRequests'
  primaryKey = 'subject'
  overlayText = 'Getting Support Requests. Please wait...'
  overlayVariant = 'danger'
  interval!: any
  formReady = false
  saveReady = true
  subject = ''
  text = ''
  selected = []
  filteredrequests: Array<ReqSupportItem> = []
  requests: Array<ReqSupportItem> = []
  viewReady?: boolean = false
  formfields = ['subject', 'prfx', 'details']
  options?: any = [
    { text: 'Technical Issue', value: 'tech' },
    { text: 'Library Content', value: 'libcnt' },
    { text: 'Document Content', value: 'doccnt' },
    { text: 'Enhancement', value: 'enhance' },
    { text: 'Training', value: 'trng' }
  ]

  requestsfilter = ''
  requestsfields = [
    { key: 'Rtype', label: 'Request Type' },
    { key: 'Title', label: 'Subject' },
    { key: 'Details', label: 'Details' }
  ]

  @users.State
  public currentUser!: UserInt

  @reqsupport.State
  public allreqsupports!: Array<ReqSupportItem>

  @reqsupport.State
  public statuses!: Array<ReqSupportItem>

  @reqsupport.State
  public requestsloaded!: boolean

  @reqsupport.State
  public allrequestsloaded!: boolean

  @reqsupport.Action
  public setRequestLoaded!: (loaded: boolean) => void

  @reqsupport.Action
  public getAllreqsupports!: () => Promise<boolean>

  @reqsupport.Action
  public createAllRequests!: () => Promise<boolean>

  fields: any = [
    { key: 'Title', label: 'Subject', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px300', id: 20 },
    { key: 'RType', label: 'Request Type', actions: ['View', 'Edit'], thClass: 'tbl-dynamic-header', tdClass: 'px80', id: 0 },
    { key: 'Details', label: 'Details', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px100', id: 1 }
  ]

  /** @method - lifecycle hook */
  mounted() {
    this.getAllreqsupports()
    this.interval = setInterval(this.waitForIt, 500)
  }
  setallrequestsupports(arg0: boolean) {
    throw new Error('Method not implemented.')
  }

  public waitForIt() {
    clearInterval(this.interval)
    this.formReady = true
  }
  public onCancel() {
    // placeholder
  }
  public onSave() {
    alert('Saving')
  }
}
</script>
