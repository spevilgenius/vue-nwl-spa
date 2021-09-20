<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../interfaces/User'
import { NotificationItem } from '../interfaces/NotificationItem'

const notify = namespace('notify')
const users = namespace('users')
const publication = namespace('publication')

@Component
export default class App extends Vue {
  public userid = 0
  public isVisible = true
  interval!: any

  @publication.State
  public allpubsloaded!: boolean

  @publication.State
  public natopubsloaded!: boolean

  @publication.State
  public pubsloaded!: boolean

  @notify.Action
  public add!: (notification: NotificationItem) => void

  @users.Action
  public getUserId!: () => Promise<UserInt>

  @users.Action
  public getUserProfile!: () => Promise<boolean>

  @users.Action
  public getUserPermissions!: (id: number) => Promise<UserInt>

  @users.Action
  public getTodosByUser!: () => Promise<boolean>

  @publication.Action
  public getAllPublications!: () => Promise<boolean>

  @publication.Action
  public getAllNatoPublications!: () => Promise<boolean>

  @publication.Action
  public createAllPubs!: () => Promise<boolean>

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
      const that = this
      this.getUserId().then(response => {
        this.userid = response.userid // sets local variable to user id and can be used in ts and js versions
        this.getUserProfile().then(response => {
          if (response === true) {
            this.getUserPermissions(this.userid).then(response => {
              if (response) {
                this.getTodosByUser().then(response => {
                  if (response) {
                    console.log('App loaded.')
                    this.add({
                      id: 'WelcomeMSG',
                      type: 'success',
                      title: 'Welcome',
                      message: 'Welcome'
                    })
                  } else {
                    console.log('App loaded. No Todos for current user')
                    this.add({
                      id: 'WelcomeMSG',
                      type: 'success',
                      title: 'Welcome',
                      message: 'Welcome'
                    })
                  }
                })
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
    this.getAllNatoPublications()
    this.getAllPublications()
    this.interval = setInterval(this.waitForIt, 500)
  }

  public waitForIt() {
    if (this.pubsloaded && this.natopubsloaded) {
      clearInterval(this.interval)
      this.createAllPubs()
    }
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
  z-index: 10000000 !important;
}
</style>
