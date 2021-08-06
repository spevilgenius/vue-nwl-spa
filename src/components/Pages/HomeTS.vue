<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="contentHeight m-0 p-0">
          <b-row no-gutters>
            <b-col cols="12" class="m-0 p-0">
              <b-carousel>
                <b-carousel-slide v-for="card in cards" :key="card">
                  <template #img>
                    <b-card no-body class="">
                      <b-row no-gutters>
                        <b-col md="4">
                          <b-card-title>{{ card.title }}</b-card-title>
                          <b-card-sub-title>{{ card.subtitle }}</b-card-sub-title>
                        </b-col>
                        <b-col md="8">
                          <b-card-text class="text-dark">{{ card.text }}</b-card-text>
                        </b-col>
                      </b-row>
                    </b-card>
                  </template>
                </b-carousel-slide>
              </b-carousel>
            </b-col>
          </b-row>
          <b-row no-gutters>
            <b-col cols="12" class="m-0 p-0">
              <div class="mx-auto text-center text-light bg-info py100">ANNOUNCEMENT</div>
            </b-col>
          </b-row>
          <b-row no-gutters>
            <b-col cols="12" class="m-0 p-0">
              <div class="mx-auto text-center text-light bg-info py80">
                <div class="upper" id="NWLTitle">Welcome to The Navy Warfare Library</div>
                <div class="pubType" align="center">The Navy Warfare Library (NWL) is the authoritative repository for Navy Doctrine and terminology.</div>
              </div>
            </b-col>
          </b-row>
          <b-row no-gutters>
            <b-col cols="4" class="m-0 p-0 bg-white">
              <div class="linksContainer">
                <span class="linkHeader">Navy Doctrinal Publications</span>
                <b-list-group>
                  <b-list-group-item href="#" class="flex-column align-items-start">
                    <b-card no-body class="">
                      <b-row no-gutters>
                        <b-col md="4">
                          <b-card-img src="https://picsum.photos/50/50/?image=20" alt="Image"></b-card-img>
                        </b-col>
                        <b-col md="8" class="p-1">
                          <b-card-sub-title>Navy Doctrine</b-card-sub-title>
                          <b-card-title>NDP, NWP</b-card-title>
                        </b-col>
                      </b-row>
                    </b-card>
                  </b-list-group-item>
                  <b-list-group-item href="#" class="flex-column align-items-start">
                    <b-card no-body class="">
                      <b-row no-gutters>
                        <b-col md="4">
                          <b-card-img src="https://picsum.photos/50/50/?image=18" alt="Image"></b-card-img>
                        </b-col>
                        <b-col md="8" class="p-1">
                          <b-card-sub-title>Navy Tactics, Techniques and Procedures</b-card-sub-title>
                          <b-card-title>NTTP, MTTP</b-card-title>
                        </b-col>
                      </b-row>
                    </b-card>
                  </b-list-group-item>
                  <b-list-group-item href="#" class="flex-column align-items-start">
                    <b-card no-body class="">
                      <b-row no-gutters>
                        <b-col md="4">
                          <b-card-img src="https://picsum.photos/50/50/?image=16" alt="Image"></b-card-img>
                        </b-col>
                        <b-col md="8" class="p-1">
                          <b-card-sub-title>Navy Reference Publication</b-card-sub-title>
                          <b-card-title>NTRP</b-card-title>
                        </b-col>
                      </b-row>
                    </b-card>
                  </b-list-group-item>
                  <b-list-group-item href="#" class="flex-column align-items-start">
                    <b-card no-body class="">
                      <b-row no-gutters>
                        <b-col md="4">
                          <b-card-img src="https://picsum.photos/50/50/?image=14" alt="Image"></b-card-img>
                        </b-col>
                        <b-col md="8" class="p-1">
                          <b-card-sub-title>Navy Development TTP</b-card-sub-title>
                          <b-card-title>TACMEMO, TACBUL, TACNOTE</b-card-title>
                        </b-col>
                      </b-row>
                    </b-card>
                  </b-list-group-item>
                </b-list-group>
              </div>
            </b-col>
            <b-col cols="4" class="m-0 p-0 bg-white">
              <div class="linksContainer">
                <span class="linkHeader">Warfighting Collections</span>
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
                <span class="linkHeader">Warfighting Reference Materials</span>
                <ul>
                  <li><a href="/pubs/Forms/Strategy.aspx">Strategy Documents</a></li>
                  <li><a href="/pubs/Forms/Archived%20Documents%20Broken.aspx">Archived Documents</a></li>
                  <li><a href="/pubs/Forms/AllItems.aspx?View={099D2171-BB61-4DEC-8364-56D897AC04F1}&amp;FilterField1=funcSeries&amp;FilterValue1=Commander%27s%20Handbooks">Commander’s Handbooks</a></li>
                  <li><a href="/pubs/Forms/AllItems.aspx?View={099D2171-BB61-4DEC-8364-56D897AC04F1}&amp;FilterField1=funcSeries&amp;FilterValue1=Writing%20Guidance">Writing Guidance</a></li>
                  <li title="Coming soon!">Selected Instructions</li>
                </ul>
              </div>
            </b-col>
            <b-col cols="4" class="m-0 p-0 bg-white"> RIGHT SIDE </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Home'
})
export default class Home extends Vue {
  public interval: any
  public cards: Array<any> = [
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
  ]
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
  font-size: 16pt;
}
.linkHeader {
  color: #000 !important;
  text-decoration: underline;
  font-family: 'Arial';
  font-size: 16pt;
  font-weight: bold;
  text-align: left;
}
.linksContainer li {
  font-family: 'Calibri';
  font-size: 14pt;
  list-style: none;
  text-align: left;
}
.linksContainer li a {
  text-decoration: none;
  color: #000 !important;
}
</style>
