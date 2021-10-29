<template>
  <div v-if="ready">
    <b-input-group>
      <b-form-input :id="getID('dfs', id)" :ref="getID('dfs', id)" size="sm" class="hidden" :value="value"></b-form-input>
      <template #prepend>
        <b-dropdown variant="blue-500" @show="onShow" size="sm" :text="label" menu-class="filterdrop">
          <b-form-checkbox v-for="option in options" v-model="selected" :key="option" class="dfs" :value="option" :name="name" @input.native="toggleSelection(option, $event)">
            {{ option }}
          </b-form-checkbox>
        </b-dropdown>
      </template>
    </b-input-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { PublicationItem } from '@/interfaces/PublicationItem'

@Component({
  name: 'dynamic-checkbox-select'
})
export default class DynamicCheckboxSelect extends Vue {
  // used to select options with multiple checkboxes
  // uses bootstrap-vue components
  @Prop(String) readonly id: string | undefined
  @Prop() value!: any
  @Prop(Array) pubs!: Array<PublicationItem>
  /* @Prop(Array) options!: [] */
  @Prop(String) label!: string
  @Prop(String) name!: string
  @Prop(String) type!: string
  @Prop(String) key!: string
  @Prop(Boolean) ad!: boolean
  @Prop(Boolean) ready!: boolean

  selected: any = ''
  options: any = []

  public getID(prefix: string, id: string) {
    return prefix + '_' + id
  }

  public onShow() {
    // we need to get the unique values of the field that is selected. This is based on the passed pubs array so just go get them.
    let p: any = []
    for (let i = 0; i < this.pubs.length; i++) {
      // get the current value in this iteration based on the field. Then test if it is already in the array and add it if not
      let val = ''
      let pub: PublicationItem = this.pubs[i]
      if (this.type === 'AD') {
        val = this.pubs[i].AdditionalData[this.label]
      }
      if (this.type === 'NWDCAO') {
        if (this.pubs[i] !== null) {
          let ao: any = pub.NWDCAO
          let t: any = ao.Title
          val = t
        }
      }
      if (this.type === 'default') {
        val = this.pubs[i][this.name]
      }
      if (p.indexOf(val) < 0) {
        p.push(val)
      }
    }
    this.options = p
  }

  public toggleSelection(item: any, event: any) {
    // toggle selection by checking if it is or is not selected and selecting/deselecting it accordingly.
    if (event.target.checked) {
      this.selected = item
    } else {
      this.selected = ''
    }
    // emit the value back out for the v-model
    let result = this.selected
    this.value = result
    this.$emit('input', this.value)
  }
}
</script>

<style>
.filterdrop {
  min-width: 300px;
}
</style>
