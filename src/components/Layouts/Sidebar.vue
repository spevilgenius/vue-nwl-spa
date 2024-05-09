<template>
  <div class="sidebar">
    <b-modal v-model="show508" size="lg" centered title="**** Section 508 of the Rehabilitation Act of 1973 ****">
      <p>
        The U.S. Department of Defense is committed to making its electronic and information technologies accessible to individuals with disabilities in accordance with
        <a href="http://www.access-board.gov/the-board/laws/rehabilitation-act-of-1973#508" target="_blank"> Section 508 of the Rehabilitation Act (29 U.S.C. 794d), as amended in 1999 </a>. Send feedback or concerns related to the accessibility of this website to the
        <a href="mailto:osd.mc-alex.dod-cio.mbx.section-508@mail.mil" target="_blank"> DoD Section 508 mailbox </a>. For more information about Section 508, please visit the DoD Section 508 website.
      </p>
      <template #modal-footer="{ ok }">
        <b-button variant="loading" @click="ok()">OK</b-button>
      </template>
    </b-modal>
    <b-modal v-model="showDOD" size="xl" header-bg-variant="gold" centered title="**** UNITED STATES DEPARTMENT OF DEFENSE WARNING STATEMENT ****">
      <div>
        <div style="text-align: center; margin: 10px; white-space: nowrap">You are accessing a U.S. Governement (USG) Information System (IS) that is provided for USG-authorized use only.</div>
        <div style="margin: 20px">
          <div>By using this IS (which includes any device attached to this IS), you consent to the following conditions:</div>
          <ul>
            <li style="margin: 4px">The USG routinely intercepts and monitors communcications on this IS for purposes including, but not limited to, penetration testing, COMSEC monitoring, network operations and defense, personnel misconduct (PM), law enforcement (LE), and counterintelligence (CI) investigations.</li>
            <li style="margin: 4px">At any time, the USG may inspect and seize data stored on this IS.</li>
            <li style="margin: 4px">Communciations using, or data stored on, this IS are not private, are subject to routine monitoring, interception, and search, and may be disclosed or used for any USG-authorized purpose.</li>
            <li style="margin: 4px">This IS includes security measures (e.g., authentication and access controls_ to protect USG interests-not for your personel benefit or privacy.</li>
            <li style="margin: 4px">
              Notwithstanding the above, using this IS does not constitute consent to PM, LE or CI investigative searching or monitoring of the content of privileged communications, or work product, related to personal representation or services by attorneys, psychotherapists, or clergy, and their assistants. Such communications and work product
              are private and confidential. See User Agreement for details.
            </li>
          </ul>
        </div>
      </div>
      <template #modal-footer="{ ok }">
        <b-button variant="loading" @click="ok()">Accept</b-button>
        <b-button variant="loading" @click="reject()">Reject</b-button>
      </template>
    </b-modal>
    <div class="sidebar-wrapper">
      <ul class="nav">
        <li class="nav-item nav-header">
          <b-link class="nav-header-link" href="https://nwdc.navy.mil">
            <div class="nav-header-logo-container">
              <div class="nav-header-logo" :style="{ backgroundImage: 'url(' + baseImageUrl + '/NWDCLogo100x100.png)' }"></div>
            </div>
          </b-link>
          <b-link class="nav-header-link-sub" href="https://doctrine.navy.mil/Pages/Home.aspx">
            <div class="nav-header-title">{{ title }}</div>
          </b-link>
        </li>
      </ul>
      <ul v-if="sidebaritems.length > 0" class="accordion nav" role="tablist">
        <UserMenu />
        <li v-for="(link, index) in sidebaritems" :key="link.name + index" :link="link" class="nav-item" :to="link.to ? link.to : '/'">
          <template v-if="link.children.length > 0">
            <a v-if="currentUser[link.permission] === link.permissionvalue" v-b-toggle="'menu' + link.id" class="nav-link">
              <span class="sidebar-icon">
                <font-awesome-icon v-if="link.library === 'fas'" fas :icon="link.icon" class="icon"></font-awesome-icon>
                <font-awesome-icon v-else-if="link.library === 'far'" far :icon="link.icon" class="icon"></font-awesome-icon>
              </span>
              <span class="sidebar-text">
                {{ link.name }}
              </span>
              <b class="caret"></b>
            </a>
            <b-collapse v-if="currentUser[link.permission] === link.permissionvalue" :id="'menu' + link.id" accordion="sidebar-accordion" role="tabpanel" class="ml-3">
              <ul class="nav" v-if="link.name == 'Approved Publications'">
                <b-overlay :show="loadingpubs" variant="loading">
                  <li v-for="(sublink, index) in link.children" :key="sublink.name + index" :sublink="sublink" class="nav-item">
                    <router-link v-if="currentUser[sublink.permission] === sublink.permissionvalue" :to="sublink.to" class="nav-link">
                      <div class="container-fluid m-0 p-0">
                        <div class="row no-gutters">
                          <div class="col-1">
                            <span class="sidebar-icon">
                              <font-awesome-icon v-if="sublink.library === 'fas'" fas :icon="sublink.icon" class="icon"></font-awesome-icon>
                              <font-awesome-icon v-else-if="sublink.library === 'far'" far :icon="sublink.icon" class="icon"></font-awesome-icon>
                            </span>
                          </div>
                          <div class="col-11">
                            <span class="sidebar-text">
                              {{ sublink.name }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </router-link>
                  </li>
                  <!-- <li v-for="(sublink, index) in link.children" :key="sublink.name + index" :sublink="sublink" class="nav-item">
                    <template v-if="sublink.children.length > 0">
                      <a v-if="currentUser[sublink.permission] === sublink.permissionvalue" v-b-toggle="'submenu' + sublink.id" class="nav-link">
                        <span class="sidebar-icon">
                          <font-awesome-icon v-if="sublink.library === 'fas'" fas :icon="sublink.icon" class="icon"></font-awesome-icon>
                          <font-awesome-icon v-else-if="sublink.library === 'far'" far :icon="sublink.icon" class="icon"></font-awesome-icon>
                        </span>
                        <span class="sidebar-text">
                          {{ sublink.name }}
                        </span>
                        <b class="caret"></b>
                      </a>
                      <b-collapse v-if="currentUser[sublink.permission] === sublink.permissionvalue" :id="'submenu' + sublink.id" accordion="sidebar-sub-accordion" role="tabpanel" class="ml-3">
                        <ul class="nav">
                          <li v-for="(childlink, index) in sublink.children" :key="childlink.name + index" :childlink="childlink" class="nav-item">
                            <router-link :to="childlink.to" class="nav-link">
                              <div class="container-fluid m-0 p-0">
                                <div class="row no-gutters">
                                  <div class="col-1">
                                    <span class="sidebar-icon">
                                      <font-awesome-icon v-if="childlink.library === 'fas'" fas :icon="childlink.icon" class="icon"></font-awesome-icon>
                                      <font-awesome-icon v-else-if="childlink.library === 'far'" far :icon="childlink.icon" class="icon"></font-awesome-icon>
                                    </span>
                                  </div>
                                  <div class="col-11">
                                    <span class="sidebar-text">
                                      {{ childlink.name }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </router-link>
                          </li>
                        </ul>
                      </b-collapse>
                    </template>
                    <template v-else>
                      <router-link v-if="currentUser[sublink.permission] === sublink.permissionvalue" :to="sublink.to" class="nav-link">
                        <div class="container-fluid m-0 p-0">
                          <div class="row no-gutters">
                            <div class="col-1">
                              <span class="sidebar-icon">
                                <font-awesome-icon v-if="sublink.library === 'fas'" fas :icon="sublink.icon" class="icon"></font-awesome-icon>
                                <font-awesome-icon v-else-if="sublink.library === 'far'" far :icon="sublink.icon" class="icon"></font-awesome-icon>
                              </span>
                            </div>
                            <div class="col-11">
                              <span class="sidebar-text">
                                {{ sublink.name }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </router-link>
                    </template>
                  </li> -->
                </b-overlay>
              </ul>
              <ul class="nav" v-else>
                <li v-for="(sublink, index) in link.children" :key="sublink.name + index" :sublink="sublink" class="nav-item">
                  <router-link v-if="currentUser[sublink.permission] === sublink.permissionvalue" :to="sublink.to" class="nav-link">
                    <div class="container-fluid m-0 p-0">
                      <div class="row no-gutters">
                        <div class="col-1">
                          <span class="sidebar-icon">
                            <font-awesome-icon v-if="sublink.library === 'fas'" fas :icon="sublink.icon" class="icon"></font-awesome-icon>
                            <font-awesome-icon v-else-if="sublink.library === 'far'" far :icon="sublink.icon" class="icon"></font-awesome-icon>
                          </span>
                        </div>
                        <div class="col-11">
                          <span class="sidebar-text">
                            {{ sublink.name }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </router-link>
                </li>
              </ul>
            </b-collapse>
          </template>
          <template v-else>
            <router-link v-if="currentUser[link.permission] === link.permissionvalue" :to="link.to" class="nav-link">
              <span class="sidebar-icon">
                <font-awesome-icon v-if="link.library === 'fas'" fas :icon="link.icon" class="icon"></font-awesome-icon>
                <font-awesome-icon v-else-if="link.library === 'far'" far :icon="link.icon" class="icon"></font-awesome-icon>
              </span>
              <span class="sidebar-text">
                {{ link.name }}
              </span>
            </router-link>
          </template>
        </li>
        <li class="nav-item" v-if="currentUser.isActionOfficer">
          <a href="https://doctrine.navy.mil/Documents/NWL3.0ActionOfficerUserGuide.pdf" target="_new" class="nav-link">
            <span class="sidebar-icon">
              <font-awesome-icon fas icon="book" class="icon"></font-awesome-icon>
            </span>
            <span class="sidebar-text">User Guide</span>
          </a>
        </li>
        <li class="nav-item" v-else-if="currentUser.isLibrarian">
          <a href="https://doctrine.navy.mil/Documents/NWL3.0DoctrineLibrarianUserGuide.pdf" target="_new" class="nav-link">
            <span class="sidebar-icon">
              <font-awesome-icon fas icon="book" class="icon"></font-awesome-icon>
            </span>
            <span class="sidebar-text">User Guide</span>
          </a>
        </li>
        <li class="nav-item" v-else-if="currentUser.isTerminologist">
          <a href="https://doctrine.navy.mil/Documents/NWL3.0TerminologistUserGuide.pdf" target="_new" class="nav-link">
            <span class="sidebar-icon">
              <font-awesome-icon fas icon="book" class="icon"></font-awesome-icon>
            </span>
            <span class="sidebar-text">User Guide</span>
          </a>
        </li>
        <li class="nav-item" v-else>
          <a href="https://doctrine.navy.mil/Documents/NWL3.0FleetUserGuide.pdf" target="_new" class="nav-link">
            <span class="sidebar-icon">
              <font-awesome-icon fas icon="book" class="icon"></font-awesome-icon>
            </span>
            <span class="sidebar-text">User Guide</span>
          </a>
        </li>
        <li class="nav-item">
          <a v-b-toggle="'menuabout'" class="nav-link">
            <span class="sidebar-icon">
              <font-awesome-icon fas icon="question" class="icon"></font-awesome-icon>
            </span>
            <span class="sidebar-text">About</span>
            <b class="caret"></b>
          </a>
          <b-collapse id="menuabout" accordion="sidebar-accordion" role="tabpanel" class="ml-3">
            <ul class="nav">
              <li class="nav-item">
                <a @click="show508 = !show508" class="nav-link">
                  <div class="container-fluid m-0 p-0">
                    <div class="row no-gutters">
                      <div class="col-1">
                        <span class="sidebar-icon">
                          <font-awesome-icon fas icon="file-lines" class="icon"></font-awesome-icon>
                        </span>
                      </div>
                      <div class="col-11">
                        <span class="sidebar-text">Section 508 compliance</span>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
              <li class="nav-item">
                <a @click="showDOD = !showDOD" class="nav-link">
                  <div class="container-fluid m-0 p-0">
                    <div class="row no-gutters">
                      <div class="col-1">
                        <span class="sidebar-icon">
                          <font-awesome-icon fas icon="handshake" class="icon"></font-awesome-icon>
                        </span>
                      </div>
                      <div class="col-11">
                        <span class="sidebar-text">DoD User Agreement</span>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </b-collapse>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../interfaces/User'
import { SidebarItem } from '../../interfaces/SidebarItem'
import UserMenu from './UserMenu.vue'

const sidebar = namespace('sidebar')
const users = namespace('users')
const publication = namespace('publication')

@Component({
  name: 'Sidebar',
  components: {
    UserMenu
  }
})
export default class Sidebar extends Vue {
  public Shown!: boolean
  showDOD = false
  show508 = false

  @users.State
  public currentUser!: UserInt

  @Prop({ default: process.env.VUE_APP_BASE_IMAGE_URL }) readonly baseImageUrl!: string

  @Prop({ default: process.env.VUE_APP_HOMEPAGE }) readonly homepage!: string

  @Prop({ default: process.env.VUE_APP_TITLE }) readonly title!: string

  @sidebar.State
  public navigationloaded

  @sidebar.State
  public sidebaritems!: Array<SidebarItem>

  @sidebar.State
  public navigation!: Array<SidebarItem>

  @sidebar.Action
  public getNavigation!: () => Promise<boolean>

  @publication.State
  public loadingpubs!: boolean

  /** @method - lifecycle hook */
  public mounted(): void {
    // this.getNavigation()
  }

  public reject() {
    this.$router.push({ path: '/rejected' })
  }
}
</script>

<style lang="scss" scoped></style>
