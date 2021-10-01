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
            items: filteredpubs,
            filterField: filterField,
            filterValue: filterValue,
            filterType: filterType,
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
import { concat } from 'lodash'

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
  filterField: any
  filterValue: any
  filterType: any
  interval!: any
  filteredpubs: Array<PublicationItem> = []
  Prfx: any
  viewReady?: boolean = false

  @users.State
  public currentUser!: UserInt

  @publication.State
  public allarchivepublications!: Array<PublicationItem>

  @publication.State
  public natoarchivepubsloaded!: boolean

  @publication.State
  public archivepubsloaded!: boolean

  @publication.State
  public allarchivepubsloaded!: boolean

  @publication.Action
  public getAllArchivePublications!: () => Promise<boolean>

  @publication.Action
  public getAllNatoArchivePublications!: () => Promise<boolean>

  @publication.Action
  public createAllArchivePubs!: () => Promise<boolean>

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
    EventBus.$on('viewItem', args => {
      this.viewPub(args)
    })
    EventBus.$on('editItem', args => {
      this.editPub(args)
    })
  }

  /** @method - lifecycle hook */

  mounted() {
    this.getAllNatoArchivePublications()
    this.getAllArchivePublications()
    this.interval = setInterval(this.waitForIt, 500)
  }

  public waitForIt() {
    if (this.archivepubsloaded && this.natoarchivepubsloaded) {
      clearInterval(this.interval)
      this.createAllArchivePubs()
      this.interval = setInterval(this.waitForPubs, 500)
    }
  }

  public waitForPubs() {
    if (this.allarchivepubsloaded) {
      clearInterval(this.interval)
      if (this.$route) {
        this.filterField = this.$route.query.Field
        this.filterValue = this.$route.query.Value
        this.filterType = this.$route.query.Type
        console.log('filterField=' + this.filterField)
        console.log('filterValue=' + this.filterValue)
        console.log('filterType=' + this.filterType)
        this.filteredpubs = this.allarchivepublications
        if (this.filterType === 'complex') {
          // filter pubs and send these pubs instead
          let fields: any = String(this.filterField)
          fields = fields.split(',')
          let vals: any = String(this.filterValue)
          vals = vals.split(',')
          let p = this.allarchivepublications
          for (let i = 0; i < fields.length; i++) {
            let field = fields[i]
            p = p.filter(search => Vue._.isEqual(search[fields[i]], vals[i]))
          }
          this.filteredpubs = p
        }

        this.viewReady = true
      }
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
