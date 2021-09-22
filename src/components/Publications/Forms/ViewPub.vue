<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="contentHeight m-0 p-0">
          <b-row no-gutters>
            <b-col id="FrameColumn" cols="8" class="m-0 p-0"></b-col>
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
  public blobloaded!: boolean

  @publication.State
  public pubBlob!: Blob

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

  public waitForIt() {
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
      this.getBinaryFile(String(this.publication.RelativeURL)).then(response => {
        if (response) {
          this.interval = setInterval(this.waitForFile, 500)
        }
      })
    }
  }

  public waitForFile() {
    if (this.blobloaded) {
      clearInterval(this.interval)
      console.log('waitForFile blobloaded')
      let link = window.URL.createObjectURL(this.pubBlob)
      let iframe = document.createElement('iframe')
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.id = 'TripReportFrame'
      iframe.src = link
      document.getElementById('FrameColumn')?.appendChild(iframe)
    }
  }

  /* public getFileBuffer(file) {
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
  } */
}
</script>

<style scoped></style>
