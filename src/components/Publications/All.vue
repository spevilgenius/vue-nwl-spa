<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <dynamic-table
          v-if="queryset"
          :user="currentUser"
          :table="{
            id: id,
            list: list,
            title: title,
            query: query,
            headerClass: headerClass,
            buttons: buttons,
            fields: fields,
            isLibrary: isLibrary,
            hasFolders: hasFolders,
            rowHeight: rowHeight,
            allowPaging: allowPaging,
            pageSize: pageSize,
            height: height,
            width: width
          }"
          :searchEnabled="true"
        ></dynamic-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../interfaces/User'
import DynamicTable from '../Custom/DynamicTable.vue'

const users = namespace('users')
const support = namespace('support')

@Component({
  name: 'All',
  components: {
    DynamicTable
  }
})
export default class All extends Vue {
  @users.State
  public currentUser!: UserInt

  @support.State
  public contentwidth!: number

  @support.State
  public contentheight!: number

  id!: 'Publications'
  list!: 'Publications'
  title!: 'All Publications'
  searchPlaceholder!: 'Type to search.'
  buttons: any = ['Edit, Export, Filter, Search, Print'] /* Add, Edit, Export, Filter, Search, Upload, Print */
  headerClass!: 'text-left bg-light-blue'
  fields: any = [
    { field: 'Actions', label: 'Actions', actions: ['View'], width: '80' },
    { field: 'filetype', label: 'DocId', type: 'extension', format: 'text', width: '40' },
    { field: 'docid', label: 'DocId', type: 'default', format: 'text', width: '120' },
    { field: 'title', label: 'Name', type: 'default', format: 'text' },
    { field: 'prefix', label: 'Prefix', type: 'default', format: 'text', width: '50' },
    { field: 'category', label: 'Category', type: 'default', format: 'text', width: '50' },
    { field: 'area', label: 'Mission Area', type: 'default', format: 'text', width: '50' },
    { field: 'location', label: 'Location', type: 'default', format: 'text', width: '50' }
    /* { field: 'Created', label: 'Created', type: 'default', format: 'date', dateformat: 'date-time' } */
  ]
  query!: string
  queryset?: boolean = false
  isLibrary?: boolean = true
  hasFolders?: boolean = true
  maximized?: boolean = true
  rowHeight!: 20
  allowPaging?: boolean = true
  pageSize!: 0
  height?: number
  width?: number

  mounted() {
    this.width = this.contentwidth
    this.height = this.contentheight - 165
    let url = "https://test.doctrine.navy.mil/_api/web/lists/getByTitle('Publications')/items?$select=*,Author/Title,File/Name,File/ServerRelativeUrl&$expand=Author,File,File/ListItemAllFields&$filter=(FSObjType ne 1)&$orderby=Title"
    this.query = url
    this.queryset = true
  }
}
</script>
