<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="contentHeight m-0 p-0">
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
                            <b-col id="PRAIcon" cols="4"></b-col>
                            <b-col cols="8"></b-col>
                          </b-row>
                        </b-container>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <b-tab class="mtab">
                    <template slot="title">Supporting Documents</template>
                    <b-row no-gutters>
                      <b-col cols="12"></b-col>
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
import axios from 'axios'

const users = namespace('users')
const publication = namespace('publication')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component({
  name: 'ViewPub'
})
export default class ViewPub extends Vue {
  rightTabs = []
  interval!: any
  iconsource!: any

  @users.State
  public currentUser!: UserInt

  @publication.State
  public publoaded!: boolean

  @publication.State
  public publication!: PublicationItem

  @publication.State
  public bufferloaded!: boolean

  @publication.State
  public pubBuffer!: ArrayBuffer

  @publication.Action
  public getPublicationById!: (id: string, nato: string) => Promise<boolean>

  @publication.Action
  public getBinaryFile!: (url: string) => Promise<boolean>

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

  public async waitForIt() {
    if (this.publoaded) {
      console.log('Single Pub Loaded: ' + this.publication.RelativeURL)
      clearInterval(this.interval)
      let ad = this.publication.AdditionalData
      let pra = ad.PRAAbbrev
      let src = tp1 + slash + slash + tp2 + '/PublishingImages/PRA/'
      src += pra
      src += '.png'
      console.log('Set Image Source: ' + src)
      let img = document.createElement('img')
      img.src = src
      document.getElementById('PRAIcon')?.appendChild(img)
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
      if (String(this.publication.RelativeURL).indexOf('.docx') > 0) {
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
      }
    }
  }

  public waitForFile() {
    if (this.bufferloaded) {
      console.log('waitForFile bufferloaded')
      clearInterval(this.interval)
      let link: any
      if (String(this.publication.RelativeURL).indexOf('.pdf') > 0) {
        // create blob and display it
        let blob = new Blob([this.pubBuffer], { type: 'application/pdf' })
        let link = window.URL.createObjectURL(blob)
        console.log(link)
        let iframe = document.getElementById('pubFrame') as HTMLIFrameElement
        iframe.src = link
        /* iframe.style.width = '100%'
        iframe.style.height = '100%'
        iframe.id = 'PubFrame'
        iframe.src = link
        document.getElementById('FrameColumn')?.appendChild(iframe) */
      }
      if (String(this.publication.RelativeURL).indexOf('.doc') > 0) {
        // create blob and display it
        let blob = new Blob([this.pubBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
        let link = window.URL.createObjectURL(blob)
        console.log(link)
        let iframe = document.getElementById('pubFrame') as HTMLIFrameElement
        iframe.src = link
        /* let iframe = document.createElement('iframe')
        iframe.style.width = '100%'
        iframe.style.height = '100%'
        iframe.id = 'PubFrame'
        iframe.src = link
        document.getElementById('FrameColumn')?.appendChild(iframe) */
      }
    } else {
      console.log('Waiting for file...')
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
}
</script>

<style scoped></style>
