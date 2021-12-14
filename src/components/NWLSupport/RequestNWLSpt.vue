<template>
  <b-container fluid class="contentHeight m-0 p-0" style="overflow=hidden; max-height: -webkit-fill-available;">
    <form>
      <div><label>Subject:</label> <input type="subject" required v-model="subject" /></div>
      <p></p>
      <div>
        <b-form-group class="add-style" v-slot="{ ariaDescribedby }">
          <label style="color: black; background-color: white;">Request Type: </label>
          <!-- edit background and text color in _forms.scss reference class "requesttype"-->
          <b-form-checkbox-group id="checkbox-group-1" v-model="selected" :options="options" :aria-describedby="ariaDescribedby" name="flavour-1" class="requesttype"> </b-form-checkbox-group>
        </b-form-group>
      </div>
      <div>
        <label>Details:</label>
        <b-form-textarea id="textarea" variant="dark" v-model="text" placeholder="Enter details..." rows="3" max-rows="6"></b-form-textarea>
        <!--  <pre class="mt-3 mb-0">{{ text }}</pre> -->
      </div>
      <div><label>Publication URL: </label> <input type="subject" required v-model="puburl" /></div>
      <div><label>Pub ID: </label> <input type="subject" required v-model="pubid" /></div>
      <p></p>
      <div>
        <label>Status:</label>
        <!-- <b-dropdown split split-variant="dark" text="Select Status" variant="dark" class="m-2"> -->
        <b-dropdown text="Select Status" variant="outline-dark" class="m-2">
          <b-dropdown-item>Submitted</b-dropdown-item>
          <b-dropdown-item>Open</b-dropdown-item>
          <b-dropdown-item>Resolved</b-dropdown-item>
        </b-dropdown>
      </div>
      <div><label>Resolution: </label> <input type="subject" required v-model="resolution" /></div>
      <div><label>Resolution Date: </label> <input type="subject" required v-model="subject" /></div>
      <div class="row n-gutters">
        <div class="col-9"></div>
        <div class="col-3"></div>
        <div role="group class=" btn-group>
          <button type="button" class="btn ml-1 btn-secondary btn-sm" align="right">Cancel</button>
          <button type="button" class="btn ml-1 btn-success btn-sm">Save</button>
        </div>
      </div>
    </form>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ReqSupportItem } from '@/interfaces/ReqSupportItem'

@Component
export default class RequestNWLSpt extends Vue {
  data() {
    return {
      subject: '',
      status: '',
      selected: [],
      text: '',
      options: [
        { text: 'Technical Issue', value: 'tech' },
        { text: 'Library Content', value: 'libcnt' },
        { text: 'Document Content', value: 'doccnt' },
        { text: 'Enhancement', value: 'enhance' },
        { text: 'Training', value: 'trng' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
form {
  max-width: 420;
  margin: 30px auto;
  text-align: left;
  padding: 40px;
}
form-group {
  max-width: 420;
  margin: 30px auto;
  text-align: left;
}
label {
  display: inline-block;
  margin: 25px 0 15px;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  font-family: inherit;
}
form-group {
  label {
    font-family: 'Avenier', Arial, Helvetica, sans-serif;
  }
}
input {
  display: block;
  padding: 10px 6px;
  width: 75%;
  box-sizing: border-box;
  border-bottom: 1px solid #000;
}
select {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #ddd;
}
textarea {
  /* details field */
  width: 75%;
  display: block;
  color: #fff;
  box-sizing: border-box;
  border-color: black;
  box-shadow: black;
}
</style>
