<template>
  <div>
    <b-modal :id="getID('dms', id)" :ref="getID('dms', id)" centered scrollable header-bg-variant="blue-500" header-text-variant="light" modal-class="zModal" @ok="onOk(id)" @show="onShow()">
      <template v-slot:modal-title>{{ title }}</template>
      <b-container class="p-0">
        <b-row>
          <b-col cols="12">
            <b-form-group label="Filter" label-cols-sm="3" label-align-sm="right" label-size="sm" class="mb-0">
              <b-input-group size="sm">
                <b-form-input :id="getID('filter', id)" v-model="filter" type="search" placeholder="Search..."></b-form-input>
                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <b-table :id="getID('table', id)" :ref="getID('table', id)" :items="items" :fields="fields" :current-page="currentPage" :filter="filter" no-provider-paging="true" no-provider-filtering="true" no-provider-sorting="true" :per-page="perPage" show-empty small @filtered="onReltoFiltered">
              <template #cell(actions)="row">
                <b-form-checkbox v-model="row.item.selected"></b-form-checkbox>
              </template>
            </b-table>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm" class="my-0"></b-pagination>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
    <b-form-group :label="label" :label-for="getID('bfi', id)">
      <b-input-group>
        <b-form-input :id="getID('bfi', id)" :ref="getID('bfi', id)" size="sm" class="form-control" :value="value"></b-form-input>
        <template #append>
          <b-button variant="blue-700" @click="onSearch(id)" size="sm">
            <font-awesome-icon fas icon="search" class="icon txt-light"></font-awesome-icon>
          </b-button>
        </template>
      </b-input-group>
    </b-form-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'dynamic-modal-select'
})
export default class DynamicModalSelect extends Vue {
  // used to select options with multiple checkboxes
  // uses bootstrap-vue components
  @Prop(String) readonly id: string | undefined
  @Prop(String) value!: string
  @Prop(Array) fields!: []
  @Prop(Array) items: any = []
  @Prop(String) filter!: string
  @Prop(String) label!: string
  @Prop({ default: 'Select' }) title!: string

  currentPage = 1
  totalRows = 0
  perPage = 30 // default
  selected: any = []

  mounted() {
    // if a value is passed with v-model, we need to ensure that we pre-select the items passed in.
    // console.log('PASSED WITH V-MODEL: ' + this.$props.value)
    console.log('PASSED WITH V-MODEL: ' + this.value)
  }

  public getID(prefix: string, id: string) {
    return prefix + '_' + id
  }

  public onSearch(id: string) {
    // open the modal
    console.log('OPEN MODAL: ' + id)
    id = 'dms_' + id
    this.$bvModal.show(id)
  }

  public onShow() {
    let ops = String(this.value)
    let options = ops.split(',')
    let items: any = this.items // this.$props.items
    this.totalRows = items.length
    for (let i = 0; i < items.length; i++) {
      if (options.indexOf(items[i].text) >= 0) {
        // value exists so lets select it
        console.log('SELECTED: ' + items[i].text)
        items[i].selected = true
        this.selected.push(items[i].text)
      }
    }
  }

  public toggleSelection(item: any, event: any) {
    // toggle selection by checking if it is or is not selected and selecting/deselecting it accordingly.
    console.log('SELECTED: ' + item.value)
    if (console) console.log('CHECKED: ' + event.target.checked + ', SELECTED LENGTH: ' + this.selected.length)
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
        }
      } else {
        this.selected.push(item.text)
      }
    } else {
      // this item is being removed
      if (this.selected.length > 0) {
        // loop through the array and see if the item is in there
        for (let i = 0; i < this.selected.length; i++) {
          if (String(this.selected[i]) === item.text) {
            this.selected.splice(i, 1)
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
    this.value = result
    this.$emit('input', this.value)
  }

  public onOk(id: string) {
    let result = ''
    for (let i = 0; i < this.items.length; i++) {
      console.log('SELECTED: ' + this.items[i].selected)
      if (this.items[i].selected) {
        if (result === '') {
          result = this.items[i].text
        } else {
          result += ',' + this.items[i].text
        }
      }
    }
    console.log('RESULT: ' + result)
    this.$emit('input', result)
    id = 'dms_' + id
    this.$bvModal.hide(id)
  }
}
</script>

<style></style>
