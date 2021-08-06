<template>
  <div>
    <b-modal ref="FilterModal" id="FilterModal" size="sm" no-fade modal-class="animated bounceInLeft filtermodal" @shown="onShown">
      <template v-slot:modal-title>{{ filterTitle }}</template>
      <div>
        <ul id="ulFields">
          <li v-for="field in filterfields" :key="field">
            <div v-if="field.FieldName !== 'Version'">
              <ejs-checkbox :label="field.DisplayName" v-model="field.Visible" :checked="field.Visible" @change="showorhide" :value="field.FieldName"></ejs-checkbox>
              <b-button size="sm" class="actionbutton float-right" :class="field.Filter ? null : 'collapsed'" :aria-expanded="field.Filter ? 'true' : 'false'" :aria-controls="getRef('collapse', field.FieldName)" @click="field.Filter = !field.Filter">
                <font-awesome-icon fas icon="filter" class="icon"></font-awesome-icon>
              </b-button>
              <b-button size="sm" class="actionbutton float-right" :class="field.Sort == 'desc' ? 'sorted' : ''" :id="getRef('sortdown', field.FieldName)" @click="sortit(field.FieldName, field.DataType, 'desc')">
                <font-awesome-icon fas icon="arrow-down" class="icon"></font-awesome-icon>
              </b-button>
              <b-button size="sm" class="actionbutton float-right" :class="field.Sort == 'asc' ? 'sorted' : ''" :id="getRef('sortup', field.FieldName)" @click="sortit(field.FieldName, field.DataType, 'asc')">
                <font-awesome-icon fas icon="arrow-up" class="icon"></font-awesome-icon>
              </b-button>
              <b-collapse class="mt-1" :id="getRef('collapse', field.FieldName)" v-model="field.Filter">
                <b-container fluid>
                  <b-row class="mb-1">
                    <ejs-dropdownlist v-if="field.DataType == 'Text'" v-model="field.Predicate" :dataSource="textpredicate" :fields="ddfields"></ejs-dropdownlist>
                    <ejs-dropdownlist v-if="field.DataType == 'Number'" v-model="field.Predicate" :dataSource="numberpredicate" :fields="ddfields"></ejs-dropdownlist>
                    <ejs-dropdownlist v-if="field.DataType == 'Date'" v-model="field.Predicate" :dataSource="datepredicate" :fields="ddfields"></ejs-dropdownlist>
                  </b-row>
                  <b-row v-if="field.Control == 'DropdownBox'" class="mb-1">
                    <div v-if="field.DataType == 'Choice'" class="full">
                      <ejs-dropdownlist v-model="field.Selected" :dataSource="field.Options" :fields="ddfields"></ejs-dropdownlist>
                    </div>
                  </b-row>
                  <b-row v-if="field.Control != 'DropdownBox'" class="mb-1">
                    <b-form-input class="filterform" v-if="field.DataType == 'Text'" v-model="field.FilterValue"></b-form-input>
                    <b-form-input class="filterform" v-if="field.DataType == 'Number'" v-model="field.FilterValue"></b-form-input>
                    <ejs-datepicker v-if="field.DataType == 'Date'" v-model="field.FilterValue"></ejs-datepicker>
                  </b-row>
                  <b-row v-if="field.Predicate == 'B'" class="mb-1">
                    <ejs-datepicker v-if="field.DataType == 'Date'" v-model="field.FilterValue2"></ejs-datepicker>
                  </b-row>
                  <b-row>
                    <div class="full">
                      <b-button size="sm" variant="danger" :id="getRef('clear', field.FieldName)" class="float-right ml-1" @click="clearfilter(filterfields, field.FieldName)">Clear</b-button>
                      <b-button size="sm" variant="success" :id="getRef('filter', field.FieldName)" class="float-right" @click="setfilter(filterfields)">Filter</b-button>
                    </div>
                  </b-row>
                </b-container>
              </b-collapse>
            </div>
          </li>
          <li class="py30">
            <div class="full py30">
              <b-button size="sm" variant="danger" id="clearfilters" class="float-right ml-1" @click="clearfilters()">Clear Filters</b-button>
              <b-button size="sm" variant="success" id="savefilters" class="float-right" @click="savefilters(filterfields)">Save Filters</b-button>
            </div>
          </li>
        </ul>
      </div>
    </b-modal>
    <b-button id="ShowFilters" class="btn btn-warning" @click="toggleFilters"> Toggle Filters </b-button>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Prop, Vue, Ref } from 'vue-property-decorator'
import { BModal } from 'bootstrap-vue'
import { namespace } from 'vuex-class'
import { EventBus } from '../../main'
import { UserInt } from '../../interfaces/User'
import { FilterFieldItem } from '../../interfaces/FilterFieldItem'
import { ObjectItem } from '../../interfaces/ObjectItem'
import moment from 'moment'

const personnel = namespace('personnel')
const travel = namespace('travel')
const users = namespace('users')

let vm: any = null

@Component({
  name: 'GridFilter'
})
export default class GridFilter extends Vue {
  @Prop() filtertype!: string
  @Prop() ShowFilters!: boolean

  @Ref('FilterModal') readonly FilterModal!: BModal

  get TravelLoaded() {
    return this.$store.state.travel.loaded
  }

  public sortfield!: string
  public sortdir!: any
  public sorttype!: any
  public timeout!: any
  public loadedFromFilter: boolean = false

  @users.State
  public currentUser!: UserInt

  public filterTitle!: string

  public ddfields: ObjectItem = { text: 'text', value: 'value', index: 'index' }
  public textpredicate: Array<ObjectItem> = [
    { text: 'Select...', value: 'S' },
    { text: 'Starts With', value: 'SW' },
    { text: 'Ends With', value: 'EW' },
    { text: 'Contains', value: 'C' },
    { text: 'Equal', value: 'E' },
    { text: 'Not Equal', value: 'NE' }
  ]
  public datepredicate: Array<ObjectItem> = [
    { text: 'Select...', value: 'S' },
    { text: 'Greater Than', value: 'GT' },
    { text: 'Less Than', value: 'LT' },
    { text: 'Equal', value: 'E' },
    { text: 'Between', value: 'B' }
  ]
  public numberpredicate: Array<ObjectItem> = [
    { text: 'Select...', value: 'S' },
    { text: 'Greater Than', value: 'GT' },
    { text: 'Less Than', value: 'LT' },
    { text: 'Equal', value: 'E' }
  ]

  public filterfields: Array<FilterFieldItem> = []

  @personnel.Action
  public setFilteredPersonnel!: (payload: any) => Promise<boolean>

  @travel.Action
  public setFilteredTravel!: (payload: any) => Promise<boolean>

  /** @method - lifecycle hook */
  mounted() {
    vm = this
    this.loadfilters()
  }

  public getRef(text: any, idx: any) {
    return text + '_' + idx
  }

  public toggleFilters() {
    ;(this.$refs['FilterModal'] as BModal).toggle('#ShowFilters')
  }

  public onShown() {
    // go get the filterfields based on the filtertype prop
    switch (this.filtertype) {
      case 'personnel':
        this.filterfields = this.$store.state.personnel.filterfields
        this.filterTitle = 'Personnel Filter'
        break

      case 'workplans':
        this.filterfields = this.$store.state.workplan.filterfields
        this.filterTitle = 'Workplan Filter'
        break

      case 'travel':
        this.filterfields = this.$store.state.travel.filterfields
        this.filterTitle = 'Travel Filter'
        break
    }
  }

  public showorhide(e: any) {
    // console.log('SHOW OR HIDE: ' + e)
    const payload: any = {}
    payload.checked = e.checked
    payload.displayname = e.event.target.labels[0].innerText
    payload.type = this.filtertype
    EventBus.$emit('showhide', payload)
  }

  public sortit(FieldName: any, DataType: any, Direction: string) {
    const payload: any = {}
    payload.fieldname = FieldName
    payload.datatype = DataType
    payload.direction = Direction
    payload.type = this.filtertype
    EventBus.$emit('sortit', payload)
    for (let i = 0; i < this.filterfields.length; i++) {
      if (this.filterfields[i].FieldName == FieldName) {
        this.filterfields[i].Sort = Direction
      }
    }
  }

  public setfilter(filterfields: Array<FilterFieldItem>) {
    let p: Array<any> = []
    switch (this.filtertype) {
      case 'personnel':
        p = this.$store.state.personnel.personnel
        break

      case 'workplans':
        p = this.$store.state.workplan.workplans
        break

      case 'travel':
        p = this.$store.state.travel.travel
        break
    }
    // console.log('FILTER: ' + p.length)
    for (let i = 0; i < filterfields.length; i++) {
      if (this.filterfields[i].Sort !== '') {
        this.sortfield = this.filterfields[i].FieldName
        this.sortdir = this.filterfields[i].Sort
        this.sorttype = this.filterfields[i].DataType
      }
      if (filterfields[i].Predicate !== 'S') {
        if (filterfields[i].FilterValue !== '' || filterfields[i].Selected !== 'S') {
          // determine what to filter based on predicate
          switch (filterfields[i].Predicate) {
            case 'SW':
              // Starts With
              p = p.filter((search) => Vue._.startsWith(search[filterfields[i].FieldName], filterfields[i].FilterValue))
              break

            case 'EW':
              // Ends With
              p = p.filter((search) => Vue._.endsWith(search[filterfields[i].FieldName], filterfields[i].FilterValue))
              break

            case 'C':
              // Contains
              p = p.filter((search) => Vue._.includes(search[filterfields[i].FieldName], filterfields[i].FilterValue))
              break

            case 'E':
              // Equals
              if (filterfields[i].DataType == 'Choice') {
                p = p.filter((search) => Vue._.isEqual(search[filterfields[i].FieldName], filterfields[i].Selected))
              }
              if (filterfields[i].DataType == 'Number' || filterfields[i].DataType == 'Text') {
                p = p.filter((search) => search[filterfields[i].FieldName] == filterfields[i].FilterValue)
              }
              if (filterfields[i].DataType == 'Date') {
                p = p.filter((search) => moment(search[filterfields[i].FieldName]).isSame(moment(filterfields[i].FilterValue), 'day'))
              }
              break

            case 'NE':
              // Not Equals
              p = p.filter((search) => Vue._.without(search[filterfields[i].FieldName], filterfields[i].FilterValue))
              break

            case 'GT':
              // Greater Than
              if (filterfields[i].DataType == 'Number') {
                p = p.filter((search) => search[filterfields[i].FieldName] > Number(filterfields[i].FilterValue))
              } else {
                // date
                p = p.filter((search) => moment(search[filterfields[i].FieldName]).isAfter(moment(filterfields[i].FilterValue)))
              }
              break

            case 'LT':
              // Less Than
              if (filterfields[i].DataType == 'Number') {
                p = p.filter((search) => search[filterfields[i].FieldName] < Number(filterfields[i].FilterValue))
              } else {
                // date
                p = p.filter((search) => moment(filterfields[i].FilterValue).isAfter(moment(search[filterfields[i].FieldName])))
              }
              break

            case 'B':
              // Between
              p = p.filter((search) => moment(search[filterfields[i].FieldName]).isBetween(moment(filterfields[i].FilterValue), moment(filterfields[i].FilterValue2)))
              break
          }
        }
      }
    }
    // now sort
    if (this.sorttype == 'Date') {
      var f = this.sortfield
      p = Vue._.orderBy(
        p,
        function (o) {
          return moment(o[f]).format('YYYYMMDD')
        },
        this.sortdir
      )
    } else {
      p = Vue._.orderBy(p, this.sortfield, this.sortdir)
    }
    // now filter
    switch (this.filtertype) {
      case 'personnel':
        // this.setFilteredPersonnel(p)
        break

      case 'workplans':
        // placeholder
        break

      case 'travel':
        // console.log('FILTERING TRAVEL: ' + p.length)
        this.setFilteredTravel(p)
        break
    }
    // now show or hide fields if loading from saved filter
    if (this.loadedFromFilter) {
      for (let i = 0; i < vm.filterfields.length; i++) {
        if (vm.filterfields[i].Visible) {
          const payload: any = {}
          payload.checked = true
          payload.displayname = vm.filterfields[i].DisplayName
          payload.type = vm.filtertype
          EventBus.$emit('showhide', payload)
        } else {
          const payload: any = {}
          payload.checked = false
          payload.displayname = vm.filterfields[i].DisplayName
          payload.type = vm.filtertype
          EventBus.$emit('showhide', payload)
        }
      }
    }
  }

  public clearfilter(filterfields: Array<FilterFieldItem>, filterfield: string) {
    const f = filterfield
    for (let i = 0; i < filterfields.length; i++) {
      if (filterfields[i].FieldName == f) {
        filterfields[i].Predicate = 'S'
        filterfields[i].FilterValue = ''
        if (filterfields[i].DataType == 'Date') {
          filterfields[i].FilterValue2 = ''
        }
        if (filterfields[i].DataType == 'Choice') {
          filterfields[i].Predicate = 'E'
          filterfields[i].Selected = 'S'
        }
        if (filterfields[i].DataType == 'Number' && filterfields[i].Control == 'DropdownBox') {
          filterfields[i].Predicate = 'S'
          filterfields[i].FilterValue = 'S'
        }
      }
    }
    this.filterfields = filterfields
    this.setfilter(this.filterfields)
  }

  public async savefilters(filterfields: Array<FilterFieldItem>) {
    switch (this.filtertype) {
      case 'personnel':
        window.localStorage.setItem('PersonnelFilter', JSON.stringify(this.filterfields))
        break

      case 'workplans':
        window.localStorage.setItem('WorkplanFilter', JSON.stringify(this.filterfields))
        break

      case 'travel':
        window.localStorage.setItem('TravelFilter', JSON.stringify(this.filterfields))
        break
    }
  }

  public async clearfilters() {
    switch (this.filtertype) {
      case 'personnel':
        window.localStorage.removeItem('PersonnelFilter')
        this.filterfields = this.$store.state.personnel.filterfields
        break

      case 'workplans':
        window.localStorage.removeItem('WorkplanFilter')
        this.filterfields = this.$store.state.workplan.filterfields
        break

      case 'travel':
        window.localStorage.removeItem('TravelFilter')
        this.filterfields = this.$store.state.travel.filterfields
        break
    }
  }

  public async loadfilters() {
    // console.log('LOAD FILTERS FROM LOCAL STORAGE')
    let f: any
    let goon: boolean = false
    switch (this.filtertype) {
      case 'personnel':
        /* if (this.PersonnelLoaded) {
          goon = true
          f = String(window.localStorage.getItem('PersonnelFilter'))
        } */
        break

      case 'workplans':
        /* if (this.WorkplansLoaded) {
          goon = true
          f = String(window.localStorage.getItem('WorkplanFilter'))
        } */
        break

      case 'travel': // only supporting travel right now
        if (this.TravelLoaded) {
          f = String(window.localStorage.getItem('TravelFilter'))
          if (f == null || f == 'null') {
            // do nothing
          } else {
            this.filterfields = JSON.parse(f)
            goon = true
            // console.log('FILTERFIELDS FROM LOCAL STORAGE: ' + f + ', FIELDS LENGTH: ' + this.filterfields.length)
          }
        } else {
          this.timeout = window.setTimeout(this.loadfilters, 500)
        }
        break
    }
    if (goon) {
      this.$bvModal
        .msgBoxConfirm('Load your saved filter?', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then((value) => {
          if (value == true) {
            vm.setFilteredTravel([])
            setTimeout(() => {
              vm.loadedFromFilter = true
              vm.setfilter(vm.filterfields)
            }, 250)
          }
        })
        .catch((err) => {
          // console.log(err)
          // TODO: Add Error Handling Here?
        })
    }
  }
}
</script>

<style lang="scss">
#FilterModal {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  background-color: #fff;
  background-clip: padding-box;
}

#FilterModal .modal-content {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
}

#FilterModal .modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid #dee2e6;
}

#FilterModal .modal-body,
#FilterModal .modal-footer {
  padding: 5px;
}

.filtermodal {
  border: 1px solid blueviolet;
}

.sorted {
  color: #04ee04 !important;
}

.full {
  width: 100%;
}

#FilterModal .modal-dialog {
  margin: 1.75rem 0 auto !important;
}

#ShowFilters {
  height: 40px;
}

.tableHeight {
  height: calc(100vh - 180px);
}

#ulFields {
  list-style-type: none;
  background-color: white;
  color: black !important;
  width: 100%;
  margin-bottom: 0px;
  font-size: 16px !important;
  padding: 0;
}

#ulFields li {
  list-style-type: none;
  margin-bottom: 5px !important;
}

.filterform {
  height: 22px !important;
  border: 1px solid black !important;
  border-radius: 4px !important;
  font-size: 1rem;
}

.filter-menu {
  margin-left: -15px;
  overflow-y: auto;
}
.e-label {
  font-size: 14px !important;
}
</style>
