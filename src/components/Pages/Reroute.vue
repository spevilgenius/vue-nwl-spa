<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import store from '@/store/store'

const support = namespace('support')

let back = -1
let prevRoute: any
let nextRoute: any

@Component({
  name: 'Reroute',
  beforeRouteEnter(to, from, next) {
    // get data
    prevRoute = from.path
    nextRoute = to.path
    next()
  }
})
export default class Reroute extends Vue {
  // Reroute: This component is to ensure that most links will refresh pages by adding an itermediary due to the router not reloading the same component.
  // This will eliminate the need to use a watcher because we are effectively loading a new component each time.
  @Prop() readonly filter!: string
  @Prop() readonly value!: string
  @Prop() readonly title!: string
  @Prop() readonly route!: string
  @Prop() readonly view!: string
  @Prop() readonly query!: string

  /* @support.State
  public history!: string */

  @support.Action
  public setHistory!: (path: string) => void

  /** @method - lifecycle hook */
  mounted() {
    console.log('REROUTE')

    this.setHistory(prevRoute)

    switch (this.route) {
      case 'all': {
        this.$router.replace({ path: '/pubs/approved/all' })
        break
      }

      case 'archive': {
        this.$router.replace({ path: '/pubs/archived/all' })
        break
      }

      case 'dev': {
        this.$router.push({ path: '/pubs/development/all' })
        break
      }

      case 'new': {
        this.$router.replace({ path: '/pubs/approved/all/filtered/custom/New/New' })
        break
      }

      case 'navy': {
        this.$router.replace({ path: '/pubs/approved/all/filtered/field/Branch/Navy' })
        break
      }

      case 'other': {
        this.$router.push({ path: '/pubs/approved/all/filtered/field/Branch/Other' })
        break
      }

      case 'joint': {
        this.$router.replace({ path: '/pubs/approved/all/filtered/field/Branch/Joint' })
        break
      }

      case 'multinational': {
        this.$router.replace({ path: '/pubs/approved/all/filtered/field/Branch/Multinational' })
        break
      }

      case 'search': {
        this.$router.replace({ name: 'Refined Search Results', params: this.$route.params })
        break
      }

      case 'refreshsearch': {
        this.$router.replace({ name: 'Search Results', params: this.$route.params })
        break
      }

      case 'filter': {
        this.$router.replace({ name: 'Complex Filtered Publications', params: this.$route.params })
        break
      }

      case 'archivefilter': {
        this.$router.replace({ name: 'Complex Filtered Archive Publications', params: this.$route.params })
        break
      }

      case 'devfilter': {
        this.$router.replace({ name: 'Complex Filtered Dev Publications', params: this.$route.params })
        break
      }

      case 'grouped': {
        this.$router.replace({ path: '/pubs/approved/grouped/' + this.view })
        break
      }

      case 'tacmemos': {
        this.$router.replace({ name: 'TTP', params: { filterType: 'TTP', grouped: 'true', groupedby: 'FS' } })
        break
      }

      case 'conops': {
        this.$router.replace({ path: '/pubs/approved/all/filtered/field/Prfx/CONOPS/true/FS' })
        break
      }

      case 'concept': {
        this.$router.replace({ path: '/pubs/approved/all/filtered/field/FunctionalSeries/Navy Concept Pubs' })
        break
      }

      case 'optasks': {
        this.$router.replace({ path: '/pubs/approved/all/filtered/field/FunctionalSeries/Navy Wide OPTASKs' })
        break
      }

      /* case 'allied': {
        this.$router.replace({ name: 'Allied Publications' })
        break
      }

      default: {
        this.$router.replace({ name: 'Filtered', params: { title: this.$props.title, filter: this.$props.filter, value: this.$props.value } })
        break
      } */
    }
  }
}
</script>

<style scoped></style>
