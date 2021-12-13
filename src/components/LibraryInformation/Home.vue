<template>
  <b-container fluid class="contentHeight"></b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class Libraryinformation extends Vue {
  @Prop() readonly mode!: string

  /** @method - lifecycle hook */
  mounted() {
    if (this.mode == 'refreshcommandlist') {
      this.$router.push({ name: 'Command List' })
    }
    if (this.mode == 'refreshdoctrinepoc') {
      this.$router.push({ name: 'Doctrine POCs' })
    }
    if (this.mode == 'refreshlinks') {
      this.$router.push({ name: 'Doctrine Links' })
    }
  }
}
</script>
