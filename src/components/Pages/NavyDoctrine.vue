<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="contentHeight m-0 p-0">
          <!-- <b-row no-gutters class="banner" :style="{ backgroundImage: 'url(' + baseImageUrl + '/banner.jpg)' }">
            <b-col cols="12">
              <b-container fluid class="m-0 p-0">
                <b-row no-gutters class="titleRow">
                  <div class="mx-auto text-center text-light">
                    <div class="upper" id="NWLTitle">
                      Welcome to The Navy Warfare Library
                    </div>
                    <div class="pubType" align="center">
                      The Navy Warfare Library (NWL) is the authoritative repository for Navy Doctrine and terminology.
                    </div>
                  </div>
                </b-row>
              </b-container>
            </b-col>
          </b-row> -->
          <b-row no-gutters>
            <b-col cols="4"></b-col>
            <b-col cols="4" class="m-0 p-1 bg-white">
              <b-link :to="{ name: 'View Publication', query: { Id: 158, Nato: 'No' } }">
                <b-card no-body header-tag="header">
                  <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                    ><h4 class="text-white p-0 mb-0">
                      Naval Warfare NDP 1
                    </h4></b-card-header
                  >
                </b-card>
              </b-link>
            </b-col>
          </b-row>
          <b-row no-gutters>
            <b-col cols="2" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                  ><h4 class="text-white p-0 mb-0">
                    General / Reference
                  </h4></b-card-header
                >
                <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP105' } }">1-05 Religious Ministry Support</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP110' } }">1-10 Tactical Reference</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP111' } }">1-11 Platform Capabilities</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP114' } }">1-14 Law</b-link>
                    </p>
                  </ul>
                </b-card-body>
              </b-card>
            </b-col>

            <b-col cols="2" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                  ><h4 class="text-white p-0 mb-0">
                    Intelligence
                  </h4></b-card-header
                >
                <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP200' } }">2-0 Navy Intelligence</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP201' } }">2-01 Intelligence Support</b-link>
                    </p>
                  </ul>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col cols="2" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                  ><h4 class="text-white p-0 mb-0">
                    Operations
                  </h4></b-card-header
                >
                <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <p>
                      <b-link :to="{ name: 'View Publication', query: { Id: 288, Nato: 'No' } }">3 Fleet Warfare</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP301' } }">3-01 Air Defense</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP302' } }">3-02 Amphibious Ops</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP305' } }">3-05 Naval Special Warfare</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP307' } }">3-07 MOOTW</b-link>
                    </p>
                    <p><b-link :to="{ name: 'All Publications', query: { Type: 'NWP309' } }">3-09 Strike and Fire Support</b-link></p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP310' } }">3-10 Expeditionary Warfare</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP311' } }">3-11 CBR-D</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP312' } }">3-12 Cyberspace Ops</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP313' } }">3-13 Information Ops</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP315' } }">3-15 Mine Warfare</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP320' } }">3-20 Surface Warfare</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP321' } }">3-21 Undersea Warfare</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP322' } }">3-22 Naval Aviation Warfare</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP329' } }">3-29 Disaster Response Ops</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP330' } }">3-30 Naval C2 of Air Ops</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP332' } }">3-32 Maritime Ops at the OLW</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP356' } }">3-56 Operational C2</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP358' } }">3-58 Military Deception</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP359' } }">3-59 Oceanography</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP360' } }">3-60 Targeting</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP361' } }">3-61 Public Affairs</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP362' } }">3-62 Seabasing</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP363' } }">3-63 Computer Network Ops</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP372' } }">3-72 Nuclear Ops</b-link>
                    </p>
                  </ul>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col cols="2" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                  ><h4 class="text-white p-0 mb-0">
                    Logistics
                  </h4></b-card-header
                >
                <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP400' } }">4-0 Naval Logistics</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP401' } }">4-01 Transportation</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP402' } }">4-02 Health Protection</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP404' } }">4-04 Naval Engineering</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP408' } }">4-08 Supply</b-link>
                    </p>
                    <p><b-link :to="{ name: 'All Publications', query: { Type: 'NWP409' } }">4-09 Other Logistic Services</b-link></p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP410' } }">4-10 Conventional Ordnance</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP411' } }">4-11 Environmental</b-link>
                    </p>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP412' } }">4-12 Salvage</b-link>
                    </p>
                  </ul>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col cols="2" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                  ><h4 class="text-white p-0 mb-0">
                    Planning
                  </h4></b-card-header
                >
                <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <p>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP501' } }">5-01 Operational Planning</b-link>
                    </p>
                  </ul>
                </b-card-body>
              </b-card>
            </b-col>

            <b-col cols="2" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                  ><h4 class="text-white p-0 mb-0">
                    Communications
                  </h4></b-card-header
                >
                <!-- <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Value: 'Air NTTP' } }">Air NTTP</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'Allied' } }">Allied Publications</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'Joint' } }">Joint Publications</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'Multinational' } }">Multinational Publications</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Value: 'Navy Concept Pubs' } }">Navy Concepts</b-link>
                    </li>
                    <li><b-link :to="{ name: 'All Publications', query: { Type: 'CONOPS' } }">Fleet CONOPS</b-link></li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'OPTASK' } }">Navy-wide OPTASKS</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Value: 'Universal Naval Task List' } }">Universal Naval Task List (UNTL)</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'FXP' } }">Fleet Exercise Publications (Archive)</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NTP' } }">Naval Telecommunications Procedures (NTPs)</b-link>
                    </li>
                    <li>
                      <a href="/SitePages/bookshelves.aspx">Mission Area Bookshelves</a>
                    </li>
                  </ul>
                </b-card-body> -->
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
import { ObjectItem } from '@/interfaces/ObjectItem'
import { Announcement } from '@/interfaces/Announcement'
import { namespace } from 'vuex-class'

const support = namespace('support')

@Component({
  name: 'NavyDoctrine'
})
export default class NavyDoctrine extends Vue {
  @Prop({ default: process.env.VUE_APP_BASE_IMAGE_URL })
  readonly baseImageUrl!: string

  @support.State
  public bookshelves!: Array<ObjectItem>

  @support.State
  public announcements!: Array<Announcement>

  @support.Action
  public getBS!: () => Promise<boolean>

  @support.Action
  public getAnnouncements!: () => Promise<boolean>

  public interval: any

  mounted() {
    this.getBS().then(response => {
      if (response) {
        console.log('Bookshelves Loaded')
        this.getAnnouncements().then(response => {
          if (response) {
            console.log('Announcements Loaded')
          }
        })
      }
    })
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
p {
  font-size: '12px' !important;
  margin-top: '0px' !important;
  margin-bottom: '0px' !important;
}
</style>
