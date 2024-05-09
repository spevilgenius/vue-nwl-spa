<template>
  <b-container fluid class="contentHeight p-0" id="MainContainer">
    <b-toast id="busy-toast" variant="light-blue" solid no-auto-hide>
      <template v-slot:toast-title>
        <div class="d-flex flex-grow-1 align-items-baseline">
          <b-img blank blank-color="#ff0000" class="mr-2" width="12" height="12"></b-img>
          <strong class="mr-auto">{{ busyTitle }}</strong>
        </div>
      </template>
      <b-progress :variant="busyVariant" :value="busyValue" :max="busyMax" show-progress animated></b-progress>
    </b-toast>
    <b-row class="mb-1">
      <b-col cols="3">
        <b-card border-variant="success" text-variant="dark">
          <template v-slot:header>
            <h3 class="mb-0">
              <span class="ml-0">Migration Actions</span>
              <font-awesome-icon fas icon="download" class="icon text-success float-right ml-1"></font-awesome-icon>
            </h3>
          </template>
          <b-card-body>
            <b-row class="p-0 m-1">
              <b-button ref="GetPubs" variant="success" @click="GetPubs">Get Active Pubs</b-button>
            </b-row>
            <b-row class="p-0 m-1">
              <b-button ref="GetNatoPubs" variant="success" @click="GetNatoPubs">Get NATO Pubs</b-button>
            </b-row>
            <b-row class="p-0 m-1">
              <b-button ref="GetPubsData" variant="success" @click="GetPubsData">Get Pubs Data</b-button>
            </b-row>
            <b-row class="p-0 m-1">
              <b-button ref="GetNatoData" variant="success" @click="GetNatoData">Get Nato Data</b-button>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="9">
        <b-container fluid ref="resultArea" class="contentHeight p-0">
          <b-row no-gutters>
            <b-col cols="12">
              <b-card no-body>
                <b-tabs v-model="devtabs" card>
                  <b-tab class="mtab" active>
                    <template slot="title">Active Pubs</template>
                    <b-row no-gutters>
                      <b-col cols="12">
                        <b-overlay :show="!ActivePubsLoaded" variant="loading" class="mtab">
                          <b-textarea v-model="ActivePubsArea" class="area"></b-textarea>
                          <template #overlay>
                            <div class="text-center">
                              <p id="busy-label">Loading Pubs...</p>
                            </div>
                          </template>
                        </b-overlay>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <b-tab class="mtab">
                    <template slot="title">Nato Pubs</template>
                  </b-tab>
                  <b-tab class="mtab">
                    <template slot="title">Pubs Data</template>
                  </b-tab>
                  <b-tab class="mtab">
                    <template slot="title">Nato Data</template>
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
import axios from 'axios'

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component
export default class Developer extends Vue {
  activepubs = []
  natopubs = []
  pubsdata = []
  natodata = []
  ActivePubsArea = ''
  ActivePubsLoaded = true
  baseUrl = tp1 + slash + slash + tp2
  // activePubsUrl = this.baseUrl + "/_api/lists/getbytitle('Pubs')/items?$select*,Author/Title,File/Name,File/ServerRelativeUrl&$expand=Author,File,File/ListItemAllFields"
  // activePubsUrl = this.baseUrl + "/_api/lists/getbytitle('Publications')/items?$select*,Folder/Name,File/Name,File/ServerRelativeUrl&$expand=Folder,File"
  activePubsUrl = this.baseUrl + "/_api/Web/GetFolderByServerRelativeUrl('pubs')?$expand=Folders,Folders/Files"

  public GetPubs() {
    this.ActivePubsLoaded = false
    let j: any[] = []
    let that = this
    async function getAllPubs(url: string): Promise<void> {
      if (url === '') {
        url = that.activePubsUrl
      }
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      console.log(response)
      j = j.concat(response.data.d.Folders.results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        url = response.data.d.__next
        return getAllPubs(url)
      } else {
        // just write the JSON
        that.ActivePubsArea = JSON.stringify(j)
        that.ActivePubsLoaded = true
      }
    }
    getAllPubs('')
  }
}
</script>

<style lang="scss">
.mtab {
  height: calc(100vh - 200px) !important;
}

.area {
  height: calc(100vh - 250px) !important;
}
</style>
