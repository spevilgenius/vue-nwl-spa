script<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-modal id="ArchiveModal" size="lg" centered header-bg-variant="blue-500" header-text-variant="light" modal-class="zModal" @ok="onOk()" @show="onShow()">
      <template v-slot:modal-title>Archive Publication</template>
      <b-container class="p-0">
        <b-form>
          <b-row no-gutters>
            <b-col cols="4">
              <b-form-group label="Archive Type">
                <b-form-select class="form-control" v-model="archive.type" size="sm" id="ddArchive" :options="archives" ref="Archive" @change="onArchiveSelected"></b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="superceded" no-gutters>
            <b-col cols="12">
              <dynamic-modal-select id="dmsSuperceded" v-model="supercededby" :items="allpublications" :fields="pubsfields" :filter="pubsfilter" title="Select Superceding Publication" label="Superceded By"></dynamic-modal-select>
            </b-col>
          </b-row>
        </b-form>
      </b-container>
    </b-modal>
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <dynamic-table
          v-if="viewReady"
          :user="currentUser"
          :ready="true"
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
import DynamicModalSelect from '../Custom/DynamicModalSelect.vue'
import { EventBus } from '../../main'

const users = namespace('users')
const publication = namespace('publication')

@Component({
  name: 'All',
  components: {
    DynamicTable,
    DynamicModalSelect
  }
})
export default class FiscalYearReport extends Vue {
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
  pubs: Array<PublicationItem> = []
  Prfx: any
  viewReady?: boolean = false
  archive: any = {
    type: '',
    id: 0,
    nato: ''
  }
  superceded?: boolean = false
  supercededby = null
  pubsfilter = ''

  pubsfields = [
    { key: 'actions', label: 'Select' },
    { key: 'Title', label: 'Title', sortable: true }
  ]

  archives = [
    { value: 'Please Select...', text: 'Please Select...' },
    { value: 'Rescinded', text: 'Rescinded' },
    { value: 'Cancelled', text: 'Cancelled' },
    { value: 'Superceded', text: 'Superceded' }
  ]

  @users.State
  public currentUser!: UserInt

  @publication.State
  public allpublications!: Array<PublicationItem>

  @publication.State
  public alldevpublications!: Array<PublicationItem>

  @publication.State
  public natopubsloaded!: boolean

  @publication.State
  public pubsloaded!: boolean

  @publication.State
  public devpubsloaded!: boolean

  @publication.State
  public allpubsloaded!: boolean

  @publication.Action
  public setPubLoaded!: (loaded: boolean) => void

  @publication.Action
  public getAllPublications!: () => Promise<boolean>

  @publication.Action
  public getAllNatoPublications!: () => Promise<boolean>

  @publication.Action
  public getAllDevPublications!: () => Promise<boolean>

  @publication.Action
  public getAllNatoDevPublications!: () => Promise<boolean>

  @publication.Action
  public createAllPubs!: () => Promise<boolean>

  @publication.Action
  public createAllDevPubs!: () => Promise<boolean>

  /* fields: any = [
    { key: 'actions', label: 'Actions', actions: ['View', 'Edit'], thClass: 'tbl-dynamic-header', tdClass: 'px80', id: 0 },
    { key: 'Branch', label: 'Branch', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px100', id: 20 },
    { key: 'Prfx', label: 'Prefix', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px100', id: 1 },
    { key: 'PubID', label: 'PubID', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px100', id: 2 },
    { key: 'Title', label: 'Title', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', id: 3 },
    { key: 'Bookshelf', label: 'Bookshelf', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px300', id: 11 },
    { key: 'Resourced', label: 'Resourced', sortable: false, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px120', id: 6 },
    { key: 'AdditionalData.PRAAbbrev', label: 'PRAAbbrev', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px150', id: 12 },
    { key: 'Class', label: 'Classification', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px200', id: 10 }
  ] */

  fields: any = [
    { key: 'actions', field: 'actions', label: 'Actions', actions: ['View', 'Edit'], thClass: 'tbl-dynamic-header', tdClass: 'px80', id: 0, model: '', ops: [] },
    { key: 'AdditionalData.LastPublished', field: 'LastPublished', label: 'Date of Last Publish', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px120', id: 1, model: '', ops: [] },
    { key: 'LongTitle', field: 'LongTitle', label: 'Long Title', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px200', id: 2, model: '', ops: [] },
    { key: 'Prfx', field: 'Prfx', label: 'Prefix', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px100', id: 3, model: '', ops: [] },
    { key: 'PubID', field: 'PubID', label: 'PubID', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px90', id: 4, model: '', ops: [] },
    { key: 'AdditionalData.Edition', field: 'Edition', label: 'Edition', sortable: true, type: 'AD', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px110', id: 5, model: '', ops: [] },
    {
      key: 'Name',
      field: 'Name',
      label: 'Name',
      sortable: true,
      type: 'default',
      format: 'text',
      thClass: 'tbl-dynamic-header',
      tdClass: 'px200',
      id: 6,
      model: '',
      ops: []
    } /*     { key: 'Resourced', field: 'Resourced', label: 'Resourced', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px130', id: 9, model: '', ops: [] },
    { key: 'DTIC', field: 'DTIC', label: 'DTIC', sortable: true, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px120', id: 10, model: '', ops: [] },
    { key: 'AdditionalData.GeneralStatus', field: 'GeneralStatus', label: 'GeneralStatus', sortable: true, type: 'AD', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px140', id: 11, model: '', ops: [] },
    { key: 'NWDCAO.Title', field: 'Title', label: 'NWDC AO', sortable: true, type: 'NWDCAO', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px150', id: 12, model: '', ops: [] },*/ /* { key: 'Remarks', label: 'Remarks', sortable: false, type: 'default', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px120', id: 8, model: '', ops: [] }, */,
    /*     { key: 'AdditionalData.PRAAbbrev', field: 'PRAAbbrev', label: 'PRAAbbrev', sortable: true, type: 'AD', format: 'text', thClass: 'tbl-dynamic-header', tdClass: 'px150', id: 7, model: '', ops: [] },
     */ {
      key: 'Class',
      field: 'Classification',
      label: 'Classification',
      sortable: true,
      type: 'default',
      format: 'text',
      thClass: 'tbl-dynamic-header',
      tdClass: 'px200',
      id: 13,
      model: '',
      ops: []
    }
  ]

  created() {
    EventBus.$on('viewItem', args => {
      this.setPubLoaded(false)
      this.viewPub(args)
    })
    EventBus.$on('editItem', args => {
      this.setPubLoaded(false)
      this.editPub(args)
    })
    EventBus.$on('archiveItem', args => {
      this.archivePub(args)
    })
    /* EventBus.$on('filterView', args => {
      this.filterView(args)
    }) */
  }

  /** @method - lifecycle hook */
  mounted() {
    this.setPubLoaded(false)
    this.getAllNatoPublications()
    this.getAllPublications()
    this.getAllDevPublications()
    this.interval = setInterval(this.waitForIt, 500)
  }

  public waitForIt() {
    if (this.pubsloaded && this.natopubsloaded) {
      clearInterval(this.interval)
      this.createAllPubs()
      this.createAllDevPubs()
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
        this.filteredpubs = this.allpublications
        // #region filters

        /* if (this.filterType === 'TTP') {
          let a = this.allpublications
          let b = this.allpublications
          a = a.filter(search => Vue._.isEqual(search['Prfx'], 'TACBUL'))
          b = b.filter(search => Vue._.isEqual(search['Prfx'], 'TACMEMO'))
          a = a.concat(b)
          a = a.sort((c, d) => (c.AdditionalData.FunctionalSeries > d.AdditionalData.FunctionalSeries ? 1 : c.AdditionalData.FunctionalSeries === d.AdditionalData.FunctionalSeries ? (c.Title > d.Title ? 1 : -1) : -1))
          this.filteredpubs = a
        }
        if (this.filterType === 'Development') {
          let a = this.alldevpublications
          this.filteredpubs = a
        } */
        // #endregion
        this.buildFilters()
        // this.viewReady = true
      }
    }
  }

  buildFilters() {
    // build the filters for all of the fields except actions
    for (let j = 1; j < this.fields.length; j++) {
      let p: any = []
      for (let i = 0; i < this.filteredpubs.length; i++) {
        // get the current value in this iteration based on the field. Then test if it is already in the array and add it if not
        let val = ''
        let pub: PublicationItem = this.filteredpubs[i]
        if (this.fields[j].type === 'AD') {
          try {
            let fld = String(this.fields[j].field)
            val = this.filteredpubs[i]['AdditionalData'][fld]
          } catch (e) {
            console.log(e)
          }
        }
        if (this.fields[j].type === 'NWDCAO') {
          if (this.filteredpubs[i] !== null) {
            let ao: any = pub.NWDCAO
            let t: any = ao.Title
            val = t
          }
        }
        if (this.fields[j].type === 'default') {
          val = this.filteredpubs[i][this.fields[j].field]
        }
        if (p.indexOf(val) < 0) {
          p.push(val)
        }
      }
      // sort vals. TODO: build a more comprehensive sort if needed
      p.sort()
      this.fields[j].ops = p
    }
    this.viewReady = true
  }

  /* filterView(args: any) {
    console.log('FILTERVIEW: ' + args.selected)
    let a = this.allpublications
    this.filterField = args.key
    if (args.selected === 'clear') {
      this.filteredpubs = this.allpublications
    } else {
      this.filterValue = args.selected
    }
    a = a.filter(search => Vue._.isEqual(search[args.key], args.selected))
    this.filteredpubs = a
  } */

  viewPub(args: any) {
    this.$router.push({ name: 'View Publication', query: { Id: args.id, Nato: args.nato } })
  }

  editPub(args: any) {
    this.$router.push({ name: 'Edit Publication', query: { Id: args.id, Nato: args.nato } })
  }

  archivePub(args: any) {
    // console.log('Archive Pub')
    this.archive.id = args.id
    this.archive.nato = args.nato
    this.$bvModal.show('ArchiveModal')
  }

  onArchiveSelected() {
    if (this.archive.type === 'Superceded') {
      this.superceded = true
    }
  }

  onOk() {
    console.log('Publication selected for archive: ' + this.archive.type + ', id: ' + this.archive.id)
    // Based on the selected type of archive move or copy document to archived pub library.
    const that = this
    switch (this.archive.type) {
      case 'Cancelled':
        // copy to archive library setting general status to obsolete and status to cancelled. Then delete this document.
        break

      case 'Rescinded':
        // copy to archive library setting general status to obsolete and status to rescinded. Then delete this document.
        break

      case 'Superceded':
        // copy to archive library setting general status to obsolete, status to rescinded, and SupercededBy to the selected document. Then delete this document.
        break
    }
  }

  onShow() {
    console.log('Showing modal')
  }
}

// TODO - Make a function that categorizes LastPublished dates into fiscal years and quarters to filter by with a drop-down selection
/* function getQuarter(d) {
  d = d || new Date()
  var m = Math.floor(d.getMonth() / 3) + 2
  m -= m > 4 ? 4 : 0
  var y = d.getFullYear() + (m == 1 ? 1 : 0)
  return [y, m]
} */

/* if (typeof obj === 'object' && obj !== null) {
  Object.keys(obj).forEach(key => {
    console.log('\n' + key + ': ' + obj[key])
  })
}
// *** Explanation line by line ***
// It checks if obj is neither null nor undefined, which means it's safe to get its keys.
// Otherwise it will give you a "TypeError: Cannot convert undefined or null to object" if obj is null or undefined.
// NOTE 1: You can use Object.hasOwnProperty() instead of Object.keys(obj).length
// NOTE 2: No need to check if obj is an array because it will work just fine.
// NOTE 3: No need to check if obj is a string because it will not pass the if typeof obj is Object statement.
// NOTE 4: No need to check if Obj is undefined because it will not pass the if type obj is Object statement either.
if (typeof obj === 'object' && obj !== null) {
  // Explaining the below line
  // Just like in the previous line, this returns an array with
  // all keys in obj (because if code execution got here, it means
  // obj has keys.)
  // Then just invoke built-in javascript forEach() to loop
  // over each key in returned array and calls a call back function
  // on each array element (key), using ES6 arrow function (=>)
  // Or you can just use a normal function ((key) { blah blah }).
  Object.keys(obj).forEach(key => {
    // The bellow line prints out all keys with their
    // respective value in obj.
    // key comes from the returned array in Object.keys(obj)
    // obj[key] returns the value of key in obj
    console.log('\n' + key + ': ' + obj[key])
  })
} */
</script>
