<template>
  <li class="nav-item">
    <a v-b-toggle.menu0 class="nav-link sidebar-menu-item">
      <span class="sidebar-icon">
        <font-awesome-icon fas icon="user" class="icon"></font-awesome-icon>
      </span>
      <span class="sidebar-text">
        {{ currentUser.DisplayName }}
      </span>
    </a>
    <b-collapse id="menu0" accordion="sidebar-accordion" role="tabpanel" class="ml-3">
      <ul class="nav">
        <li class="nav-item">
          <div class="container-fluid m-0 p-0">
            <div class="row no-gutters">
              <div class="col-1">
                <span class="sidebar-icon">
                  <font-awesome-icon fas icon="envelope" class="icon"></font-awesome-icon>
                </span>
              </div>
              <div class="col-11">
                <span class="sidebar-text">
                  {{ currentUser.Email }}
                </span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </b-collapse>
  </li>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../interfaces/User'

const users = namespace('users')

@Component({
  name: 'UserMenu'
})
export default class UserMenu extends Vue {
  @users.State
  public currentUser!: UserInt
}
</script>

<style lang="scss"></style>
