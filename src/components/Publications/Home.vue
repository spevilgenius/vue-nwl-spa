<template>
  <b-container fluid class="contentHeight"></b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'Publications'
})
export default class Publications extends Vue {
  @Prop() readonly mode!: string

  /** @method - lifecycle hook */
  mounted() {
    if (this.mode == 'refreshnew') {
      this.$router.push({ name: 'Whats New' })
    }
    if (this.mode == 'refreshnavy') {
      this.$router.push({ name: 'Navy' })
    }
    if (this.mode == 'refreshallied') {
      this.$router.push({ name: 'Allied' })
    }
    if (this.mode == 'refreshjoint') {
      this.$router.push({ name: 'Joint' })
    }
    if (this.mode == 'refreshmulti') {
      this.$router.push({ name: 'MultiNational' })
    }
    if (this.mode == 'refreshother') {
      this.$router.push({ name: 'Other' })
    }
    if (this.mode == 'refreshall') {
      this.$router.push({ name: 'All Publications' })
    }
    if (this.mode == 'refreshdevelopment') {
      this.$router.push({ name: 'Pubs In Development' })
    }
  }
}
</script>
