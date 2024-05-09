<template>
  <b-card no-gutters fluid class="contentHeight" style="min-width: 1000px">
    <b-card-header>
      <b-row style="padding-left: 15px"> </b-row>
    </b-card-header>
    <b-card-body class="m-0 p-0">
      <b-container fluid class="p-0">
        <b-form>
          <b-form-row class="searchprops">
            <b-col cols="2" class="m-0 p-0"></b-col>
            <b-col cols="8" class="mt-1 p-0 text-center" style="font-size: large; text-align: center"> Fill out the form and select "Generate Email" below to request NWL Support </b-col>
            <b-col cols="2" class="mb-1 p-0"></b-col>
          </b-form-row>
          <b-form-row></b-form-row>
          <b-form-row class="searchprops">
            <b-col cols="3" class="m-0 p-2">Subject</b-col>
            <b-col cols="9" class="m-0 p-2"><b-form-input v-model="subject" type="text"></b-form-input></b-col>
          </b-form-row>
          <b-form-row class="searchprops">
            <b-col cols="3" class="m-0 p-2">Request Type</b-col>
            <b-col cols="9" class="m-0 p-2 text-left">
              <b-form-checkbox-group v-model="reqtype" :options="options" name="reqtype" stacked></b-form-checkbox-group>
            </b-col>
          </b-form-row>
          <b-form-row class="searchprops">
            <b-col cols="3" class="m-0 p-2">Details</b-col>
            <!-- <b-col cols="9" class="m-0 p-2 text-center"><vue-editor id="txtDetails" v-model="details"></vue-editor></b-col> -->
            <b-col cols="9" class="m-0 p-2">
              <b-form-textarea v-model="details" rows="8"></b-form-textarea>
            </b-col>
          </b-form-row>
          <b-form-row class="searchprops">
            <b-col cols="12" class="m-0 p-2 text-center"><b-button variant="success" @click="generate()">Generate Email</b-button></b-col>
          </b-form-row>
          <b-form-row class="hidden"><a ref="maillink" id="maillink"></a></b-form-row>
        </b-form>
      </b-container>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { VueEditor, Quill } from 'vue2-editor'
import { namespace } from 'vuex-class'

const support = namespace('support')

@Component({
  name: 'ReqNWLSupport',
  components: {
    VueEditor
  }
})
export default class ReqNWLSupport extends Vue {
  @support.Action
  public setHeaderTitle!: (title: string) => void

  isTest?: boolean = false
  location = ''
  details = ''
  reqtype = ''
  subject = ''
  href = 'mailto:nwdc_nrfk_fleet_pubs@navy.mil?subject='

  options = [
    { text: 'Technical Issue', value: 'Technical Issue' },
    { text: 'Library Content', value: 'Library Content' },
    { text: 'Document Content', value: 'Document Content' },
    { text: 'Enhancement', value: 'Enhancement' },
    { text: 'Training', value: 'Training' }
  ]

  mounted() {
    this.setHeaderTitle('Request NWL Support')
  }

  generate() {
    // generate link and then click it
    let h = this.href
    h += encodeURIComponent(this.subject)
    h += '&body=Request%20Type:%20'
    h += encodeURIComponent(this.reqtype)
    h += '%0D%0A'
    h += '%0D%0A'
    h += 'Details:%20'
    h += encodeURIComponent(this.details)
    let link = document.getElementById('maillink') as HTMLAnchorElement
    if (link) {
      link.href = h
      console.log(h)
      link.click()
    }
  }
}
</script>

<style>
.searchprops {
  text-align: center;
  align-self: center;
}

.mt-100px {
  margin-top: 100px;
}
</style>
