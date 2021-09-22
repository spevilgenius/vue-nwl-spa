<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <dynamic-table
          v-if="viewReady"
          :user="currentUser"
          :table="{
            id: tblId,
            primaryKey: primaryKey,
            buttons: buttons,
            fields: fields,
            items: allpublications,
            filterField: filterField,
            filterValue: filterValue,
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
  name: 'All',
  components: {
    DynamicTable
  }
})
export default class All extends Vue {
  tblId = 'AllPubs'
  primaryKey = 'docid'
  overlayText = 'Getting Publications. Please wait...'
  overlayVariant = 'danger'
  rowHeight = 0
  pageSize = 20
  filterField: any
  filterValue: any
  interval!: any
  viewReady?: boolean = false

  @users.State
  public currentUser!: UserInt

  @publication.State
  public allpublications!: Array<PublicationItem>

  @publication.State
  public allpubsloaded!: boolean

  /* fields: any = [
    { key: 'actions', label: 'Actions', actions: ['View', 'Edit'], tdClass: 'px60 text-nowrap', id: 0 },
    { key: 'Branch', label: 'Branch', sortable: true, type: 'default', format: 'text', tdClass: 'px100 text-nowrap', id: 20 },
    { key: 'Prfx', label: 'Prefix', sortable: true, type: 'default', format: 'text', tdClass: 'px70 text-nowrap', id: 1 },
    { key: 'PubID', label: 'PubID', sortable: true, type: 'default', format: 'text', tdClass: 'px150 text-nowrap', id: 2 },
    { key: 'Title', label: 'Title', sortable: true, type: 'default', format: 'text', tdClass: 'px500 text-nowrap', id: 3 },
    { key: 'Bookshelf', label: 'Bookshelf', sortable: true, type: 'default', format: 'text', tdClass: 'px150 text-nowrap', id: 11 },
    { key: 'Resourced', label: 'Resourced', sortable: false, type: 'default', format: 'text', tdClass: 'px80 text-nowrap', id: 6 },
    { key: 'AdditionalData.PRAAbbrev', label: 'PRAAbbrev', sortable: true, type: 'default', format: 'text', tdClass: 'px100 text-nowrap', id: 12 },
    { key: 'Class', label: 'Classification', sortable: true, type: 'default', format: 'text', tdClass: 'px150 text-nowrap', id: 10 }
  ] */

  fields: any = [
    { key: 'actions', label: 'Actions', actions: ['View', 'Edit'], id: 0 },
    { key: 'Branch', label: 'Branch', sortable: true, type: 'default', format: 'text', id: 20 },
    { key: 'Prfx', label: 'Prefix', sortable: true, type: 'default', format: 'text', id: 1 },
    { key: 'PubID', label: 'PubID', sortable: true, type: 'default', format: 'text', id: 2 },
    { key: 'Title', label: 'Title', sortable: true, type: 'default', format: 'text', id: 3 },
    { key: 'Bookshelf', label: 'Bookshelf', sortable: true, type: 'default', format: 'text', id: 11 },
    { key: 'Resourced', label: 'Resourced', sortable: false, type: 'default', format: 'text', id: 6 },
    { key: 'AdditionalData.PRAAbbrev', label: 'PRAAbbrev', sortable: true, type: 'default', format: 'text', id: 12 },
    { key: 'Class', label: 'Classification', sortable: true, type: 'default', format: 'text', id: 10 },
    { key: 'AdditionalData.FunctionalSeries', label: 'Functional Series', sortable: true, type: 'default', format: 'text', id: 10 }
  ]

  created() {
    EventBus.$on('viewItem', args => {
      this.viewPub(args)
    })
    EventBus.$on('editItem', args => {
      this.editPub(args)
    })
  }

  /** @method - lifecycle hook */

  mounted() {
    if (this.$route) {
      console.log('filterField=' + this.filterField)
      console.log('filterValue=' + this.filterValue)
      this.filterField = this.$route.query.Field
      this.filterValue = this.$route.query.Value
      this.interval = setInterval(this.waitForIt, 500)
    }
  }

  public waitForIt() {
    if (this.filterField !== '' || (null && this.filterValue !== '') || null) {
      clearInterval(this.interval)
      this.viewReady = true
      console.log('filterField2=' + this.filterField)
      console.log('filterValue2=' + this.filterValue)
    }
  }

  viewPub(args: any) {
    this.$router.push({ name: 'View Publication', query: { Id: args.id, Nato: args.nato }, params: { Id: args.id } })
  }
  editPub(args: any) {
    this.$router.push({ name: 'Edit Publication', query: { Id: args.id, Nato: args.nato }, params: { Id: args.id } })
  }
}
</script>
