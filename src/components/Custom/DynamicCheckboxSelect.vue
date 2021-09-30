<template>
  <div>
    <b-form-group :label="label" :label-for="getID('bfcb', id)">
      <b-input-group>
        <b-form-input :id="getID('bfcb', id)" :ref="getID('bfcb', id)" size="sm" class="form-control" :value="value"></b-form-input>
        <template #prepend>
          <b-dropdown variant="blue-700" @show="onShow" size="sm" text="Select">
            <b-form-checkbox v-for="option in options" v-model="selected" :key="option.value" class="dcbs" :value="option.value" :name="name" @input.native="toggleSelection(option, $event)">
              {{ option.text }}
            </b-form-checkbox>
          </b-dropdown>
        </template>
      </b-input-group>
    </b-form-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'dynamic-checkbox-select'
})
export default class DynamicCheckboxSelect extends Vue {
  // used to select options with multiple checkboxes
  // uses bootstrap-vue components
  @Prop(String) readonly id: string | undefined
  @Prop() value!: any
  @Prop(Array) options!: []
  @Prop(String) label!: string
  @Prop(String) name!: string

  selected: any = []

  mounted() {
    // if a value is passed with v-model, we need to ensure that we pre-select the items passed in.
    console.log('PASSED WITH V-MODEL: ' + this.value)
  }

  public getID(prefix: string, id: string) {
    return prefix + '_' + id
  }

  public onShow() {
    let ops = String(this.value)
    let options = ops.split(',')
    let items: any = this.options
    for (let i = 0; i < items.length; i++) {
      if (options.indexOf(items[i].text) >= 0) {
        // value exists so lets select it
        console.log('SELECTED: ' + items[i].text)
        this.selected.push(items[i].text)
      }
    }
  }

  public toggleSelection(item: any, event: any) {
    // toggle selection by checking if it is or is not selected and selecting/deselecting it accordingly.
    if (event.target.checked) {
      if (this.selected.length > 0) {
        // there are selections
        let index = 0
        for (let i = 0; i < this.selected.length; i++) {
          if (this.selected[i] === item.text) {
            index += 1
          }
        }
        if (index === 0) {
          // this item isnt yet in the selected array so add it
          this.selected.push(item.text)
          this.value.push(item.text)
        }
      } else {
        this.selected.push(item.text)
        this.value.push(item.text)
      }
    } else {
      // this item is being removed
      if (this.selected.length > 0) {
        // loop through the array and see if the user is in there
        for (let i = 0; i < this.selected.length; i++) {
          if (String(this.selected[i]) === item.text) {
            this.selected.splice(i, 1)
            this.value.splice(i, 1)
          }
        }
      }
    }
    // emit the value back out for the v-model
    let result = ''
    for (let i = 0; i < this.selected.length; i++) {
      if (i === 0) {
        result += this.selected[i]
      } else {
        result += ',' + this.selected[i]
      }
    }
    this.$emit('input', this.value)
  }
}
</script>

<style></style>
