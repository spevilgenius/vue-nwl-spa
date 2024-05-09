<template>
  <b-container fluid class="contentHeight"></b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class Librarian extends Vue {
  @Prop() readonly mode!: string

  /** @method - lifecycle hook */
  mounted() {
    if (this.mode == 'refreshadmin') {
      this.$router.push({ name: 'NWL Administration' })
    }
    if (this.mode == 'refreshannouncements') {
      this.$router.push({ name: 'Announcements' })
    }
    if (this.mode == 'refreshpocs') {
      this.$router.push({ name: 'Doctrine POCs' })
    }
  }
}
</script>
