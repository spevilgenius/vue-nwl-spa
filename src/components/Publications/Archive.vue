<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <dynamic-table
          v-if="allpubsloaded"
          :user="currentUser"
          :table="{
            id: tblId,
            primaryKey: primaryKey,
            buttons: buttons,
            fields: fields,
            items: allpublications,
            filterField: filterField,
            filterOn: 'Archived Documents',
            filter: 'Archived Documents',
            overlayText: overlayText,
            overlayVariant: overlayVariant
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
import { PublicationItem } from '../../interfaces/PublicationItem'
import DynamicTable from '../Custom/DynamicTable2.vue'
import { EventBus } from '../../main'

const users = namespace('users')
const publication = namespace('publication')

@Component({
  name: 'Archive',
  components: {
    DynamicTable
  }
})
export default class Archive extends Vue {
  tblId = 'ArchivePubs'
  primaryKey = 'docid'
  overlayText = 'Getting Publications. Please wait...'
  overlayVariant = 'danger'
  rowHeight = 0
  pageSize = 20

  @users.State
  public currentUser!: UserInt

  @publication.State
  public allpublications!: Array<PublicationItem>

  @publication.State
  public allpubsloaded!: boolean

  fields: any = [
    { key: 'actions', label: 'Actions', actions: ['View', 'Edit'], thClass: 'tbl-dynamic-header', id: 0 },
    { key: 'Branch', label: 'Branch', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px100', id: 20 },
    { key: 'Prfx', label: 'Prefix', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px100', id: 1 },
    { key: 'PubID', label: 'PubID', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px100', id: 2 },
    { key: 'Title', label: 'Title', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', id: 3 },
    { key: 'Bookshelf', label: 'Bookshelf', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px300', id: 11 },
    { key: 'Resourced', label: 'Resourced', sortable: false, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px120', id: 6 },
    { key: 'AdditionalData.PRAAbbrev', label: 'PRAAbbrev', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px150', id: 12 },
    { key: 'Class', label: 'Classification', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px200', id: 10 }
  ]

  created() {
    EventBus.$on('viewItem', id => {
      this.viewPub(id)
    })
    EventBus.$on('editItem', id => {
      this.editPub(id)
    })
  }

  /** @method - lifecycle hook */

  viewPub(id: string) {
    this.$router.push({ name: 'View Publication', query: { Id: id }, params: { Id: id } })
  }
  editPub(id: string) {
    this.$router.push({ name: 'Edit Publication', query: { Id: id }, params: { Id: id } })
  }
}
</script>
