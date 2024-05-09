<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <nav>
        <ul class="footer-menu">
          <li>
            <!-- <router-link :to="{ path: '/pages/home' }">Home</router-link> 
            <a class="navbar-brand" href="mailto:idina.m.hatten.civ@us.navy.mil?bcc=lynn.ellenwood.civ@us.navy.mil&subject=NWL%20Feedback"><font-awesome-icon far icon="envelope" class="icon ml-2" style="font-size: 28px"></font-awesome-icon>&nbsp;&nbsp;Provide Feedback</a>-->
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const support = namespace('support')

@Component
export default class Footer extends Vue {
  @support.State
  public isShown!: boolean
}
</script>

<style lang="scss"></style>
