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
  filterType: any
  interval!: any
  filteredpubs: Array<PublicationItem> = []
  Prfx: any
  viewReady?: boolean = false

  @users.State
  public currentUser!: UserInt

  @publication.State
  public allpublications!: Array<PublicationItem>

  @publication.State
  public natopubsloaded!: boolean

  @publication.State
  public pubsloaded!: boolean

  @publication.State
  public allpubsloaded!: boolean

  @publication.Action
  public getAllPublications!: () => Promise<boolean>

  @publication.Action
  public getAllNatoPublications!: () => Promise<boolean>

  @publication.Action
  public createAllPubs!: () => Promise<boolean>

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
    this.getAllNatoPublications()
    this.getAllPublications()
    this.interval = setInterval(this.waitForIt, 500)
  }

  public waitForIt() {
    if (this.pubsloaded && this.natopubsloaded) {
      clearInterval(this.interval)
      this.createAllPubs()
      this.interval = setInterval(this.waitForPubs, 500)
    }
  }

  public waitForPubs() {
    if (this.allpubsloaded) {
      clearInterval(this.interval)
      if (this.$route) {
        this.filterField = this.$route.query.Field
        this.filterValue = this.$route.query.Value
        this.filterType = this.$route.query.Type
        console.log('filterField=' + this.filterField)
        console.log('filterValue=' + this.filterValue)
        console.log('filterType=' + this.filterType)
        this.filteredpubs = this.allpublications
        if (this.filterType === 'complex') {
          // filter pubs and send these pubs instead
          let fields: any = String(this.filterField)
          fields = fields.split(',')
          let vals: any = String(this.filterValue)
          vals = vals.split(',')
          let p = this.allpublications
          for (let i = 0; i < fields.length; i++) {
            let field = fields[i]
            p = p.filter(search => Vue._.isEqual(search[fields[i]], vals[i]))
          }
          this.filteredpubs = p
        }
        if (this.filterType === 'NWP105') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 1-05 Religious Ministry Support')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP110') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 1-10 Tactical Reference')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP111') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 1-11 Platform Capabilities')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP114') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 1-14 Law')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP200') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 2-0 Navy Intelligence')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP201') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 2-01 Intelligence Support')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP301') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-01 Air Defense')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP302') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-02 Amphibious Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP305') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-05 Naval Special Warfare')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP307') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-07 Military Operations Other Than War')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP309') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-09 Strike And Fire Support')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP310') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-10 Expeditionary Warfare')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP311') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-11 Nuclear, Biological, Chemical Defense')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP312') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-12 Cyberspace Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP313') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-13 Information Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP315') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-15 Mine Warfare')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP320') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-20 Surface Warfare')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP321') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-21 Undersea Warfare')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP322') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-22 Naval Aviation Warfare')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP329') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-29 Disaster Response Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP330') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-30 Naval Command And Control Of Air Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP332') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-32 Command And Control For Joint Maritime Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP356') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-56 Operational Command/Control')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP358') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-58 Military Deception')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP359') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-59 Oceanography')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP360') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-60 Targeting')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP361') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-61 Public Affairs')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP362') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-62 Seabasing')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP363') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-63 Computer Network Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP372') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 3-72 Nuclear Operations')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP400') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-00 Undersea Warfare')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP401') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-01 Transportation')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP402') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-02 Health Protection')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP404') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-04 Naval Engineering')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP408') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-08 Supply')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP409') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-09 Other Logistic Services')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP410') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-10 Conventional Ordnance')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP411') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-11 Environmental')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP412') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 4-12 Salvage')
          this.filteredpubs = a
        }
        if (this.filterType === 'NWP501') {
          let a = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'NWP'))
          a = a.filter(d => d.AdditionalData.FunctionalField === 'Navy 5-01 Operational Planning')
          this.filteredpubs = a
        }
        if (this.filterType === 'TTP') {
          let a = this.allpublications
          let b = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'TACBUL'))
          b = b.filter(search => Vue._.isEqual(search['Prfx'], 'TACMEMO'))
          a = a.concat(b)
          a = a.sort((c, d) => (c.AdditionalData.FunctionalSeries > d.AdditionalData.FunctionalSeries ? 1 : c.AdditionalData.FunctionalSeries === d.AdditionalData.FunctionalSeries ? (c.Title > d.Title ? 1 : -1) : -1))
          this.filteredpubs = a
        }
        this.viewReady = true
      }
    }
  }

  viewPub(args: any) {
    this.$router.push({ name: 'View Publication', params: { Id: args.id, Nato: args.nato } })
  }
  editPub(args: any) {
    this.$router.push({ name: 'Edit Publication', params: { Id: args.id, Nato: args.nato } })
  }
}
</script>
