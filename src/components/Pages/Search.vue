<template>
  <b-card no-gutters fluid class="contentHeight" style="min-width: 800px">
    <b-card-header>
      <b-row style="padding-left:15px;">
        Search
      </b-row>
    </b-card-header>
    <b-card-body class="m-0 p-0">
      <b-container fluid class="mt-100px p-0">
        <b-row>
          <b-col cols="2"></b-col>
          <b-col cols="10" class="mb-1 p-0" style="font-size:large; text-align:left">
            Find documents that have...
          </b-col>
        </b-row>
        <b-row class="searchprops">
          <b-col cols="1" class="m-0 p-0"></b-col>
          <b-col cols="4" class="mt-1 p-0 font-size-large">All of these words:</b-col>
          <b-col cols="4" class="mb-1 p-0"><b-form-input v-model="text" size="sm"></b-form-input></b-col>
          <b-col cols="3" class="m-0 p-0"></b-col>
        </b-row>
        <b-row class="searchprops">
          <b-col cols="1" class="m-0 p-0"></b-col>
          <b-col cols="4" class="mt-1 p-0">The exact phrase:</b-col>
          <b-col cols="4" class="mb-1 p-0"><b-form-input v-model="text" size="sm"></b-form-input></b-col>
          <b-col cols="3" class="m-0 p-0"></b-col>
        </b-row>
        <b-row class="searchprops">
          <b-col cols="1" class="m-0 p-0"></b-col>
          <b-col cols="4" class="mt-1 p-0">Any of these words:</b-col>
          <b-col cols="4" class="mb-1 p-0"><b-form-input v-model="text" size="sm"></b-form-input></b-col>
          <b-col cols="3" class="m-0 p-0"></b-col>
        </b-row>
        <b-row class="searchprops">
          <b-col cols="1" class="m-0 p-0"></b-col>
          <b-col cols="4" class="mt-1 p-0">None of these words:</b-col>
          <b-col cols="4" class="mb-1 p-0"><b-form-input v-model="text" size="sm"></b-form-input></b-col>
          <b-col cols="3" class="m-0 p-0"></b-col>
        </b-row>
        <b-row no-gutters>
          <b-col cols="2" class="m-0 p-0"></b-col>
          <b-row cols="10" class="mt-3 mb-1 p-0" style="font-size:large">Add Property Restrictions...</b-row>
        </b-row>

        <b-container fluid>
          <b-row v-for="row in rows" :key="row"> {{ rows.pickpropfields }}{{ rows.containsfields }}{{ rows.searchrestrictiontext }}{{ rows.andorfields }} </b-row>
        </b-container>

        <!-- <b-container fluid class="m-0 p-0" id="propertyrestrictions">
          <b-row no-gutters>
            <b-col cols="2" class="m-0 p-0 searchprops">Where the Property...</b-col>
            <b-col cols="2" class="m-0 pl-1"><b-form-select :options="pickpropfields" size="sm"></b-form-select></b-col>
            <b-col cols="2" class="m-0 pl-1"><b-form-select :options="containsfields" size="sm"></b-form-select></b-col>
            <b-col cols="3" class="m-0 pl-1"><b-form-input v-model="text" size="sm"></b-form-input></b-col>
            <b-col cols="2" class="m-0 pl-1"><b-form-select :options="andorfields" size="sm"></b-form-select></b-col>
            <b-col cols="1" class="m-0 pl-1"
              ><a
                href="#"
                @click="
                  addSearchPropRow()
                  return false
                "
              >
                <img :src="baseImageUrl + '/advadd.png'" />
              </a>
              &nbsp;
              <a
                href="#"
                @click="
                  removeSearchPropRow()
                  return false
                "
              >
                <img :src="baseImageUrl + '/advminus.png'" /> </a
            ></b-col>
          </b-row>
        </b-container> -->
        <b-row no-gutters>
          <b-col cols="10"></b-col>
          <b-col cols="2" style="margin-top:15px; margin-bottom 15px;"><b-button @click="startSearch" variant="outline-primary" size="sm" class="">Search</b-button></b-col>
        </b-row>
        <b-row>&nbsp;</b-row>
      </b-container>
      <b-card-footer
        ><b-row no-gutters>Improve your searches with&nbsp;<a href='javascript:HelpWindowKey("WSSEndUser_SearchTips")'> search tips </a></b-row></b-card-footer
      >
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import crono from 'vue-crono'
import { namespace } from 'vuex-class'
//import { UserInt } from '../../../interfaces/User'
//import { PublicationItem } from '../../../interfaces/PublicationItem'
//import { SupportingDocItem } from '../../../interfaces/SupportingDocItem'
import axios from 'axios'
//import Searchts from 'searchts'

@Component
export default class Search extends Vue {
  @Prop({ default: process.env.VUE_APP_BASE_IMAGE_URL })
  readonly baseImageUrl!: string

  searchrestrictiontext?: any

  pickpropfields = [
    { value: null, text: '(Pick Property)' },
    { value: 'Description', text: 'Description' },
    { value: 'Name', text: 'Name' },
    { value: 'URL', text: 'URL' },
    { value: 'Last Modified Date', text: 'Last Modified Date' },
    { value: 'AdditionalData.LastPublished', text: 'Last Published' }
  ]

  containsfields = [
    { value: 'Contains', text: 'Contains' },
    { value: 'Does not contain', text: 'Does not contain' },
    { value: 'Equals', text: 'Equals' },
    { value: 'Does not equal', text: 'Does not equal' }
  ]

  andorfields = [
    { value: 'And', text: 'And' },
    { value: 'Or', text: 'Or' }
  ]

  rows = [this.pickpropfields, this.containsfields, this.searchrestrictiontext, this.andorfields]

  public startSearch() {
    alert('Searching!')
  }

  public addSearchPropRow() {
    alert('Add Clicked!')
  }

  public removeSearchPropRow() {
    alert('Remove Clicked!')
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
