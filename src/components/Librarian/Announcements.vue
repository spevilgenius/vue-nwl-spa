<template>
  <b-container fluid class="contentHeight m-0 p-0" style="overflow=hidden;">
    <b-overlay :show="!isIframeloaded" variant="loading" class="contentHeight">
      <b-embed type="iframe" src="https://doctrine.navy.mil/Lists/announce/current.aspx?IsDlg=1" class="contentHeight" style="overflow=auto;" @load="iframeloaded()"></b-embed>
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

@Component
export default class Announcements extends Vue {
  @support.Action
  public setHeaderTitle!: (title: string) => void

  isIframeloaded?: boolean = false

  public iframeloaded() {
    this.setHeaderTitle('Announcements')
    this.isIframeloaded = true
  }
}
</script>
