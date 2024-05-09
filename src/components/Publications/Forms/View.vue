<template>
  <b-container fluid class="dialogHeight m-0 p-0">
    <b-overlay :show="!frameLoaded" variant="loading" class="dialogHeight">
      <b-row no-gutters class="dialogHeight">
        <b-col cols="12" class="m-0 p-0">
          <b-container fluid v-if="publoaded" class="dialogHeight m-0 p-0">
            <b-row no-gutters>
              <b-col id="FrameColumn" cols="8" class="dialogContentHeight m-0 p-0">
                <iframe id="pubFrame" width="100%" class="dialogContentHeight"></iframe>
              </b-col>
              <b-col cols="4" class="m-0 p-0">
                <b-card no-body>
                  <b-tabs card>
                    <b-tab class="mtab m-0 p-0" active>
                      <template slot="title">Data</template>
                      <Details />
                    </b-tab>
                    <b-tab class="mtab m-0 p-0">
                      <template slot="title">Supporting Documents</template>
                      <SupportingDocs />
                    </b-tab>
                    <b-tab class="mtab m-0 p-0">
                      <template slot="title">Feedback/Comments</template>
                      <Comments />
                    </b-tab>
                    <b-tab v-if="currentUser.canViewDevPubs" class="mtab m-0 p-0 overflow-auto">
                      <template slot="title">Version History</template>
                      <History />
                    </b-tab>
                  </b-tabs>
                </b-card>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
    </b-overlay>
  </b-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../../interfaces/User'
import { PublicationItem } from '../../../interfaces/PublicationItem'
import Details from './Details.vue'
import SupportingDocs from './SupportingDocs.vue'
import Comments from './Comments.vue'
import History from './History.vue'
import axios from 'axios'

const users = namespace('users')
const publication = namespace('publication')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component({
  name: 'View',
  components: {
    Details,
    SupportingDocs,
    Comments,
    History
  }
})
export default class View extends Vue {
  @Prop() Id: any
  @Prop() IsNato: any
  @Prop() IsArchive: any
  @Prop() Title: any
  interval!: any
  formReady = false
  frameLoaded = false

  @users.State
  public currentUser!: UserInt

  @publication.State
  public activepub!: PublicationItem

  @publication.State
  public publoaded!: boolean

  @publication.Action
  public setPubLoaded!: (loaded: boolean) => void

  @publication.Action
  public getPublicationById!: () => Promise<boolean>

  @publication.Action
  public getArchivedPublicationById!: () => Promise<boolean>

  mounted() {
    console.log('View Mounted! ' + this.Id + ', ' + this.IsNato)
    this.setPubLoaded(false)
    if (this.IsArchive === 'true') {
      this.getArchivedPublicationById().then(() => {
        this.interval = setInterval(this.loadData, 500)
      })
    } else {
      this.getPublicationById().then(() => {
        this.interval = setInterval(this.loadData, 500)
      })
    }
  }

  public loadData() {
    if (this.publoaded) {
      clearInterval(this.interval)
      this.loadPub()
    }
  }

  public async loadPub() {
    console.log('Single Pub Loaded: ' + this.activepub.RelativeURL)
    if (String(this.activepub.RelativeURL).indexOf('.pdf') > 0) {
      const that = this
      let getfileUrl = tp1 + slash + slash + tp2 + "/_api/web/GetFileByServerRelativeUrl('" + this.activepub.RelativeURL + "')/OpenBinaryStream"
      const response = await axios.get(getfileUrl, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/pdf'
        }
      })
      let file = new File([response.data], 'preview.pdf')
      let buff = this.getFileBuffer(file)
      buff.then(function (b) {
        let blob = new Blob([b as Blob], { type: 'application/pdf' })
        let link = window.URL.createObjectURL(blob)
        let iframe = document.getElementById('pubFrame') as HTMLIFrameElement
        iframe.src = link
        that.frameloaded()
      })
    }
  }

  public frameloaded() {
    console.log('Frame Loaded')
    this.frameLoaded = true
  }

  public getFileBuffer(file) {
    let p = new Promise(function (resolve, reject) {
      var reader = new FileReader()
      reader.onloadend = function (e) {
        resolve(e?.target?.result)
      }
      reader.onerror = function (e) {
        reject(e?.target?.error)
      }
      reader.readAsArrayBuffer(file)
    })
    return p
  }
}
</script>

<style>
#pubFrame {
  padding: 0;
}
</style>
