<template>
  <b-container fluid></b-container>
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
      this.$router.push({ name: 'New Publications' })
    }
    if (this.mode == 'refreshnavy') {
      // this.$router.push({ name: 'All Publications', query: { Type: 'Navy' } })
      this.$router.push({ name: 'Filtered Publications', params: { title: 'Navy Publications', filter: 'branch', value: 'Navy' } })
    }
    if (this.mode == 'refreshallied') {
      // this.$router.push({ name: 'All Publications', query: { Type: 'Allied' } })
      this.$router.push({ name: 'Allied Publications' })
    }
    if (this.mode == 'refreshjoint') {
      this.$router.push({ name: 'Joint Publications' })
    }
    if (this.mode == 'refreshmulti') {
      this.$router.push({ name: 'Multinational Publications' })
    }
    if (this.mode == 'refreshother') {
      this.$router.push({ name: 'Other Publications' })
    }
    if (this.mode == 'refreshall') {
      this.$router.push({ name: 'All Publications' })
    }
    if (this.mode == 'refresharchived') {
      this.$router.push({ name: 'Archived Publications' })
    }
    if (this.mode == 'refreshdevelopment') {
      this.$router.push({ name: 'Pubs In Development' })
    }
    if (this.mode == 'refreshtacmemos') {
      this.$router.push({ name: 'TACMEMOS' })
    }
    if (this.mode == 'refreshfleet') {
      this.$router.push({ name: 'CONOPS' })
    }
    if (this.mode == 'refreshconcept') {
      this.$router.push({ name: 'Navy Concept Publications' })
    }
    if (this.mode == 'refreshoptasks') {
      this.$router.push({ name: 'All Publications' })
    }
  }
}
</script>
