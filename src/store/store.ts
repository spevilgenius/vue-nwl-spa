import Vue from 'vue'
import Vuex from 'vuex'
import notify from './modules/notify'
import support from './modules/support'
import users from './modules/users'
import sidebar from './modules/sidebar'

Vue.use(Vuex)

Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    users,
    support,
    sidebar,
    notify
  }
})
