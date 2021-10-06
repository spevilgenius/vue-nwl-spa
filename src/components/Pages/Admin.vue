<template>
  <b-container fluid class="contentHeight p-0" id="MainContainer">
    <iframe id="pubFrame" height="100%" width="100%" src="https://doctrine.navy.mil/SitePages/admin.aspx?IsDlg=1"></iframe>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Admin extends Vue {
  nothing = null
}
</script>
