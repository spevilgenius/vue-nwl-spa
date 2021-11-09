<template>
  <b-container class="p-0">
    <b-form>
      <b-row no-gutters>
        <b-col cols="12">
          <b-form-group label="Select Publication">
            <b-form-file placeholder="Choose a file" no-drop class="form-control" v-model="file" id="UploadFile" @input="fileSelected()"></b-form-file>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row no-gutters>
        <b-col cols="8"></b-col>
        <b-col cols="4" class="p-0 text-right">
          <b-button v-if="isUploading" variant="blue-500"><b-spinner variant="light" class="loading-spinner"></b-spinner>&nbsp;Uploading...</b-button>
          <b-button variant="blue-500" @click.stop="uploadFile" title="Upload"><font-awesome-icon far icon="file-upload" class="icon"></font-awesome-icon>Upload</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { PublicationItem } from '../../../interfaces/PublicationItem'
import axios from 'axios'

const publication = namespace('publication')
const support = namespace('support')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component
export default class UploadPub extends Vue {
  isUploading = false
}
</script>

<style></style>
