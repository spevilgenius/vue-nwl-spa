<template>
  <b-container fluid class="contentHeight m-0 p-0" style="overflow=auto; max-height: -webkit-fill-available;">
    <b-overlay :show="!iframeloaded" variant="loading" class="contentHeight">
      <iframe width="100%" height="100%" @load="frameLoaded" src="https://doctrine.navy.mil/_layouts/15/topreport.aspx?List=%7BDA118610-D260-4F2E-9103-24960CA55501%7D&IsDlg=1"></iframe>
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
export default class TopPubs extends Vue {
  iframeloaded?: boolean = false
  @support.Action
  public setHeaderTitle!: (title: string) => void

  mounted() {
    this.setHeaderTitle('Top Publications')
  }

  public frameLoaded() {
    this.iframeloaded = true
  }
}
</script>
