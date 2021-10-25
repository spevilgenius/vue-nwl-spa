<template>
  <b-container fluid class="contentHeight m-0 p-0" style="overflow=hidden;">
    <b-overlay :show="!isIframeloaded" variant="danger" class="contentHeight">
      <b-embed type="iframe" src="https://doctrine.navy.mil/Lists/faq/AllItems.aspx?IsDlg=1" class="contentHeight" style="overflow=auto;" @load="iframeloaded()"></b-embed>
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

@Component
export default class Faq extends Vue {
  isIframeloaded?: boolean = false

  public iframeloaded() {
    console.log('IFRAME LOADED')
    this.isIframeloaded = true
  }
}
</script>
