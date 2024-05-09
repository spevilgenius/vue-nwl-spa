<template>
  <b-container id="doctrine" fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="contentHeight m-0 p-0">
          <b-row no-gutters>
            <b-col cols="4"></b-col>
            <b-col cols="4" class="m-0 p-1 bg-white">
              <b-link v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" :to="{ path: '/pubs/approved/all/view/158/No/5b2c13d1-be4f-4a3d-b228-c2d15285c80b/true/NDP%201,%20Naval%20Warfare.pdf' }">
                <b-card no-body header-tag="header">
                  <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">Naval Warfare NDP 1</h4></b-card-header>
                </b-card>
              </b-link>
              <b-link v-else :to="{ path: '/pubs/approved/all/view/158/No/5b2c13d1-be4f-4a3d-b228-c2d15285c80b/false/NDP%201,%20Naval%20Warfare.pdf' }">
                <b-card no-body header-tag="header">
                  <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">Naval Warfare NDP 1</h4></b-card-header>
                </b-card>
              </b-link>
            </b-col>
            <b-col cols="4"></b-col>
          </b-row>
          <b-row no-gutters>
            <b-col cols="2" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">General / Reference</h4></b-card-header>
                <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 1-05 Religious Ministry Support' }">1-05 Religious Ministry Support</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 1-10 Tactical Reference' }">1-10 Tactical Reference</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 1-11 Platform Capabilities' }">1-11 Platform Capabilities</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 1-14 Law' }">1-14 Law</b-link>
                    </li>
                  </ul>
                </b-card-body>
              </b-card>
            </b-col>

            <b-col cols="2" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">Intelligence</h4></b-card-header>
                <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/view/972/No/df307a87-e87d-4663-8d16-521eda6ae9b6/true/NWP%202%20Fleet%20Intelligence.pdf' }">2 Fleet Intelligence</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/view/286/No/02aeebfb-fd6f-4f47-a90e-5979494d4fdd/true/NWP%202-0%2C%20Naval%20Intelligence.pdf' }">2-0 Navy Intelligence</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 2-01 Intelligence Support' }">2-01 Intelligence Support</b-link>
                    </li>
                  </ul>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col cols="2" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">Operations</h4></b-card-header>
                <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <li>
                      <b-link v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" :to="{ path: '/pubs/approved/all/view/288/No/1d333452-0c16-4880-9223-eb5402c57369/true/NWP%203%2C%20Fleet%20Warfare.pdf' }">3 Fleet Warfare</b-link>
                      <b-link v-else :to="{ path: '/pubs/approved/all/view/288/No/1d333452-0c16-4880-9223-eb5402c57369/false/NWP%203%2C%20Fleet%20Warfare.pdf' }">3 Fleet Warfare</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-01 Air Defense' }">3-01 Air Defense</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-02 Amphibious Operations' }">3-02 Amphibious Ops</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-05 Naval Special Warfare' }">3-05 Naval Special Warfare</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-07 Military Operations Other Than War' }">3-07 MOOTW</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-09 Strike And Fire Support' }">3-09 Strike and Fire Support</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-10 Expeditionary Warfare' }">3-10 Expeditionary Warfare</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-11 Nuclear, Biological, Chemical Defense' }">3-11 CBR-D</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-12 Cyberspace Operations' }">3-12 Cyberspace Ops</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-13 Information Operations' }">3-13 Information Ops</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-15 Mine Warfare' }">3-15 Mine Warfare</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-20 Surface Warfare' }">3-20 Surface Warfare</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-22 Naval Aviation Warfare' }">3-22 Naval Aviation Warfare</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-29 Disaster Response Operations' }">3-29 Disaster Response Ops</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-30 Naval Command And Control Of Air Operations' }">3-30 Naval C2 of Air Ops</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy Navy 3-32 Command And Control For Joint Maritime Operations' }">3-32 Maritime Ops at the OLW</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-56 Operational Command/Control' }">3-56 Operational C2</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-58 Military Deception' }">3-58 Military Deception</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-59 Oceanography' }">3-59 Oceanography</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-60 Targeting' }">3-60 Targeting</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-61 Public Affairs' }">3-61 Public Affairs</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-62 Seabasing' }">3-62 Seabasing</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-63 Computer Network Operations' }">3-63 Computer Network Ops</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 3-72 Nuclear Operations' }">3-72 Nuclear Ops</b-link>
                    </li>
                  </ul>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col cols="2" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">Logistics</h4></b-card-header>
                <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 4-0 Naval Logistics' }">4-0 Naval Logistics</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 4-01 Transportation' }">4-01 Transportation</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 4-02 Health Protection' }">4-02 Health Protection</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 4-04 Naval Engineering' }">4-04 Naval Engineering</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 4-08 Supply' }">4-08 Supply</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 4-09 Other Logistic Services' }">4-09 Other Logistic Services</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 4-10 Conventional Ordnance' }">4-10 Conventional Ordnance</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 4-11 Environmental' }">4-11 Environmental</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 4-12 Salvage' }">4-12 Salvage</b-link>
                    </li>
                  </ul>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col cols="2" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">Planning</h4></b-card-header>
                <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <li>
                      <b-link :to="{ path: '/pubs/approved/all/filtered/NWP/FunctionalField/Navy 5-01 Operational Planning' }">5-01 Operational Planning</b-link>
                    </li>
                  </ul>
                </b-card-body>
              </b-card>
            </b-col>

            <b-col cols="2" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">Communications</h4></b-card-header>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { UserInt } from '../../interfaces/User'
import { namespace } from 'vuex-class'

const support = namespace('support')
const users = namespace('users')

@Component({
  name: 'NavyDoctrine'
})
export default class NavyDoctrine extends Vue {
  @Prop({ default: process.env.VUE_APP_BASE_IMAGE_URL })
  readonly baseImageUrl!: string

  @users.State
  public currentUser!: UserInt

  @support.Action
  public setHeaderTitle!: (title: string) => void

  public interval: any

  mounted() {
    this.setHeaderTitle('Navy Doctrine')
  }

  limitText(text: string) {
    let parser = new DOMParser()
    let doc = parser.parseFromString(text, 'text/html')
    let p = doc.getElementsByTagName('p')
    let elem = document.createElement('div') as Element
    let count = 0
    for (let i = 0; i < p.length; i++) {
      count += 1
      if (count === 1) {
        elem.innerHTML += p[i].innerHTML
      }
      if (count === 3) {
        elem.innerHTML += '<br/>' + p[i].innerHTML
      }
    }
    return elem.innerHTML
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
.card-body-center {
  font-family: 'Arial';
  font-size: 16px;
  text-align: center !important;
}
.card-body-center li a {
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
#doctrine ul,
#doctrine li {
  list-style-type: none;
}
#doctrine li a {
  margin-bottom: 0;
}
</style>
