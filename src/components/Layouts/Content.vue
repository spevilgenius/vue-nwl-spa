<template>
  <div class="content" id="maincontent">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import { namespace } from 'vuex-class'

// const support = namespace('support')

@Component({
  name: 'Content'
})
export default class Content extends Vue {
  /* @support.Action
  public setRect!: () => void

  mounted() {
    this.setRect()
  } */
}
</script>

<style lang="scss"></style>
