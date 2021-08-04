<template>
  <b-toast :variant="notification.type" solid append-toast auto-hide-delay="4000" visible>
    <template v-slot:toast-title>
      <div class="d-flex flex-grow-1 align-items-baseline">
        <strong class="mr-auto">{{ notification.title }}</strong>
      </div>
    </template>
    <span>{{ notification.message }}</span>
  </b-toast>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { NotificationItem } from '../../interfaces/NotificationItem'
import { namespace } from 'vuex-class'
const notify = namespace('notify')

@Component
export default class NotificationBar extends Vue {
  @notify.Action
  public remove!: (notificationToRemove: NotificationItem) => void

  @Prop()
  public notification!: NotificationItem

  private timeout!: number

  mounted() {
    this.timeout = window.setTimeout(() => this.remove(this.notification), 1000)
  }

  beforeDestroy() {
    clearTimeout(this.timeout)
  }
}
</script>

<style scoped></style>
