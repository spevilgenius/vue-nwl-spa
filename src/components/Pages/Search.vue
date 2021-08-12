<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="py100">
      <b-col cols="3" class="m-0 p-0"></b-col>
      <b-col cols="6" class="m-0 p-0"></b-col>
      <b-col cols="3" class="m-0 p-0"></b-col>
    </b-row>
    <b-row no-gutters>
      <b-col cols="3" class="m-0 p-0">LEFT</b-col>
      <b-col cols="6" class="m-0 p-0">LEFT</b-col>
      <b-col cols="3" class="m-0 p-0">LEFT</b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {}
</script>

<style scoped></style>
