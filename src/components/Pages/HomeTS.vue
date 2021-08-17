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
                    <b-card no-body class="">
                      <b-row no-gutters>
                        <b-col md="4" class="centerFlex">
                          <h4 class="text-black">{{ announcement.title }}</h4>
                          <h5 class="text-black">{{ announcement.date }}</h5>
                          <h5 class="text-black">{{ announcement.author }}</h5>
                        </b-col>
                        <b-col md="8">
                          <b-row class="text-center">
                            <b-card-text class=" text-black">{{ announcement.description }}</b-card-text>
                          </b-row>
                          <b-row class="text-center">
                            <h5 class="text-black">
                              <a :href="announcement.link">{{ announcement.title }}</a>
                            </h5>
                          </b-row>
                        </b-col>
                      </b-row>
                    </b-card>
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
                    <div class="upper" id="NWLTitle">Welcome to The Navy Warfare Library</div>
                    <div class="pubType" align="center">The Navy Warfare Library (NWL) is the authoritative repository for Navy Doctrine and terminology.</div>
                  </div>
                </b-row>
              </b-container>
            </b-col>
            <!-- <b-col cols="6"></b-col> -->
          </b-row>
          <b-row no-gutters>
            <b-col cols="4" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="info" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">Navy Doctrinal Publications</h4></b-card-header>
                <b-card-body class="p-1">
                  <b-list-group>
                    <b-list-group-item variant="info" href="#" class="flex-column align-items-start">
                      <b-card no-body class="p-1">
                        <b-row no-gutters>
                          <b-col md="2">
                            <font-awesome-icon fas icon="book-open" class="pubicon text-green"></font-awesome-icon>
                          </b-col>
                          <b-col md="10" class="p-1">
                            <b-card-sub-title>Navy Doctrine</b-card-sub-title>
                            <b-card-title>NDP, NWP</b-card-title>
                          </b-col>
                        </b-row>
                      </b-card>
                    </b-list-group-item>
                    <b-list-group-item variant="info" href="#" class="flex-column align-items-start">
                      <b-card no-body class="p-1">
                        <b-row no-gutters>
                          <b-col md="2">
                            <font-awesome-icon fas icon="project-diagram" class="pubicon text-yellow"></font-awesome-icon>
                          </b-col>
                          <b-col md="10" class="p-1">
                            <b-card-sub-title>Navy Tactics, Techniques and Procedures</b-card-sub-title>
                            <b-card-title>NTTP, MTTP</b-card-title>
                          </b-col>
                        </b-row>
                      </b-card>
                    </b-list-group-item>
                    <b-list-group-item variant="info" href="#" class="flex-column align-items-start">
                      <b-card no-body class="p-1">
                        <b-row no-gutters>
                          <b-col md="2">
                            <font-awesome-icon fas icon="book" class="pubicon text-red"></font-awesome-icon>
                          </b-col>
                          <b-col md="10" class="p-1">
                            <b-card-sub-title>Navy Reference Publication</b-card-sub-title>
                            <b-card-title>NTRP</b-card-title>
                          </b-col>
                        </b-row>
                      </b-card>
                    </b-list-group-item>
                    <b-list-group-item variant="info" href="#" class="flex-column align-items-start">
                      <b-card no-body class="p-1">
                        <b-row no-gutters>
                          <b-col md="2">
                            <font-awesome-icon fas icon="lightbulb" class="pubicon text-orange"></font-awesome-icon>
                          </b-col>
                          <b-col md="10" class="p-1">
                            <b-card-sub-title>Navy Development TTP</b-card-sub-title>
                            <b-card-title>TACMEMO, TACBUL, TACNOTE</b-card-title>
                          </b-col>
                        </b-row>
                      </b-card>
                    </b-list-group-item>
                  </b-list-group>
                </b-card-body>
              </b-card>
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="info" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">Bookshelves</h4></b-card-header>
                <b-card-body body-class="p-1">
                  <b-form-select class="form-control-bookshelf" :options="bookshelves" ref="Bookshelves" @change="onShelfSelected"></b-form-select>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col cols="4" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="info" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">Warfighting Collections</h4></b-card-header>
                <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <li><a href="/pubs/Forms/nttp.aspx?FilterField1=funcSeries&amp;FilterValue1=7 Series - Air NTTP">Air NTTP</a></li>
                    <li><a href="/Pages/alliedHome.aspx">Allied Publications</a></li>
                    <li><a href="/pubs/Forms/joint.aspx">Joint Publications</a></li>
                    <li><a href="/pubs/Forms/multinational.aspx">Multinational Publications</a></li>
                    <li><a href="/pubs/Forms/concepts.aspx">Navy Concepts</a></li>
                    <li><a href="/pubs/Forms/conops.aspx">Fleet CONOPS</a></li>
                    <li><a href="/pubs/Forms/optasks.aspx">Navy-wide OPTASKS</a></li>
                    <li><a href="/pubs/Forms/AllItems.aspx?View={099D2171-BB61-4DEC-8364-56D897AC04F1}&amp;FilterField1=funcSeries&amp;FilterValue1=Universal%20Naval%20Task%20List">Universal Naval Task List (UNTL)</a></li>
                    <li><a href="/pubs/Forms/AllItems.aspx?View={099D2171-BB61-4DEC-8364-56D897AC04F1}&amp;FilterField1=Prefix&amp;FilterValue1=FXP">Fleet Exercise Publications (Archive)</a></li>
                    <li><a href="/pubs/Forms/AllItems.aspx?View={099D2171-BB61-4DEC-8364-56D897AC04F1}&amp;FilterField1=Prefix&amp;FilterValue1=NTP">Naval Telecommunications Procedures (NTPs)</a></li>
                    <li><a href="/SitePages/bookshelves.aspx">Mission Area Bookshelves</a></li>
                  </ul>
                </b-card-body>
              </b-card>
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="info" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">Warfighting Reference Materials</h4></b-card-header>
                <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <li><a href="/pubs/Forms/Strategy.aspx">Strategy Documents</a></li>
                    <li><a href="/pubs/Forms/Archived%20Documents%20Broken.aspx">Archived Documents</a></li>
                    <li><a href="/pubs/Forms/AllItems.aspx?View={099D2171-BB61-4DEC-8364-56D897AC04F1}&amp;FilterField1=funcSeries&amp;FilterValue1=Commander%27s%20Handbooks">Commander’s Handbooks</a></li>
                    <li><a href="/pubs/Forms/AllItems.aspx?View={099D2171-BB61-4DEC-8364-56D897AC04F1}&amp;FilterField1=funcSeries&amp;FilterValue1=Writing%20Guidance">Writing Guidance</a></li>
                    <li title="Coming soon!"><a href="#">Selected Instructions</a></li>
                  </ul>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col cols="4" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="info" header-text-variant="white" class="p-0"><h4 class="text-white p-0 mb-0">Top Publications</h4></b-card-header>
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
  @Prop({ default: process.env.VUE_APP_BASE_IMAGE_URL }) readonly baseImageUrl!: string

  @support.State
  public bookshelves!: Array<ObjectItem>

  @support.State
  public announcements!: Array<Announcement>

  @support.Action
  public getBS!: () => Promise<boolean>

  @support.Action
  public getAnnouncements!: () => Promise<boolean>

  public interval: any
  /* public cards: Array<any> = [
    {
      title: 'Title 1',
      subtitle: 'Sub-title',
      text: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin congue massa felis, finibus dignissim augue lacinia id. Proin efficitur leo massa, eget faucibus est rhoncus eget.'
    },
    {
      title: 'Title 2',
      subtitle: 'Sub-title',
      text: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin congue massa felis, finibus dignissim augue lacinia id. Proin efficitur leo massa, eget faucibus est rhoncus eget.'
    },
    {
      title: 'Title 3',
      subtitle: 'Sub-title',
      text: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin congue massa felis, finibus dignissim augue lacinia id. Proin efficitur leo massa, eget faucibus est rhoncus eget.'
    }
  ] */

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
  background-color: #fff;
  border: none;
}
.card-body-left {
  font-family: 'Arial';
  font-size: 16px;
  text-align: left !important;
}
.card-body-left li a {
  color: black !important;
}
.centerFlex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1ch;
}
</style>
