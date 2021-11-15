<template>
  <b-container fluid class="contentHeight"></b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'AO'
})
export default class Reports extends Vue {
  @Prop() readonly mode!: string

  /** @method - lifecycle hook */
  mounted() {
    if (this.mode == 'fiscalyearreport') {
      this.$router.push({ name: 'Fiscal Year Report' })
    }
  }
}
</script>
