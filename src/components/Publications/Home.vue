<template>
  <b-container fluid class="contentHeight"></b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'Home',
  props: {
    mode: {
      type: String
    }
  }
})
export default class Home extends Vue {
  @Prop() readonly mode!: string

  /** @method - lifecycle hook */
  mounted() {
    if (this.mode == 'refreshnew') {
      this.$router.push({ name: 'Whats New' })
    }
    if (this.mode == 'refreshnavy') {
      this.$router.push({ name: 'Navy' })
    }
  }
}
</script>
