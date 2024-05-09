<template>
  <b-container fluid class="contentHeight m-0 p-0">
    <b-modal v-if="viewReady" id="ArchiveModal" size="xl" centered header-bg-variant="blue-500" header-text-variant="light" modal-class="zModal" @ok="onOk()" @show="onShow()" @cancel="onCancelled()" @hide="onCancelled()">
      <template v-slot:modal-title>Archive Publication</template>
      <b-container class="p-0">
        <b-form>
          <b-row no-gutters>
            <b-col cols="4">
              <b-form-group label="Archive Type">
                <b-form-select class="form-control" v-model="archive.archivetype" size="sm" id="ddArchive" :options="archives" ref="ArchiveType" @change="onArchiveSelected"></b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="superseded" no-gutters>
            <b-col cols="12">
              <b-row no-gutters :style="getStyle('pagingrow', null)" class="px500">
                <b-col cols="12">
                  <b-form-group label="Filter" label-cols-sm="3" label-align-sm="right" label-size="sm" class="mb-0">
                    <b-input-group size="sm">
                      <b-form-input v-model="filter" type="search" placeholder="Search..."></b-form-input>
                      <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row no-gutters :style="getStyle('tablerowarchive', null)">
                <b-col cols="12">
                  <b-table :items="archivepubs" :fields="archivefields" primary-key="primarykey" :filter="filter" :per-page="perPageArchive" :current-page="currentPageArchive" table-class="table-archive table-full" :sticky-header="getSticky('dynamictablearchive')" table-variant="light" thead-class="blue-500 text-white">
                    <template #head()="data">
                      {{ data.field.label }}
                    </template>
                    <template #head(actions)> Actions </template>
                    <template #cell(actions)="data">
                      <b-form-checkbox @change="selectSuperceded(data.item.DocID, data.item.Name)" :checked="data.item.selected"></b-form-checkbox>
                    </template>
                    <template #cell()="data">
                      <div>{{ data.value }}</div>
                    </template>
                  </b-table>
                </b-col>
              </b-row>
              <b-row no-gutters :style="getStyle('pagingrow', null)">
                <b-col cols="12">
                  <b-pagination v-model="currentPageArchive" :total-rows="totalRowsArchive" :per-page="perPageArchive" class="my-0" first-number last-number></b-pagination>
                </b-col>
              </b-row>
              <b-row no-gutters :style="getStyle('pagingrow', null)" class="px500">
                <b-col cols="3">SELECTED PUB:</b-col>
                <b-col cols="9">
                  <b-form-input disabled v-model="supersededby" type="text"></b-form-input>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-form>
      </b-container>
    </b-modal>
    <b-row no-gutters class="contentHeight">
      <b-col cols="12" class="m-0 p-0">
        <b-overlay :show="!viewReady" :variant="overlayVariant" class="contentHeight">
          <b-container fluid class="contentHeight m-0 p-0">
            <b-card no-body>
              <b-row v-if="groupeditems.length > 1">
                <div class="accordion m-1" role="tablist" :style="getStyle('branchaccordion', null)">
                  <b-card no-body class="m-1" v-for="(item, index) in groupeditems" :key="item">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-container fluid class="m-0 p-0 px300">
                        <b-row no-gutters class="">
                          <b-col cols="1">
                            <b-button v-b-toggle="'collapse-' + index" size="sm" variant="outline" class="actionbutton">
                              <font-awesome-icon class="while-open ml-1" far icon="minus-square" :style="{ color: 'black' }"></font-awesome-icon>
                              <font-awesome-icon class="while-closed ml-1" far icon="plus-square" :style="{ color: 'black' }"></font-awesome-icon>
                            </b-button>
                          </b-col>
                          <b-col cols="9" class="text-left pl-2">
                            <span>{{ item.text }}</span>
                          </b-col>
                          <b-col cols="2">
                            <span class="count-label">({{ item.count }})</span>
                          </b-col>
                        </b-row>
                      </b-container>
                    </b-card-header>
                    <b-collapse :id="'collapse-' + index" accordion="branch-accordion" role="tabpanel">
                      <b-card-body v-if="item.text == 'Navy'">
                        <div class="accordion m-1" role="tablist">
                          <b-card no-body class="m-1" v-for="(child, childindex) in item.children" :key="child">
                            <b-card-header header-tag="header" class="p-1" role="tab">
                              <b-container fluid class="m-0 p-0 px400">
                                <b-row no-gutters class="">
                                  <b-col cols="1">
                                    <b-button v-b-toggle="'childcollapse-' + childindex" size="sm" variant="outline" class="actionbutton">
                                      <font-awesome-icon class="while-open ml-1" far icon="minus-square" :style="{ color: 'black' }"></font-awesome-icon>
                                      <font-awesome-icon class="while-closed ml-1" far icon="plus-square" :style="{ color: 'black' }"></font-awesome-icon>
                                    </b-button>
                                  </b-col>
                                  <b-col cols="9" class="text-left pl-2">
                                    <span>{{ child.text }}</span>
                                  </b-col>
                                  <b-col cols="2">
                                    <span class="count-label">({{ child.count }})</span>
                                  </b-col>
                                </b-row>
                              </b-container>
                            </b-card-header>
                            <b-collapse :id="'childcollapse-' + childindex" accordion="series-accordion" role="tabpanel">
                              <b-card-body v-if="childindex < 7">
                                <div class="accordion m-1" role="tablist">
                                  <b-card no-body class="m-1" v-for="(grandchild, grandchildindex) in child.children" :key="grandchild">
                                    <b-card-header header-tag="header" class="p-1" role="tab">
                                      <b-container fluid class="m-0 p-0 px500">
                                        <b-row no-gutters class="">
                                          <b-col cols="1">
                                            <b-button v-b-toggle="'grandchildcollapse-' + grandchildindex" size="sm" variant="outline" class="actionbutton">
                                              <font-awesome-icon class="while-open ml-1" far icon="minus-square" :style="{ color: 'black' }"></font-awesome-icon>
                                              <font-awesome-icon class="while-closed ml-1" far icon="plus-square" :style="{ color: 'black' }"></font-awesome-icon>
                                            </b-button>
                                          </b-col>
                                          <b-col cols="9" class="text-left pl-2">
                                            <span>{{ grandchild.text }}</span>
                                          </b-col>
                                          <b-col cols="2">
                                            <span class="count-label">({{ grandchild.count }})</span>
                                          </b-col>
                                        </b-row>
                                      </b-container>
                                    </b-card-header>
                                    <b-collapse :id="'grandchildcollapse-' + grandchildindex" accordion="field-accordion" role="tabpanel">
                                      <b-card-body>
                                        <b-table responsive striped hover :items="grandchild.items" :fields="fields" primary-key="primarykey" table-class="table-full" sticky-header table-variant="light" thead-class="tbl-dynamic-header blue-500 text-white">
                                          <template #head()="data">
                                            <span class="text-center">{{ data.field.label }}</span>
                                          </template>
                                          <template #head(actions)> Actions </template>
                                          <template #cell(actions)="data">
                                            <b-button title="View" variant="white" size="lg" class="actionbutton text-dark" @click="viewItem(data.item.Id, data.item.IsNato, data.item.DocID, data.item.Name)">
                                              <font-awesome-icon v-if="String(data.item.Name).indexOf('.docx') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.doc') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.pdf') > 0" :icon="['far', 'file-pdf']" class="icon"></font-awesome-icon>
                                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.txt') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.rtf') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                                            </b-button>
                                            <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" title="Edit" variant="white" size="lg" class="actionbutton text-dark" @click="editItem(data.item.Id, data.item.IsNato, data.item.Name)">
                                              <font-awesome-icon :icon="['far', 'edit']" class="icon"></font-awesome-icon>
                                            </b-button>
                                            <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian" title="Archive" variant="white" size="lg" class="actionbutton text-dark" @click="archiveItem(data.item.Id, data.item.IsNato, data.item)">
                                              <font-awesome-icon :icon="['fas', 'sync']" class="icon"></font-awesome-icon>
                                            </b-button>
                                          </template>
                                          <template #cell(Name)="data">
                                            <b-link v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" :to="{ path: '/pubs/approved/grouped/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + true + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                                            <b-link v-else :to="{ path: '/pubs/approved/grouped/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + false + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                                          </template>
                                          <template #cell()="data">
                                            <div>{{ data.value }}</div>
                                          </template>
                                        </b-table>
                                      </b-card-body>
                                    </b-collapse>
                                  </b-card>
                                </div>
                              </b-card-body>
                              <b-card-body v-else>
                                <b-table responsive striped hover :items="child.items" :fields="fields" primary-key="primarykey" table-class="table-full" sticky-header table-variant="light" thead-class="tbl-dynamic-header blue-500 text-white">
                                  <template #head()="data">
                                    <span class="text-center">{{ data.field.label }}</span>
                                  </template>
                                  <template #head(actions)> Actions </template>
                                  <template #cell(actions)="data">
                                    <b-button title="View" variant="white" size="lg" class="actionbutton text-dark" @click="viewItem(data.item.Id, data.item.IsNato, data.item.DocID, data.item.Name)">
                                      <font-awesome-icon v-if="String(data.item.Name).indexOf('.docx') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.doc') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.pdf') > 0" :icon="['far', 'file-pdf']" class="icon"></font-awesome-icon>
                                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.txt') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.rtf') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                                    </b-button>
                                    <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" title="Edit" variant="white" size="lg" class="actionbutton text-dark" @click="editItem(data.item.Id, data.item.IsNato, data.item.Name)">
                                      <font-awesome-icon :icon="['far', 'edit']" class="icon"></font-awesome-icon>
                                    </b-button>
                                    <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian" title="Archive" variant="white" size="lg" class="actionbutton text-dark" @click="archiveItem(data.item.Id, data.item.IsNato, data.item)">
                                      <font-awesome-icon :icon="['fas', 'sync']" class="icon"></font-awesome-icon>
                                    </b-button>
                                  </template>
                                  <template #cell(Name)="data">
                                    <b-link v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" :to="{ path: '/pubs/approved/grouped/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + true + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                                    <b-link v-else :to="{ path: '/pubs/approved/grouped/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + false + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                                  </template>
                                  <template #cell()="data">
                                    <div>{{ data.value }}</div>
                                  </template>
                                </b-table>
                              </b-card-body>
                            </b-collapse>
                          </b-card>
                        </div>
                      </b-card-body>
                      <b-card-body v-else>
                        <div class="accordion m-1" role="tablist">
                          <b-card no-body class="m-1" v-for="(child, childindex) in item.children" :key="child">
                            <b-card-header header-tag="header" class="p-1" role="tab">
                              <b-container fluid class="m-0 p-0 px400">
                                <b-row no-gutters class="">
                                  <b-col cols="1">
                                    <b-button v-b-toggle="'childcollapse-' + childindex" size="sm" variant="outline" class="actionbutton">
                                      <font-awesome-icon class="while-open ml-1" far icon="minus-square" :style="{ color: 'black' }"></font-awesome-icon>
                                      <font-awesome-icon class="while-closed ml-1" far icon="plus-square" :style="{ color: 'black' }"></font-awesome-icon>
                                    </b-button>
                                  </b-col>
                                  <b-col cols="9" class="text-left pl-2">
                                    <span>{{ child.text }}</span>
                                  </b-col>
                                  <b-col cols="2">
                                    <span class="count-label">({{ child.count }})</span>
                                  </b-col>
                                </b-row>
                              </b-container>
                            </b-card-header>
                            <b-collapse :id="'childcollapse-' + childindex" accordion="series-accordion" role="tabpanel">
                              <b-card-body>
                                <b-table responsive striped hover :items="child.items" :fields="fields" primary-key="primarykey" table-class="table-full" sticky-header table-variant="light" thead-class="tbl-dynamic-header blue-500 text-white">
                                  <template #head()="data">
                                    <span class="text-center">{{ data.field.label }}</span>
                                  </template>
                                  <template #head(actions)> Actions </template>
                                  <template #cell(actions)="data">
                                    <b-button title="View" variant="white" size="lg" class="actionbutton text-dark" @click="viewItem(data.item.Id, data.item.IsNato, data.item.DocID, data.item.Name)">
                                      <font-awesome-icon v-if="String(data.item.Name).indexOf('.docx') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.doc') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.pdf') > 0" :icon="['far', 'file-pdf']" class="icon"></font-awesome-icon>
                                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.txt') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.rtf') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                                    </b-button>
                                    <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" title="Edit" variant="white" size="lg" class="actionbutton text-dark" @click="editItem(data.item.Id, data.item.IsNato, data.item.Name)">
                                      <font-awesome-icon :icon="['far', 'edit']" class="icon"></font-awesome-icon>
                                    </b-button>
                                    <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian" title="Archive" variant="white" size="lg" class="actionbutton text-dark" @click="archiveItem(data.item.Id, data.item.IsNato, data.item)">
                                      <font-awesome-icon :icon="['fas', 'sync']" class="icon"></font-awesome-icon>
                                    </b-button>
                                  </template>
                                  <template #cell(Name)="data">
                                    <b-link v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" :to="{ path: '/pubs/approved/grouped/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + true + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                                    <b-link v-else :to="{ path: '/pubs/approved/grouped/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + false + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                                  </template>
                                  <template #cell()="data">
                                    <div>{{ data.value }}</div>
                                  </template>
                                </b-table>
                              </b-card-body>
                            </b-collapse>
                          </b-card>
                        </div>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>
              </b-row>
              <b-row v-else>
                <!-- The grouped items array will be based on a specific branch or filtered view but we won't need to show the branch grouping -->
                <!-- The grouped items code will have created a single groupitem object and that object will contain what we need -->
                <div v-if="groupitem.text == 'Navy'" class="accordion m-1" role="tablist" :style="getStyle('branchaccordion', null)">
                  <b-card no-body class="m-1" v-for="(child, childindex) in groupitem.children" :key="child">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-container fluid class="m-0 p-0 px350">
                        <b-row no-gutters class="">
                          <b-col cols="1">
                            <b-button v-b-toggle="'collapse-' + childindex" size="sm" variant="outline" class="actionbutton">
                              <font-awesome-icon class="while-open ml-1" far icon="minus-square" :style="{ color: 'black' }"></font-awesome-icon>
                              <font-awesome-icon class="while-closed ml-1" far icon="plus-square" :style="{ color: 'black' }"></font-awesome-icon>
                            </b-button>
                          </b-col>
                          <b-col cols="9" class="text-left pl-2">
                            <span>{{ child.text }}</span>
                          </b-col>
                          <b-col cols="2">
                            <span class="count-label">({{ child.count }})</span>
                          </b-col>
                        </b-row>
                      </b-container>
                    </b-card-header>
                    <b-collapse :id="'collapse-' + childindex" accordion="branch-accordion" role="tabpanel">
                      <b-card-body v-if="childindex < 7">
                        <div class="accordion m-1" role="tablist">
                          <b-card no-body class="m-1" v-for="(grandchild, grandchildindex) in child.children" :key="grandchild">
                            <b-card-header header-tag="header" class="p-1" role="tab">
                              <b-container fluid class="m-0 p-0 px500">
                                <b-row no-gutters class="">
                                  <b-col cols="1">
                                    <b-button v-b-toggle="'grandchildcollapse-' + grandchildindex" size="sm" variant="outline" class="actionbutton">
                                      <font-awesome-icon class="while-open ml-1" far icon="minus-square" :style="{ color: 'black' }"></font-awesome-icon>
                                      <font-awesome-icon class="while-closed ml-1" far icon="plus-square" :style="{ color: 'black' }"></font-awesome-icon>
                                    </b-button>
                                  </b-col>
                                  <b-col cols="9" class="text-left pl-2">
                                    <span>{{ grandchild.text }}</span>
                                  </b-col>
                                  <b-col cols="2">
                                    <span class="count-label">({{ grandchild.count }})</span>
                                  </b-col>
                                </b-row>
                              </b-container>
                            </b-card-header>
                            <b-collapse :id="'grandchildcollapse-' + grandchildindex" accordion="field-accordion" role="tabpanel">
                              <b-card-body>
                                <b-table responsive striped hover :items="grandchild.items" :fields="fields" primary-key="primarykey" table-class="table-full" sticky-header table-variant="light" thead-class="tbl-dynamic-header blue-500 text-white">
                                  <template #head()="data">
                                    <span class="text-center">{{ data.field.label }}</span>
                                  </template>
                                  <template #head(actions)> Actions </template>
                                  <template #cell(actions)="data">
                                    <b-button title="View" variant="white" size="lg" class="actionbutton text-dark" @click="viewItem(data.item.Id, data.item.IsNato, data.item.DocID, data.item.Name)">
                                      <font-awesome-icon v-if="String(data.item.Name).indexOf('.docx') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.doc') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.pdf') > 0" :icon="['far', 'file-pdf']" class="icon"></font-awesome-icon>
                                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.txt') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                                      <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.rtf') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                                    </b-button>
                                    <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" title="Edit" variant="white" size="lg" class="actionbutton text-dark" @click="editItem(data.item.Id, data.item.IsNato, data.item.Name)">
                                      <font-awesome-icon :icon="['far', 'edit']" class="icon"></font-awesome-icon>
                                    </b-button>
                                    <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian" title="Archive" variant="white" size="lg" class="actionbutton text-dark" @click="archiveItem(data.item.Id, data.item.IsNato, data.item)">
                                      <font-awesome-icon :icon="['fas', 'sync']" class="icon"></font-awesome-icon>
                                    </b-button>
                                  </template>
                                  <template #cell(Name)="data">
                                    <b-link v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" :to="{ path: '/pubs/approved/grouped/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + true + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                                    <b-link v-else :to="{ path: '/pubs/approved/grouped/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + false + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                                  </template>
                                  <template #cell()="data">
                                    <div>{{ data.value }}</div>
                                  </template>
                                </b-table>
                              </b-card-body>
                            </b-collapse>
                          </b-card>
                        </div>
                      </b-card-body>
                      <b-card-body v-else>
                        <b-table responsive striped hover :items="child.items" :fields="fields" primary-key="primarykey" table-class="table-full" sticky-header table-variant="light" thead-class="tbl-dynamic-header blue-500 text-white">
                          <template #head()="data">
                            <span class="text-center">{{ data.field.label }}</span>
                          </template>
                          <template #head(actions)> Actions </template>
                          <template #cell(actions)="data">
                            <b-button title="View" variant="white" size="lg" class="actionbutton text-dark" @click="viewItem(data.item.Id, data.item.IsNato, data.item.DocID, data.item.Name)">
                              <font-awesome-icon v-if="String(data.item.Name).indexOf('.docx') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.doc') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.pdf') > 0" :icon="['far', 'file-pdf']" class="icon"></font-awesome-icon>
                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.txt') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.rtf') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                            </b-button>
                            <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" title="Edit" variant="white" size="lg" class="actionbutton text-dark" @click="editItem(data.item.Id, data.item.IsNato, data.item.Name)">
                              <font-awesome-icon :icon="['far', 'edit']" class="icon"></font-awesome-icon>
                            </b-button>
                            <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian" title="Archive" variant="white" size="lg" class="actionbutton text-dark" @click="archiveItem(data.item.Id, data.item.IsNato, data.item)">
                              <font-awesome-icon :icon="['fas', 'sync']" class="icon"></font-awesome-icon>
                            </b-button>
                          </template>
                          <template #cell(Name)="data">
                            <b-link v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" :to="{ path: '/pubs/approved/grouped/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + true + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                            <b-link v-else :to="{ path: '/pubs/approved/grouped/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + false + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                          </template>
                          <template #cell()="data">
                            <div>{{ data.value }}</div>
                          </template>
                        </b-table>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>
                <div v-else class="accordion m-1" role="tablist" :style="getStyle('branchaccordion', null)">
                  <b-card no-body class="m-1" v-for="(child, childindex) in groupitem.children" :key="child">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-container fluid class="m-0 p-0 px350">
                        <b-row no-gutters class="">
                          <b-col cols="1">
                            <b-button v-b-toggle="'collapse-' + childindex" size="sm" variant="outline" class="actionbutton">
                              <font-awesome-icon class="while-open ml-1" far icon="minus-square" :style="{ color: 'black' }"></font-awesome-icon>
                              <font-awesome-icon class="while-closed ml-1" far icon="plus-square" :style="{ color: 'black' }"></font-awesome-icon>
                            </b-button>
                          </b-col>
                          <b-col cols="9" class="text-left pl-2">
                            <span>{{ child.text }}</span>
                          </b-col>
                          <b-col cols="2">
                            <span class="count-label">({{ child.count }})</span>
                          </b-col>
                        </b-row>
                      </b-container>
                    </b-card-header>
                    <b-collapse :id="'collapse-' + childindex" accordion="branch-accordion" role="tabpanel">
                      <b-card-body>
                        <b-table responsive striped hover :items="child.items" :fields="fields" primary-key="primarykey" table-class="table-full" sticky-header table-variant="light" thead-class="tbl-dynamic-header blue-500 text-white">
                          <template #head()="data">
                            <span class="text-center">{{ data.field.label }}</span>
                          </template>
                          <template #head(actions)> Actions </template>
                          <template #cell(actions)="data">
                            <b-button title="View" variant="white" size="lg" class="actionbutton text-dark" @click="viewItem(data.item.Id, data.item.IsNato, data.item.DocID, data.item.Name)">
                              <font-awesome-icon v-if="String(data.item.Name).indexOf('.docx') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.doc') > 0" :icon="['far', 'file-word']" class="icon"></font-awesome-icon>
                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.pdf') > 0" :icon="['far', 'file-pdf']" class="icon"></font-awesome-icon>
                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.txt') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                              <font-awesome-icon v-else-if="String(data.item.Name).indexOf('.rtf') > 0" :icon="['far', 'file-alt']" class="icon"></font-awesome-icon>
                            </b-button>
                            <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" title="Edit" variant="white" size="lg" class="actionbutton text-dark" @click="editItem(data.item.Id, data.item.IsNato, data.item.Name)">
                              <font-awesome-icon :icon="['far', 'edit']" class="icon"></font-awesome-icon>
                            </b-button>
                            <b-button v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian" title="Archive" variant="white" size="lg" class="actionbutton text-dark" @click="archiveItem(data.item.Id, data.item.IsNato, data.item)">
                              <font-awesome-icon :icon="['fas', 'sync']" class="icon"></font-awesome-icon>
                            </b-button>
                          </template>
                          <template #cell(Name)="data">
                            <b-link v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer" :to="{ path: '/pubs/approved/grouped/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + true + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                            <b-link v-else :to="{ path: '/pubs/approved/grouped/view/' + data.item.Id + '/' + data.item.IsNato + '/' + data.item.DocID + '/' + false + '/' + encodeURIComponent(data.item.Name) }">{{ data.item.Name }}</b-link>
                          </template>
                          <template #cell()="data">
                            <div>{{ data.value }}</div>
                          </template>
                        </b-table>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>
              </b-row>
            </b-card>
          </b-container>
          <template #overlay>
            <div class="text-center">
              <p id="busy-label">{{ overlayText }}</p>
            </div>
          </template>
        </b-overlay>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../interfaces/User'
import { PublicationItem } from '../../interfaces/PublicationItem'
import { ObjectItem } from '../../interfaces/ObjectItem'
import { GroupItem } from '@/interfaces/GroupItem'
import { isDate } from 'lodash'
import DynamicModalSelect from '../Custom/DynamicModalSelect.vue'

const users = namespace('users')
const publication = namespace('publication')
const support = namespace('support')

let that: any

@Component({
  name: 'Grouped',
  components: {
    DynamicModalSelect
  }
})
export default class Grouped extends Vue {
  @Prop() view: any

  // #region variables
  tblId = 'AllPubs'
  primaryKey = 'docid'
  overlayText = 'Grouping Publications. Please wait...'
  overlayVariant = 'loading'
  rowHeight = 0
  pageSize = 20
  interval!: any
  branch = 'Navy'
  filteredpubs: Array<PublicationItem> = []
  archivepubs: Array<PublicationItem> = []
  groupeditems: Array<GroupItem> = [] // will be created from the filtered items
  groupitem: GroupItem = {
    children: [] // Initially required to be set as it is a required object to properly make the code work
  }
  currentPage = 1
  totalRows = 0
  perPage = 30 // default
  currentPageArchive = 1
  totalRowsArchive = 0
  perPageArchive = 24 // default
  pubs: Array<PublicationItem> = []
  Prfx: any
  FunctionalSeries: any
  viewReady?: boolean = false
  archive: any = {
    item: {},
    archivetype: '',
    id: 0,
    nato: '',
    supersededby: ''
  }
  superseded?: boolean = false
  supersededby = ''
  pubsfilter = ''
  filter = ''

  pubsfields = [
    { key: 'actions', label: 'Select' },
    { key: 'Title', label: 'Title' }
  ]

  archives = [
    { value: 'None', text: 'None' },
    { value: 'Rescinded', text: 'Rescinded' },
    { value: 'Cancelled', text: 'Cancelled' },
    { value: 'Superseded', text: 'Superseded' }
  ]

  fields: any = [
    { key: 'actions', label: 'Actions', actions: ['View', 'Edit'], thClass: 'blue-500', tdClass: 'px100', id: 0 },
    { key: 'Prfx', field: 'Prfx', label: 'Prefix', thClass: 'blue-500', tdClass: 'px100', type: 'default', format: 'dropdownmulti', id: 1, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'PubID', field: 'PubID', label: 'PubID', thClass: 'blue-500', tdClass: 'px90', type: 'default', format: 'text', id: 2, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    { key: 'Name', field: 'Name', label: 'Name', thClass: 'blue-500', tdClass: 'px200', type: 'default', format: 'text', id: 3, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    { key: 'LongTitle', field: 'LongTitle', label: 'Long Title', thClass: 'blue-500', tdClass: 'px200', type: 'default', format: 'text', id: 4, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    { key: 'AdditionalData.Status', field: 'Status', label: 'Status', thClass: 'blue-500', tdClass: 'px100', type: 'AD', format: 'dropdownmulti', id: 5, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'AdditionalData.Edition', field: 'Edition', label: 'Edition', thClass: 'blue-500', tdClass: 'px110', type: 'AD', format: 'dropdownmulti', id: 6, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'AdditionalData.PRAAbbrev', field: 'PRAAbbrev', label: 'PRA Abbrev', thClass: 'blue-500', tdClass: 'px150', type: 'AD', format: 'dropdownmulti', id: 7, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'AdditionalData.Change', field: 'Change', label: 'Change', thClass: 'blue-500', tdClass: 'px150', type: 'AD', format: 'text', id: 8, sort: '', filter: false, filtervalue: '', predicate: 'S' },
    { key: 'DTIC', field: 'DTIC', label: 'Distribution', thClass: 'blue-500', tdClass: 'px120', type: 'default', format: 'dropdownmulti', id: 10, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'AdditionalData.GeneralStatus', field: 'GeneralStatus', label: 'General Status', thClass: 'blue-500', tdClass: 'px140', type: 'AD', format: 'dropdownmulti', id: 11, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'NWDCAO.Title', field: 'NWDCAO', label: 'NWDC AO', thClass: 'blue-500', tdClass: 'px150', type: 'NWDCAO', format: 'dropdownmulti', id: 12, sort: '', ops: [], filter: false, filtervalue: [] },
    { key: 'Class', field: 'Class', label: 'Classification', thClass: 'blue-500', tdClass: 'px200', type: 'default', format: 'dropdownmulti', id: 13, sort: '', ops: [], filter: false, filtervalue: [] }
  ]

  archivefields: any = [
    { key: 'actions', label: 'Actions', actions: ['View', 'Edit'], thClass: 'blue-500', tdClass: 'px50', id: 0 },
    { key: 'Name', field: 'Name', label: 'Name', thClass: 'blue-500', tdClass: 'px900', type: 'default', format: 'text', id: 3, sort: '', filter: false, filtervalue: '', predicate: 'S' }
  ]
  // #endregion

  // #region store data

  @users.State
  public currentUser!: UserInt

  @support.State
  public contentheight!: number

  @support.State
  public contentwidth!: number

  @publication.State
  public loadingpubs!: boolean

  @publication.State
  public approvedpubsforuser!: Array<PublicationItem>

  @publication.State
  public activepubsforuserloaded!: boolean

  @publication.State
  public natopubsforuserloaded!: boolean

  @publication.State
  public approvedpubsforuserloaded!: Date

  @publication.State
  public branches!: Array<ObjectItem>

  @publication.State
  public groupedviews!: any

  @support.Action
  public addActivity!: (activity: any) => void

  @support.Action
  public setHeaderTitle!: (title: string) => void

  @publication.Action
  public getDigest!: () => Promise<boolean>

  @publication.Action
  public setGroupedViews!: (views: any) => void

  @publication.Action
  public getBranches!: () => Promise<boolean>

  @publication.Action
  public getActivePubsForUser!: () => Promise<boolean>

  @publication.Action
  public getNatoPubsForUser!: () => Promise<boolean>

  @publication.Action
  public createAllApprovedPubsForUser!: (includeNATO: boolean) => Promise<boolean>

  @publication.Action
  public archivePublication!: (data: any) => Promise<boolean>

  @publication.Action
  public returnFunctionalSeriesByBranch!: (branch: string) => Promise<GroupItem>

  @publication.Action
  public returnFunctionalFieldByFunctionalSeries!: (series: string) => Promise<GroupItem>

  // #endregion

  public getid(text: any, idx: any) {
    return text + '_' + idx
  }

  /** @method - lifecycle hook */
  created() {
    that = this
  }

  mounted() {
    this.getBranches().then(() => {
      this.interval = setInterval(this.loadstuff, 500)
    })
  }

  /** @method - lifecycle hook */
  loadstuff() {
    clearInterval(this.interval)
    this.setHeaderTitle('Grouped Publications')
    // do we already have pubs and when were they last loaded. Also check to be sure we are not already loading pubs
    if (!this.loadingpubs) {
      if (this.approvedpubsforuserloaded && isDate(this.approvedpubsforuserloaded)) {
        // if the data is not too old (1 hour) just keep it. for testing set the check for different times to validate
        const date1 = this.approvedpubsforuserloaded.getTime()
        const date2 = new Date().getTime()
        let diff = date2 - date1
        diff = diff / 1000
        if (diff > 3600) {
          // time is in seconds so set to whatever to test. 3600 = 1 hour
          if (this.currentUser.isNATOVisitor) {
            // the test for isNATOVisitor is simply used to be sure a user can view NATO pubs since the SharePoint groups split. This applies for all tests for isNATOVisitor
            this.getActivePubsForUser()
            this.getNatoPubsForUser()
            this.interval = setInterval(this.waitForIt, 500)
          } else {
            this.getActivePubsForUser()
            this.interval = setInterval(this.waitForIt, 500)
          }
        } else {
          // pubs loaded so just move on
          this.pubsloaded()
        }
      } else {
        // need to load the pubs for the user
        if (this.currentUser.isNATOVisitor) {
          // the test for isNATOVisitor is simply used to be sure a user can view NATO pubs since the SharePoint groups split. This applies for all tests for isNATOVisitor
          this.getActivePubsForUser()
          this.getNatoPubsForUser()
          this.interval = setInterval(this.waitForIt, 500)
        } else {
          this.getActivePubsForUser()
          this.interval = setInterval(this.waitForIt, 500)
        }
      }
    }
  }

  updated() {
    console.log('UPDATED!')
  }

  public waitForIt() {
    if (this.activepubsforuserloaded) {
      if (this.currentUser.isNATOVisitor) {
        if (this.natopubsforuserloaded) {
          clearInterval(this.interval)
          that.createAllApprovedPubsForUser(true).then((response) => {
            that.interval = setInterval(this.waitForPubs, 500)
          })
        }
      } else {
        clearInterval(this.interval)
        that.createAllApprovedPubsForUser(false).then((response) => {
          that.interval = setInterval(this.waitForPubs, 500)
        })
      }
    }
  }

  public waitForPubs() {
    if (this.approvedpubsforuserloaded) {
      clearInterval(this.interval)
      this.pubsloaded()
    }
  }

  public pubsloaded() {
    this.totalRows = this.approvedpubsforuser.length
    this.filteredpubs = this.approvedpubsforuser
    this.filterPubs()
  }

  public filterPubs() {
    let buildview = true
    this.overlayText = 'Grouping Publications. Checking for previous load.'
    this.archivepubs = this.filteredpubs
    this.totalRowsArchive = this.archivepubs.length
    for (let i = 0; i < this.groupedviews.length; i++) {
      if (this.groupedviews[i].key === this.view) {
        // we are on the view so is it loaded? When was it last loaded? is it dirty?
        if (this.groupedviews[i].loaded) {
          if (this.groupedviews[i].items && this.groupedviews[i].items.length > 0) {
            buildview = false
            this.groupeditems = this.groupedviews[i].items
            if (this.groupeditems && this.groupeditems.length == 1) {
              this.groupitem = this.groupeditems[0]
            }
          }
        }
      }
    }
    if (buildview) {
      this.overlayText = 'Grouping Publications. Filtering by selected view.'
      let a = this.filteredpubs
      switch (this.view) {
        case 'Navy': {
          a = a.filter((search) => Vue._.isEqual(search['Branch'], 'Navy'))
          this.setHeaderTitle('Navy Publications')
          break
        }
        case 'Allied': {
          a = a.filter((search) => Vue._.isEqual(search['Branch'], 'Allied'))
          this.setHeaderTitle('Allied Publications')
          break
        }
        case 'Joint': {
          a = a.filter((search) => Vue._.isEqual(search['Branch'], 'Joint'))
          this.setHeaderTitle('Joint Publications')
          break
        }
        case 'Multinational': {
          a = a.filter((search) => Vue._.isEqual(search['Branch'], 'Multinational'))
          this.setHeaderTitle('Multinational Publications')
          break
        }
        default: {
          // eslint-disable-next-line no-self-assign
          a = a
          this.setHeaderTitle('All Publications (Grouped)')
        }
      }
      this.filteredpubs = a
      this.buildGroupedItems()
    } else {
      switch (this.view) {
        case 'Navy': {
          this.setHeaderTitle('Navy Publications')
          break
        }
        case 'Allied': {
          this.setHeaderTitle('Allied Publications')
          break
        }
        case 'Joint': {
          this.setHeaderTitle('Joint Publications')
          break
        }
        case 'Multinational': {
          this.setHeaderTitle('Multinational Publications')
          break
        }
        default: {
          // eslint-disable-next-line no-self-assign
          this.setHeaderTitle('All Publications (Grouped)')
        }
      }
      this.viewReady = true
    }
  }

  public async buildGroupedItems() {
    this.overlayText = 'Grouping Publications. Getting all data into proper groups. This takes some time.'
    // will loop through filtered items and create groupeditems array
    // empty the array first then fill it back as filters/data changes
    console.log('[BUILDING GROUPED ITEMS ARRAY]')
    this.groupeditems = []
    let a = this.filteredpubs
    // if the view prop is set to All we will start at the branch level but if not we will start at the series level
    // start at branches first
    // We can assume based on data and earlier versions that every branch has at least 1 or more items
    for (let i = 0; i < this.branches.length; i++) {
      let p: any = {}
      p.type = 'Branch'
      p.text = this.branches[i].text
      let b = a.filter((search) => Vue._.isEqual(search['Branch'], p.text))
      p.count = b.length
      p.children = []
      if (p.count > 0) {
        this.groupeditems.push(p)
      }
    }
    for (let i = 0; i < this.groupeditems.length; i++) {
      // get series for this branch
      let branch = this.groupeditems[i].text
      if (branch) {
        let response = await this.returnFunctionalSeriesByBranch(branch)
        let children = response.children
        let n: Array<GroupItem> = []
        if (children && children.length > 0) {
          for (let j = 0; j < children.length; j++) {
            let series = children[j].text
            if (series) {
              let b = Vue._.filter(a, { AdditionalData: { FunctionalSeries: series } })
              if (b && b.length > 0) {
                children[j].count = b.length
                children[j].items = b
                n.push(children[j])
              } else {
                // do nothing
              }
            }
          }
        }
        this.groupeditems[i].children = n
      }
    }
    for (let i = 0; i < this.groupeditems.length; i++) {
      // get the fields now
      // only branch Navy has fields
      if (this.groupeditems[i].text === 'Navy') {
        let children = this.groupeditems[i].children
        if (children && children.length > 0) {
          for (let j = 0; j < children.length; j++) {
            let series = children[j].text
            children[j].children = []
            if (series) {
              let response = await this.returnFunctionalFieldByFunctionalSeries(series)
              let grandchildren = response.children
              let o: Array<GroupItem> = []
              if (grandchildren && grandchildren.length > 0) {
                for (let k = 0; k < grandchildren.length; k++) {
                  let field = grandchildren[k].text
                  if (field) {
                    let b = Vue._.filter(a, { AdditionalData: { FunctionalField: field } })
                    if (b && b.length > 0) {
                      grandchildren[k].count = b.length
                      grandchildren[k].items = b
                      o.push(grandchildren[k])
                    }
                  }
                }
              }
              children[j].children = o
            }
          }
        }
      }
    }
    // if there is only 1 in the array, copy it to the groupitem object
    if (this.groupeditems && this.groupeditems.length == 1) {
      this.groupitem = this.groupeditems[0]
    }
    // TODO: setup logic to define when this should be reloaded. Should it be time based? Refresh if the user changes data?
    this.overlayText = 'Grouping Publications. Storing selection for future load.'
    for (let i = 0; i < this.groupedviews.length; i++) {
      if (this.groupedviews[i].key === this.view) {
        this.groupedviews[i].loaded = true
        this.groupedviews[i].items = this.groupeditems
      }
    }
    this.setGroupedViews(this.groupedviews)
    this.archivepubs = this.filteredpubs
    this.viewReady = true
  }

  public selectSuperceded(docid: string, name: string) {
    console.log('SELECT SUPERCEDED: ' + docid)
    this.supersededby = ''
    this.supersededby = name
    for (let i = 0; i < this.archivepubs.length; i++) {
      let DocID = String(this.archivepubs[i].DocID)
      if (DocID === docid) {
        this.archivepubs[i].selected = true
      } else {
        this.archivepubs[i].selected = false
      }
    }
  }

  public viewItem(id: string, nato: string, docid: string, name: string) {
    let showhidden = false
    if (this.currentUser.isActionOfficer || this.currentUser.isLibrarian || this.currentUser.isNATOLibrarian) {
      showhidden = true
    }
    this.$router.push({ path: '/pubs/approved/grouped/view/' + id + '/' + nato + '/' + docid + '/' + showhidden + '/' + encodeURIComponent(name) })
  }

  public editItem(id: string, nato: string, name: string) {
    this.$router.push({ path: '/pubs/approved/grouped/edit/' + id + '/' + nato + '/' + true + '/' + encodeURIComponent(name) })
  }

  public getStyle(element, field) {
    let style: any = {}
    switch (element) {
      case 'buttonrow':
        style.background = '#ffffff'
        style.height = '50px'
        break

      case 'tablerowarchive':
        style.height = '600px'
        break

      case 'pagingrow':
        style.height = '50px'
        break

      case 'branchaccordion':
        style.maxHeight = '600px'
        style.overflowY = 'auto'
        style.overflowX = 'hidden'
    }
    return style
  }

  public getSticky(element) {
    let h: any
    switch (element) {
      case 'dynamictablearchive':
        h = '600px'
        break

      case 'accordiontable':
        h = '800px'
    }
    return h
  }

  public getCount(type: string, branch: string | null) {
    console.log('getCount called')
    let result = 0
    let a = this.filteredpubs
    switch (type) {
      case 'branch': {
        let b = a.filter((search) => Vue._.isEqual(search['Branch'], branch))
        result = b.length
        break
      }
    }
    return result
  }

  archiveItem(id: string, nato: string, item: any) {
    // console.log('Archive Pub')
    this.archive.item = item
    this.archive.id = id
    this.archive.nato = nato
    this.$bvModal.show('ArchiveModal')
  }

  onArchiveSelected() {
    if (this.archive.archivetype === 'Superseded') {
      this.superseded = true
    }
  }

  onCancelled() {
    this.archive.archivetype = ''
    this.supersededby = ''
    this.superseded = false
  }

  onOk() {
    console.log('Publication selected for archive: ' + this.archive.archivetype + ', id: ' + this.archive.id)
    // Based on the selected archivetype of archive move or copy document to archived pub library.
    const that = this
    switch (this.archive.archivetype) {
      case 'Cancelled':
        // copy to archive library setting general status to obsolete and status to cancelled. Then delete this document.
        this.archive.item.AdditionalData.Status = 'Cancelled'
        this.getDigest().then((response) => {
          if (response) {
            that.archivePublication(that.archive).then(function () {
              console.log('ARCHIVE PUBLICATION')
            })
          }
        })
        break

      case 'Rescinded':
        // copy to archive library setting general status to obsolete and status to rescinded. Then delete this document.
        this.archive.item.AdditionalData.Status = 'Rescinded'
        this.getDigest().then((response) => {
          if (response) {
            that.archivePublication(that.archive).then(function () {
              console.log('ARCHIVE PUBLICATION')
            })
          }
        })
        break

      case 'Superseded':
        // copy to archive library setting general status to obsolete, status to superseded, and SupersededBy to the selected document. Then delete this document.
        this.archive.item.AdditionalData.Status = 'Superseded'
        this.archive.item.AdditionalData.SupersededBy = this.supersededby
        console.log('Superseded By: ' + this.supersededby + ', item superseded by: ' + this.archive.item.AdditionalData.SupersededBy)
        this.getDigest().then((response) => {
          if (response) {
            that.archivePublication(that.archive).then(function () {
              console.log('ARCHIVE PUBLICATION')
            })
          }
        })
        break
    }
    // remove the archived item from the array
    for (let i = 0; i < this.approvedpubsforuser.length; i++) {
      if (this.approvedpubsforuser[i].Id === this.archive.id) {
        // is it nato
        if (this.approvedpubsforuser[i].IsNato === 'Yes') {
          if (this.archive.nato === 'Yes') {
            this.approvedpubsforuser.splice(i, 1)
          }
        } else {
          // not nato
          this.approvedpubsforuser.splice(i, 1)
        }
      }
    }
    this.pubsloaded()
  }

  onShow() {
    console.log('Showing modal')
  }
}
</script>

<style lang="scss">
.nav-btn-filter {
  position: absolute;
  right: 125px;
}
.nav-btn-clear {
  position: absolute;
  right: 25px;
}
.table-full {
  border: 1px solid #000000 !important;
}
.table-full td,
.table-full th {
  border: 1px solid #000000 !important;
  height: 20px !important;
  padding: 2px 5px !important;
}
.pubcount {
  border: 1px solid #ffffff !important;
  padding: 2px 2px !important;
  color: $pagination-color;
}
.collapsed > .while-open,
.not-collapsed > .while-closed {
  display: none;
}
#ulFields {
  list-style-type: none;
  width: 100%;
  margin-bottom: 0px;
  font-size: 16px !important;
  padding: 0;
}

#ulFields li {
  list-style-type: none;
  margin-bottom: 5px !important;
}
</style>
