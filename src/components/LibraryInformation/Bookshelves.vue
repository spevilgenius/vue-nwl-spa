<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-overlay :show="!viewReady" :variant="overlayVariant" class="contentHeight">
          <b-container fluid class="contentHeight">
            <b-card no-body>
              <b-row class="p-3" v-if="groupeditems.length > 1">
                <div class="accordion m-1" role="tablist" :style="getStyle('shelfaccordion', null)">
                  <b-card no-body class="m-1" v-for="(item, index) in groupeditems" :key="item">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-container fluid class="m-0 p-0 px300">
                        <b-row no-gutters class="">
                          <b-col cols="1">
                            <b-button v-b-toggle="'collapse-' + index" size="sm" variant="outline" class="actionbutton">
                              <font-awesome-icon class="while-open ml-1" far icon="minus-square" :style="{ color: 'black' }"></font-awesome-icon>
                              <font-awesome-icon class="while-closed ml-1" far icon="plus-square" :style="{ color: 'black' }"></font-awesome-icon>
                            </b-button>
                          </b-col>
                          <b-col cols="9" class="text-left pl-2">
                            <span>{{ item.text }}</span>
                          </b-col>
                          <b-col cols="2">
                            <span class="count-label">({{ item.count }})</span>
                          </b-col>
                        </b-row>
                      </b-container>
                    </b-card-header>
                    <b-collapse :id="'collapse-' + index" accordion="shelf-accordion" role="tabpanel">
                      <b-card-body>
                        <b-table striped hover :items="item.children" :fields="fields" primary-key="primarykey" table-class="table-full" :sticky-header="getSticky('accordiontable')" table-variant="light" thead-class="tbl-dynamic-header">
                          <template #head()="data">
                            <span class="text-center">{{ data.field.label }}</span>
                          </template>
                          <template #head(actions)> Actions </template>
                          <template #cell(actions)="data">
                            <b-button title="View" variant="white" size="lg" class="actionbutton text-dark" @click="viewItem(data.item.Id, data.item.IsNato, data.item.DocID, data.item.Name)">
                              <font-awesome-icon v-if="String(data.item.Name).indexOf('.docx') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.doc') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.pdf') > 0" :icon="['far', 'file-pdf']" class="icon"></font-awesome-icon>
                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.txt') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.rtf') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                            </b-button>
                            <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" title="Edit" variant="white" size="lg" class="actionbutton text-dark" @click="editItem(data.item.Id, data.item.IsNato, data.item.Name)">
                              <font-awesome-icon :icon="['far', 'edit']" class="icon"></font-awesome-icon>
                            </b-button>
                          </template>
                          <template #cell(Name)="data">
                            <b-link v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" :to="{ path: '/pubs/approved/grouped/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + true + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                            <b-link v-else :to="{ path: '/pubs/approved/grouped/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + true + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                          </template>
                          <template #cell()="data">
                            <div>{{ data.value }}</div>
                          </template>
                        </b-table>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>
              </b-row>
            </b-card>
          </b-container>
          <template #overlay>
            <div class="text-center">
              <p id="busy-label">{{ overlayText }}</p>
            </div>
          </template>
        </b-overlay>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../interfaces/User'
import { PublicationItem } from '../../interfaces/PublicationItem'
import { ObjectItem } from '../../interfaces/ObjectItem'
import { GroupItem } from '@/interfaces/GroupItem'
import { isDate } from 'lodash'
import DynamicModalSelect from '../Custom/DynamicModalSelect.vue'

const users = namespace('users')
const publication = namespace('publication')
const support = namespace('support')

let that: any

@Component({
  name: 'Grouped',
  components: {
    DynamicModalSelect
  }
})
export default class Grouped extends Vue {
  @Prop() view: any

  // #region variables
  tblId = 'AllPubs'
  primaryKey = 'docid'
  overlayText = 'Grouping Publications. Please wait...'
  overlayVariant = 'loading'
  rowHeight = 0
  pageSize = 20
  interval!: any
  branch = 'Navy'
  filteredpubs: Array<PublicationItem> = []
  groupeditems: Array<GroupItem> = [] // will be created from the filtered items
  groupitem: GroupItem = {
    children: [] // Initially required to be set as it is a required object to properly make the code work
  }
  currentPage = 1
  totalRows = 0
  perPage = 30 // default
  pubs: Array<PublicationItem> = []
  Prfx: any
  viewReady?: boolean = false
  pubsfilter = ''

  pubsfields = [
    { key: 'actions', label: 'Select' },
    { key: 'Title', label: 'Title' }
  ]

  fields: any = [
    { key: 'actions', label: 'Actions', actions: ['View', 'Edit'], thClass: 'blue-500', tdClass: 'px100', id: 0 },
    { key: 'Prfx', field: 'Prfx', label: 'Prefix', thClass: 'blue-500', tdClass: 'px100', type: 'default', format: 'dropdownmulti', id: 1, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'PubID', field: 'PubID', label: 'PubID', thClass: 'blue-500', tdClass: 'px90', type: 'default', format: 'text', id: 2, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    { key: 'Name', field: 'Name', label: 'Name', thClass: 'blue-500', tdClass: 'px200', type: 'default', format: 'text', id: 3, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    { key: 'LongTitle', field: 'LongTitle', label: 'Long Title', thClass: 'blue-500', tdClass: 'px200', type: 'default', format: 'text', id: 4, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    { key: 'AdditionalData.Status', field: 'Status', label: 'Status', thClass: 'blue-500', tdClass: 'px100', type: 'AD', format: 'dropdownmulti', id: 5, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'AdditionalData.Edition', field: 'Edition', label: 'Edition', thClass: 'blue-500', tdClass: 'px110', type: 'AD', format: 'text', id: 6, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    { key: 'AdditionalData.PRAAbbrev', field: 'PRAAbbrev', label: 'PRAAbbrev', thClass: 'blue-500', tdClass: 'px150', type: 'AD', format: 'dropdownmulti', id: 7, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'Resourced', field: 'Resourced', label: 'Resourced', thClass: 'blue-500', tdClass: 'px130', type: 'default', format: 'dropdown', id: 9, sort: '', ops: [], filtervalue: '' },
    { key: 'DTIC', field: 'DTIC', label: 'DTIC', thClass: 'blue-500', tdClass: 'px120', type: 'default', format: 'dropdownmulti', id: 10, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'AdditionalData.GeneralStatus', field: 'GeneralStatus', label: 'GeneralStatus', thClass: 'blue-500', tdClass: 'px140', type: 'AD', format: 'dropdownmulti', id: 11, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'NWDCAO.Title', field: 'Title', label: 'NWDC AO', thClass: 'blue-500', tdClass: 'px150', type: 'NWDCAO', format: 'dropdownmulti', id: 12, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'Class', field: 'Class', label: 'Classification', thClass: 'blue-500', tdClass: 'px200', type: 'default', format: 'dropdownmulti', id: 13, sort: '', ops: [], filter: false, filtervalue: [] }
  ]
  // #endregion

  // #region store data

  @users.State
  public currentUser!: UserInt

  @support.State
  public contentheight!: number

  @support.State
  public contentwidth!: number

  @support.State
  public bookshelves!: Array<ObjectItem>

  @publication.State
  public loadingpubs!: boolean

  @publication.State
  public approvedpubsforuser!: Array<PublicationItem>

  @publication.State
  public activepubsforuserloaded!: boolean

  @publication.State
  public natopubsforuserloaded!: boolean

  @publication.State
  public approvedpubsforuserloaded!: Date

  @support.Action
  public getBS!: () => Promise<boolean>

  @support.Action
  public addActivity!: (activity: any) => void

  @support.Action
  public setHeaderTitle!: (title: string) => void

  @publication.Action
  public getDigest!: () => Promise<boolean>

  @publication.Action
  public getActivePubsForUser!: () => Promise<boolean>

  @publication.Action
  public getNatoPubsForUser!: () => Promise<boolean>

  @publication.Action
  public createAllApprovedPubsForUser!: (includeNATO: boolean) => Promise<boolean>

  // #endregion

  public getid(text: any, idx: any) {
    return text + '_' + idx
  }

  /** @method - lifecycle hook */
  created() {
    that = this
  }

  mounted() {
    this.getBS().then(() => {
      this.interval = setInterval(this.loadstuff, 500)
    })
  }

  /** @method - lifecycle hook */
  loadstuff() {
    clearInterval(this.interval)
    this.setHeaderTitle('Mission Area Bookshelves')
    // do we already have pubs and when were they last loaded. Also check to be sure we are not already loading pubs
    if (!this.loadingpubs) {
      if (this.approvedpubsforuserloaded && isDate(this.approvedpubsforuserloaded)) {
        // if the data is not too old (1 hour) just keep it. for testing set the check for different times to validate
        const date1 = this.approvedpubsforuserloaded.getTime()
        const date2 = new Date().getTime()
        let diff = date2 - date1
        diff = diff / 1000
        if (diff > 3600) {
          // time is in seconds so set to whatever to test. 3600 = 1 hour
          if (this.currentUser.isNATOVisitor) {
            // the test for isNATOVisitor is simply used to be sure a user can view NATO pubs since the SharePoint groups split. This applies for all tests for isNATOVisitor
            this.getActivePubsForUser()
            this.getNatoPubsForUser()
            this.interval = setInterval(this.waitForIt, 500)
          } else {
            this.getActivePubsForUser()
            this.interval = setInterval(this.waitForIt, 500)
          }
        } else {
          // pubs loaded so just move on
          this.pubsloaded()
        }
      } else {
        // need to load the pubs for the user
        if (this.currentUser.isNATOVisitor) {
          // the test for isNATOVisitor is simply used to be sure a user can view NATO pubs since the SharePoint groups split. This applies for all tests for isNATOVisitor
          this.getActivePubsForUser()
          this.getNatoPubsForUser()
          this.interval = setInterval(this.waitForIt, 500)
        } else {
          this.getActivePubsForUser()
          this.interval = setInterval(this.waitForIt, 500)
        }
      }
    }
  }

  updated() {
    console.log('UPDATED!')
  }

  public waitForIt() {
    if (this.activepubsforuserloaded) {
      if (this.currentUser.isNATOVisitor) {
        if (this.natopubsforuserloaded) {
          clearInterval(this.interval)
          that.createAllApprovedPubsForUser(true).then((response) => {
            that.interval = setInterval(this.waitForPubs, 500)
          })
        }
      } else {
        clearInterval(this.interval)
        that.createAllApprovedPubsForUser(false).then((response) => {
          that.interval = setInterval(this.waitForPubs, 500)
        })
      }
    }
  }

  public waitForPubs() {
    if (this.approvedpubsforuserloaded) {
      clearInterval(this.interval)
      this.pubsloaded()
    }
  }

  public pubsloaded() {
    this.totalRows = this.approvedpubsforuser.length
    this.filteredpubs = this.approvedpubsforuser
    this.buildGroupedItems()
  }

  public async buildGroupedItems() {
    this.overlayText = 'Grouping Publications. Getting all data into proper groups. This takes some time.'
    // will loop through filtered items and create groupeditems array
    // empty the array first then fill it back as filters/data changes
    console.log('[BUILDING GROUPED ITEMS ARRAY]')
    this.groupeditems = []
    let a = this.filteredpubs
    for (let i = 0; i < this.bookshelves.length; i++) {
      let p: any = {}
      p.type = 'Shelf'
      p.text = this.bookshelves[i].text
      // filter the pubs for each bookshelf
      let b = a.filter((search) => Vue._.includes(search['Bookshelf'], p.text))
      p.count = b.length
      p.children = b
      if (p.count > 0) {
        this.groupeditems.push(p)
      }
    }
    this.viewReady = true
  }

  public viewItem(id: string, nato: string, docid: string, name: string) {
    let showhidden = false
    if (this.currentUser.isActionOfficer || this.currentUser.isLibrarian || this.currentUser.isNATOLibrarian) {
      showhidden = true
    }
    this.$router.push({ path: '/pubs/approved/grouped/view/' + id + '/' + nato + '/' + docid + '/' + showhidden + '/' + encodeURIComponent(name) })
  }

  public editItem(id: string, nato: string, name: string) {
    this.$router.push({ path: '/pubs/approved/grouped/edit/' + id + '/' + nato + '/' + true + '/' + encodeURIComponent(name) })
  }

  public getStyle(element, field) {
    let style: any = {}
    switch (element) {
      case 'buttonrow':
        style.background = '#ffffff'
        style.height = '50px'
        style.width = that.contentwidth + 'px'
        break

      case 'maintable':
        style.width = that.contentwidth - 5 + 'px'
        style.height = that.contentheight - 150 + 'px'
        break

      case 'tablerow':
        style.height = that.contentheight - 100 + 'px'
        style.width = that.contentwidth + 'px'
        break

      case 'pagingrow':
        style.height = '50px'
        style.width = that.contentwidth + 'px'
        break

      case 'shelfaccordion':
        style.maxHeight = that.contentheight - 50 + 'px'
        style.overflowY = 'scroll'
        style.overflowX = 'hidden'
    }
    return style
  }

  public getSticky(element) {
    let h: any
    switch (element) {
      case 'dynamictable':
        h = that.contentheight - 100 + 'px'
        break

      case 'accordiontable':
        h = '800px'
    }
    return h
  }
}
</script>

<style lang="scss">
.nav-btn-filter {
  position: absolute;
  right: 125px;
}
.nav-btn-clear {
  position: absolute;
  right: 25px;
}
.table-full {
  border: 1px solid #000000 !important;
}
.table-full td,
.table-full th {
  border: 1px solid #000000 !important;
  height: 20px !important;
  padding: 2px 5px !important;
}
.pubcount {
  border: 1px solid #ffffff !important;
  padding: 2px 2px !important;
  color: $pagination-color;
}
.collapsed > .while-open,
.not-collapsed > .while-closed {
  display: none;
}
#ulFields {
  list-style-type: none;
  width: 100%;
  margin-bottom: 0px;
  font-size: 16px !important;
  padding: 0;
}

#ulFields li {
  list-style-type: none;
  margin-bottom: 5px !important;
}
</style>
