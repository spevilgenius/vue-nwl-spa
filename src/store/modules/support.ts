/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { LegendItem } from '@/interfaces/LegendItem'
import { EventBus } from '../../main'
// import { ThemeName } from '@/themes/theme.types'
@Module({ namespaced: true })
class Support extends VuexModule {
  public rect!: DOMRect
  public isShown?: boolean = true
  public isThemeSelectorShown?: boolean = false
  // public theme: ThemeName = ThemeName.DEFAULT
  public contentrect!: DOMRect
  public contentwidth!: number
  public legendItems: Array<LegendItem> = []
  public legendLoaded = false
  public legendLoading = false
  @Mutation
  public updateRect(newVal: DOMRect): void {
    this.contentrect = newVal
    this.contentwidth = newVal.width
    console.log('SIDEBAR VISIBLE: ' + this.isShown + ', WIDTH: ' + this.contentwidth)
    EventBus.$emit('SidebarChanged', this.contentwidth)
  }

  @Mutation
  public updateLegendItems(items: Array<LegendItem>): void {
    this.legendItems = items
  }

  /* @Action
  public setRect(newVal: DOMRect): void {
    this.context.commit('updateRect', newVal)
  } */

  @Action
  public setRect(): void {
    const element = document.getElementById('maincontent')!
    this.rect = element.getBoundingClientRect()
    this.context.commit('updateRect', this.rect)
  }

  @Action
  public setLegendItems(items: Array<LegendItem>): void {
    this.context.commit('updateLegendItems', items)
  }

  @Mutation
  public updateShown(newVal: boolean): void {
    this.isShown = newVal
  }

  @Action
  public setShown(newVal: boolean): void {
    const that = this
    this.context.commit('updateShown', newVal)
    window.setTimeout(function() {
      that.context.dispatch('setRect')
    }, 500)
  }

  @Mutation
  public updateThemeSelectorShown(newVal: boolean): void {
    this.isThemeSelectorShown = newVal
  }

  @Action
  public setThemeSelectorShown(newVal: boolean): void {
    this.context.commit('updateThemeSelectorShown', newVal)
  }

  /* @Mutation
  private SET_THEME(theme: ThemeName): void {
    this.theme = theme
  }
  @Action
  public setTheme(theme: ThemeName): void {
    this.context.commit('SET_THEME', theme)
  } */
}
export default Support
