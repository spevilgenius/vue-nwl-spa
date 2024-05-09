<template>
  <b-container fluid class="dialogTabsContentHeight m-0 p-1">
    <b-row no-gutters>
      <b-col cols="12" class="dialogTabsContentHeight m-0 p-0">
        <!-- <iframe id="historyFrame" :src="iframe.src" @load="frameloaded" v-show="iframe.loaded" width="100%" :height="iframe.height"></iframe> -->
        <iframe id="historyFrame" :src="iframe.src" @load="frameloaded" v-show="iframe.loaded" width="100%" class="dialogTabsContentHeight"></iframe>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../../interfaces/User'

const users = namespace('users')
const publication = namespace('publication')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component({
  name: 'Comments'
})
export default class History extends Vue {
  @Prop() Id: any
  @Prop() IsNato: any
  @Prop() IsArchive: any
  @Prop() Title: any
  interval!: any
  iframe: any = {
    src: '',
    loaded: false,
    height: '500px'
  }

  @users.State
  public currentUser!: UserInt

  @publication.State
  public historyUrl!: string

  @publication.State
  public historyUrlloaded!: boolean

  @publication.Action
  public getHistory!: () => Promise<boolean>

  mounted() {
    this.getHistory()
    this.interval = setInterval(this.waitForHistory, 500)
  }

  updated() {
    this.getHistory()
    this.interval = setInterval(this.waitForHistory, 500)
  }

  public waitForHistory() {
    if (this.historyUrlloaded) {
      clearInterval(this.interval)
      this.iframe.src = this.historyUrl
    }
  }

  public frameloaded() {
    console.log('FRAME LOADED')
    let frame = document.getElementById('historyFrame') as HTMLIFrameElement
    let cw: any = frame.contentWindow
    /* let h: any = ''
    if (cw !== null) {
      h = cw.document.getElementById('s4-workspace').style.height
    } */
    // console.log('CALCULATED HEIGHT: ' + h)
    this.iframe.loaded = true
  }
}
</script>

<style>
/* #vpfdescription {
  height: 200px !important;
  overflow-y: scroll;
  line-height: normal;
  font-size: 16px;
} */
</style>
