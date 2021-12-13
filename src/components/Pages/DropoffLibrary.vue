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
            query: query,
            headerClass: headerClass,
            buttons: buttons,
            fields: fields,
            isLibrary: isLibrary,
            hasFolders: hasFolders,
            hasRequiredFields: hasRequiredFields,
            permissionBase: permissionBase,
            permissionField: permissionField,
            hasRecipients: hasRecipients,
            recipientOptions: recipientOptions,
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

<script>
import User from '@/models/User'
import DynamicTable from '../Bootstrap/DynamicTable'

export default {
  components: { DynamicTable },
  name: 'droppoff-library',
  computed: {
    currentuser() {
      return User.getters('CurrentUser')
    },
    isAFRL() {
      return User.getters('isAFRL')
    },
    isMember() {
      return User.getters('isMember')
    },
    isSubcontractor() {
      return User.getters('isSubcontractor')
    }
  },
  data: function() {
    return {
      id: 1,
      list: 'DropoffLibrary' /* list name to get data for. Also used to create links for library files. */,
      currentUser: null,
      headerClass: 'text-left bg-light-blue',
      action: '',
      buttons: ['Upload'] /* Add, Edit, Export, Filter, Search, Upload, Print */,
      fields: [
        { field: 'Actions', label: 'Actions', actions: ['Delete'], width: '80' }, // actions the current user can perform. Based on a field or SharePoint permissions. Field permissions are controlled by FieldName and JSON object model
        { field: 'Name', label: 'Title', type: 'file', format: 'link', required: true, selected: '', url: '', rurl: '' },
        { field: 'Author', label: 'Uploaded By', type: 'user', format: 'text' },
        { field: 'Created', label: 'Uploaded', type: 'default', format: 'date', dateformat: 'date-time' }
      ],
      query: '',
      queryset: false,
      isLibrary: true,
      hasFolders: false,
      hasRequiredFields: true,
      permissionBase: 'Field' /* Field or SharePoint */,
      permissionField: 'Permissions' /* Used for field permissions. */,
      hasRecipients: true /* turns on recipient based permissions if true. Recipients are stored in a user column and permissions are stored in 'Permissions' column */,
      recipientOptions: [],
      maximized: true,
      rowHeight: 20,
      allowPaging: true,
      pageSize: 0,
      height: 0,
      width: 0
    }
  },
  mounted: function() {
    this.currentUser = this.currentuser
    if (this.isMember) {
      // PMO Team
      this.recipientOptions = []
      this.recipientOptions.push(
        { kind: 'Companies', title: 'Select individuals from companies', id: 'Companies', component: 'PeoplePicker', user: this.currentUser },
        { kind: 'Group', title: 'Select individuals from Workplan Managers', group: 'Workplan Managers', component: 'PeoplePicker', id: 'WorkplanManagers', user: this.currentUser },
        { kind: 'Group', title: 'Select individuals from AFRL', group: 'AFRL', component: 'PeoplePicker', id: 'AFRL', user: this.currentUser }
      )
    }
    if (this.isAFRL) {
      this.recipientOptions = []
      this.recipientOptions.push({ kind: 'Group', title: 'Workplan Managers', group: 'Workplan Managers', component: 'PeoplePicker', id: 'WorkplanManagers', user: this.currentUser })
    }
    if (this.isSubcontractor) {
      this.recipientOptions = []
      this.recipientOptions.push({ kind: 'Company', title: this.currentUser[0].Company, id: 'Company', component: 'PeoplePicker', user: this.currentUser }, { kind: 'Group', title: 'Workplan Managers', group: 'Workplan Managers', component: 'PeoplePicker', id: 'WorkplanManagers', user: this.currentUser })
    }
    let url =
      "https://infoplus.caci.com/sites/f3i2/_api/web/lists/getByTitle('DropoffLibrary')/items?$select=*,Author/Title,Author/EMail,Author/Id,File/Name,File/ServerRelativeUrl,Recipients/Id,Recipients/Title,Recipients/EMail&$expand=Author,File,Recipients&$filter=(Recipients/Id eq " +
      this.currentUser[0].id +
      ') or (Author/Id eq ' +
      this.currentUser[0].id +
      ')'
    this.query = url
    this.queryset = true
  }
}
</script>
