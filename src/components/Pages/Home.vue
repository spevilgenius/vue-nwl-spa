<template>
  <b-container fluid class="m-0 p-0">
    <b-row no-gutters>
      <b-col cols="12" class="m-0 p-0">
        <b-container fluid class="m-0 p-0">
          <b-row no-gutters class="banner d-none d-xxl-block" :style="{ backgroundImage: 'url(' + baseImageUrl + '/headeridealightnew.png)' }">
            <b-col cols="12">
              <b-container fluid class="m-0 p-0">
                <b-row no-gutters class="titleRow">
                  <div class="mx-auto text-center text-light bannerbackground">
                    <div class="upper" id="NWLTitle">Welcome to The Navy Warfare Library</div>
                    <div class="pubType" align="center">The Navy Warfare Library (NWL) is the authoritative repository for Navy Doctrine and terminology.</div>
                  </div>
                </b-row>
              </b-container>
            </b-col>
          </b-row>
          <b-row no-gutters>
            <b-col order="1" class="col-lg-12 col-xl-4 col m-0 p-1">
              <b-card no-body header-tag="header" class="bg-loading">
                <b-card-header class="bg-gold p-0" header-text-variant="white">
                  <h5 class="text-white p-0 mb-0">New Navy Warfare Library Coming Soon</h5>
                </b-card-header>
              </b-card>
            </b-col>
            <b-col order="2" class="col-lg-12 col-xl-4 m-0 p-1">
              <b-card no-body header-tag="header" class="bg-loading">
                <b-card-header class="bg-gold p-0" header-text-variant="white">
                  <h5 class="text-white p-0 mb-0">
                    <a class="fixedanchor" href="https://doctrine.navy.mil/default.aspx">Return to previous version of Navy Warfare Library</a>
                  </h5>
                </b-card-header>
              </b-card>
            </b-col>
            <b-col order="3" class="col-lg-12 col-xl-4 m-0 p-1">
              <b-card no-body header-tag="header" class="bg-loading">
                <b-card-header class="bg-gold p-0" header-text-variant="white">
                  <h5 class="text-white p-0 mb-0">
                    <a class="fixedanchor" href="mailto:idina.m.hatten.civ@us.navy.mil?bcc=lynn.ellenwood.civ@us.navy.mil&subject=NWL%20Feedback"><font-awesome-icon far icon="envelope" class="icon ml-2" style="font-size: 23px"></font-awesome-icon>&nbsp;&nbsp;Provide Feedback</a>
                  </h5>
                </b-card-header>
              </b-card>
            </b-col>
          </b-row>
          <b-row no-gutters>
            <b-col order="1" class="col-lg-12 col-xl-4 m-0 p-1 bg-white">
              <b-card no-body header-tag="header" class="bg-loading">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0">
                  <h5 class="text-white p-0 mb-0">Navy Doctrinal Publications</h5>
                </b-card-header>
                <b-card-body class="p-1">
                  <b-list-group>
                    <b-link :to="{ name: 'NavyDoctrine' }">
                      <b-list-group-item variant="white" class="flex-column align-items-start">
                        <b-card no-body class="p-1 bg-navy">
                          <b-row no-gutters>
                            <b-col md="2">
                              <!-- <font-awesome-icon fas icon="book-open" class="pubicon text-success"></font-awesome-icon> -->
                              <div>
                                <img
                                  class="icon"
                                  img
                                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAABhCAYAAAD2it6CAAAACXBIWXMAABcSAAAXEgFnn9JSAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuNTY2ZWJjNSwgMjAyMi8wNS8wOS0wNzoyMjoyOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjQgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wOC0wNVQwNzowNDowMi0wNDowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDgtMDVUMDc6MDg6MDQtMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDgtMDVUMDc6MDg6MDQtMDQ6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmUyNDBhMWU2LTIzNWEtNmI0MC1iYTExLWYwZDMyZTJhYTNlOSIgeG1wTU06RG9jdW1lbnRJRD0i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"
                                  height="65"
                                />
                              </div>
                            </b-col>
                            <b-col md="10" class="p-1 text-white">
                              <h6 class="text-white">Navy Doctrine</h6>
                              <b-card-title class="text-white">NDP, NWP</b-card-title>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-list-group-item>
                    </b-link>
                    <b-list-group-item variant="white" class="flex-column align-items-start">
                      <b-link
                        :to="{
                          path: '/pubs/approved/all/filtered/field/Prfx/NTTP/true/FSFF'
                        }"
                      >
                        <b-card no-body class="p-1 bg-navy">
                          <b-row no-gutters>
                            <b-col md="2">
                              <!-- <font-awesome-icon fas icon="project-diagram" class="pubicon text-info"></font-awesome-icon> -->
                              <div>
                                <img
                                  class="icon"
                                  img
                                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABlCAYAAAC/S5bMAAAACXBIWXMAABcSAAAXEgFnn9JSAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuNTY2ZWJjNSwgMjAyMi8wNS8wOS0wNzoyMjoyOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjQgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wOC0wNVQwNzowNDowMi0wNDowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDgtMDVUMDc6MTI6MjItMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDgtMDVUMDc6MTI6MjItMDQ6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBhNjc0MjUzLTUxZjItZDE0ZS1iNjFhLTlmOWUzY2JkNzQwYiIgeG1wTU06RG9jdW1lbnRJRD0i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"
                                  height="65"
                                />
                              </div>
                            </b-col>
                            <b-col md="10" class="p-1 text-white">
                              <h6 class="text-white">Navy Tactics, Techniques and Procedures</h6>
                              <b-card-title class="text-white">NTTP, MTTP</b-card-title>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-link>
                    </b-list-group-item>
                    <b-list-group-item variant="white" class="flex-column align-items-start">
                      <b-link
                        :to="{
                          path: '/pubs/approved/all/filtered/field/Prfx/NTRP/true/FSFF'
                        }"
                      >
                        <b-card no-body class="p-1 bg-navy">
                          <b-row no-gutters>
                            <b-col md="2">
                              <!-- <font-awesome-icon fas icon="book" class="pubicon text-danger"></font-awesome-icon> -->
                              <div>
                                <img
                                  class="icon"
                                  img
                                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHUAAABdCAYAAACb+ynnAAAACXBIWXMAABcSAAAXEgFnn9JSAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuNTY2ZWJjNSwgMjAyMi8wNS8wOS0wNzoyMjoyOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjQgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wOC0wNVQwNzowNDowMi0wNDowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDgtMDVUMDc6MTA6MzItMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDgtMDVUMDc6MTA6MzItMDQ6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ1ZTUwMGIyLWEzZGYtYTM0OS05Yjc3LTUzYzA3MjgyN2EyYiIgeG1wTU06RG9jdW1lbnRJRD0i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"
                                  height="65"
                                />
                              </div>
                            </b-col>
                            <b-col md="10" class="p-1">
                              <h6 class="text-white">Navy Tactical Reference Publication</h6>
                              <b-card-title class="text-white">NTRP</b-card-title>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-link>
                    </b-list-group-item>
                    <b-list-group-item variant="white" class="flex-column align-items-start">
                      <b-link
                        :to="{
                          name: 'TTP',
                          params: {
                            filterType: 'TTP',
                            grouped: true,
                            groupedby: 'FS'
                          }
                        }"
                      >
                        <b-card no-body class="p-1 bg-navy">
                          <b-row no-gutters>
                            <b-col md="2">
                              <!-- <font-awesome-icon fas icon="lightbulb" class="pubicon text-warning"></font-awesome-icon> -->
                              <div>
                                <img
                                  class="icon"
                                  img
                                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAB1CAYAAAAoez2lAAAACXBIWXMAABcSAAAXEgFnn9JSAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuNTY2ZWJjNSwgMjAyMi8wNS8wOS0wNzoyMjoyOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjQgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wOC0wNVQwNzowNDowMi0wNDowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDgtMDVUMDc6MTE6MzktMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDgtMDVUMDc6MTE6MzktMDQ6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYyMGM4ZGNmLWMxOTctOTU0Mi04YzgyLWUyYjVkYTQyYmNiZiIgeG1wTU06RG9jdW1lbnRJRD0i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"
                                  height="65"
                                />
                              </div>
                            </b-col>
                            <b-col md="10" class="p-1">
                              <h6 class="text-white">Navy Developmental TTP</h6>
                              <b-card-title class="text-white">TACMEMO, TACBUL, TACNOTE</b-card-title>
                            </b-col>
                          </b-row>
                        </b-card>
                      </b-link>
                    </b-list-group-item>
                  </b-list-group>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col order="2" class="col-lg-12 col-xl-4 m-0 p-1 bg-white">
              <b-card no-body header-tag="header" class="bg-loading">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h5 class="text-white p-0 mb-0">Warfighting Collections</h5></b-card-header>
                <b-card-body body-class="card-body-left p-1" style="height: 320px; overflow-y: auto; overflow-x: hidden">
                  <ul>
                    <li>
                      <b-link
                        :to="{
                          path: '/pubs/approved/all/filtered/field/Prfx/Air NTTP/true/FF'
                        }"
                        >Air NTTP</b-link
                      >
                    </li>
                    <li>
                      <b-link v-if="currentUser.isNATOVisitor" :to="{ name: 'Allied Publications' }">Allied Publications</b-link>
                      <b-link v-else :to="{ path: '/nwlsupport/home/requestnato' }">Allied Publications</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/reroute/grouped/Joint' }">Joint Publications</b-link>
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/reroute/grouped/Multinational' }">Multinational Publications</b-link>
                    </li>
                    <li>
                      <b-link
                        :to="{
                          path: '/pubs/approved/all/filtered/field/FunctionalSeries/Navy Concept Pubs'
                        }"
                        >Navy Concepts</b-link
                      >
                    </li>
                    <li>
                      <b-link
                        :to="{
                          path: '/pubs/approved/all/filtered/field/Prfx/CONOPS/true/FS'
                        }"
                        >Fleet CONOPS</b-link
                      >
                    </li>
                    <li>
                      <b-link
                        :to="{
                          path: '/pubs/approved/all/filtered/field/FunctionalSeries/Navy Wide OPTASKs'
                        }"
                        >Navy-wide OPTASKS</b-link
                      >
                    </li>
                    <li>
                      <b-link
                        v-if="currentUser.isLibrarian || currentUser.isNATOLibrarian || currentUser.isActionOfficer"
                        :to="{
                          path: '/pubs/approved/all/view/1/No/7c8dea07-ccaf-40e0-910f-2cfe91c170e4/true/3500.38B%2C%20Universal%20Naval%20Task%20List%20(UNTL).pdf'
                        }"
                        >Universal Naval Task List (UNTL)</b-link
                      >
                      <b-link
                        v-else
                        :to="{
                          path: '/pubs/approved/all/view/1/No/7c8dea07-ccaf-40e0-910f-2cfe91c170e4/false/3500.38B%2C%20Universal%20Naval%20Task%20List%20(UNTL).pdf'
                        }"
                        >Universal Naval Task List (UNTL)</b-link
                      >
                    </li>
                    <li>
                      <b-link :to="{ name: 'FXP', params: { filterType: 'FXP' } }">Fleet Exercise Publications (Archive)</b-link>
                    </li>
                    <li>
                      <b-link
                        :to="{
                          path: '/pubs/approved/all/filtered/field/Prfx/NTP'
                        }"
                        >Naval Telecommunications Procedures (NTPs)</b-link
                      >
                    </li>
                    <li>
                      <b-link :to="{ name: 'Mission Area Bookshelves' }">Mission Area Bookshelves</b-link>
                    </li>
                  </ul>
                </b-card-body>
              </b-card>
              <b-card no-body header-tag="header" class="bg-loading">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h5 class="text-white p-0 mb-0">Warfighting Reference Materials</h5></b-card-header>
                <b-card-body body-class="card-body-left p-1" style="height: 190px">
                  <ul>
                    <li>
                      <b-link
                        :to="{
                          path: '/pubs/approved/all/filtered/field/FunctionalSeries/Strategy Documents'
                        }"
                        >Strategy Documents</b-link
                      >
                    </li>
                    <li>
                      <b-link :to="{ path: '/pubs/archived/all' }">Archived Documents</b-link>
                    </li>
                    <li>
                      <b-link
                        :to="{
                          path: '/pubs/approved/all/filtered/Commander Handbooks'
                        }"
                        >Commander’s Handbooks</b-link
                      >
                    </li>
                    <li>
                      <b-link
                        :to="{
                          path: '/pubs/approved/all/filtered/field/FunctionalSeries/Writing Guidance'
                        }"
                        >Writing Guidance</b-link
                      >
                    </li>
                  </ul>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col order="3" class="col-lg-12 col-xl-4 m-0 p-1 bg-white">
              <b-card no-body header-tag="header" class="bg-loading">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h5 class="text-white p-0 mb-0">Trending Publications</h5></b-card-header>
                <b-card-body body-class="card-body-left p-1" style="height: 320px; overflow-y: auto; overflow-x: hidden">
                  <ol style="display: block">
                    <li v-for="item in items" :key="item.DocId">
                      <b-link
                        :to="{
                          path: '/pubs/approved/all/view/' + item.ID + '/no' + '/' + item.DocId + '/true/' + encodeURIComponent(String(item.Name))
                        }"
                        >{{ item.Title }}</b-link
                      >
                    </li>
                    <!--<li>
                      <a v-bind:href="item.Path" v-for="item in items" :key="item.DocId">{{ item.Title }}</a>
                    </li>-->
                  </ol>
                </b-card-body>
              </b-card>
              <b-card no-body header-tag="header" class="bg-loading">
                <b-card-header header-bg-variant="blue-800" header-text-variant="white" class="p-0"><h5 class="text-white p-0 mb-0">Library Publication Chart</h5></b-card-header>
                <b-card-body body-class="p-1">
                  <b-container fluid>
                    <div style="cursor: pointer; margin: 0px auto; display: inline-block; position: relative">
                      <div style="text-align: center">
                        <imgcaption>
                          <strong>
                            NWL Org Chart<br />
                            Click to View Larger Image<br />
                          </strong>
                        </imgcaption>
                      </div>
                      <a href="https://doctrine.navy.mil/SiteAssets/images/Navy%20Warfare%20Library%20Organization%20Chart.pdf" target="_blank">
                        <div style="text-align: center">
                          <img src="https://doctrine.navy.mil/SiteAssets/images/NWL-Org_Chart.jpg" alt="" width="200" height="auto" />
                        </div>
                      </a>
                    </div>
                  </b-container>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
          <b-row no-gutters>
            <b-col cols="12" class="m-0 p-0 bg-blue-600">
              <b-carousel fade controls indicators interval="6000">
                <b-carousel-slide v-for="announcement in announcements" :key="announcement">
                  <template #img>
                    <b-container id="annoucements" fluid class="py100">
                      <b-row>
                        <b-col md="4" class="centerFlex py100">
                          <h5 class="text-white">
                            <b-modal size="lg" scrollable :id="announcement.Id + '_Announcement'" hide-footer>
                              <template #modal-title>{{ announcement.Title }}</template>
                              <div class="d-block text-left">
                                <p v-html="announcement.Body"></p>
                              </div>
                              <b-button class="mt-3" block @click="$bvModal.hide(announcement.Id + '_Announcement')">Close</b-button>
                            </b-modal>
                            <a @click="$bvModal.show(announcement.Id + '_Announcement')" style="cursor: pointer">{{ announcement.Title }}</a>
                          </h5>
                        </b-col>
                        <b-col md="8" class="centerFlex py100">
                          <h6><span class="text-white" v-html="limitText(announcement.Info)"></span></h6>
                        </b-col>
                      </b-row>
                    </b-container>
                  </template>
                </b-carousel-slide>
              </b-carousel>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ObjectItem } from '@/interfaces/ObjectItem'
import { Announcement } from '@/interfaces/Announcement'
import { UserInt } from '../../interfaces/User'
import { namespace } from 'vuex-class'
import { ReportItem } from '../../interfaces/ReportItem'

const support = namespace('support')
const users = namespace('users')
const reports = namespace('reports')

@Component({
  name: 'Home'
})
export default class Home extends Vue {
  @Prop({ default: process.env.VUE_APP_BASE_IMAGE_URL })
  public readonly baseImageUrl!: string
  showDOD = true
  viewReady?: boolean = false
  items: Array<ReportItem> = []

  fields = [
    {
      key: 'Title',
      type: 'default',
      format: 'text',
      tdClass: 'text-left',
      id: 1
    }
    //{ key: 'FileExtension', label: 'Ext', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 2 }
    //{ key: 'IsDoc', label: 'IsDoc', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 3 }
    //{ key: 'Description', label: 'Description', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 2 }
    //{ key: 'Library', label: 'Library', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 2 }
  ]
  @support.State
  public bookshelves!: Array<ObjectItem>

  @support.State
  public announcements!: Array<Announcement>

  @support.Action
  public getBS!: () => Promise<boolean>

  @support.Action
  public getAnnouncements!: () => Promise<boolean>

  @users.State
  public currentUser!: UserInt

  @reports.State
  public topTenPubsLoaded!: boolean

  @reports.State
  public topTenPubsResults!: Array<ReportItem>

  @reports.Action
  public getTopTenPubsResults!: () => Promise<boolean>
  @support.Action
  public setHeaderTitle!: (title: string) => void

  public interval: any

  public shelf!: any

  mounted() {
    this.setHeaderTitle('Home')
    this.getBS().then((response) => {
      if (response) {
        this.getAnnouncements().then((response) => {
          if (response) {
            console.log('Announcements Loaded')
          }
        })
      }
    })
    this.$nextTick(function () {
      console.log('TOP TEN PUBS MOUNTED')
      this.getTopTenPubsResults()
      console.log(this.getTopTenPubsResults)
      this.interval = setInterval(this.waitForIt, 500)
    })
  }

  public limitText(text: string): string {
    let parser = new DOMParser()
    let doc = parser.parseFromString(text, 'text/html')
    let p = doc.getElementsByTagName('p')
    let elem = document.createElement('div') as Element
    let count = 0
    for (let i = 0; i < p.length; i++) {
      count += 1
      if (count === 1) {
        elem.innerHTML += p[i].innerHTML
      }
      if (count === 3) {
        elem.innerHTML += '<br/>' + p[i].innerHTML
      }
    }
    return elem.innerHTML
  }
  public waitForIt() {
    if (this.topTenPubsLoaded === true) {
      clearInterval(this.interval)
      this.items = this.topTenPubsResults
      console.log('-----------TOP TEN ITEMS-----------------')
      console.log(this.items)
      this.viewReady = true
    }
  }
  public reject() {
    this.$router.push({ path: '/rejected' })
  }
}
</script>

<style lang="scss">
.carousel-indicators {
  right: unset;
}
a.fixedanchor:visited,
a.fixedanchor:focus,
a.fixedanchor {
  color: white !important;
  text-decoration: underline !important;
}
#NWLTitle {
  text-align: center;
  font-family: 'Arial', Gadget, sans-serif;
  font-variant: small-caps;
  font-style: italic;
  font-size: 36px;
}
.bannerbackground {
  background-color: #00000055 !important;
  box-shadow: 0 0 1.5px 1.5px #919191;
}
.pubType {
  font-family: 'Arial';
  font-size: 14pt;
}
.pubicon {
  font-size: 65px;
}
.list-group-item {
  position: relative;
  display: block;
  padding: 0.5rem;
  background-color: $light;
  border: none;
}
.card-body-left {
  font-family: 'Arial';
  font-size: 16px;
  text-align: left !important;
}
.card-body-left li a {
  color: $dark !important;
}
.centerFlex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1ch;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin-bottom: auto;
}
</style>
