<template>
  <b-container fluid class="contentHeight m-0 p-0" style="overflow=hidden; max-height: -webkit-fill-available;">
    <b-overlay :show="!isIframeloaded" variant="loading" class="contentHeight">
      <div class="fluid m-0 p-0 text-center">
        <b-button variant="success" @click="generate()">How to ask a question</b-button>
      </div>
      <b-form-row class="hidden"><a ref="maillink" id="maillink"></a></b-form-row>
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
import { namespace } from 'vuex-class'

const support = namespace('support')

@Component
export default class Faq extends Vue {
  @support.Action
  public setHeaderTitle!: (title: string) => void

  isIframeloaded?: boolean = false
  href = 'mailto:nwdc_nrfk_fleet_pubs@navy.mil'

  public iframeloaded() {
    this.setHeaderTitle('FAQs')
    this.isIframeloaded = true
  }

  public generate() {
    // generate email
    let h = this.href
    let link = document.getElementById('maillink') as HTMLAnchorElement
    if (link) {
      link.href = h
      link.click()
    }
  }
}
</script>
