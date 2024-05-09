<template>
  <nav class="navbar navbar-dark navbar-expand-lg">
    <!-- eslint-disable-next-line prettier/prettier -->
    <b-modal id="ActivityLog" ref="ActivityLog" size="xl" centered :header-bg-variant="light-blue" @close="onModalHide" v-model="Show">
      <template v-slot:modal-title>Activity Log</template>
      <b-container fluid class="p-0">
        <div class="row m-0">
          <div class="col-12 p-0 activity" v-html="activity"></div>
        </div>
      </b-container>
    </b-modal>
    <div class="container-fluid">
      <div class="navbar-minimize">
        <b-button class="btn btn-outline btn-fill btn-round btn-icon d-none d-lg-block btn-burger" @click.prevent="toggler" :title="isShown === true ? 'Hide Navigation' : 'Show Navigation'">
          <font-awesome-icon fas :icon="isShown === true ? 'angle-left' : 'angle-right'" class="icon"></font-awesome-icon>
        </b-button>
      </div>
      <router-link class="navbar-brand" :to="{ path: '/pages/home' }"><font-awesome-icon far icon="house-chimney" class="icon ml-2" style="font-size: 28px"></font-awesome-icon>&nbsp;&nbsp;&nbsp;&nbsp;</router-link><span class="navbar-brand">{{ this.headertitle }}</span>
      <div class="collapse navbar-collapse justify-content-end">
        <b-navbar-nav class="ml-auto hidden-xs">
          <div class="app-search hidden-sm hidden-xs">
            <b-container fluid class="p-0">
              <b-row no-gutters>
                <input type="text" v-model="searchbox" placeholder="Search..." class="form-control" @keyup.enter="onSearch" />
                <a @click="onSearch"><i class="fa fa-search"></i></a>
              </b-row>
              <b-row no-gutters>
                <b-link class="advanced" :to="{ name: 'Search' }">Advanced Search</b-link>
              </b-row>
            </b-container>
          </div>
          <b-nav-item-dropdown id="SettingsMenu" right no-caret menu-class="animated bounceInDown">
            <template slot="button-content">
              <font-awesome-icon fas icon="cog" class="cog"></font-awesome-icon>
            </template>
            <b-dropdown-item v-if="currentUser.isDeveloper" href="#" onclick="ChangeLayoutMode(false)">
              <div class="row">
                <font-awesome-icon far icon="edit" class="icon"></font-awesome-icon>
                <span>Edit page</span>
              </div>
            </b-dropdown-item>
            <b-dropdown-item v-if="currentUser.isDeveloper" href="#" onclick="STSNavigate2(event,'/_layouts/15/addanapp.aspx');">
              <div class="row">
                <font-awesome-icon far icon="plus-square" class="icon"></font-awesome-icon>
                <span>Add an app</span>
              </div>
            </b-dropdown-item>
            <b-dropdown-item v-if="currentUser.isDeveloper" href="#" onclick="STSNavigate2(event,'/_layouts/15/DesignSite.aspx');">
              <div class="row">
                <font-awesome-icon fas icon="pencil-alt" class="icon"></font-awesome-icon>
                <span>Design Manager</span>
              </div>
            </b-dropdown-item>
            <b-dropdown-item v-if="currentUser.isDeveloper || currentUser.isLibrarian" href="#" onclick="STSNavigate2(event,'/_layouts/15/viewlsts.aspx');">
              <div class="row">
                <font-awesome-icon fas icon="box-open" class="icon"></font-awesome-icon>
                <span>Site contents</span>
              </div>
            </b-dropdown-item>
            <b-dropdown-item v-if="currentUser.isDeveloper" href="#" onclick="STSNavigate2(event,'/_layouts/15/settings.aspx');">
              <div class="row">
                <font-awesome-icon fas icon="cogs" class="icon"></font-awesome-icon>
                <span>Site settings</span>
              </div>
            </b-dropdown-item>
            <b-dropdown-item v-if="isDeveloper" href="#" @click="ShowActivityLog">
              <div class="row">
                <font-awesome-icon fas icon="clipboard-list" class="icon"></font-awesome-icon>
                <span>Show Activity Log</span>
              </div>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Vue } from 'vue-property-decorator'
import { UserInt } from '../../interfaces/User'
import { namespace } from 'vuex-class'

const support = namespace('support')
const users = namespace('users')
const publication = namespace('publication')

let that: any

@Component({
  name: 'Header'
})
export default class Header extends Vue {
  public rect!: DOMRect
  public Show = false
  public title = ''
  public searchbox = ''
  interval!: any

  get isDeveloper() {
    return this.$store.state.users.currentUser.isDeveloper
  }

  @users.State
  public currentUser!: UserInt

  @support.State
  public headertitle!: string

  @support.State
  public isShown!: boolean

  @support.State
  public activity!: string

  @support.Action
  public setShown!: (newVal: boolean) => void

  @support.Action
  public setRect!: (newVal: DOMRect) => void

  @publication.State
  public activepubsforuserloaded!: boolean

  @publication.State
  public natopubsforuserloaded!: boolean

  @publication.Action
  public getActivePubsForUser!: () => Promise<boolean>

  @publication.Action
  public getNatoPubsForUser!: () => Promise<boolean>

  @publication.Action
  public createAllApprovedPubsForUser!: (includeNATO: any) => Promise<boolean>

  toggler() {
    this.setShown(!this.isShown)
  }

  public ShowActivityLog(): void {
    this.Show = true
  }

  public onModalHide(): void {
    this.Show = false
  }

  public mounted(): void {
    if (this.currentUser.isNATOVisitor) {
      // the test for isNATOVisitor is simply used to be sure a user can view NATO pubs since the SharePoint groups split. This applies for all tests for isNATOVisitor
      this.getActivePubsForUser()
      this.getNatoPubsForUser()
      this.interval = setInterval(this.waitForIt, 500)
    } else {
      this.getActivePubsForUser()
      this.interval = setInterval(this.waitForIt, 500)
    }
  }

  public waitForIt() {
    if (this.activepubsforuserloaded) {
      if (this.currentUser.isNATOVisitor) {
        if (this.natopubsforuserloaded) {
          clearInterval(this.interval)
          this.createAllApprovedPubsForUser('Yes')
        }
      } else {
        clearInterval(this.interval)
        this.createAllApprovedPubsForUser('No')
      }
    }
  }

  public onSearch() {
    console.log('SEARCHING FOR: ' + this.searchbox)
    this.$router.push({ path: '/search/results/query/' + this.searchbox })
  }
}
</script>

<style>
.activity {
  height: 700px;
  overflow-y: auto;
}
</style>
