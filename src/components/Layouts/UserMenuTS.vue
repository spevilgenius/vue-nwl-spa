<template>
  <li class="nav-item">
    <!-- <b-modal id="Todos" ref="Todos" scrollable size="xl" centered hide-footer header-bg-variant="warning" header-text-variant="white">
      <template v-slot:modal-title>My Tasks</template>
      <b-form></b-form>
    </b-modal> -->
    <a v-b-toggle.menu0 class="nav-link sidebar-menu-item">
      <span class="sidebar-icon">
        <font-awesome-icon fas icon="user" class="icon"></font-awesome-icon>
      </span>
      <span class="sidebar-text">
        {{ currentUser.DisplayName }}
      </span>
      <span class="sidebar-button">
        <!-- <b-button v-if="todoCount > 0" variant="warning" @click="OpenTodos" class="sidebar-tasks rounded"
          >My Tasks
          <b-spinner v-if="todoCount == 0" variant="danger" class="loading-spinner"></b-spinner>
          <span class="badge badge-xs badge-danger sidebar-badge" @click="OpenTodos">{{ todoCount }}</span>
        </b-button> -->
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
// import { TodoItem } from '../../interfaces/TodoItem'
import ActionsTemplate from './TodoActionsTS.vue'
import DetailTemplate from './TodoDetailTS.vue'

const users = namespace('users')

@Component({
  name: 'UserMenu'
})
export default class UserMenu extends Vue {
  @users.State
  public currentUser!: UserInt

  /* @users.State
  public todos!: Array<TodoItem> */

  @users.State
  public todoCount!: number

  get isSubcontractor() {
    return this.$store.state.users.currentUser.isSubcontractor
  }

  get todos() {
    return this.$store.state.users.todos
  }

  public actionsTemplate() {
    return { template: ActionsTemplate }
  }

  public detailTemplate() {
    return { template: DetailTemplate }
  }

  public pageSettings?: any = { pageSize: 30 }
  public editSettings: any = {
    allowEditing: this.isSubcontractor ? false : true,
    allowAdding: this.isSubcontractor ? false : true,
    allowDeleting: false,
    mode: 'Dialog'
  }

  public OpenTodos() {
    this.$bvModal.show('Todos')
  }
}
</script>

<style lang="scss"></style>
