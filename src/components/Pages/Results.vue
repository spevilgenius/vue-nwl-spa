<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <dynamic-table
          v-if="viewReady"
          :user="currentUser"
          :ready="true"
          :table="{
            id: tblId,
            primaryKey: primaryKey,
            buttons: buttons,
            fields: fields,
            items: results,
            overlayText: overlayText,
            overlayVariant: overlayVariant
          }"
          :searchEnabled="true"
        ></dynamic-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { NotificationItem } from '../../interfaces/NotificationItem'
import { namespace } from 'vuex-class'
import { UserInt } from '../../interfaces/User'
import { PublicationItem } from '../../interfaces/PublicationItem'
import DynamicTable from '../Custom/DynamicTable2.vue'

const users = namespace('users')
const publication = namespace('publication')
const notify = namespace('notify')

@Component({
  name: 'Results',
  components: {
    DynamicTable
  }
})
export default class Results extends Vue {
  tblId = 'AllPubs'
  primaryKey = 'docid'
  overlayText = 'Getting Publications. Please wait...'
  overlayVariant = 'danger'
  rowHeight = 0
  pageSize = 20
  interval!: any
  results: Array<PublicationItem> = []
  viewReady?: boolean = false

  @publication.Action
  public searchAllPublications!: (data: any) => Promise<boolean>

  mounted() {
    const that = this
    this.$nextTick(function() {
      // alert(this.$route.query.k)
      let data: any = {}
      data.k = this.$route.query.k
      this.searchAllPublications(data)
    })
  }
}
</script>
