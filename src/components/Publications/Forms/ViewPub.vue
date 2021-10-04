<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid v-if="publoaded" class="contentHeight m-0 p-0">
          <b-row no-gutters>
            <b-col id="FrameColumn" cols="8" class="m-0 p-0">
              <iframe id="pubFrame" height="100%" width="100%"></iframe>
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
                            <b-col cols="12" class="vpfdescription text-left">{{ publication.AdditionalData.Description }}</b-col>
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
                          <b-row id="DTIC">
                            <b-col cols="4" class="text-left">
                              <b-button v-if="currentUser.isLibrarian || currentUser.isActionOfficer" variant="success" size="lg" @click="editItem(publication.Id, publication.IsNato)">
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
                    <b-row no-gutters cols="12" style="height: 50px;">
                      <b-table id="SupportingDocsTable" striped hover :items="supportingdocs" :fields="table.fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :per-page="perPage" :current-page="currentPage">
                        <template #cell(Name)="data">
                          <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                        </template>
                      </b-table>
                      <b-row no-gutters cols="12">
                        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="my-0 p-0"></b-pagination>
                      </b-row>
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
          fields: [{ key: 'Name', label: 'Supporting Document Name', sortable: true, type: 'default', format: 'text', tdClass: 'px100', id: 1 }],
          items: [],
          overlayText: 'Loading. Please Wait...',
          overlayVariant: 'success',
          perPage: 15,
          currentPage: 1
        }
      }
    }
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

  @users.State
  public currentUser!: UserInt

  @publication.State
  public publoaded!: boolean

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
  public getSupportingDocs!: (data: any) => Promise<boolean>

  @publication.Action
  public getPublicationById!: (data: any) => Promise<boolean>

  @publication.Action
  public getBinaryFile!: (url: string) => Promise<boolean>

  mounted() {
    if (this.$route) {
      let id = this.$route.params.Id
      let nato = this.$route.params.Nato
      if (id !== null) {
        let data: any = {}
        data.id = id
        data.nato = nato
        this.getPublicationById(data).then(response => {
          if (response) {
            this.interval = setInterval(this.loadData, 500)
          }
        })
      }
    }
  }

  public loadData() {
    if (this.publoaded) {
      clearInterval(this.interval)
      let data: any = {}
      data.DocID = this.publication.DocID
      data.nato = this.publication.IsNato
      this.getSupportingDocs(data)
      this.interval = setInterval(this.waitForData, 500)
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
      /* if (String(this.publication.RelativeURL).indexOf('.docx') > 0) {
        // woohoo
        let getfileUrl = tp1 + slash + slash + tp2 + "/_api/web/GetFileByServerRelativeUrl('" + this.publication.RelativeURL + "')/OpenBinaryStream"
        const response = await axios.get(getfileUrl, {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
        })
        // let buff = new ArrayBuffer(response.data)
        let file = new File([response.data], 'preview.docx')
        let buff = this.getFileBuffer(file)
        buff.then(function(b) {
          let blob = new Blob([b as Blob], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
          // let link = window.URL.createObjectURL(blob)
          let link = 'https://docs.google.com/viewer?url=%s' + window.URL.createObjectURL(blob)
          let iframe = document.getElementById('pubFrame') as HTMLIFrameElement
          iframe.src = link
        })
      } */
    }
  }

  public editItem(id: string, nato: string) {
    this.$router.push({ name: 'Edit Publication', params: { Id: id, Nato: nato, t: new Date().getTime().toString() } })
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
.vpfdescription {
  height: 100px !important;
  overflow-y: scroll;
  line-height: 16px;
}

.table td,
.table th {
  padding: 0.4rem !important;
  line-height: 2;
}
</style>
