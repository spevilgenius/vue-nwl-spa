<template>
  <b-container fluid class="contentHeight p-0" id="MainContainer">
    <b-toast id="busy-toast" variant="light-blue" solid no-auto-hide>
      <template v-slot:toast-title>
        <div class="d-flex flex-grow-1 align-items-baseline">
          <b-img blank blank-color="#ff0000" class="mr-2" width="12" height="12"></b-img>
          <strong class="mr-auto">{{ busyTitle }}</strong>
        </div>
      </template>
      <b-progress :variant="busyVariant" :value="busyValue" :max="busyMax" show-progress animated></b-progress>
    </b-toast>
    <b-row class="mb-1">
      <b-col cols="3">
        <b-card border-variant="success" text-variant="dark">
          <template v-slot:header>
            <h3 class="mb-0">
              <span class="ml-0">Subcontractor Actions</span>
              <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
            </h3>
          </template>
          <b-card-body>
            <b-row class="p-0 m-0">
              <b-button ref="UpdateSubs" variant="success" @click="UpdateSubs">Update Subs</b-button>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="3">
        <b-card border-variant="success" text-variant="dark">
          <template v-slot:header>
            <h3 class="mb-0">
              <span class="ml-0">MSR Actions</span>
              <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
            </h3>
          </template>
          <b-card-body>
            <b-row class="p-0 m-0">
              <b-button ref="createMSR" variant="success" @click="createMSRs">Create MSRs</b-button>
              <b-button ref="cloneMSRs" variant="warning" class="ml-1" @click="btnCloneMSRsClick">Clone MSRs</b-button>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="3">
        <b-card border-variant="success" text-variant="dark">
          <template v-slot:header>
            <h3 class="mb-0">
              <span class="ml-0">Travel Actions</span>
              <font-awesome-icon fas icon="helicopter" class="icon text-danger float-right ml-1"></font-awesome-icon>
            </h3>
          </template>
          <b-card-body>
            <b-row class="p-0 m-0">
              <b-button ref="btn_LateTripReports" variant="success" @click="btn_LateTripReports_Clicked">Calculate Late TRs</b-button>
              <span class="badge badge-xs badge-danger">{{ tripcount }}</span>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="3">
        <b-card border-variant="success" text-variant="dark">
          <template v-slot:header>
            <h3 class="mb-0">
              <span class="ml-0">Developer Actions</span>
              <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
            </h3>
          </template>
          <b-card-body>
            <b-row class="p-0 m-1">
              <b-button :disabled="travel.length <= 0" ref="UpdateTravel" variant="success" @click="UpdateTravel">Update Travelers</b-button>
              <b-button ref="InstallSecurity" variant="danger" @click="InstallSecurity" class="ml-1">Install Security</b-button>
              <!-- <b-button ref="btnPlayground" variant="success" @click="btnPlaygroundClick">Playground</b-button> -->
            </b-row>
            <b-row class="p-0 m-1">
              <b-button ref="migrateSecurityInfo" variant="success" @click="migrateSecurityInfo" class="ml-1">Migrate Security Info</b-button>
            </b-row>
            <b-row class="p-0 m-1">
              <b-button ref="UpdatePermissions" variant="success" @click="UpdatePermissions" class="ml-1">Update Permissions</b-button>
            </b-row>
            <b-row class="p-0 m-1">
              <b-button ref="AddUsersToGroups" variant="success" @click="AddUsersToGroups" class="ml-1">Add Users To Groups</b-button>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="3">
        <b-card border-variant="success" text-variant="dark">
          <template v-slot:header>
            <h3 class="mb-0">
              <span class="ml-0">Personnel Actions</span>
              <font-awesome-icon fas icon="people-arrow" class="icon text-danger float-right ml-1"></font-awesome-icon>
            </h3>
          </template>
          <b-card-body>
            <b-row class="p-0 m-0">
              <b-button ref="checkPersonnelSecurity" :disabled="disablePersonnelSecurityCheck" variant="success" @click="checkPersonnelSecurity">Check Personnel Versus Security</b-button>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Admin extends Vue {
  nothing = null
}
</script>
