<template>
  <b-container fluid class="m-0 p-0">
    <b-row no-gutters class="cui">
      <b-col cols="4" class="p-0"></b-col>
      <b-col cols="4" class="p-0 text-center text-white">CUI</b-col>
      <b-col cols="4" class="p-0"></b-col>
    </b-row>
    <b-row no-gutters>
      <div v-if="userloaded" class="wrapper" :class="isShown === true ? 'bsidebarOpen' : 'bsidebarClosed'">
        <NotificationContainer />
        <b-sidebar no-slide no-close-on-route-change v-model="isShown" no-header bg-variant="light" text-variant="white" sidebar-class="bsvSidebar" z-index="1000">
          <template v-slot:default>
            <Sidebar v-if="userloaded"></Sidebar>
          </template>
          <!-- <template v-slot:footer>
            <div class="accordion legend" role="tablist" :class="{ 'legend-expanded': legendHeightExpanded }">
              <b-card no-body>
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button @click="setLegend" block size="sm" v-b-toggle.legend-accordion variant="secondary" class="text-center legend-button">Legend<span class="caret legend-caret" :class="{ 'legend-expanded-caret': legendHeightExpanded }"></span></b-button>
                </b-card-header>
                <b-collapse id="legend-accordion" accordion="legend-accordion" role="tabpanel">
                  <b-list-group>
                    <b-list-group-item v-for="item in legendItems" :key="item.id" :item="item" class="list-group-item-sm">
                      <b-button block size="sm" class="text-left legend-btn" :class="item.class">
                        {{ item.name }}
                        <font-awesome-icon v-if="item.hasIcon && item.library === 'fas'" fas :icon="item.icon" class="icon float-right ml-1" :class="'text-' + item.iconVariant"></font-awesome-icon>
                        <font-awesome-icon v-else-if="item.hasIcon && item.library === 'far'" far :icon="item.icon" class="icon float-right ml-1" :class="'text-' + item.iconVariant"></font-awesome-icon>
                      </b-button>
                    </b-list-group-item>
                  </b-list-group>
                </b-collapse>
              </b-card>
            </div>
          </template> -->
        </b-sidebar>
        <div v-if="userloaded" class="main-panel" :class="isShown === true ? 'sidebarOpen' : 'sidebarClosed'">
          <Header />
          <Content />
          <Footer />
        </div>
      </div>
      <div v-else id="LoadingBars">
        <div class="blockG" id="rotateG_01"></div>
        <div class="blockG" id="rotateG_02"></div>
        <div class="blockG" id="rotateG_03"></div>
        <div class="blockG" id="rotateG_04"></div>
        <div class="blockG" id="rotateG_05"></div>
        <div class="blockG" id="rotateG_06"></div>
        <div class="blockG" id="rotateG_07"></div>
        <div class="blockG" id="rotateG_08"></div>
      </div>
    </b-row>
    <b-row no-gutters class="cui">
      <b-col cols="4" class="p-0"></b-col>
      <b-col cols="4" class="p-0 text-center text-white">CUI</b-col>
      <b-col cols="4" class="p-0"></b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { LegendItem } from '../../interfaces/LegendItem'
import NotificationContainer from '@/components/Notifications/NotificationContainer.vue'
import Header from './HeaderTS.vue'
import Footer from './FooterTS.vue'
import Content from './ContentTS.vue'
import Sidebar from './SidebarTS.vue'

const support = namespace('support')
const users = namespace('users')

@Component({
  name: 'Layout',
  components: {
    NotificationContainer,
    Sidebar,
    Header,
    Footer,
    Content
  }
})
export default class Layout extends Vue {
  public userloaded?: boolean = false
  public legendHeightExpanded?: boolean = false
  public interval: any

  @Prop({ default: process.env.VUE_APP_TITLE }) readonly title!: string

  @users.State
  public loaded!: boolean

  @support.State
  public isShown!: boolean

  @support.Action
  public setShown!: (newVal: boolean) => void

  @support.State
  public isThemeSelectorShown!: boolean

  @support.Action
  public setRect!: (newVal: DOMRect) => void

  @support.State
  public legendItems!: Array<LegendItem>

  mounted() {
    console.log('ENVIRONMENT ' + process.env)
    this.interval = setInterval(this.waitforit, 1000)
  }

  public waitforit() {
    // wait for user to finish loading
    if (this.loaded) {
      clearInterval(this.interval)
      this.userloaded = true
    }
  }

  /* public getLegend() {
    let l = String(window.localStorage.getItem('legend'))
    if (l) {
      let legend = JSON.parse(l)
      if (legend) {
        this.legendHeightExpanded = legend.value
      }
    }
  }

  public setLegend() {
    this.legendHeightExpanded = !this.legendHeightExpanded
    var legend = {
      value: this.legendHeightExpanded
    }
    window.localStorage.setItem('legend', JSON.stringify(legend))
  } */
}
</script>

<style lang="scss">
/* .legend {
  display: block;
  position: absolute !important;
  bottom: 0;
  left: 0;
  background-color: black;
  opacity: 1;
  height: 50px;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.legend-button {
  height: 40px;
}

.legend-expanded {
  min-height: 300px;
}

.list-group-item-sm {
  height: 25px;
  margin: 0;
  font-size: 14px;
}

.legend-btn {
  height: 25px;
  line-height: normal;
  padding: 2px 10px;
}

.legend-caret {
  display: inline-block;
  width: 0;
  height: 0;
  vertical-align: middle;
  border-top: 4px dashed;
  border-top: 4px solid\9;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  margin-top: 0.5rem;
  position: absolute;
  right: 15px;
  transition: 0.15s, ease-in;
}

.legend-expanded-caret {
  transform: rotate(180deg);
} */

#LoadingBars {
  position: relative;
  width: 240px;
  height: 298px;
  margin: auto;
}

.blockG {
  position: absolute;
  background-color: $blue-200;
  width: 39px;
  height: 93px;
  border-radius: 31px 31px 0 0;
  -o-border-radius: 31px 31px 0 0;
  -ms-border-radius: 31px 31px 0 0;
  -webkit-border-radius: 31px 31px 0 0;
  -moz-border-radius: 31px 31px 0 0;
  transform: scale(0.4);
  -o-transform: scale(0.4);
  -ms-transform: scale(0.4);
  -webkit-transform: scale(0.4);
  -moz-transform: scale(0.4);
  animation-name: fadeG;
  -o-animation-name: fadeG;
  -ms-animation-name: fadeG;
  -webkit-animation-name: fadeG;
  -moz-animation-name: fadeG;
  animation-duration: 0.732s;
  -o-animation-duration: 0.732s;
  -ms-animation-duration: 0.732s;
  -webkit-animation-duration: 0.732s;
  -moz-animation-duration: 0.732s;
  animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-direction: normal;
  -o-animation-direction: normal;
  -ms-animation-direction: normal;
  -webkit-animation-direction: normal;
  -moz-animation-direction: normal;
}

#rotateG_01 {
  left: 0;
  top: 109px;
  animation-delay: 0.2695s;
  -o-animation-delay: 0.2695s;
  -ms-animation-delay: 0.2695s;
  -webkit-animation-delay: 0.2695s;
  -moz-animation-delay: 0.2695s;
  transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
}

#rotateG_02 {
  left: 31px;
  top: 39px;
  animation-delay: 0.366s;
  -o-animation-delay: 0.366s;
  -ms-animation-delay: 0.366s;
  -webkit-animation-delay: 0.366s;
  -moz-animation-delay: 0.366s;
  transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
}

#rotateG_03 {
  left: 101px;
  top: 12px;
  animation-delay: 0.4525s;
  -o-animation-delay: 0.4525s;
  -ms-animation-delay: 0.4525s;
  -webkit-animation-delay: 0.4525s;
  -moz-animation-delay: 0.4525s;
  transform: rotate(0deg);
  -o-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
}

#rotateG_04 {
  right: 31px;
  top: 39px;
  animation-delay: 0.549s;
  -o-animation-delay: 0.549s;
  -ms-animation-delay: 0.549s;
  -webkit-animation-delay: 0.549s;
  -moz-animation-delay: 0.549s;
  transform: rotate(45deg);
  -o-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
}

#rotateG_05 {
  right: 0;
  top: 109px;
  animation-delay: 0.6355s;
  -o-animation-delay: 0.6355s;
  -ms-animation-delay: 0.6355s;
  -webkit-animation-delay: 0.6355s;
  -moz-animation-delay: 0.6355s;
  transform: rotate(90deg);
  -o-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
}

#rotateG_06 {
  right: 31px;
  bottom: 27px;
  animation-delay: 0.732s;
  -o-animation-delay: 0.732s;
  -ms-animation-delay: 0.732s;
  -webkit-animation-delay: 0.732s;
  -moz-animation-delay: 0.732s;
  transform: rotate(135deg);
  -o-transform: rotate(135deg);
  -ms-transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
  -moz-transform: rotate(135deg);
}

#rotateG_07 {
  bottom: 0;
  left: 101px;
  animation-delay: 0.8185s;
  -o-animation-delay: 0.8185s;
  -ms-animation-delay: 0.8185s;
  -webkit-animation-delay: 0.8185s;
  -moz-animation-delay: 0.8185s;
  transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
}

#rotateG_08 {
  left: 31px;
  bottom: 27px;
  animation-delay: 0.905s;
  -o-animation-delay: 0.905s;
  -ms-animation-delay: 0.905s;
  -webkit-animation-delay: 0.905s;
  -moz-animation-delay: 0.905s;
  transform: rotate(-135deg);
  -o-transform: rotate(-135deg);
  -ms-transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
  -moz-transform: rotate(-135deg);
}

@keyframes fadeG {
  0% {
    background-color: rgb(255, 0, 0);
  }

  100% {
    background-color: rgb(255, 255, 255);
  }
}

@-o-keyframes fadeG {
  0% {
    background-color: rgb(255, 0, 0);
  }

  100% {
    background-color: rgb(255, 255, 255);
  }
}

@-ms-keyframes fadeG {
  0% {
    background-color: rgb(255, 0, 0);
  }

  100% {
    background-color: rgb(255, 255, 255);
  }
}

@-webkit-keyframes fadeG {
  0% {
    background-color: rgb(255, 0, 0);
  }

  100% {
    background-color: rgb(255, 255, 255);
  }
}

@-moz-keyframes fadeG {
  0% {
    background-color: rgb(255, 0, 0);
  }

  100% {
    background-color: rgb(255, 255, 255);
  }
}
</style>
