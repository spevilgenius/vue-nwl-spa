<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters>
      <b-col cols="4" class="m-0 p-1 bg-white" style="height: 170px">
        <b-card no-body header-tag="header">
          <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">Navy Supplement</h4> </b-card-header>
          <b-card-body class="p-1">
            <b-card no-body class="p-1">
              <b-row no-gutters>
                <b-col cols="12" class="m-1" align="center">
                  <b-card-sub-title>Navy Supplement to the DOD Dictionary of Military and Associated Terms</b-card-sub-title>
                  <b-card-title mb-0>
                    <a href="https://doctrine.navy.mil/pubs/NTRP%201-02,%20Navy%20Supplement%20to%20the%20DOD%20Dictionary%20of%20Military%20and%20Associated%20Terms/NTRP_1-02.pdf">NTRP 1-02</a>
                  </b-card-title>
                </b-col>
              </b-row>
            </b-card>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="4" class="m-0 p-1 bg-white" style="height: 170px">
        <b-card no-body header-tag="header">
          <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">Marine Corps Supplement</h4></b-card-header>
          <b-card-body class="p-1">
            <b-card no-body class="p-1">
              <b-row no-gutters>
                <b-row align="center">
                  <b-col cols="12" class="p-1" align="center">
                    <b-card-sub-title>Marine Corps Supplement to the DOD Dictionary of Military and Associated Terms</b-card-sub-title>
                    <b-card-title>
                      <a href="https://doctrine.navy.mil/pubs/MCRP%201-10.2,%20Marine%20Corps%20Terminology/MCRP_1-10.2.pdf">MCRP 1-10.2</a>
                    </b-card-title>
                  </b-col>
                </b-row>
              </b-row>
            </b-card>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="4" class="m-0 p-1 bg-white" style="height: 170px">
        <b-card no-body header-tag="header">
          <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0">
            <h4 class="text-white p-0 mb-0">Joint Supplement</h4>
          </b-card-header>
          <b-card-body class="p-1">
            <b-card no-body class="p-1">
              <b-row no-gutters>
                <b-row align="center">
                  <b-col cols="12" class="p-1" align="center">
                    <b-card-sub-title>Joint Doctrine, Education & Training Electronic Information System (JDEIS) Terminology Program</b-card-sub-title>
                    <b-card-title>
                      <a href="https://jdeis.js.mil/jdeis/index.jsp?">JDEIS</a>
                    </b-card-title>
                  </b-col>
                </b-row>
              </b-row>
            </b-card>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <b-row no-gutters class="terminologyHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-overlay :show="!termsloaded" variant="loading" class="terminologyHeight">
          <b-container fluid class="terminologyHeight m-0 p-0">
            <b-sidebar id="sidebar-filter" title="Filter Terms" shadow width="450px" v-model="showFilter" sidebar-class="border-left border-danger bg-blue-500 text-white" right>
              <template #default>
                <div class="text-white">
                  <ul class="accordion nav" role="tablist">
                    <li v-for="field in fields" :key="field" class="nav-item px450">
                      <template v-if="field.key !== 'actions'">
                        <div class="px450 m-0 p-0">
                          <div class="container-fluid m-0 p-0">
                            <div class="row no-gutters">
                              <div class="col-3">
                                <span class="sidebar-icon">
                                  <a v-b-toggle="'menu' + field.id" class="m-0 p-0">
                                    <b-button size="sm" class="btn-blue-500 text-white" :class="field.filter ? null : 'collapsed'" :aria-expanded="field.filter ? 'true' : 'false'" :aria-controls="getid('collapse', field.key)" @click="field.filter = !field.filter">
                                      <font-awesome-icon fas icon="filter" class="icon"></font-awesome-icon>
                                    </b-button>
                                  </a>
                                  <b-button size="sm" class="btn-blue-500 text-white ml-1" :class="field.sort == 'desc' ? 'sorted' : ''" :id="getid('sortdown', field.key)" @click="sortit(field.key, 'desc')" title="Sort Descending">
                                    <font-awesome-icon fas icon="arrow-down" class="icon"></font-awesome-icon>
                                  </b-button>
                                  <b-button size="sm" class="btn-blue-500 text-white ml-1" :class="field.Sort == 'asc' ? 'sorted' : ''" :id="getid('sortup', field.key)" @click="sortit(field.key, 'asc')" title="Sort Ascending">
                                    <font-awesome-icon fas icon="arrow-up" class="icon"></font-awesome-icon>
                                  </b-button>
                                </span>
                              </div>
                              <div class="col-9 text-left">
                                <span class="sidebar-text text-left">{{ field.label }}</span>
                                <b class="caret"></b>
                              </div>
                            </div>
                          </div>
                        </div>
                        <b-collapse class="px450" :id="'menu' + field.id" accordion="filter-accordion" role="tabpanel">
                          <ul class="nav px450">
                            <li v-if="field.format == 'text'" class="nav-item px450">
                              <div class="container-fluid m-0 p-0">
                                <div class="row no-gutters">
                                  <div class="col-12">
                                    <b-form-select class="pw100" v-model="field.predicate" :options="textpredicate"></b-form-select>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li class="nav-item px450">
                              <div class="container-fluid m-0 p-0">
                                <div class="row no-gutters">
                                  <div class="col-12">
                                    <b-input-group class="pw100" v-if="field.format == 'dropdownmulti'">
                                      <b-form-input :id="getid('bfi', field.id)" size="sm" class="form-control" :value="field.filtervalue"></b-form-input>
                                      <template #prepend>
                                        <b-dropdown variant="blue-700" size="sm" text="Select" right>
                                          <b-form-checkbox v-for="option in field.ops" v-model="field.filtervalue" :key="option" :value="option.value" :name="field.label">
                                            {{ option.text }}
                                          </b-form-checkbox>
                                        </b-dropdown>
                                      </template>
                                      <template #append>
                                        <b-button size="sm" variant="success" :id="getid('filter', field.key)" class="float-right" @click="setfilter(field.key)">Filter</b-button>
                                        <b-button size="sm" variant="danger" :id="getid('clear', field.key)" class="float-right ml-1" @click="clearfilter(field.key)">Clear</b-button>
                                      </template>
                                    </b-input-group>
                                    <b-input-group class="pw100" v-if="field.format == 'dropdown'">
                                      <b-form-select :options="field.ops" v-model="field.filtervalue"></b-form-select>
                                      <template #append>
                                        <b-button size="sm" variant="success" :id="getid('filter', field.key)" class="float-right" @click="setfilter(field.key)">Filter</b-button>
                                        <b-button size="sm" variant="danger" :id="getid('clear', field.key)" class="float-right ml-1" @click="clearfilter(field.key)">Clear</b-button>
                                      </template>
                                    </b-input-group>
                                    <b-input-group class="pw100" v-if="field.format == 'text'">
                                      <b-form-input v-if="field.format == 'text'" v-model="field.filtervalue"></b-form-input>
                                      <template #append>
                                        <b-button size="sm" variant="success" :id="getid('filter', field.key)" class="float-right" @click="setfilter(field.key)">Filter</b-button>
                                        <b-button size="sm" variant="danger" :id="getid('clear', field.key)" class="float-right ml-1" @click="clearfilter(field.key)">Clear</b-button>
                                      </template>
                                    </b-input-group>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </b-collapse>
                      </template>
                    </li>
                  </ul>
                </div>
              </template>
              <template #footer>
                <div class="d-flex bg-blue-800 text-white align-items-center px-3 py-2">
                  <b-button variant="danger" @click="closeFilters">Close</b-button>
                </div>
              </template>
            </b-sidebar>
            <b-card no-body class="terminologyHeight">
              <b-tabs class="tabarea" card>
                <b-tab class="vtab" active>
                  <template slot="title">TERMS</template>
                  <b-row no-gutters :style="getStyle('tablerow', null)">
                    <b-col cols="12">
                      <b-table striped hover :items="filteredterms" :fields="fields" primary-key="primarykey" :per-page="perPage" :current-page="currentPage" table-class="table-full" :sticky-header="getSticky('dynamictable')" table-variant="light" thead-class="blue-500 text-white">
                        <template #head()="data">
                          {{ data.field.label }}
                        </template>
                      </b-table>
                    </b-col>
                  </b-row>
                  <b-row no-gutters :style="getStyle('pagingrow', null)">
                    <b-col cols="6">
                      <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="my-0" first-number last-number></b-pagination>
                    </b-col>
                    <b-col>
                      <div class="pubcount"># Terms Found: {{ totalRows }}</div>
                    </b-col>
                  </b-row>
                </b-tab>
                <template #tabs-end>
                  <li role="presentation" class="nav-item nav-btn-export">
                    <excel-export-button :data="filteredterms" :columns="columns" :file-name="'Export'" :file-type="'xlsx'" :sheet-name="'Export'"></excel-export-button>
                  </li>
                  <li role="presentation" class="nav-item nav-btn-filter"><b-button class="btn-filter" variant="success" @click="showFilters">Filter</b-button></li>
                  <li role="presentation" class="nav-item nav-btn-clear"><b-button class="btn-clear-filter" variant="danger" @click="clearFilters" title="Clear filters to show all pubs.">Clear</b-button></li>
                </template>
              </b-tabs>
            </b-card>
          </b-container>
          <template #overlay>
            <div class="text-center px800 py40">
              <!-- <p id="busy-label">Loading...</p> -->
              <p>
                <b-progress height="40px" min="1" :max="termscount" variant="success" show-progress animated>
                  <b-progress-bar :value="currentcount">
                    <span>
                      Loading: <strong>{{ currentcount }} / {{ termscount }}</strong>
                    </span>
                  </b-progress-bar>
                </b-progress>
              </p>
            </div>
          </template>
        </b-overlay>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ObjectItem } from '@/interfaces/ObjectItem'
import { TerminologyItem } from '@/interfaces/TerminologyItem'
import { namespace } from 'vuex-class'
import ExcelExportButton from '../Custom/ExcelExportButton.vue'
import axios from 'axios'

const support = namespace('support')

let that: any

@Component({
  name: 'Terminology',
  components: {
    ExcelExportButton
  }
})
export default class Terminology extends Vue {
  @Prop({ default: process.env.VUE_APP_BASE_IMAGE_URL })
  readonly baseImageUrl!: string

  @support.State
  public terminologyheight!: number

  @support.State
  public contentwidth!: number

  @support.Action
  public setHeaderTitle!: (title: string) => void

  public interval: any

  tblId = 'AllTerms'
  primarykey = 'Id'
  termsloaded = false
  termscount = 0
  currentcount = 0
  terms: Array<TerminologyItem> = []
  filteredterms: Array<TerminologyItem> = []
  currentPage = 1
  totalRows = 0
  perPage = 50 // default
  viewReady?: boolean = false
  showFilter = false
  sortfield!: any
  sortdir!: any
  filter = ''

  termsUrl = "https://doctrine.navy.mil/terminology/_api/lists/getbytitle('Terminology')/items?$select=Disposition,TermType,Title,Definition,Service1&$filter=Disposition eq 'Include'"
  termsCountUrl = "https://doctrine.navy.mil/terminology/_vti_bin/listdata.svc/Terminology/$count?$filter=(DispositionValue eq 'Include')"

  public ddfields: ObjectItem = { text: 'text', value: 'value', index: 'index' }
  public textpredicate: Array<ObjectItem> = [
    { text: 'Select...', value: 'S' },
    { text: 'Starts With', value: 'SW' },
    { text: 'Ends With', value: 'EW' },
    { text: 'Contains', value: 'C' },
    { text: 'Equal', value: 'E' },
    { text: 'Not Equal', value: 'NE' }
  ]

  fields: any = [
    { key: 'type', label: 'Type', type: 'default', tdClass: 'px80', thClass: 'blue-500', format: 'dropdown', id: 1, sort: '', ops: ['Acronym', 'Term'], filter: false, filtervalue: '' },
    { key: 'title', label: 'Title', type: 'default', tdClass: 'px200', thClass: 'blue-500', format: 'text', id: 2, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    { key: 'definition', label: 'Definition', type: 'default', thClass: 'blue-500', format: 'text', id: 3, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    { key: 'service', label: 'Service', type: 'default', tdClass: 'px100', thClass: 'blue-500', format: 'dropdown', id: 4, sort: '', ops: ['Navy', 'Marine'], filter: false, filtervalue: '' }
  ]

  columns: any = [
    { field: 'type', label: 'Type', width: 100 },
    { field: 'title', label: 'Title', width: 200 },
    { field: 'definition', label: 'Definition', width: 850 },
    { field: 'service', label: 'Service', width: 150 }
  ]

  public getid(text: any, idx: any) {
    return text + '_' + idx
  }

  /** @method - lifecycle hook */
  created() {
    that = this
  }

  /** @method - lifecycle hook */
  updated() {
    console.log('CURRENTCOUNT: ' + this.currentcount)
  }

  /** @method - lifecycle hook */
  mounted() {
    this.setHeaderTitle(' > Terminology')
    this.getTermsCount()
    /* this.getTerms() */
    this.interval = setInterval(this.waitForCount, 500)
  }

  public async getTermsCount() {
    const response = await axios.get(this.termsCountUrl)
    this.termscount = Number(response.data)
  }

  public waitForCount() {
    if (this.termscount > 0) {
      clearInterval(this.interval)
      this.getTerms()
    }
  }

  public async getTerms() {
    let j: any[] = []
    let p: Array<TerminologyItem> = []
    const that = this
    async function getAllTerms(url: string): Promise<void> {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      j = j.concat(response.data.d.results)
      that.currentcount = j.length
      // console.log('CURRENTCOUNT: ' + that.currentcount)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllTerms(url)
      } else {
        // console.log('getAllTerms Response: ' + j)
        for (let i = 0; i < j.length; i++) {
          p.push({
            Id: j[i]['Id'],
            type: j[i]['TermType'],
            title: j[i]['Title'],
            service: that.formatService(j[i]['Service1']['results']),
            definition: j[i]['Definition']
          })
        }
        that.terms = p
        that.filteredterms = p
        that.totalRows = p.length
        that.termsloaded = true
      }
    }
    getAllTerms(this.termsUrl)
  }

  public formatService(results: any) {
    let service = ''
    for (let i = 0; i < results.length; i++) {
      if (i === 0) {
        service = results[i]
      }
      if (i === 1) {
        service += ', ' + results[i]
      }
    }
    return service
  }

  public filterterms() {
    this.filteredterms = this.terms
    let hasfilter = false
    for (let j = 0; j < this.fields.length; j++) {
      if (this.fields[j].filter === true || this.fields[j].sort !== '') {
        hasfilter = true
      }
    }
    if (hasfilter) {
      console.log('hasfilter is set')
      // loop through the fields array and filter accordingly
      for (let j = 0; j < this.fields.length; j++) {
        let q = this.filteredterms
        if (this.fields[j].sort !== '') {
          this.sortfield = this.fields[j].key
          this.sortdir = this.fields[j].sort
        }
        if (this.fields[j].filtervalue && this.fields[j].filtervalue.length >= 1) {
          // is this a dropdown or text?
          switch (this.fields[j].format) {
            case 'text': {
              switch (this.fields[j].predicate) {
                case 'SW': {
                  let that = this
                  q = q.filter(function (search) {
                    return Vue._.startsWith(String(search[that.fields[j].key]).toLowerCase(), String(that.fields[j].filtervalue).toLowerCase())
                  })
                  break
                }
                case 'EW': {
                  let that = this
                  q = q.filter(function (search) {
                    return Vue._.endsWith(String(search[that.fields[j].key]).toLowerCase(), String(that.fields[j].filtervalue).toLowerCase())
                  })
                  break
                }
                case 'C': {
                  let that = this
                  q = q.filter(function (search) {
                    return Vue._.includes(String(search[that.fields[j].key]).toLowerCase(), String(that.fields[j].filtervalue).toLowerCase())
                  })
                  break
                }
                case 'E': {
                  let that = this
                  q = q.filter(function (search) {
                    return Vue._.isEqual(String(search[that.fields[j].key]).toLowerCase(), String(that.fields[j].filtervalue).toLowerCase())
                  })
                  break
                }
                case 'NE': {
                  let that = this
                  q = q.filter(function (search) {
                    return Vue._.without(String(search[that.fields[j].key]).toLowerCase(), String(that.fields[j].filtervalue).toLowerCase())
                  })
                  break
                }
              }
              break
            }
            case 'dropdown': {
              /* q = q.filter((search) => search[this.fields[j].key] == this.fields[j].filtervalue) */
              /* let that = this
              q = q.filter(function (search) {
                return Vue._.isEqual(String(search[that.fields[j].key]).toLowerCase(), String(that.fields[j].filtervalue).toLowerCase())
              }) */
              let that = this
              q = q.filter(function (search) {
                return Vue._.includes(String(search[that.fields[j].key]).toLowerCase(), String(that.fields[j].filtervalue).toLowerCase())
              })
              break
            }
          }
        }
        // let's sort if requested
        if (this.sortfield && this.sortdir !== '') {
          q = Vue._.orderBy(q, this.sortfield, this.sortdir)
        }
        this.filteredterms = q
      }
    }
    this.totalRows = this.filteredterms.length
  }

  public showFilters() {
    this.showFilter = true
  }

  public clearFilters() {
    this.showFilter = false
    this.filteredterms = this.terms
    for (let j = 0; j < this.fields.length; j++) {
      this.fields[j].filter = false
      if (this.fields[j].format === 'dropdownmulti') {
        this.fields[j].filtervalue = []
      } else {
        this.fields[j].filtervalue = ''
      }
    }
  }

  public closeFilters() {
    this.showFilter = false
  }

  public setfilter(key: string) {
    for (let j = 0; j < this.fields.length; j++) {
      if (this.fields[j].key === key) {
        this.fields[j].filter = true
      }
    }
    this.filterterms()
  }

  public clearfilter(key: string) {
    for (let j = 0; j < this.fields.length; j++) {
      if (this.fields[j].key === key) {
        this.fields[j].filter = false
        if (this.fields[j].format === 'dropdownmulti') {
          this.fields[j].filtervalue = []
        } else {
          this.fields[j].filtervalue = ''
        }
      }
    }
    this.filterterms()
  }

  public sortit(key: string, direction: string) {
    for (let j = 0; j < this.fields.length; j++) {
      if (this.fields[j].key === key) {
        this.fields[j].sort = direction
      } else {
        this.fields[j].sort = ''
      }
    }
    let a = this.filteredterms
    if (direction === 'asc') {
      a = Vue._.orderBy(a, key, 'asc')
    } else {
      a = Vue._.orderBy(a, key, 'desc')
    }
    this.filteredterms = a
  }

  public getStyle(element, field) {
    let style: any = {}
    switch (element) {
      case 'buttonrow':
        style.background = '#ffffff'
        style.height = '50px'
        style.width = that.contentwidth + 'px'
        break

      case 'tablerow':
        style.height = that.terminologyheight - 100 + 'px'
        style.width = that.contentwidth + 'px'
        break

      case 'pagingrow':
        style.height = '50px'
        style.width = that.contentwidth + 'px'
        break
    }
    return style
  }

  public getSticky(element) {
    let h: any
    switch (element) {
      case 'dynamictable':
        h = that.terminologyheight - 100 + 'px'
        break

      case 'accordiontable':
        h = '800px'
    }
    return h
  }
}
</script>

<style lang="scss">
.nav-btn-export {
  position: absolute;
  right: 225px;
}
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
#NWLTitle {
  text-align: center;
  font-family: 'Arial', Gadget, sans-serif;
  font-variant: small-caps;
  font-style: italic;
  font-size: 36px;
}
.pubType {
  font-family: 'Arial';
  font-size: 14pt;
}
.pubicon {
  font-size: 65px;
}
.list-group-item {
  position: relative;
  display: block;
  padding: 0.5rem;
  background-color: $light;
  border: none;
}
.card-body-left {
  font-family: 'Arial';
  font-size: 16px;
  text-align: left !important;
}
.card-body-left li a {
  color: $dark !important;
}
.centerFlex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1ch;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin-bottom: auto;
}
</style>
