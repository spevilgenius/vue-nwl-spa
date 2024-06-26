import Vue from 'vue'
import Vuex from 'vuex'
import notify from './modules/notify'
import support from './modules/support'
import users from './modules/users'
import sidebar from './modules/sidebar'
import publication from './modules/publication'
import terminology from './modules/terminology'
import search from './modules/search'
import poc from './modules/poc'
import reqsupport from './modules/reqsupport'
import reports from './modules/reports'

Vue.use(Vuex)

Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    users,
    support,
    sidebar,
    notify,
    publication,
    terminology,
    search,
    poc,
    reqsupport,
    reports
  }
})
