<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-modal id="FileModal" ref="FileModal" centered hide-footer header-bg-variant="light-blue" size="lg" header-text-variant="light" @show="resetModal">
      <template v-slot:modal-title>Upload File</template>
      <b-container fluid class="p-0">
        <b-row class="m-0">
          <b-col cols="12" class="p-0">
            <b-form-group label="NOTICE">
              <b-form-textarea id="textarea_notice" v-html="notice" rows="3" disabled class="text-dark" style="resize: none;"></b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>
      <b-container v-if="table.hasRequiredFields" fluid class="p-0">
        <b-row class="m-0" v-for="field in table.fields" :key="field" :style="showIfRequired(field)">
          <b-col cols="12" class="p-0">
            <b-form-group :label="field.label">
              <b-form-file v-if="field.type == 'file'" placeholder="Choose a file" no-drop class="form-control" v-model="field.selected" :id="'required_' + field.field" @input="fileSelected(field)" :state="!Invalid" :ref="field.field"></b-form-file>
              <b-form-select v-if="field.type == 'lookup'" class="form-control" :options="field.options" v-model="field.selected" :id="'required_' + field.field" :state="field.selected !== ''" :ref="field.field"></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>
      <b-container v-if="table.hasRecipients" fluid class="p-0">
        <div v-for="(option, index) in table.recipientOptions" :key="index">
          <keep-alive>
            <component :key="option.id" :is="option.component" v-bind="option"></component>
          </keep-alive>
        </div>
      </b-container>
      <b-container fluid class="p-0">
        <b-row class="m-0">
          <b-col cols="4" class="p-0">
            <b-alert v-if="Invalid" variant="danger" show class="p-0">{{ InvalidMessage }}</b-alert>
          </b-col>
          <b-col cols="4" class="p-0"></b-col>
          <b-col cols="4" class="p-0 text-right">
            <b-button v-if="isUploading" variant="success"><b-spinner variant="danger" class="loading-spinner"></b-spinner>&nbsp;Uploading...</b-button>
            <b-button variant="light-blue" @click.stop="UploadFile" title="Upload"><font-awesome-icon far icon="file-upload" class="icon"></font-awesome-icon>Upload</b-button>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="contentHeight m-0 p-0">
          <b-row no-gutters class="contentHeight">
            <!-- <b-overlay :show="loaded == false" :variant="overlayVariant" z-index="3000">
              <b-container fluid class="contentHeight m-0 p-0">
                <b-row no-gutters :class="table.headerClass" class="dt-button-row">
                  <b-col cols="6" class="m-0 p-0" v-if="table.buttons.length > 0">
                    <span v-for="button in table.buttons" :key="button">
                      <b-button v-if="button == 'Upload'" v-b-modal.FileModal variant="light-blue"><font-awesome-icon fas icon="upload" class="icon"></font-awesome-icon>&nbsp;Upload</b-button>
                    </span>
                  </b-col>
                  <b-col cols="6" v-if="searchEnabled" class="pr-3">
                    <b-form @submit="onSubmit">
                      <b-input-group v-on:submit.native.prevent class="w-50 float-right">
                        <b-form-input v-on:submit.native.prevent size="small" v-model="search" placeholder="Search ..." @keyup.native="filtering"></b-form-input>
                        <b-input-group-append>
                          <b-button v-on:submit.native.prevent size="small" variant="primary" @click="searchFiltering($event)"><font-awesome-icon fas icon="search"></font-awesome-icon></b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form>
                  </b-col>
                </b-row>
                <b-row no-gutters class="table-row">
                  <b-overlay :show="noitems" :opacity="100" :variant="overlayVariant" z-index="3000">
                    <b-table-simple :id="getID('DynamicTable', table.id)" :ref="getID('DynamicTable', table.id)" table-variant="light" table-class="table-full" :bordered="bordered" :hover="hover">
                      <b-thead>
                        <b-tr>
                          <b-th v-for="field in table.fields" :key="field" :style="getStyle('th', field)">{{ field.label }}</b-th>
                        </b-tr>
                      </b-thead>
                      <b-tbody :id="getID('DynamicTableBody', table.id)">
                        <b-tr v-for="item in items" :key="item" :style="getStyle('tr', null)">
                          <b-td v-for="field in table.fields" :key="field" class="text-black">
                            <span v-if="field.field === 'Actions'" :id="field.field + '_' + item.id" :ref="field.field + '_' + item.id">
                              <component v-for="comp in item.renderItems" :key="comp.id" :is="comp.component" v-bind="comp.props"></component>
                            </span>
                            <span v-else :id="field.field + '_' + item.id" :ref="field.field + '_' + item.id"></span>
                          </b-td>
                        </b-tr>
                      </b-tbody>
                    </b-table-simple>
                    <template #overlay>
                      <div class="text-center">
                        <p id="busy-label">No Items Found ...</p>
                      </div>
                    </template>
                  </b-overlay>
                </b-row>
              </b-container>
              <template #overlay>
                <div class="text-center">
                  <p id="busy-label">{{ overlayText }}</p>
                </div>
              </template>
            </b-overlay> -->
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
/* import axios from 'axios'
import { EventBus } from '../../main' */

declare const _spPageContextInfo: any

@Component({
  name: 'dynamic-table'
})
export default class DynamicTable extends Vue {
  public notice!: 'Hello'
  @Prop({ default: false }) readonly hascomponents!: boolean
  @Prop() readonly user!: object
  @Prop({ default: false }) readonly searchEnabled!: boolean
  @Prop({
    default: () => {
      return {
        id: '',
        title: '' /* Header Title and Table Title */,
        list: '' /* list name to get data for */,
        items: [],
        action: '',
        headerClass: 'text-center bg-warning',
        buttons: ['Add', 'Edit', 'Export', 'Filter', 'Search', 'Upload'] /* Add, Edit, Export, Filter, Search, Upload */,
        fields: [],
        query: '' /* pass custom query. */,
        isLibrary: false,
        hasFolders: false,
        folderField: '',
        rowHeight: 20,
        pageSize: 0 /* 0 default means dynamic based on space available and rowHeight */,
        height: 0 /* 0 for dynamic */,
        width: 0 /* 0 for dynamic */
      }
    }
  })
  readonly table!: object

  get hasComponents() {
    return this.hascomponents === true
  }

  isAuthor!: false
  overlayText!: 'Loading. Please Wait...'
  overlayVariant!: 'success'
  items!: []
  filtereditems!: []
  shownData!: []
  loading!: true
  loaded!: false
  striped!: true
  bordered!: true
  outlined!: true
  small!: true
  hover!: true
  dark!: false
  fixed!: false
  isUploading!: false
  fileName!: null
  fileBuffer!: null
  search!: ''
}
</script>
