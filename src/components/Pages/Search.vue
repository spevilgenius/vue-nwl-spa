<template>
  <b-card no-gutters fluid class="contentHeight" style="min-width: 1200px">
    <b-card-header>
      <b-row style="padding-left: 15px"> Search </b-row>
    </b-card-header>
    <b-card-body class="m-0 p-0">
      <b-container fluid class="p-0">
        <b-row>
          <b-col cols="2"></b-col>
          <b-col cols="10" class="mb-1 p-0" style="font-size: large; text-align: left"> Find documents that have... </b-col>
        </b-row>
        <b-row class="searchprops">
          <b-col cols="1" class="m-0 p-0"></b-col>
          <b-col cols="4" class="mt-1 p-0 font-size-large">All of these words:</b-col>
          <b-col cols="4" class="mb-1 p-0"><b-form-input v-model="allwords" size="sm"></b-form-input></b-col>
          <b-col cols="3" class="m-0 p-0"></b-col>
        </b-row>
        <b-row class="searchprops">
          <b-col cols="1" class="m-0 p-0"></b-col>
          <b-col cols="4" class="mt-1 p-0">The exact phrase:</b-col>
          <b-col cols="4" class="mb-1 p-0"><b-form-input v-model="exactwords" size="sm"></b-form-input></b-col>
          <b-col cols="3" class="m-0 p-0"></b-col>
        </b-row>
        <b-row class="searchprops">
          <b-col cols="1" class="m-0 p-0"></b-col>
          <b-col cols="4" class="mt-1 p-0">Any of these words:</b-col>
          <b-col cols="4" class="mb-1 p-0"><b-form-input v-model="anywords" size="sm"></b-form-input></b-col>
          <b-col cols="3" class="m-0 p-0"></b-col>
        </b-row>
        <b-row class="searchprops">
          <b-col cols="1" class="m-0 p-0"></b-col>
          <b-col cols="4" class="mt-1 p-0">None of these words:</b-col>
          <b-col cols="4" class="mb-1 p-0"><b-form-input v-model="nowords" size="sm"></b-form-input></b-col>
          <b-col cols="3" class="m-0 p-0"></b-col>
        </b-row>
        <b-row no-gutters>
          <b-col cols="2" class="m-0 p-0"></b-col>
          <b-row cols="10" class="mt-3 mb-1 p-0" style="font-size: large">Add Property Restrictions...</b-row>
        </b-row>
        <b-container fluid>
          <b-row v-for="(row, index) in rows" :key="row" :id="'row_' + index">
            <b-col cols="2" class="p-0 searchprops">Where the Property...</b-col>
            <b-col cols="3" class="p-0"><b-form-select :id="'property_' + index" v-model="row.property" :options="pickpropfields" size="sm"></b-form-select></b-col>
            <b-col cols="2" class="p-0"><b-form-select :id="'logic_' + index" v-model="row.type" :options="row.property.indexOf('Date') > 1 ? datefields : containsfields" size="sm"></b-form-select></b-col>
            <b-col cols="2" class="p-0">
              <div v-if="row.property === 'Prefix'">
                <b-form-select :id="'value_' + index" v-model="row.value" size="sm" :options="prefixes"></b-form-select>
              </div>
              <div v-else>
                <b-form-input v-if="row.property.indexOf('Date') > 1" :id="'value_' + index" v-model="row.value" size="sm" type="date"></b-form-input>
                <b-form-input v-else :id="'value_' + index" v-model="row.value" size="sm" type="text"></b-form-input>
              </div>
            </b-col>
            <b-col cols="2" class="p-0"><b-form-select :id="'andor_' + index" v-model="row.andor" :options="andorfields" size="sm"></b-form-select></b-col>
            <b-col cols="1">
              <a href="#" @click="addSearchPropRow()">
                <img :src="baseImageUrl + '/advadd.png'" />
              </a>
              &nbsp;
              <a v-if="rows.length > 1" href="#" @click="removeSearchPropRow(index)">
                <img :src="baseImageUrl + '/advminus.png'" />
              </a>
            </b-col>
          </b-row>
        </b-container>
        <b-row no-gutters>
          <b-col cols="10"></b-col>
          <b-col cols="2" style="margin-top:15px; margin-bottom 15px;"><b-button @click="startSearch" variant="outline-primary" size="sm" class="">Search</b-button></b-col>
        </b-row>
        <b-row>&nbsp;</b-row>
      </b-container>
      <b-card-footer>
        <b-row no-gutters>Improve your searches with&nbsp;<a href='javascript:HelpWindowKey("WSSEndUser_SearchTips")'>search tips</a></b-row>
      </b-card-footer>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
// import { forEach } from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { ObjectItem } from '../../interfaces/ObjectItem'
import { UserInt } from '../../interfaces/User'

const search = namespace('search')
const publication = namespace('publication')
const support = namespace('support')
const users = namespace('users')

@Component
export default class Search extends Vue {
  @Prop({ default: process.env.VUE_APP_BASE_IMAGE_URL })
  readonly baseImageUrl!: string

  searchrestrictiontext?: any
  idx = 0
  allwords = ''
  exactwords = ''
  anywords = ''
  nowords = ''
  interval!: any
  prefixes: Array<ObjectItem> = []

  pickpropfields = [
    { value: null, text: '(Pick Property)' },
    { value: 'Name', text: 'Name' },
    { value: 'Prefix', text: 'Prefix' },
    { value: 'Author', text: 'Author' },
    { value: 'Description', text: 'Description' },
    { value: 'Last Modified Date', text: 'Last Modified Date' },
    { value: 'Last Modified By', text: 'Last Modified By' }
  ]

  containsfields = [
    { value: 'Contains', text: 'Contains' },
    { value: 'Does not contain', text: 'Does not contain' },
    { value: 'Equals', text: 'Equals' },
    { value: 'Does not equal', text: 'Does not equal' }
  ]

  datefields = [
    { value: 'Equals', text: 'Equals' },
    { value: 'On or before', text: 'On or before' },
    { value: 'On or after', text: 'On or after' }
  ]

  andorfields = [
    { value: 'AND', text: 'And' },
    { value: 'OR', text: 'Or' }
  ]

  rows: any = []

  @users.State
  public currentUser!: UserInt

  @search.Action
  public getSearchResults!: () => Promise<boolean>

  @support.Action
  public setHeaderTitle!: (title: string) => void

  @publication.State
  public prefixesforuser!: Array<ObjectItem>

  @publication.State
  public prefixesforuserloaded!: boolean

  @publication.Action
  public getPrefixesForUser!: () => Promise<boolean>

  mounted() {
    this.rows.push({
      property: '',
      type: '',
      value: '',
      andor: ''
    })
    this.idx += 1
    this.setHeaderTitle('Advanced Search')
    this.getPrefixesForUser()
    this.interval = setInterval(this.waitForPrefixes, 500)
  }

  public waitForPrefixes() {
    if (this.prefixesforuserloaded === true) {
      clearInterval(this.interval)
      if (this.currentUser.isNATOVisitor === true) {
        this.prefixes = this.prefixesforuser
      } else {
        for (let i = 0; i < this.prefixesforuser.length; i++) {
          if (this.prefixesforuser[i].branch !== 'Allied') {
            this.prefixes.push(this.prefixesforuser[i])
          }
        }
      }
    }
  }

  public startSearch() {
    // alert('Searching!')
    let k = ''
    if (this.allwords && this.allwords.length > 2) {
      k = 'ALL(' + this.allwords + ') '
    }
    if (this.anywords && this.anywords.length > 2) {
      k += 'ANY(' + this.anywords + ') '
    }
    if (this.nowords && this.nowords.length > 2) {
      k += 'NONE(' + this.nowords + ') '
    }
    if (this.exactwords && this.exactwords.length > 2) {
      k += this.exactwords
    }
    if (this.rows.length >= 1) {
      if (this.rows.length === 1) {
        // no need to loop
        let prp = this.rows[0].property
        if (prp) {
          if (prp === 'Last Modified Date') prp = 'Write'
          if (prp === 'Last Modified By') prp = 'ModifiedBy'
          if (prp === 'Description') prp = 'AdditionalInfo'
          if (prp === 'Prefix') prp = 'PrfxOWSTEXT'
          switch (this.rows[0].type) {
            case 'Equals': {
              k += prp + '=' + this.rows[0].value
              break
            }
            case 'Does not equal': {
              k += prp + '<>' + this.rows[0].value
              break
            }
            case 'Contains': {
              k += prp + ':' + this.rows[0].value
              break
            }
            case 'Does not contain': {
              k += '-' + prp + ':' + this.rows[0].value
              break
            }
            case 'On or before': {
              k += prp + '<=' + this.rows[0].value
              break
            }
            case 'On or after': {
              k += prp + '>=' + this.rows[0].value
              break
            }
          }
        }
      } else {
        // loop through all the rows to see if the user selected filters
        k += ' ('
        for (let i = 0; i < this.rows.length; i++) {
          // console.log('ROW: ' + this.rows[i])
          let prp = this.rows[i].property
          if (prp === 'Last Modified Date') prp = 'Write'
          if (prp === 'Last Modified By') prp = 'ModifiedBy'
          if (prp === 'Description') prp = 'AdditionalInfo'
          if (prp === 'Prefix') prp = 'PrfxOWSTEXT'
          switch (this.rows[i].type) {
            case 'Equals': {
              k += prp + '=' + this.rows[i].value
              break
            }
            case 'Does not equal': {
              k += prp + '<>' + this.rows[i].value
              break
            }
            case 'Contains': {
              k += prp + ':' + this.rows[i].value
              break
            }
            case 'Does not contain': {
              k += '-' + prp + ':' + this.rows[i].value
              break
            }
            case 'On or before': {
              k += prp + '<=' + this.rows[i].value
              break
            }
            case 'On or after': {
              k += prp + '>=' + this.rows[i].value
              break
            }
          }
          if (i < this.rows.length - 1) {
            k += ' ' + this.rows[i].andor + ' '
          }
        }
        k += ')'
      }
    }
    this.$router.push({ path: '/search/results/query/' + k })
    // this.$router.push({ name: 'Search Results', query: { k: k } })
  }

  public addSearchPropRow() {
    this.rows.push({
      property: '',
      type: '',
      value: '',
      andor: ''
    })
    this.idx += 1
  }

  public removeSearchPropRow(index: number) {
    this.rows.splice(index, 1)
    this.idx -= 1
  }
}
</script>

<style>
.searchprops {
  text-align: right;
  align-self: center;
  /* font-family: 'Arial', Gadget, sans-serif;
  font-variant: small-caps;
  font-style: italic;
  font-size: 36px; */
}

.mt-100px {
  margin-top: 100px;
}
</style>
