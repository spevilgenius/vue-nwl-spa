import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Global from './global'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import crono from 'vue-crono'
// import { logger } from './applogger'

import './assets/css/themify-icons.css'
import './assets/css/animate.css'
import './assets/sass/bootstrap.scss'
import './assets/css/spa.css'
import '../node_modules/quill/dist/quill.core.css'
import '../node_modules/quill/dist/quill.bubble.css'

import App from './components/App.vue'
import router from './router/router'
import store from './store/store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { dom } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import jquery from 'jquery'
Object.defineProperty(Vue.prototype, '$jQuery', { value: jquery })

library.add(far, fas)
dom.watch()

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueMoment, {
  moment
})
Vue.use(BootstrapVue)
Vue.use(Global)
Vue.use(VueLodash, { lodash: lodash })
Vue.use(crono)

export const EventBus = new Vue()

/* Vue.config.errorHandler = (err, vm, info) => {
  logger.logToServer({ err, vm, info })
} */

/* window.onerror = function(message, source, lineno, colno, error) {
  logger.logToServer({ message, source, lineno, colno, error })
} */

window.addEventListener('beforeunload', function(e) {
  // TODO: anything to do here?
})

Vue.config.productionTip = false

Vue.config.devtools = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
