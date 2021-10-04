<template>
  <div>PUBS IN DEVELOPMENT</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Development extends Vue {
  @Prop() readonly mode!: string

  /** @method - lifecycle hook */
  mounted() {
    if (this.mode == 'new') {
      this.$router.push({ name: 'Add New Publication' })
    }
    if (this.mode == 'refreshall') {
      this.$router.push({ name: 'All Publications In Development', query: { Type: 'Development' } })
    }
  }
}
</script>

<style scoped></style>
