<template>
  <div>HOME</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Home'
})
export default class Home extends Vue {
  public interval: any
}
</script>
