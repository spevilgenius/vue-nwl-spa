<template>
  <div class="sidebar">
    <div class="sidebar-wrapper">
      <ul class="nav">
        <li class="nav-item nav-header">
          <b-link class="nav-link" :href="homepage">
            <span class="sidebar-icon">
              <font-awesome-icon fas icon="fighter-jet" class="icon"></font-awesome-icon>
            </span>
            <span class="sidebar-text sidebar-header">{{ title }}</span>
          </b-link>
        </li>
      </ul>
      <ul v-if="sidebaritems.length > 0" class="accordion nav" role="tablist">
        <UserMenu />
        <li v-for="(link, index) in sidebaritems" :key="link.name + index" :link="link" class="nav-item" :to="link.path ? link.path : '/'">
          <template v-if="link.children.length > 0">
            <a v-b-toggle="'menu' + link.id" class="nav-link">
              <span class="sidebar-icon">
                <font-awesome-icon v-if="link.library === 'fas'" fas :icon="link.icon" class="icon"></font-awesome-icon>
                <font-awesome-icon v-else-if="link.library === 'far'" far :icon="link.icon" class="icon"></font-awesome-icon>
              </span>
              <span class="sidebar-text">
                {{ link.name }}
              </span>
              <b class="caret"></b>
            </a>
            <b-collapse :id="'menu' + link.id" accordion="sidebar-accordion" role="tabpanel" class="ml-3">
              <ul class="nav">
                <li v-for="(sublink, index) in link.children" :key="sublink.name + index" :sublink="sublink" class="nav-item">
                  <router-link :to="sublink.path" class="nav-link">
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
            <router-link v-if="currentUser[link.permission] === link.permissionvalue" :to="link.path" class="nav-link">
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
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../interfaces/User'
import { SidebarItem } from '../../interfaces/SidebarItem'
import GridFilter from './GridFilterTS.vue'
import UserMenu from './UserMenuTS.vue'

const sidebar = namespace('sidebar')
const users = namespace('users')

@Component({
  name: 'Sidebar',
  components: {
    UserMenu,
    GridFilter
  }
})
export default class Sidebar extends Vue {
  public Shown!: boolean

  @users.State
  public currentUser!: UserInt

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

  /** @method - lifecycle hook */
  public mounted(): void {
    this.getNavigation()
  }
}
</script>

<style lang="scss" scoped></style>
