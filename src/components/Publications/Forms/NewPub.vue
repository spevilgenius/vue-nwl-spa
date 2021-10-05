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
          <p id="busy-label">{{ overlayText }}</p>
        </div>
      </template>
    </b-overlay>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../../interfaces/User'
import { ObjectItem } from '@/interfaces/ObjectItem'
import axios from 'axios'

const publication = namespace('publication')
const users = namespace('users')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component
export default class NewPub extends Vue {
  interval!: any
  invalidTitle = 'Please input a valid Title.'
  invalidBranch = 'Please select a valid Branch.'
  overlayText = 'Loading New Publication Form.'
  totalcalls = 0
  completedcalls = 0
  formReady = false
  branch = ''
  prfx = ''
  pubid = ''
  ltitle = ''
  nato = false
  saveReady = false
  formfields = ['branch', 'prfx', 'pubid', 'ltitle']

  @users.State
  public currentUser!: UserInt

  @publication.State
  public digest!: string

  @publication.State
  public prefixes!: Array<ObjectItem>

  @publication.Action
  public getPrefixesByBranch!: (branch: string) => Promise<boolean>

  @publication.Action
  public getDigest!: () => Promise<boolean>

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
          ret = this.ltitle === '' ? false : true
          break

        case 'Branch':
          ret = this.branch === '' || this.branch === 'Please Select...' ? false : true
          break

        case 'Prefix':
          ret = this.prfx === '' || this.prfx === 'Please Select...' ? false : true
          break

        case 'PubID':
          ret = this.pubid === '' ? false : true
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

  public onSave() {
    this.overlayText = 'Uploading Document'
    this.formReady = false
    // need to get the digest first
    clearInterval(this.interval)
    this.getDigest().then(response => {
      if (response) {
        this.interval = setInterval(this.saveForm, 500)
      }
    })
  }

  public async saveForm() {
    // use the default new publication template to create a new document and upload it to the library.
    // the return of the call will return the id of the new document which we will use to update the data
    // the library is determined by the current user. If they are NATO, then the document is a Nato document
    clearInterval(this.interval)
    let nato: any = this.currentUser.isNATOLibrarian
    this.nato = nato
    let url = ''
    let turl = ''
    let getfileUrl = tp1 + slash + slash + tp2 + "/_api/web/GetFileByServerRelativeUrl('/Documents/NewPublicationTemplate.pdf')/OpenBinaryStream"
    const response = await axios.get(getfileUrl, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/pdf'
      }
    })
    let name = this.prfx + ' ' + this.pubid + ' ' + this.ltitle + '.pdf'
    let responsedata = response.data
    if (this.nato) {
      url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('NATOPublications')/RootFolder/Files/Add"
    } else {
      url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('ActivePublications')/RootFolder/Files/Add"
    }
    // TODO: For testing we are using a different library with versioning turned on.
    url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('AAAPubs')/RootFolder/Files/Add"
    url += "(url='"
    url += name
    url += "',overwrite=true)"
    let headers = {
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': this.digest
    }
    try {
      let response = await axios({
        url: url,
        method: 'POST',
        data: responsedata,
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
        Title: name,
        BranchTitle: this.branch,
        Prfx: this.prfx,
        PubID: this.pubid,
        LongTitle: this.ltitle,
        DocID: this.makeGuid()
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
      // navigate to the edit form for this item
      this.$router.push({ name: 'Edit Publication', params: { Id: id, Nato: nato } })
    } catch (error) {
      console.log('Error Adding Document: ' + error)
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

  public makeGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}
</script>

<style></style>
