<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="contentHeight m-0 p-0">
          <b-row no-gutters>
            <b-col cols="12" class="m-0 p-0">
              <b-carousel>
                <b-carousel-slide v-for="announcement in announcements" :key="announcement">
                  <template #img>
                    <b-container fluid class="py100">
                      <b-row>
                        <b-col md="4" class="centerFlex py100">
                          <h5 class="text-black">{{ announcement.Title }}</h5>
                          <h6 class="text-black">
                            {{ announcement.Modified }}
                          </h6>
                          <h6 class="text-black">
                            {{ announcement.ModifiedBy.Title }}
                          </h6>
                        </b-col>
                        <b-col md="8" class="centerFlex py100">
                          <span class="text-black" v-html="limitText(announcement.Info)"></span>
                          <!-- <h5 class="text-black">
                            <a :href="announcement.link">{{ announcement.title }}</a>
                          </h5> -->
                        </b-col>
                      </b-row>
                    </b-container>
                  </template>
                </b-carousel-slide>
              </b-carousel>
            </b-col>
          </b-row>
          <b-row no-gutters class="banner" :style="{ backgroundImage: 'url(' + baseImageUrl + '/banner.jpg)' }">
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
            <!-- <b-col cols="6"></b-col> -->
          </b-row>
          <b-row no-gutters>
            <b-col cols="12" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                  ><h4 class="text-white p-0 mb-0">
                    Naval Warfare NDP 1
                  </h4></b-card-header
                >
                <b-card-body body-class="card-body-center p-1">
                  <ul>
                    <b-link :to="{ name: 'View Publication', query: { Id: 158, Nato: 'No' } }">NDP 1</b-link>
                  </ul>
                </b-card-body>
              </b-card>
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
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 283, Nato: 'No' } }">1-05 Religious Ministry Support</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 0, Nato: 'No' } }">1-10 Tactical Reference</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'Joint' } }">1-11 Platform Capabilities</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 285, Nato: 'No' } }">1-14 Law</b-link>
                    </li>
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
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 286, Nato: 'No' } }">2-0 Navy Intelligence</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 287, Nato: 'No' } }">2-01 Intelligence Support</b-link>
                    </li>
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
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 288, Nato: 'No' } }">3 Fleet Warfare</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 289, Nato: 'No' } }">3-01 Air Defense</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NWP302' } }">3-02 Amphibious Ops</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Field: 'FunctionalSeries', Value: 'Navy 3-05 Naval Special Warfare' } }">3-05 Naval Special Warfare</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Value: 'Navy Concept Pubs' } }">3-07 MOOTW</b-link>
                    </li>
                    <b-link :to="{ name: 'View Publication', query: { Id: 297, Nato: 'No' } }">3-09 Strike and Fire Support</b-link>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 298, Nato: 'No' } }">3-10 Expeditionary Warfare</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 299, Nato: 'No' } }">3-11 CBR-D</b-link>
                    </li>
                    <li>
                      <!-- Need to upload pub and change the ID for 3-12 Cyberspace Ops-->
                      <b-link :to="{ name: 'View Publication', query: { Id: 0, Nato: 'No' } }">3-12 Cyberspace Ops</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NTP' } }">3-13 Information Ops</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NTP' } }">3-15 Mine Warfare</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NTP' } }">3-20 Surface Warfare</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NTP' } }">3-21 Undersea Warfare</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NTP' } }">3-22 Naval Aviation Warfare</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 303, Nato: 'No' } }">3-29 Disaster Response Ops</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 304, Nato: 'No' } }">3-30 Naval C2 of Air Ops</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 305, Nato: 'No' } }">3-32 Maritime Ops at the OLW</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 306, Nato: 'No' } }">3-56 Operational C2</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NTP' } }">3-58 Military Deception</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 574, Nato: 'No' } }">3-59 Oceanography</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NTP' } }">3-60 Targeting</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NTP' } }">3-61 Public Affairs</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 307, Nato: 'No' } }">3-62 Seabasing</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NTP' } }">3-63 Computer Network Ops</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 548, Nato: 'No' } }">3-72 Nuclear Ops</b-link>
                    </li>
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
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 308, Nato: 'No' } }">4-0 Naval Logistics</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'Allied' } }">4-01 Transportation</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 311, Nato: 'No' } }">4-02 Health Protection</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 312, Nato: 'No' } }">4-04 Naval Engineering</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 313, Nato: 'No' } }">4-08 Supply</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 314, Nato: 'No' } }">4-09 Other Logistic Services</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'OPTASK' } }">4-10 Conventional Ordnance</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Value: 'Universal Naval Task List' } }">4-11 Environmental</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 315, Nato: 'No' } }">4-12 Salvage</b-link>
                    </li>
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
                    <li>
                      <b-link :to="{ name: 'View Publication', query: { Id: 316, Nato: 'No' } }">5-01 Operational Planning</b-link>
                    </li>
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
</style>
