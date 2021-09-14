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
            filterField: 'Branch',
            filterValue: 'Allied',
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
import { PublicationItem } from '../../interfaces/PublicationItem'
import DynamicTable from '../Custom/DynamicTable2.vue'
import { EventBus } from '../../main'
import { UserInt } from '../../interfaces/User'

const users = namespace('users')
const publication = namespace('publication')

@Component({
  name: 'Allied',
  components: {
    DynamicTable
  }
})
export default class Allied extends Vue {
  tblId = 'AlliedPubs'
  primaryKey = 'docid'
  overlayText = 'Getting Publications. Please wait...'
  overlayVariant = 'danger'
  rowHeight = 0
  pageSize = 20

  @users.State
  public currentUser!: UserInt

  @publication.State
  public allpubsloaded!: boolean

  @publication.State
  public allpublications!: Array<PublicationItem>

  fields: any = [
    { key: 'actions', label: 'Actions', actions: ['View', 'Edit'], tdClass: 'px60 text-nowrap', id: 0 },
    { key: 'Prfx', label: 'Prefix', type: 'default', format: 'text', tdClass: 'px70 text-nowrap', id: 1 },
    { key: 'Branch', label: 'Branch', type: 'default', format: 'text', tdClass: 'px100 text-nowrap', id: 15 },
    { key: 'PubID', label: 'PubID', type: 'default', format: 'text', tdClass: 'px150 text-nowrap', id: 2 },
    /* { key: 'Name', label: 'Name', type: 'default', format: 'text', tdClass: 'px200', id: 3 }, */
    { key: 'Title', label: 'Title', type: 'default', format: 'text', tdClass: 'px500 text-nowrap', id: 3 },
    /* { key: 'Name', label: 'Name', type: 'default', format: 'text', id: 3 }, */
    { key: 'AdditionalData.Status', label: 'Status', type: 'default', format: 'text', tdClass: 'px100 text-nowrap', id: 4 },
    { key: 'Modified', label: 'Modified', type: 'default', format: 'text', tdClass: 'px80 text-nowrap', id: 5 },
    { key: 'Resourced', label: 'Resourced', type: 'default', format: 'text', tdClass: 'px80 text-nowrap', id: 6 },
    { key: 'DTIC', label: 'DTIC', type: 'default', format: 'text', tdClass: 'px200 text-nowrap', id: 7 },
    /* { key: 'Status', label: 'Status', type: 'default', format: 'text', tdClass: 'px100 text-nowrap', id: 8 }, */
    /* { key: 'NWDCAO.Title', label: 'NWDCAO', type: 'default', format: 'text', tdClass: 'px200 text-nowrap', id: 9 }, */
    { key: 'Class', label: 'Classification', type: 'default', format: 'text', tdClass: 'px150 text-nowrap', id: 10 }
  ]

  created() {
    EventBus.$on('viewItem', id => {
      this.viewPub(id)
    })
    EventBus.$on('editItem', id => {
      this.editPub(id)
    })
  }

  viewPub(id: string) {
    this.$router.push({ name: 'View Publication', query: { Id: id }, params: { Id: id } })
  }
  editPub(id: string) {
    this.$router.push({ name: 'Edit Publication', query: { Id: id }, params: { Id: id } })
  }
}
</script>
