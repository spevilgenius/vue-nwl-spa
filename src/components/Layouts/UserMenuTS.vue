<template>
  <li class="nav-item">
    <b-modal id="Todos" ref="Todos" scrollable size="xl" centered hide-footer header-bg-variant="warning" header-text-variant="white">
      <template v-slot:modal-title>My Tasks</template>
      <b-form>
        <!-- <ejs-grid id="TodoGrid" ref="TodoGrid" :dataSource="todos" :allowPaging="true" :pageSettings="pageSettings" :editSettings="editSettings" :toolbar="toolbar" :toolbarclick="toolbarClick" :detailTemplate="detailTemplate" rowHeight="20" height="100%" width="100%">
          <e-columns>
            <e-column headerText="Actions" textAlign="Left" width="100" :template="actionsTemplate"></e-column>
            <e-column field="Title" headerText="Title" textAlign="Left" width="200"></e-column>
            <e-column field="Status" headerText="Status" width="100"></e-column>
            <e-column field="StartDate" headerText="Start Date" textAlign="Left" width="100"></e-column>
            <e-column field="DueDate" headerText="Due Date" textAlign="Left" width="100"></e-column>
            <e-column field="TaskType" headerText="Task Type" textAlign="Left" width="160"></e-column>
            <e-column field="Id" headerText="Id" :visible="false" textAlign="Left" width="40" :isPrimaryKey="true"></e-column>
            <e-column field="Body" :visible="false" textAlign="Left" width="40"></e-column>
            <e-column field="uri" :visible="false" textAlign="Left" width="40"></e-column>
            <e-column field="etag" :visible="false" textAlign="Left" width="40"></e-column>
            <e-column field="TaskLink" :visible="false" textAlign="Left" width="40"></e-column>
          </e-columns>
        </ejs-grid> -->
      </b-form>
    </b-modal>
    <a v-b-toggle.menu0 class="nav-link sidebar-menu-item">
      <span class="sidebar-icon">
        <font-awesome-icon fas icon="user" class="icon"></font-awesome-icon>
      </span>
      <span class="sidebar-text">
        {{ currentUser.DisplayName }}
      </span>
      <span class="sidebar-button">
        <b-button v-if="todoCount > 0" variant="warning" @click="OpenTodos" class="sidebar-tasks rounded"
          >My Tasks
          <b-spinner v-if="todoCount == 0" variant="danger" class="loading-spinner"></b-spinner>
          <span class="badge badge-xs badge-danger sidebar-badge" @click="OpenTodos">{{ todoCount }}</span>
        </b-button>
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
import { Component, Vue, Ref } from 'vue-property-decorator'
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

  // @Ref('TodoGrid') readonly TravelGrid!: GridComponent

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
