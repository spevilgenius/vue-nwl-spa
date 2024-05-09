<template>
  <b-container v-if="alerts.length > 0" fluid class="m-0 p-1">
    <b-row v-for="alert in alerts" :key="alert">
      <b-col cols="12">
        <b-alert show dismissible :variant="alert.AlertType.toLowerCase()" @dismissed="closeme(alert.Id)">
          <h5>{{ alert.Text }}</h5>
        </b-alert>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Alert } from '@/interfaces/Alert'
import { namespace } from 'vuex-class'

const support = namespace('support')

@Component
export default class Alerts extends Vue {
  public interval: any

  @support.State
  public alerts!: Array<Alert>

  @support.Action
  public getAlerts!: () => Promise<boolean>

  mounted() {
    this.getAlerts()
  }

  closeme(id: number) {
    for (let i = 0; i < this.alerts.length; i++) {
      // check if the selected alert is this alert and remove if it is
      let a: any[] = []
      if (this.alerts[i].Id === id) {
        a = this.alerts.splice(i, 1)
      }
      this.alerts = a
    }
  }
}
</script>
