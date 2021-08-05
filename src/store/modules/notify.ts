import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { NotificationItem } from '@/interfaces/NotificationItem'

let nextId = 1

@Module({ namespaced: true })
class Notify extends VuexModule {
  public notifications: Array<NotificationItem> = []
  @Mutation
  public addNotification(notification: NotificationItem): void {
    this.notifications.push({
      ...notification,
      id: nextId++
    })
  }
  @Mutation
  public deleteNotification(notificationToRemove: NotificationItem): void {
    this.notifications = this.notifications.filter(notification => notification.id !== notificationToRemove.id)
  }
  @Action
  public add(notification: NotificationItem): void {
    this.context.commit('addNotification', notification)
  }
  @Action
  public delete(notificationToRemove: NotificationItem) {
    this.context.commit('deleteNotification', notificationToRemove)
  }
}

export default Notify
