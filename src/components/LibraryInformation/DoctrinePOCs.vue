<template>
  <b-container fluid class="contentHeight m-0 p-0" style="overflow=hidden;">
    <b-overlay :show="!isIframeloaded" variant="loading" class="contentHeight">
      <b-embed type="iframe" :src="commandListUrl" class="contentHeight" style="overflow=auto;" @load="iframeloaded()"></b-embed>
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

const slash = '/'
const tp1 = String(window.location.protocol)
const tp2 = String(window.location.host)

@Component
export default class Commandlist extends Vue {
  @support.Action
  public setHeaderTitle!: (title: string) => void

  isIframeloaded?: boolean = false
  baseUrl = tp1 + slash + slash + tp2
  commandListUrl = this.baseUrl + '/Lists/poc/POC.aspx?IsDlg=1'

  public iframeloaded() {
    this.setHeaderTitle("Doctrine POC's")
    this.isIframeloaded = true
  }
}
</script>
