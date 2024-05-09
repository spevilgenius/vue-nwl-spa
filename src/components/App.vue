<template>
  <div v-if="isVisible" id="app">
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
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../interfaces/User'

const users = namespace('users')

@Component
export default class App extends Vue {
  public userid = 0
  public isVisible = true
  interval!: any
  showDOD = true

  @users.Action
  public getUserId!: () => Promise<UserInt>

  @users.Action
  public getUserProfile!: () => Promise<boolean>

  @users.Action
  public getUserPermissions!: (id: number) => Promise<UserInt>

  /** @method - lifecycle hook */
  public created(): void {
    let loc = String(window.location)
    if (loc.indexOf('WSSWebPartPage') >= 0) {
      this.isVisible = false
      let doc = document?.getElementById('app')
      if (doc !== null) {
        doc.style.display = 'none'
        doc.style.zIndex = '-1000'
      }
    } else {
      this.isVisible = true
      console.log('APP VISIBLE')
      this.getUserId().then((response) => {
        this.userid = response.userid // sets local variable to user id and can be used in ts and js versions
        this.getUserProfile().then((response) => {
          if (response === true) {
            this.getUserPermissions(this.userid).then((response) => {
              if (response) {
                console.log('App loaded.')
              } else {
                console.log('Error getting user permissions.')
              }
            })
          } else {
            console.log('Error getting user profile.')
          }
        })
      })
    }
  }

  /** @method - lifecycle hook */
  mounted() {
    this.interval = setInterval(this.waitForIt, 1500)
  }

  public waitForIt() {
    clearInterval(this.interval)
    const oldBanners = document.querySelectorAll('.classificationbanner')
    oldBanners.forEach((banner) => {
      banner.remove()
    })
  }
  public reject() {
    this.$router.push({ path: '/rejected' })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  background-color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 100 !important;
}
</style>
