<template>
  <b-container fluid class="contentHeight"></b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'NWLSupport'
})
export default class NWLSupport extends Vue {
  @Prop() readonly mode!: string

  /** @method - lifecycle hook */
  mounted() {
    if (this.mode == 'refreshfaq') {
      this.$router.push({ name: 'FAQ' })
    }
    if (this.mode == 'requestnato') {
      this.$router.push({ name: 'Request NATO Access' })
    }
    if (this.mode == 'requestnwl') {
      this.$router.push({ name: 'Request NWL Support' })
    }
    if (this.mode == 'newsptrequest') {
      this.$router.push({ name: 'NWL Support Request' })
    }
    /*if (this.mode == 'refreshmulti') {
      this.$router.push({ name: 'All Publications', query: { Type: 'Multinational' } })
    }
    if (this.mode == 'refreshother') {
      this.$router.push({ name: 'All Publications', query: { Type: 'Other' } })
    }
    if (this.mode == 'refreshall') {
      this.$router.push({ name: 'All Publications' })
    }
    if (this.mode == 'refreshdevelopment') {
      this.$router.push({ name: 'Pubs In Development' })
    } */
  }
}
</script>
