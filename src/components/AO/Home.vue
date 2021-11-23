<template>
  <b-container fluid class="contentHeight"></b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class AO extends Vue {
  @Prop() readonly mode!: string

  /** @method - lifecycle hook */
  mounted() {
    if (this.mode === 'aoadministration') {
      this.$router.push({ name: 'AO Administration' })
    }
  }
}
</script>
