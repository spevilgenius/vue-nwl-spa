<template>
  <b-container fluid class="contentHeight m-1 p-2">
    <b-row class="p-2">
      <b-col class="p-1 text-white">
        <b-card-title class="text-white"><h4>To request NATO access please download and save the attached PDF document. Email completed request form to 'NWDC_NRFK_FLEETPUBS@navy.mil'</h4></b-card-title>
      </b-col>
    </b-row>
    <b-row class="p-2">
      <b-col class="p-1 text-white">
        <b-card-title class="text-white"><h4>Please ensure all information is entered into the form and all required signatures are applied prior to submitting the request.</h4></b-card-title>
      </b-col>
    </b-row>
    <b-row class="p-2">
      <b-col class="p-1 text-white"
        ><h5><a :href="location" target="_blank" download>Request NATO Access Form</a></h5></b-col
      >
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const support = namespace('support')

// are we on a localhost demo?
let loc = String(window.location)
let test = false
if (loc.indexOf('test.') >= 0) {
  test = true
}

@Component
export default class ReqNatoAccess extends Vue {
  @support.Action
  public setHeaderTitle!: (title: string) => void

  isTest?: boolean = false
  location = ''

  mounted() {
    this.setHeaderTitle('Request NATO Access')
    if (test === true) {
      this.location = 'https://test.doctrine.navy.mil/SiteCollectionDocuments/NWL_NATO_user_form.pdf'
    } else {
      this.location = 'https://doctrine.navy.mil/SiteCollectionDocuments/NWL_NATO_user_form.pdf'
    }
  }
}
</script>
