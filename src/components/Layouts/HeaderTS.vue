<template>
  <nav class="navbar navbar-expand-lg">
    <!-- <b-modal id="ActivityLog" ref="ActivityLog" size="xl" centered :header-bg-variant="warning" @close="onModalHide" v-model="Show">
      <template v-slot:modal-title>Activity Log</template>
      <b-container fluid class="p-0">
        <div class="row m-0">
          <div class="col-12 p-0 activity" v-html="activity"></div>
        </div>
      </b-container>
    </b-modal> -->
    <div class="container-fluid">
      <div class="navbar-minimize">
        <button class="btn btn-outline btn-fill btn-round btn-icon d-none d-lg-block btn-burger" @click.prevent="toggler">
          <font-awesome-icon fas :icon="isShown === true ? 'ellipsis-v' : 'bars'" class="icon"></font-awesome-icon>
        </button>
      </div>
      <a class="navbar-brand">{{ this.$route.name }}</a>
      <span id="PageTitle"></span>
      <button type="button" class="navbar-toggler navbar-toggler-right btn-burger">
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end">
        <b-navbar-nav class="ml-auto hidden-xs">
          <!-- <b-nav-item-dropdown id="ContactsMenu" right no-caret menu-class="animated bounceInDown">
            <template slot="button-content"> <font-awesome-icon fas icon="users" class="cog"></font-awesome-icon>Contacts </template>
            <b-table-simple id="ContactsTable" v-for="contact in contacts" :key="contact">
              <b-tbody>
                <b-tr>
                  <b-td rowspan="3" class="px40 p-0 pl-1">
                    <a :href="contact.Email" rel="noopener noreferrer"><font-awesome-icon far icon="envelope" class="icon"></font-awesome-icon></a>
                  </b-td>
                  <b-td class="p-0">{{ contact.Name }}</b-td>
                </b-tr>
                <b-tr>
                  <b-td class="p-0">{{ contact.Position }}</b-td>
                </b-tr>
                <b-tr v-if="contact.Phone !== 'Empty'">
                  <b-td class="p-0">{{ contact.Phone }}</b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </b-nav-item-dropdown> -->
          <b-nav-item-dropdown id="SettingsMenu" right no-caret menu-class="animated bounceInDown">
            <template slot="button-content">
              <font-awesome-icon fas icon="cog" class="cog"></font-awesome-icon>
            </template>
            <b-dropdown-item v-if="isDeveloper" href="#" onclick="ChangeLayoutMode(false)">
              <div class="row">
                <font-awesome-icon far icon="edit" class="icon"></font-awesome-icon>
                <span>Edit page</span>
              </div>
            </b-dropdown-item>
            <b-dropdown-item v-if="isDeveloper" href="#" onclick="STSNavigate2(event,'/sites/f3I2/_layouts/addanapp.aspx');">
              <div class="row">
                <font-awesome-icon far icon="plus-square" class="icon"></font-awesome-icon>
                <span>Add an app</span>
              </div>
            </b-dropdown-item>
            <b-dropdown-item v-if="isDeveloper" href="#" onclick="STSNavigate2(event,'/sites/f3i2/_layouts/15/DesignSite.aspx');">
              <div class="row">
                <font-awesome-icon fas icon="pencil-alt" class="icon"></font-awesome-icon>
                <span>Design Manager</span>
              </div>
            </b-dropdown-item>
            <b-dropdown-item v-if="isDeveloper" href="#" onclick="STSNavigate2(event,'/sites/f3I2/_layouts/viewlsts.aspx');">
              <div class="row">
                <font-awesome-icon fas icon="box-open" class="icon"></font-awesome-icon>
                <span>Site contents</span>
              </div>
            </b-dropdown-item>
            <b-dropdown-item v-if="isDeveloper" href="#" onclick="STSNavigate2(event,'/sites/f3I2/_layouts/settings.aspx');">
              <div class="row">
                <font-awesome-icon fas icon="cogs" class="icon"></font-awesome-icon>
                <span>Site settings</span>
              </div>
            </b-dropdown-item>
            <!-- <b-dropdown-item href="#" @click="ShowActivityLog">
              <div class="row">
                <font-awesome-icon fas icon="clipboard-list" class="icon"></font-awesome-icon>
                <span>Show Activity Log</span>
              </div>
            </b-dropdown-item> -->
            <b-dropdown-item href="#" onclick="STSNavigate2(event,'/sites/f3i2/_layouts/15/SignOut.aspx');">
              <div class="row">
                <font-awesome-icon fas icon="sign-out-alt" class="icon"></font-awesome-icon>
                <span>Logout</span>
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
import { namespace } from 'vuex-class'
// import { EventBus } from '../../main'

const support = namespace('support')
// const contact = namespace('contact')

@Component({
  name: 'Header'
})
export default class Header extends Vue {
  public rect!: DOMRect
  public Show = false

  get isDeveloper() {
    return this.$store.state.users.currentUser.isDeveloper
  }

  @support.State
  public isShown!: boolean

  @support.Action
  public setShown!: (newVal: boolean) => void

  @support.State
  public isThemeSelectorShown!: boolean

  @support.Action
  public setRect!: (newVal: DOMRect) => void

  /* @support.Action
  public setThemeSelectorShown!: (newVal: boolean) => void */

  /* @contact.State
  public loaded!: boolean

  @contact.Action
  public getContacts!: () => Promise<boolean>

  get contacts() {
    return this.$store.state.contact.contacts
  }
 */
  toggler() {
    this.setShown(!this.isShown)
  }

  /* public ShowThemeSelector() {
    this.setThemeSelectorShown(!this.isThemeSelectorShown)
  } */

  public ShowActivityLog(): void {
    this.Show = true
  }

  public onModalHide(): void {
    this.Show = false
  }

  mounted() {
    // this.getContacts()
  }
}
</script>
