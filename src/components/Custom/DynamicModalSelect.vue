<template>
  <div>
    <b-modal :id="getID('dm', id)" :ref="getID('dm', id)" centered scrollable header-bg-variant="blue-500" header-text-variant="light" modal-class="zModal">
      <template v-slot:modal-title>{{ table.title }}</template>
      <b-container class="p-0">
        <b-row>
          <b-col cols="12">
            <b-form-group label="Filter" label-cols-sm="3" label-align-sm="right" label-size="sm" class="mb-0">
              <b-input-group size="sm">
                <b-form-input :id="getID('filter', id)" v-model="table.filter" type="search" placeholder="Search..."></b-form-input>
                <b-input-group-append>
                  <b-button :disabled="!table.filter" @click="table.filter = ''">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <b-table :id="getID('table', id)" :ref="getID('table', id)" :items="table.items" :fields="table.fields" :current-page="currentPage" :filter="table.filter" no-provider-paging="true" no-provider-filtering="true" no-provider-sorting="true" :per-page="perPage" show-empty small @filtered="onReltoFiltered">
              <template #cell(actions)="row">
                <b-form-checkbox v-model="row.item.selected" @input.native="toggleSelection(row.item, $event)"></b-form-checkbox>
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
    <b-form-group :label="table.label" :label-for="getID('txt', table.control)">
      <b-input-group>
        <b-form-input :id="getID('txt', table.control)" :ref="getID('txt', table.control)" size="sm" class="form-control" v-model="table.value"></b-form-input>
        <template #append>
          <b-button variant="blue-700" @click="onSearch(id)">
            <font-awesome-icon fas icon="search" class="icon txt-light"></font-awesome-icon>
          </b-button>
        </template>
      </b-input-group>
    </b-form-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'dynamic-modal-select',
  props: {
    id: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    table: {
      type: Object,
      default: () => {
        return {
          items: [],
          filter: '',
          fields: [],
          control: '',
          value: '',
          label: '',
          title: 'Select'
        }
      }
    }
  }
})
export default class DynamicModalSelect extends Vue {
  // used to select options with multiple checkboxes
  // uses bootstrap-vue components
  currentPage = 1
  totalRows = 0
  perPage = 30 // default
  workingval = []

  public getID(prefix: string, id: string) {
    return prefix + '_' + id
  }

  public onSearch(id: string) {
    // open the modal
    console.log('OPEN MODAL: ' + id)
    id = 'dm_' + id
    this.$bvModal.show(id)
  }
}
</script>

<style></style>
