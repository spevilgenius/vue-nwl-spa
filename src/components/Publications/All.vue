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

@Component({
  name: 'All',
  components: {
    DynamicTable
  }
})
export default class All extends Vue {
  @users.State
  public currentUser!: UserInt

  id!: 'Publications'
  list!: 'Publications'
  title!: 'All Publications'
  searchPlaceholder!: 'Type to search.'
  buttons: any = ['Edit, Export, Filter, Search, Print'] /* Add, Edit, Export, Filter, Search, Upload, Print */
  headerClass!: 'text-left bg-light-blue'
  fields: any = [
    { field: 'Actions', label: 'Actions', actions: ['Delete'], width: '80' },
    { field: 'Name', label: 'Title', type: 'file', format: 'link', required: true, selected: '', url: '', rurl: '' },
    { field: 'Author', label: 'Author', type: 'user', format: 'text' },
    { field: 'Created', label: 'Created', type: 'default', format: 'date', dateformat: 'date-time' }
  ]
  query!: string
  queryset?: boolean = false
  isLibrary?: boolean = true
  hasFolders?: boolean = true
  maximized?: boolean = true
  rowHeight!: 20
  allowPaging?: boolean = true
  pageSize!: 0
  height!: 0
  width!: 0

  mounted() {
    let url = "https://test.doctrine.navy.mil/_api/web/lists/getByTitle('Publications')/items?$select=*,Author/Title,File/Name,File/ServerRelativeUrl&$expand=Author,File,File/ListItemAllFields&$filter=(FSObjType ne 1)&$orderby=Title"
    this.query = url
    this.queryset = true
  }
}
</script>
