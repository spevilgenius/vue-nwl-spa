<template>
  <b-container fluid class="contentHeight m-0 p-0" style="overflow=hidden;">
    <b-overlay :show="!isIframeloaded" variant="danger" class="contentHeight">
      <b-embed type="iframe" :src="doctrineLinksUrl" class="contentHeight" style="overflow=auto;" @load="iframeloaded()"></b-embed>
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

const slash = '/'
const tp1 = String(window.location.protocol)
const tp2 = String(window.location.host)

@Component
export default class Doctrinelinks extends Vue {
  isIframeloaded?: boolean = false
  baseUrl = tp1 + slash + slash + tp2
  doctrineLinksUrl = this.baseUrl + '/Lists/links/AllItems.aspx?IsDlg=1'

  public iframeloaded() {
    console.log('IFRAME LOADED')
    this.isIframeloaded = true
  }
}
</script>
