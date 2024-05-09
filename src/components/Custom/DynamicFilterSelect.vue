<template>
  <div v-if="ready">
    <b-modal :id="getID('dfs', id)" :ref="getID('dfs', id)" centered scrollable hide-header modal-class="filterModal" @ok="onOk(id)" @show="onShow()">
      <b-form-checkbox v-for="option in ops" v-model="selected" :key="option" class="dfs" :value="option" :name="name" @input.native="toggleSelection(option, $event)">
        {{ option }}
      </b-form-checkbox>
    </b-modal>
    <b-input-group>
      <b-form-input :id="getID('dfsi', id)" :ref="getID('dfsi', id)" size="sm" class="hidden" :value="value"></b-form-input>
      <template #prepend>
        <b-button variant="blue-500" size="sm" class="actionbutton">{{ label }}</b-button>
      </template>
      <template #append>
        <b-button variant="blue-500" @click="showFilter(id, position)" size="sm" class="actionbutton">
          <font-awesome-icon fas icon="filter" class="icon txt-light"></font-awesome-icon>
        </b-button>
      </template>
    </b-input-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { EventBus } from '../../main'
import { PublicationItem } from '@/interfaces/PublicationItem'

@Component({
  name: 'dynamic-checkbox-select'
})
export default class DynamicCheckboxSelect extends Vue {
  // used to select options with multiple checkboxes
  // uses bootstrap-vue components
  @Prop(String) readonly id: string | undefined
  @Prop() value!: any
  @Prop(Array) ops!: []
  @Prop(String) label!: string
  @Prop(String) name!: string
  @Prop(String) type!: string
  @Prop(String) position!: string
  @Prop(String) key!: string
  @Prop(Boolean) ad!: boolean
  @Prop(Boolean) ready!: boolean

  selected: any = ''
  options: any = []

  public getID(prefix: string, id: string) {
    return prefix + '_' + id
  }

  public showFilter(id: string, position: string) {
    // open the modal
    console.log('OPEN MODAL: ' + id)
    id = 'dfs_' + id
    this.$bvModal.show(id)
  }

  mounted() {
    // do we have the information to build the actual dropdown options?
    this.$nextTick(function () {
      // console.log('PUBS LENGTH: ' + this.pubs.length)
    })
  }

  public onOk() {
    // set the filter to the selected value by emitting it to the parent
    // alert(this.selected)
    let args: any = {}
    args.type = this.type
    args.key = this.key
    args.selected = this.selected
    EventBus.$emit('filterView', args)
  }

  public onShow() {
    // Needed?
    console.log('show event: ' + event)
  }

  public toggleSelection(item: any, event: any) {
    // toggle selection by checking if it is or is not selected and selecting/deselecting it accordingly.
    if (event.target.checked) {
      this.selected = item
    } else {
      this.selected = 'clear'
    }
    let args: any = {}
    args.type = this.type
    args.key = this.key
    args.selected = this.selected
    EventBus.$emit('filterView', args)
    let id = 'dfs_' + this.id
    this.$bvModal.hide(id)
  }
}
</script>

<style>
.filterdrop {
  min-width: 300px;
}
.filterModal > div {
  position: relative;
  top: 30px;
  left: 0;
}
</style>
