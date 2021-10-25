<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="contentHeight m-0 p-0">
          <b-row no-gutters>
            <b-col cols="12" class="m-0 p-0 bg-blue-600">
              <b-carousel fade controls interval="10000">
                <b-carousel-slide v-for="announcement in announcements" :key="announcement">
                  <template #img>
                    <b-container fluid class="py100">
                      <b-row>
                        <b-col md="4" class="centerFlex py100">
                          <h5 class="text-white">{{ announcement.Title }}</h5>
                          <h6 class="text-white">
                            {{ announcement.Modified }}
                          </h6>
                          <h6 class="text-white">
                            {{ announcement.ModifiedBy.Title }}
                          </h6>
                        </b-col>
                        <b-col md="8" class="centerFlex py100">
                          <span class="text-white" v-html="limitText(announcement.Info)"></span>
                          <!-- <h5 class="text-white">
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
          <b-row no-gutters class="banner" :style="{ backgroundImage: 'url(' + baseImageUrl + '/headeridealightnew.png)' }">
            <b-col cols="12">
              <b-container fluid class="m-0 p-0">
                <b-row no-gutters class="titleRow">
                  <div class="mx-auto text-center text-light bannerbackground">
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
            <b-col cols="4" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0">
                  <h4 class="text-white p-0 mb-0">
                    Navy Doctrinal Publications
                  </h4>
                </b-card-header>
                <b-card-body class="p-1">
                  <b-list-group>
                    <b-link :to="{ name: 'NavyDoctrine' }">
                      <b-list-group-item variant="blue-800" class="flex-column align-items-start">
                        <b-card no-body class="p-1">
                          <b-row no-gutters>
                            <b-col md="2">
                              <!-- <font-awesome-icon fas icon="book-open" class="pubicon text-success"></font-awesome-icon> -->
                              <div>
                                <img
                                  class="icon"
                                  img
                                  src="data:image/png;base64,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"
                                  height="65"
                                />
                              </div>
                            </b-col>
                            <b-col md="10" class="p-1">
                              <b-card-sub-title>Navy Doctrine</b-card-sub-title>
                              <b-card-title>NDP, NWP</b-card-title>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-list-group-item>
                    </b-link>
                    <b-list-group-item variant="blue-800" class="flex-column align-items-start">
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NTTP' } }">
                        <b-card no-body class="p-1">
                          <b-row no-gutters>
                            <b-col md="2">
                              <!-- <font-awesome-icon fas icon="project-diagram" class="pubicon text-info"></font-awesome-icon> -->
                              <div>
                                <img
                                  class="icon"
                                  img
                                  src="data:image/png;base64,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"
                                  height="65"
                                />
                              </div>
                            </b-col>
                            <b-col md="10" class="p-1">
                              <b-card-sub-title>Navy Tactics, Techniques and Procedures</b-card-sub-title>
                              <b-card-title>NTTP, MTTP</b-card-title>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-link>
                    </b-list-group-item>
                    <b-list-group-item variant="blue-800" class="flex-column align-items-start">
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NTRP' } }">
                        <b-card no-body class="p-1">
                          <b-row no-gutters>
                            <b-col md="2">
                              <!-- <font-awesome-icon fas icon="book" class="pubicon text-danger"></font-awesome-icon> -->
                              <div>
                                <img
                                  class="icon"
                                  img
                                  src="data:image/png;base64,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"
                                  height="65"
                                />
                              </div>
                            </b-col>
                            <b-col md="10" class="p-1">
                              <b-card-sub-title>Navy Reference Publication</b-card-sub-title>
                              <b-card-title>NTRP</b-card-title>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-link>
                    </b-list-group-item>
                    <b-list-group-item variant="blue-800" href="#" class="flex-column align-items-start">
                      <b-link :to="{ name: 'All Publications', query: { Type: 'TTP' } }">
                        <b-card no-body class="p-1">
                          <b-row no-gutters>
                            <b-col md="2">
                              <!-- <font-awesome-icon fas icon="lightbulb" class="pubicon text-warning"></font-awesome-icon> -->
                              <div>
                                <img
                                  class="icon"
                                  img
                                  src="data:image/png;base64,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"
                                  height="65"
                                />
                              </div>
                            </b-col>
                            <b-col md="10" class="p-1">
                              <b-card-sub-title>Navy Development TTP</b-card-sub-title>
                              <b-card-title>TACMEMO, TACBUL, TACNOTE</b-card-title>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-link>
                    </b-list-group-item>
                  </b-list-group>
                </b-card-body>
              </b-card>
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                  ><h4 class="text-white p-0 mb-0">
                    Bookshelves
                  </h4></b-card-header
                >
                <b-card-body body-class="p-1">
                  <b-form-select class="form-control-bookshelf" v-model="shelf" :options="bookshelves" ref="Bookshelves" @change="onShelfSelected"></b-form-select>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col cols="4" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                  ><h4 class="text-white p-0 mb-0">
                    Warfighting Collections
                  </h4></b-card-header
                >
                <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Value: 'Air NTTP' } }">Air NTTP</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'Allied Publications' }">Allied Publications</b-link>
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
                      <b-link :to="{ name: 'View Publication', query: { Id: 1, Nato: 'No' } }">Universal Naval Task List (UNTL)</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'FXP' } }">Fleet Exercise Publications (Archive)</b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Type: 'NTP' } }">Naval Telecommunications Procedures (NTPs)</b-link>
                    </li>
                  </ul>
                </b-card-body>
              </b-card>
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                  ><h4 class="text-white p-0 mb-0">
                    Warfighting Reference Materials
                  </h4></b-card-header
                >
                <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Value: 'Strategy Documents' } }">Strategy Documents</b-link>
                    </li>
                    <li>
                      <a href="/pubs/Forms/Archived%20Documents%20Broken.aspx">Archived Documents</a>
                    </li>
                    <li>
                      <b-link :to="{ name: 'All Publications', query: { Value: 'Commander Handbook' } }">Commander’s Handbooks</b-link>
                    </li>
                    <li><b-link :to="{ name: 'All Publications', query: { Value: 'Writing Guidance' } }">Writing Guidance</b-link></li>
                    <li title="Coming soon!">
                      <a href="#">Selected Instructions</a>
                    </li>
                  </ul>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col cols="4" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                  ><h4 class="text-white p-0 mb-0">
                    Top Publications
                  </h4></b-card-header
                >
                <b-card-body body-class="p-1"></b-card-body>
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
  name: 'Home'
})
export default class Home extends Vue {
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
  public shelf!: any

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

  onShelfSelected() {
    this.$router.push({ name: 'All Publications', query: { Value: this.shelf } })
  }
}
</script>

<style lang="scss">
#NWLTitle {
  text-align: center;
  font-family: 'Arial', Gadget, sans-serif;
  font-variant: small-caps;
  font-style: italic;
  font-size: 36px;
}
.bannerbackground {
  background-color: #00000055 !important;
  box-shadow: 0 0 1.5px 1.5px #919191;
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
