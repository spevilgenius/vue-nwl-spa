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
      // this.$router.push({ name: 'Whats New' })
      this.$router.push({ name: 'All Publications', query: { Type: 'New' } })
    }
    if (this.mode == 'refreshnavy') {
      this.$router.push({ name: 'All Publications', query: { Type: 'Navy' } })
    }
    if (this.mode == 'refreshallied') {
      this.$router.push({ name: 'All Publications', query: { Type: 'Allied' } })
    }
    if (this.mode == 'refreshjoint') {
      this.$router.push({ name: 'All Publications', query: { Type: 'Joint' } })
    }
    if (this.mode == 'refreshmulti') {
      this.$router.push({ name: 'All Publications', query: { Type: 'Multinational' } })
    }
    if (this.mode == 'refreshother') {
      this.$router.push({ name: 'All Publications', query: { Type: 'Other' } })
    }
    if (this.mode == 'refreshall') {
      this.$router.push({ name: 'All Publications' })
    }
    if (this.mode == 'refresharchived') {
      this.$router.push({ name: 'All Archived Publications' })
    }
    if (this.mode == 'refreshdevelopment') {
      this.$router.push({ name: 'Pubs In Development' })
    }
    if (this.mode == 'refreshtacmemos') {
      this.$router.push({ name: 'All Publications', query: { Type: 'TACMEMO' } })
    }
    if (this.mode == 'refreshfleet') {
      this.$router.push({ name: 'All Publications', query: { Type: 'CONOPS' } })
    }
    if (this.mode == 'refreshconcept') {
      this.$router.push({ name: 'All Publications', query: { Type: 'NavyConceptPubs' } })
    }
    if (this.mode == 'refreshoptasks') {
      this.$router.push({ name: 'All Publications', query: { Type: 'OPTASK' } })
    }
  }
}
</script>
