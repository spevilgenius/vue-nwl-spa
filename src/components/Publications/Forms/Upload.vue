<template>
  <b-container class="p-0">
    <b-form>
      <b-row no-gutters>
        <b-col cols="12">
          <b-form-file placeholder="Choose a file" no-drop class="form-control" v-model="file" id="UploadFile" @input="fileSelected()"></b-form-file>
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { PublicationItem } from '../../../interfaces/PublicationItem'
import axios from 'axios'

const publication = namespace('publication')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component({
  name: 'Upload'
})
export default class Upload extends Vue {
  @Prop() Id: any
  @Prop() IsNato: any
  @Prop() Title: any
  @Prop() DocID: any
  @Prop() FromView: any

  isUploading = false
  file?: File
  buffer?: any = null
  fileUploaded?: boolean = false

  @publication.State
  public digest!: string

  @publication.Action
  public getDigest!: () => Promise<boolean>

  mounted() {
    const that = this
  }

  public fileSelected() {
    // get the bufffer
    const that = this
    let buffer = this.getFileBuffer(this.file)
    buffer.then(function (buff: any) {
      that.buffer = buff
    })
    // get the digest so we can upload
    this.getDigest()
  }

  public async uploadFile() {
    // get a buffer for the file and then upload to the appropriate library
    // after upload we can then set the properties of the document and then refresh the supporting docs array
    this.isUploading = true
    if (this.digest !== '') {
      const that = this
      if (this.buffer !== null) {
        let url = ''
        if (this.IsNato === 'Yes') {
          url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('NATOPublications')/RootFolder/Files/Add"
        } else {
          url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('ActivePublications')/RootFolder/Files/Add"
        }
        url += "(url='"
        url += this.file?.name
        url += "',overwrite=true)"
        let headers = {
          Accept: 'application/json;odata=verbose',
          'X-RequestDigest': this.digest
        }
        try {
          let response = await axios({
            url: url,
            method: 'POST',
            data: this.buffer,
            headers: headers
          })
          this.fileUploaded = true
          this.$router.replace({ path: '/pubs/approved/all/view/' + this.Id + '/' + this.IsNato + '/' + this.DocID + '/true/' + encodeURIComponent(this.Title) })
        } catch (error) {
          console.log('Error Adding Document: ' + error)
        }
      }
    }
  }

  public getFileBuffer(file) {
    let p = new Promise(function (resolve, reject) {
      var reader = new FileReader()
      reader.onloadend = function (e) {
        resolve(e?.target?.result)
      }
      reader.onerror = function (e) {
        reject(e?.target?.error)
      }
      reader.readAsArrayBuffer(file)
    })
    return p
  }
}
</script>

<style></style>
