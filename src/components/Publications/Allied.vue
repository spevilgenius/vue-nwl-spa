<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters>
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="m-0 p-0">
          <b-row no-gutters class="titleRow">
            <div class="mx-auto text-center">
              <div class="upper" id="NWLTitle">Allied Publications Library</div>
            </div>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
    <b-row no-gutters>
      <b-col cols="3"></b-col>
      <b-col cols="3" class="m-0 p-1 bg-white">
        <b-card no-body header-tag="header">
          <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">NATO Warfighting Publications</h4></b-card-header>
          <b-card-body class="p-1">
            <b-list-group>
              <b-list-group-item variant="blue-800" class="flex-column align-items-start">
                <b-link :to="{ path: '/pubs/approved/allied/filtered/field/Prfx/ATP', meta: { title: 'ATP Publications' } }">
                  <b-card no-body class="p-1">
                    <b-row no-gutters>
                      <b-col class="p-1">
                        <b-card-sub-title><b>Allied Tactical Publications</b></b-card-sub-title>
                        <b-card-title>ATP</b-card-title>
                      </b-col>
                    </b-row>
                  </b-card>
                </b-link>
              </b-list-group-item>
              <b-list-group-item variant="blue-800" class="flex-column align-items-start">
                <b-link :to="{ path: '/pubs/approved/allied/filtered/field/Prfx/AJP', meta: { title: 'AJP Publications' } }">
                  <b-card no-body class="p-1">
                    <b-row no-gutters>
                      <b-col class="p-1">
                        <b-card-sub-title>Allied Joint Publications</b-card-sub-title>
                        <b-card-title>AJP</b-card-title>
                      </b-col>
                    </b-row>
                  </b-card>
                </b-link>
              </b-list-group-item>
              <b-list-group-item variant="blue-800" class="flex-column align-items-start">
                <b-link :to="{ path: '/pubs/approved/allied/filtered/field/Prfx/AMP', meta: { title: 'AMP Publications' } }">
                  <b-card no-body class="p-1">
                    <b-row no-gutters>
                      <b-col class="p-1">
                        <b-card-sub-title>Allied Mine Warfare Publications</b-card-sub-title>
                        <b-card-title>AMP</b-card-title>
                      </b-col>
                    </b-row>
                  </b-card>
                </b-link>
              </b-list-group-item>
            </b-list-group>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="3" class="m-0 p-1 bg-white">
        <b-card no-body header-tag="header">
          <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">Other key NATO Publications</h4></b-card-header>
          <b-card-body body-class="card-body-left p-1">
            <ul>
              <p>
                <b-link :to="{ path: '/pubs/approved/allied/filtered/field/Prfx/AAP', meta: { title: 'AAP Publications' } }">Administrative (AAPs)</b-link>
              </p>
              <p>
                <b-link :to="{ path: '/pubs/approved/allied/filtered/field/Prfx/APP', meta: { title: 'Procedural Publications (APPs)' } }">Procedural Publications (APPs)</b-link>
              </p>
              <p>
                <b-link :to="{ path: '/pubs/approved/allied/filtered/field/Prfx/AEP', meta: { title: 'Engineering Publications (AEPs)' } }">Engineering Publications (AEPs)</b-link>
              </p>
              <p>
                <b-link :to="{ path: '/pubs/approved/allied/filtered/field/Prfx/ANEP', meta: { title: 'Naval Engineering Publications (ANEPs)' } }">Naval Engineering (ANEPs)</b-link>
              </p>
              <p>
                <!-- <b-link :to="{ path: '/pubs/approved/allied/filtered/field/Prfx/AWP', meta: { title: 'Meteorology and Oceanography (AMETOCPs/AWPs)' } }">Meteorology and Oceanography (AMETOCPs/AWPs)</b-link> -->
                <b-link :to="{ name: 'Meteorology', params: { filterType: 'Meteorology' } }">Meteorology and Oceanography (AMETOCPs/AWPs)</b-link>
              </p>
              <p>
                <b-link :to="{ path: '/pubs/approved/allied/filtered/field/Prfx/AHP', meta: { title: 'Hydrographic Publications (AHPs)' } }">Hydrographic Publications (AHPs)</b-link>
              </p>
              <p>
                <b-link :to="{ path: '/pubs/approved/allied/filtered/field/Prfx/ADivP', meta: { title: 'Diving Publications (ADIVPs)' } }">Diving Publications (ADIVPs)</b-link>
              </p>
              <p>
                <b-link :to="{ path: '/pubs/approved/allied/filtered/field/Prfx/ALP', meta: { title: 'Logistics Publications (ALPs)' } }">Logistics Publications (ALPs)</b-link>
              </p>
              <p>
                <b-link :to="{ path: '/pubs/approved/allied/filtered/field/Prfx/AXP', meta: { title: 'Exercise Publications (AXPs)' } }">Exercise Publications (AXPs)</b-link>
              </p>
              <p>
                <b-link :to="{ path: '/pubs/approved/allied/filtered/field/Tags/NATO Specialist', meta: { title: 'NATO Specialist Publications (AAEP, ACOMP etc)' } }">NATO Specialist Publications (AAEP, ACOMP etc)</b-link>
              </p>
            </ul>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="3">
        <a href="https://www.nato.int">
          <img :src="baseImageUrl + '/NatoImage233x117.jpg'" />
        </a>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const support = namespace('support')

@Component({
  name: 'Allied'
})
export default class Allied extends Vue {
  @Prop({ default: process.env.VUE_APP_BASE_IMAGE_URL }) readonly baseImageUrl!: string
  @Prop() readonly title!: string

  @support.Action
  public setHeaderTitle!: (title: string) => void

  mounted() {
    this.setHeaderTitle('Allied Publications')
  }
}
</script>

<style lang="scss" scoped>
#NWLTitle {
  text-align: center;
  font-family: 'Arial', Gadget, sans-serif;
  font-variant: small-caps;
  font-style: italic;
  font-size: 36px;
  font-weight: bold;
}
.pubType {
  font-family: 'Arial';
  font-size: 14pt;
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
a {
  color: black !important;
}
</style>
