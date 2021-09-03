<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="contentHeight m-0 p-0">
          <b-row no-gutters>
            <b-col cols="6" class="m-0 p-0"></b-col>
            <b-col cols="6" class="m-0 p-0">
              <b-card no-body>
                <b-tabs v-model="rightTabs" card>
                  <b-tab class="mtab" active>
                    <template slot="title">Data</template>
                    <b-row no-gutters>
                      <b-col cols="12"></b-col>
                    </b-row>
                  </b-tab>
                  <b-tab class="mtab">
                    <template slot="title">Supporting Documents</template>
                    <b-row no-gutters>
                      <b-col cols="12"></b-col>
                    </b-row>
                  </b-tab>
                  <b-tab class="mtab">
                    <template slot="title">Feedback/Comments</template>
                  </b-tab>
                </b-tabs>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../../interfaces/User'
import { PublicationItem } from '../../../interfaces/PublicationItem'

const users = namespace('users')
const publication = namespace('publication')

@Component({
  name: 'ViewPub'
})
export default class ViewPub extends Vue {
  rightTabs = []

  @users.State
  public currentUser!: UserInt

  @publication.State
  public publoaded!: boolean

  @publication.State
  public publication!: PublicationItem

  @publication.Action
  public getPublicationById!: (id: string) => Promise<boolean>

  mounted() {
    if (this.$route) {
      let id = this.$route.query.Id
      if (id !== null) {
        console.log('TEST B')
        this.getPublicationById(String(id))
      } else {
        console.log('TEST A')
      }
    }
  }
}
</script>

<style scoped></style>
