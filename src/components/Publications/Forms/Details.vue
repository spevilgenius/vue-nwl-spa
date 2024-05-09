<template>
  <b-container fluid class="dialogTabsContentHeight m-0 p-1">
    <b-row no-gutters>
      <b-col cols="12">
        <img id="PRAIcon" />
      </b-col>
    </b-row>
    <b-row id="Title">
      <b-col cols="12" class="text-center mt-2">
        <strong>{{ activepub.Title }}</strong>
      </b-col>
    </b-row>
    <b-row id="Description" class="mt-2">
      <b-col cols="12">
        <div id="vpfdescription" class="text-left" v-html="activepub.AdditionalData.Description"></div>
      </b-col>
    </b-row>
    <b-row class="mt-3" id="Prfx">
      <b-col cols="4" class="text-left">Prefix</b-col>
      <b-col cols="1"></b-col>
      <b-col cols="7" class="text-left">{{ activepub.Prfx }}</b-col>
    </b-row>
    <b-row id="PubID">
      <b-col cols="4" class="text-left">Pub ID</b-col>
      <b-col cols="1"></b-col>
      <b-col cols="7" class="text-left">{{ activepub.PubID }}</b-col>
    </b-row>
    <b-row id="Status">
      <b-col cols="4" class="text-left">Status</b-col>
      <b-col cols="1"></b-col>
      <b-col cols="7" class="text-left">{{ activepub.AdditionalData.Status }}</b-col>
    </b-row>
    <b-row id="LongTitle">
      <b-col cols="4" class="text-left">Long Title</b-col>
      <b-col cols="1"></b-col>
      <b-col cols="7" class="text-left">{{ activepub.LongTitle }}</b-col>
    </b-row>
    <b-row id="Edition">
      <b-col cols="4" class="text-left">Edition</b-col>
      <b-col cols="1"></b-col>
      <b-col cols="7" class="text-left">{{ activepub.AdditionalData.Edition }}</b-col>
    </b-row>
    <b-row id="Change">
      <b-col cols="4" class="text-left">Change</b-col>
      <b-col cols="1"></b-col>
      <b-col cols="7" class="text-left">{{ activepub.AdditionalData.Change }}</b-col>
    </b-row>
    <b-row id="NSN">
      <b-col cols="4" class="text-left">NSN</b-col>
      <b-col cols="1"></b-col>
      <b-col cols="7" class="text-left">{{ activepub.NSN }}</b-col>
    </b-row>
    <b-row id="PRA">
      <b-col cols="5" class="text-left">Primary Review Authority</b-col>
      <b-col cols="7" class="text-left">{{ activepub.PRA }}</b-col>
    </b-row>
    <b-row id="NWDCAO">
      <b-col cols="4" class="text-left">NWDC AO</b-col>
      <b-col cols="1"></b-col>
      <b-col cols="7" class="text-left">{{ activepub.NWDCAO.Title }}</b-col>
    </b-row>
    <b-row id="LibrarianRemarks">
      <b-col cols="4" class="text-left">Librarian Remarks</b-col>
      <b-col cols="1"></b-col>
      <b-col cols="7" class="text-left">{{ activepub.LibrarianRemarks }}</b-col>
    </b-row>
    <b-row id="Classification">
      <b-col cols="4" class="text-left">Classification</b-col>
      <b-col cols="1"></b-col>
      <b-col cols="7" class="text-left">{{ activepub.Class }}</b-col>
    </b-row>
    <b-row id="DTIC">
      <b-col cols="4" class="text-left">DTIC</b-col>
      <b-col cols="1"></b-col>
      <b-col cols="7" class="text-left">{{ activepub.DTIC }}</b-col>
    </b-row>
    <b-row class="py20"></b-row>
    <b-row>
      <b-col cols="4" class="text-left">
        <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" variant="success" size="sm" @click="editItem(activepub.Id, activepub.IsNato, activepub.Name)"> Edit Properties </b-button>
      </b-col>
      <b-col cols="8"></b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../../interfaces/User'
import { PublicationItem } from '../../../interfaces/PublicationItem'

const users = namespace('users')
const publication = namespace('publication')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component({
  name: 'Details'
})
export default class Details extends Vue {
  interval!: any
  iconsource!: any
  formReady = false

  @users.State
  public currentUser!: UserInt

  @publication.State
  public activepub!: PublicationItem

  @publication.State
  public publoaded!: boolean

  mounted() {
    let icon = document.getElementById('PRAIcon') as HTMLDivElement
    icon.innerHTML = ''
    this.interval = setInterval(this.loadData, 500)
  }

  public loadData() {
    if (this.publoaded) {
      clearInterval(this.interval)
      this.loadPub()
    }
  }

  public async loadPub() {
    console.log('Pub Details Loaded: ' + this.activepub.RelativeURL)
    let ad = this.activepub.AdditionalData
    try {
      let pra = ad.PRAAbbrev
      let src = tp1 + slash + slash + tp2 + '/PublishingImages/PRA/'
      src += pra
      src += '.png'
      console.log('Set Image Source: ' + src)
      let img = document.getElementById('PRAIcon') as HTMLImageElement
      img.height = 150
      img.width = 150
      img.src = src
    } catch (e) {
      //don't care for now
    }
  }

  public editItem(id: string, nato: string, name: string) {
    this.$router.replace({ path: '/pubs/approved/all/edit/' + id + '/' + nato + '/' + true + '/' + encodeURIComponent(name) })
  }
}
</script>

<style>
#vpfdescription {
  height: 200px !important;
  overflow-y: scroll;
  line-height: normal;
  font-size: 16px;
}
</style>
