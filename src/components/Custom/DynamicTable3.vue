<template>
  <b-container fluid class="contentHeight m-2 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="contentHeight m-0 p-0">
          <b-row no-gutters :class="table.headerClass" :style="getStyle('buttonrow', null)">
            <b-col cols="4" class="float-left">
              <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="my-0"></b-pagination>
            </b-col>
            <b-col cols="4">
              <b-button v-if="currentUser.isTerminologist" @click="$bvModal.show('bv-modal-addTerm')" style="height: 35px;">New Term/Acronym</b-button>
              <b-modal id="bv-modal-addTerm" :no-close-on-backdrop="true" hide-footer>
                <template #addNewTerm>
                  Add New Term/Acronym
                </template>
                <b-container v-if="formReady" fluid class="contentHeight m-0 p-0">
                  <b-row no-gutters class="contentHeight">
                    <b-col cols="12" class="m-0 p-1">
                      <b-card no-body>
                        <b-form class="mt-0">
                          <b-form-row>
                            <b-col cols="2" class="text-center text-dark p-1">
                              <b-form-group label="Branch" label-for="ddBranch" invalid-feedback="Please select a Branch" :state="ValidateMe('Branch')">
                                <b-form-select
                                  class="form-control"
                                  size="sm"
                                  id="ddBranch"
                                  v-model="branch"
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
              </b-modal>
            </b-col>
            <b-col cols="4" class="mt-1 pr-3">
              <b-input-group class="float-right">
                <b-form-input v-model="filter" placeholder="Filter..." type="search"></b-form-input>
                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row no-gutters :style="getStyle('tablerow', null)">
            <b-col cols="12" class="p-1">
              <b-table
                striped
                hover
                :sticky-header="getSticky('dynamictable')"
                :items="filtereditems"
                :fields="table.fields"
                primary-key="table.primarykey"
                :filter="filter"
                :filter-included-fields="filterOn"
                :per-page="perPage"
                :current-page="currentPage"
                table-class="table-full"
                table-variant="light"
                :style="getStyle('tablerow', null)"
                @filtered="onFiltered"
              >
                <template #cell(definition)="data">
                  <div class="definition" :title="data.item.definition" v-b-tooltip.hover.v-dark>{{ data.item.definition }}</div>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-container>
        <template #overlay>
          <div class="text-center">
            <p id="busy-label">{{ overlayText }}</p>
          </div>
        </template>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { EventBus } from '../../main'
import { UserInt } from '../../interfaces/User'
import { ObjectItem } from '@/interfaces/ObjectItem'
import axios from 'axios'

const support = namespace('support')
const users = namespace('users')
const publication = namespace('publication')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

let that: any

@Component({
  name: 'terminology-table',
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
          id: 'dynamic-table',
          list: 'ActivePublications',
          primaryKey: 'id',
          buttons: ['Add', 'Edit', 'Export', 'Delete'] /* Add, Edit, Export, Delete, Search */,
          fields: [],
          items: [],
          filterField: {
            Type: String,
            default: ''
          },
          filterValue: '',
          overlayText: 'Loading. Please Wait...',
          overlayVariant: 'success'
        }
      }
    },
    searchEnabled: {
      type: Boolean,
      default: false
    }
  }
})
export default class DynamicTable extends Vue {
  filter = null
  filterOn: Array<any> = []
  checkBoxes: Array<any> = ['Prfx', 'Branch']
  Branch!: any
  Prfx!: any
  PubID!: any
  Title!: any
  Bookshelf!: any
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

  @support.State
  public contentheight!: number

  @support.State
  public contentwidth!: number

  @publication.State
  public prefixes!: Array<ObjectItem>

  @publication.Action
  public getPrefixesByBranch!: (branch: string) => Promise<boolean>

  @publication.Action
  public getDigest!: () => Promise<boolean>

  @support.State
  public bookshelves!: Array<ObjectItem>

  @support.Action
  public getBS!: () => Promise<boolean>

  interval!: any
  filtereditems: Array<any> = []
  currentPage = 1
  totalRows = 0
  perPage = 20 // default

  branches = [
    { value: 'Please Select...', text: 'Please Select...' },
    { value: 'Navy', text: 'Navy' },
    { value: 'Allied', text: 'Allied' },
    { value: 'Joint', text: 'Joint' },
    { value: 'Other', text: 'Other' },
    { value: 'Multinational', text: 'Multinational' }
  ]

  created() {
    that = this
  }

  mounted() {
    // wait for there to be items and then gitrdone
    this.interval = setInterval(this.waitForIt, 500)
  }

  public waitForIt() {
    if (this.$props.table.items.length > 0) {
      const that = this
      console.log('got props items ' + this.$props.table.items.length)
      clearInterval(that.interval)
      this.getBS()
      this.totalRows = this.$props.table.items.length
      this.filtereditems = this.$props.table.items // set initially to all items
      if (this.$props.table.filterField !== null && this.$props.table.filterField !== '') {
        this.filter = this.$props.table.filterValue
        this.filterOn.push(this.$props.table.filterField)
      }
      // Calculate perPage based on counting the number of rows that will fit in the available space
      let available = this.contentheight - 130
      let amount = Math.floor(available / 33) // (Jean changed to 33 from) 29 is based on the height of the rows used by the 'small' attribute on the b-table component
      this.perPage = amount
    }
  }

  public onBranchSelect() {
    if (this.Branch !== null && this.Branch !== 'Please Select...') {
      // call getPrefixesByBranch
      this.getPrefixesByBranch(String(this.Branch)).then(response => {
        if (response) {
          this.filter = this.Branch
          this.filterOn = ['Branch']
        }
      })
    }
  }

  public onPrfxSelect() {
    if (this.Prfx !== null && this.Prfx !== 'Please Select...') {
      this.filter = this.Prfx
      this.filterOn = ['Prfx']
    }
  }

  public onPubIDSelected() {
    if (this.PubID !== null && this.PubID !== '') {
      this.filter = this.PubID
      this.filterOn = ['PubID']
    }
  }

  public onTitleSelected() {
    if (this.Title !== null && this.Title !== '') {
      this.filter = this.Title
      this.filterOn = ['Title']
    }
  }

  public onBookshelfSelected() {
    if (this.Bookshelf !== null && this.Bookshelf !== '') {
      this.filter = this.Bookshelf
      this.filterOn = ['Bookshelf']
    }
  }

  public onFiltered(filtereditems) {
    this.totalRows = filtereditems.length
    this.currentPage = 1
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
  /*   public getSticky(element) {
    let h: any
    switch (element) {
      case 'dynamictable':
        h = that.contentheight - 200 + 'px'
        break
    }
    return h
  } */
  public getStyle(element, field) {
    let style: any = {}
    switch (element) {
      case 'buttonrow':
        style.background = '#ffffff'
        style.height = '50px'
        style.width = that.contentwidth + 'px'
        break

      case 'maintable':
        style.width = that.contentwidth - 5 + 'px'
        break

      case 'tablerow':
        style.height = that.contentheight - 200 + 'px'
        style.width = that.contentwidth + 'px'
        break

      case 'pagingrow':
        style.height = '50px'
        style.width = that.contentwidth + 'px'
        break
    }
    return style
  }

  public viewItem(id: string, nato: string) {
    let args: any = {}
    args.id = id
    args.nato = nato
    EventBus.$emit('viewItem', args)
  }

  public editItem(id: string, nato: string) {
    let args: any = {}
    args.id = id
    args.nato = nato
    EventBus.$emit('editItem', args)
  }

  public getSticky(element) {
    let h: any
    switch (element) {
      case 'dynamictable':
        h = that.contentheight - 270 + 'px'
        break
    }
    return h
  }
  // Need more information from Terminologist to develop new form modal
  /* public onCancel() {
    // close the form
    this.$router.push({ name: 'All Publications' })
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
  } */
}
</script>

<style lang="scss">
.table-full {
  border: 1px solid #000000 !important;
  text-align: left;
}
.table-full td,
.table-full th {
  border: 1px solid #000000 !important;
  height: 20px !important;
  padding: 2px 5px !important;
}
.definition {
  max-width: 1800px;
}

.input-group > .custom-file,
.input-group > .custom-select,
.input-group > .form-control,
.input-group > .form-control-plaintext {
  max-height: 35px;
}

.input-group-append .btn,
.input-group-prepend .btn {
  max-height: 35px;
}
</style>
