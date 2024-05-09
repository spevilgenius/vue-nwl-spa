<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12">
        <div class="detailDiv" v-html="data.Body"></div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      data: {}
    }
  }
}
</script>

<style lang="scss"></style>
