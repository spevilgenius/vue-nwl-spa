<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-overlay :show="!termiframeloaded" variant="danger" class="contentHeight">
      <!-- <b-embed :style="getStyle('iframesize', null)" type="iframe" src="/terminology/_layouts/15/termstoremanager.aspx?IsDlg=1"></b-embed> -->
      <iframe id="termiframe" src="/terminology/_layouts/15/termstoremanager.aspx?IsDlg=1" height="100%" width="100%" @load="iframeLoadHelper"></iframe>
      <template #overlay>
        <div class="text-center">
          <p id="busy-label">Loading...</p>
        </div>
      </template>
    </b-overlay>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const support = namespace('support')

let that: any

@Component
export default class ManageTerms extends Vue {
  termiframeloaded?: boolean = false
  el?: any

  @support.State
  public contentheight!: number

  @support.State
  public contentwidth!: number

  created() {
    that = this
  }

  mounted() {
    const that = this
    window.setInterval(function() {
      that.termiframeloaded = true
    }, 2000)
  }

  public getStyle(element, field) {
    let style: any = {}
    switch (element) {
      case 'iframesize':
        style.height = that.contentheight - 150 + 'px'
        style.width = that.contentwidth + 'px'
        /* style.overflow = 'hidden' */
        break
    }
  }

  iframeLoadHelper() {
    if (this.termiframeloaded) return this.iframeLoaded()
    else return console.log('Terminology Iframe Not Loaded')
  }
  // The real load method
  iframeLoaded() {
    console.log('iframe loaded')
    let el = document.getElementById('termiframe') as HTMLIFrameElement
    let ele: any = el.contentDocument?.getElementsByTagName('body')[0]
    /* let ele = document.getElementsByTagName('body') */
    console.log(el)
    console.log(ele)
    if (ele === null) {
      console.log('Element is null')
    } else {
      ele.style.overflow = 'hidden'
      console.log('ele = ' + el)
      console.log('style = ' + el.style.overflow)
    }
  }
}
</script>

<style scoped></style>
