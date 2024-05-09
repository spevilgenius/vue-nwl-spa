<template>
  <b-container fluid class="contentHeight m-0 p-0" style="overflow=auto; max-height: -webkit-fill-available;">
    <b-overlay :show="!iframeloaded" variant="loading" class="contentHeight">
      <b-embed type="iframe" src="https://doctrine.navy.mil/SitePages/NATOInstructions.aspx?IsDlg=1" style="min-height: 200px; max-height: 850px"></b-embed>
      <b-row></b-row>>
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
export default class ReqNatoAccess extends Vue {
  iframeloaded?: boolean = false
  @support.Action
  public setHeaderTitle!: (title: string) => void

  mounted() {
    this.setHeaderTitle('My NATO Status')
    const that = this
    window.setInterval(function () {
      that.iframeloaded = true
    }, 2100)
  }
}
</script>
