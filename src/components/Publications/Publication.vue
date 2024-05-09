<template>
  <b-container id="publications" fluid class="m-0 p-0">
    <b-modal header-bg-variant="blue-500" header-text-variant="light" hide-footer v-model="showModal" dialog-class="dialogclass" body-class="bodyclass" modal-class="modalclass" content-class="contentclass" header-class="headerclass" @close="onModalHide">
      <template v-slot:modal-title>{{ dialogTitle }}</template>
      <template v-slot:default>
        <div id="dialogContent" class="m-0 p-0">
          <router-view name="dialog" :Id="Id" :IsNato="IsNato" :DocID="DocID" :ShowHidden="ShowHidden" :Title="Title" :FromView="FromView" :IsArchive="IsArchive"></router-view>
        </div>
      </template>
    </b-modal>
    <router-view name="content" :grouped="grouped" :groupedby="groupedby" :filterFields="filterFields" :filterField="filterField" :filterValue="filterValue" :filterType="filterType" :ShowTacMemos="ShowTacMemos" :ShowFXP="ShowFXP" :view="view" :query="query"></router-view>
  </b-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Route, RouteMeta } from 'vue-router'
import { namespace } from 'vuex-class'

const support = namespace('support')

let that: any

@Component({
  name: 'Publication'
})
export default class Publication extends Vue {
  @Prop() filterFields: any = this.$route.params !== undefined ? this.$route.params.filterFields : []
  @Prop() filterField: any = this.$route.params !== undefined ? this.$route.params.filterField : ''
  @Prop() filterValue: any = this.$route.params !== undefined ? this.$route.params.filterValue : ''
  @Prop() filterType: any = this.$route.params !== undefined ? this.$route.params.filterType : ''
  @Prop() view: any = this.$route.params !== undefined ? this.$route.params.view : ''
  @Prop() grouped: any = this.$route.params !== undefined ? this.$route.params.grouped : false
  @Prop() groupedby: any = this.$route.params !== undefined ? this.$route.params.groupedby : '' // values - FSFF, FS, FF
  @Prop() query: any = this.$route.params !== undefined ? this.$route.params.query : ''
  @Prop() Id: any = this.$route.params !== undefined ? this.$route.params.Id : ''
  @Prop() IsNato: any = this.$route.params !== undefined ? this.$route.params.IsNato : ''
  @Prop() DocID: any = this.$route.params !== undefined ? this.$route.params.DocID : ''
  @Prop() ShowTacMemos: any = this.$route.meta !== undefined ? this.$route.meta.ShowTacMemos : 'No'
  @Prop() ShowFXP: any = this.$route.meta !== undefined ? this.$route.meta.ShowFXP : 'No'
  @Prop() ShowHidden: any = this.$route.params !== undefined ? this.$route.params.ShowHidden : false
  @Prop() FromView: any = this.$route.params !== undefined ? this.$route.params.FromView : false
  @Prop() IsArchive: any = this.$route.params !== undefined ? this.$route.params.IsArchive : false
  @Prop() Title: any = this.$route.params !== undefined ? this.$route.params.Title : ''
  public showModal = this.$route.meta !== undefined ? this.$route.meta.showModal : false
  public dialogTitle = this.$route.params !== undefined ? this.$route.params.Title : ''

  /* @support.State
  public contentwidth!: number

  @support.State
  public contentheight!: number */

  public created() {
    that = this
  }

  public mounted() {
    const element = document.getElementById('dialogContent')!
    // element.style.height = String(that.contentheight + 'px')
  }

  public onModalHide(): void {
    this.showModal = false
    if (this.FromView === 'Yes') {
      this.$router.go(-2)
    } else {
      this.$router.go(-1)
    }
  }

  @Watch('$route.meta')
  onMetaChanged(val: RouteMeta) {
    // do something if the route meta changes
    this.showModal = val.showModal
  }

  @Watch('$route')
  onRouteChanged(val: Route) {
    // do something if the route meta changes
    this.dialogTitle = val.params.Title
  }
}
</script>

<style lang="scss">
.modalclass {
  padding: 0;
}
.bodyclass {
  padding: 0 !important;
  height: calc(100vh - 100px);
}
.headerclass {
  border-bottom: 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 10px;
  width: 100vw;
}
/* .dialogclass {
  background-color: orangered;
} */
.contentclass {
  border: 0;
  max-width: unset;
  margin: 0;
  position: fixed;
  top: 25px;
  left: 25px;
  width: calc(100vw - 50px);
  height: calc(100vh - 50px);
}
.headerclass .close {
  float: unset;
  position: fixed; // remove it from the stack allowing the header title to be truly centered
  right: 25px;
}
#dialogContent {
  height: calc(100vh - 100px);
}
</style>
