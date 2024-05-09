<template>
  <b-container fluid class="dialogTabsContentHeight m-0 p-1">
    <b-row no-gutters v-for="comment in comments" :key="comment">{{ comment.value }}</b-row>
    <b-row no-gutters>
      <b-form-textarea v-model="comment" rows="6" style="width: 90%"></b-form-textarea>
    </b-row>
    <b-row no-gutters>
      <b-button variant="success" size="sm" @click="addNewComment()"> Add Comment </b-button>
    </b-row>
  </b-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../../interfaces/User'
import { ObjectItem } from '../../../interfaces/ObjectItem'

const users = namespace('users')
const publication = namespace('publication')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component({
  name: 'Comments'
})
export default class Comments extends Vue {
  @Prop() DocID: any

  interval!: any
  comment!: any

  @users.State
  public currentUser!: UserInt

  @publication.State
  public comments!: ObjectItem

  @publication.State
  public commentsloaded!: boolean

  @publication.Action
  public getDigest!: () => Promise<boolean>

  @publication.Action
  public getComments!: () => Promise<boolean>

  @publication.Action
  public addComment!: (comment: any) => Promise<boolean>

  mounted() {
    this.getComments()
    this.interval = setInterval(this.waitForComments, 500)
  }

  updated() {
    this.getComments()
    this.interval = setInterval(this.waitForComments, 500)
  }

  public waitForComments() {
    if (this.commentsloaded) {
      clearInterval(this.interval)
    }
  }

  public addNewComment() {
    const that = this
    this.getDigest().then((response) => {
      if (response) {
        that.addComment(that.comment)
      }
    })
  }
}
</script>

<style>
#vpfdescription {
  height: 200px !important;
  overflow-y: scroll;
  line-height: normal;
  font-size: 16px;
}
</style>
