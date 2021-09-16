<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="contentHeight m-0 p-0">
          
          <b-row no-gutters class="banner" :style="{ backgroundImage: 'url(' + baseImageUrl + '/banner.jpg)' }">
            <b-col cols="12">
              <b-container fluid class="m-0 p-0">
                <b-row no-gutters class="titleRow">
                  <div class="mx-auto text-center text-light">
                    <div class="upper" id="NWLTitle">
                     NWL Terminology
                    </div>
                    
                  </div>
                </b-row>
              </b-container>
            </b-col>
           
          </b-row>
          <b-row no-gutters>
            <b-col cols="4" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                  ><h4 class="text-white p-0 mb-0">
                    Navy Supplement
                  </h4></b-card-header>
                <b-card-body class="p-1">
                  <!-- <b-list-group>
                    <b-list-group-item variant="blue-800" href="#" class="flex-column align-items-start"> -->
                      <b-card no-body class="p-1">
                        <b-row no-gutters>
                          <b-col md="2">
                            <font-awesome-icon fas icon="book-open" class="pubicon text-success"></font-awesome-icon>
                          </b-col>
                          <b-col md="10" class="p-1">
                            <b-card-sub-title>Navy Supplement to the DOD Dictionary of Military and Associated Terms</b-card-sub-title>
                            <b-card-title>
                              <a href="https://doctrine.navy.mil/pubs/NTRP%201-02,%20Navy%20Supplement%20to%20the%20DOD%20Dictionary%20of%20Military%20and%20Associated%20Terms/NTRP_1-02.pdf">NTRP 1-02</a>
                              </b-card-title>
                          </b-col>
                        </b-row>
                      </b-card>
                    <!--</b-list-group-item>-->
                  <!--<b-list-group-item variant="blue-800" href="#" class="flex-column align-items-start">
                     <b-card no-body class="p-1">
                        <b-row no-gutters>
                          <b-col md="2">
                            <font-awesome-icon fas icon="project-diagram" class="pubicon text-info"></font-awesome-icon>
                          </b-col>
                          <b-col md="10" class="p-1">
                            <b-card-sub-title>Navy Tactics, Techniques and Procedures</b-card-sub-title>
                            <b-card-title>NTTP, MTTP</b-card-title>
                          </b-col>
                        </b-row>
                      </b-card>
                    </b-list-group-item>-->
                    <!--<b-list-group-item variant="blue-800" href="#" class="flex-column align-items-start">
                      <b-card no-body class="p-1">
                        <b-row no-gutters>
                          <b-col md="2">
                            <font-awesome-icon fas icon="book" class="pubicon text-danger"></font-awesome-icon>
                          </b-col>
                          <b-col md="10" class="p-1">
                            <b-card-sub-title>Navy Reference Publication</b-card-sub-title>
                            <b-card-title>NTRP</b-card-title>
                          </b-col>
                        </b-row>
                      </b-card>
                    </b-list-group-item>-->
                    <!--<b-list-group-item variant="blue-800" href="#" class="flex-column align-items-start">
                      <b-card no-body class="p-1">
                        <b-row no-gutters>
                          <b-col md="2">
                            <font-awesome-icon fas icon="lightbulb" class="pubicon text-warning"></font-awesome-icon>
                          </b-col>
                          <b-col md="10" class="p-1">
                            <b-card-sub-title>Navy Development TTP</b-card-sub-title>
                            <b-card-title>TACMEMO, TACBUL, TACNOTE</b-card-title>
                          </b-col>
                        </b-row>
                      </b-card>
                    </b-list-group-item>-->
                  <!--</b-list-group>-->
                </b-card-body>
              </b-card>
            </b-col>
            <b-col cols="4" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                  ><h4 class="text-white p-0 mb-0">
                    Marine Corps Supplement
                  </h4></b-card-header>
                  <b-card-body class="p-1">
                    <b-card no-body class="p-1">
                        <b-row no-gutters>
                          <b-col md="2">
                            <font-awesome-icon fas icon="book-open" class="pubicon text-success"></font-awesome-icon>
                          </b-col>
                          <b-col md="10" class="p-1">
                            <b-card-sub-title>Marine Corps Supplement to the DOD Dictionary of Military and Associated Terms</b-card-sub-title>
                            <b-card-title>
                              <a href="https://doctrine.navy.mil/pubs/MCRP%201-10.2,%20Marine%20Corps%20Terminology/MCRP_1-10.2.pdf">MCRP 1-10.2</a>
                              </b-card-title>
                          </b-col>
                        </b-row>
                      </b-card>
                <!--<b-card-body body-class="card-body-left p-1">
                  <ul>
                    <li>
                      <a href="/pubs/Forms/nttp.aspx?FilterField1=funcSeries&amp;FilterValue1=7 Series - Air NTTP">Air NTTP</a>
                    </li>
                    <li>
                      <a href="/Pages/alliedHome.aspx">Allied Publications</a>
                    </li>
                    <li>
                      <a href="/pubs/Forms/joint.aspx">Joint Publications</a>
                    </li>
                    <li>
                      <a href="/pubs/Forms/multinational.aspx">Multinational Publications</a>
                    </li>
                    <li>
                      <a href="/pubs/Forms/concepts.aspx">Navy Concepts</a>
                    </li>
                    <li><a href="/pubs/Forms/conops.aspx">Fleet CONOPS</a></li>
                    <li>
                      <a href="/pubs/Forms/optasks.aspx">Navy-wide OPTASKS</a>
                    </li>
                    <li>
                      <a href="/pubs/Forms/AllItems.aspx?View={099D2171-BB61-4DEC-8364-56D897AC04F1}&amp;FilterField1=funcSeries&amp;FilterValue1=Universal%20Naval%20Task%20List">Universal Naval Task List (UNTL)</a>
                    </li>
                    <li>
                      <a href="/pubs/Forms/AllItems.aspx?View={099D2171-BB61-4DEC-8364-56D897AC04F1}&amp;FilterField1=Prefix&amp;FilterValue1=FXP">Fleet Exercise Publications (Archive)</a>
                    </li>
                    <li>
                      <a href="/pubs/Forms/AllItems.aspx?View={099D2171-BB61-4DEC-8364-56D897AC04F1}&amp;FilterField1=Prefix&amp;FilterValue1=NTP">Naval Telecommunications Procedures (NTPs)</a>
                    </li>
                    <li>
                      <a href="/SitePages/bookshelves.aspx">Mission Area Bookshelves</a>
                    </li>
                  </ul>
                </b-card-body>-->
              </b-card>
              <!--<b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"
                  ><h4 class="text-white p-0 mb-0">
                    Warfighting Reference Materials
                  </h4></b-card-header
                >
                <b-card-body body-class="card-body-left p-1">
                  <ul>
                    <li>
                      <a href="/pubs/Forms/Strategy.aspx">Strategy Documents</a>
                    </li>
                    <li>
                      <a href="/pubs/Forms/Archived%20Documents%20Broken.aspx">Archived Documents</a>
                    </li>
                    <li>
                      <a href="/pubs/Forms/AllItems.aspx?View={099D2171-BB61-4DEC-8364-56D897AC04F1}&amp;FilterField1=funcSeries&amp;FilterValue1=Commander%27s%20Handbooks">Commander’s Handbooks</a>
                    </li>
                    <li>
                      <a href="/pubs/Forms/AllItems.aspx?View={099D2171-BB61-4DEC-8364-56D897AC04F1}&amp;FilterField1=funcSeries&amp;FilterValue1=Writing%20Guidance">Writing Guidance</a>
                    </li>
                    <li title="Coming soon!">
                      <a href="#">Selected Instructions</a>
                    </li>
                  </ul>
                </b-card-body>
              </b-card>-->
            </b-col>
            <b-col cols="4" class="m-0 p-1 bg-white">
              <b-card no-body header-tag="header">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0">
                  <h4 class="text-white p-0 mb-0">
                    Joint Supplement
                    </h4></b-card-header>
                    <b-card-body class="p-1">
                      <b-card no-body class="p-1">
                        <b-row no-gutters>
                          <b-col md="2">
                            <font-awesome-icon fas icon="book-open" class="pubicon text-success"></font-awesome-icon>
                          </b-col>
                          <b-col md="10" class="p-1">
                            <b-card-sub-title>Joint Doctrine, Education & Training Electronic Information System (JDEIS) Terminology Program</b-card-sub-title>
                            <b-card-title>
                              <a href="https://jdeis.js.mil/jdeis/index.jsp?">JDEIS</a>
                              </b-card-title>
                          </b-col>
                        </b-row>
                      </b-card>
                      
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
