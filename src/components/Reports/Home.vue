<template>
  <b-container fluid class="contentHeight"></b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class Reports extends Vue {
  @Prop() readonly mode!: string

  /** @method - lifecycle hook */
  mounted() {
    if (this.mode == 'fiscalyearreport') {
      this.$router.push({ name: 'Fiscal Year Report' })
    }
    if (this.mode == 'toppublications') {
      this.$router.push({ name: 'Top Publications' })
    }
    if (this.mode == 'topnatopublications') {
      this.$router.push({ name: 'Top NATO Publications' })
    }
    if (this.mode == 'uniqueusers') {
      this.$router.push({ name: 'Unique Users' })
    }
    if (this.mode == 'publicationsindevphase') {
      this.$router.push({ name: 'Publications In Dev Phase' })
    }
    if (this.mode == 'publicationsposted') {
      this.$router.push({ name: 'Publications Posted' })
    }
    if (this.mode == 'natopublicationsposted') {
      this.$router.push({ name: 'NATO Publications Posted' })
    }
  }
}
</script>
