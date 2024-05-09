<template>
  <b-container fluid class="dialogTabsContentHeight m-0 p-1">
    <b-row no-gutters>
      <b-col cols="12" v-if="currentUser.isActionOfficer || currentUser.isLibrarian || currentUser.isNATOLibrarian">
        <b-table id="SupportingDocsTable" striped hover :items="supportingdocs" :fields="aofields" :per-page="perPage" :current-page="currentPage">
          <template #cell(actions)="data">
            <b-button v-if="currentUser.isLibrarian || currentUser.isActionOfficer" variant="white" size="lg" class="actionbutton text-dark" @click="deleteItem(data.item.Id, data.item.IsNato)">
              <font-awesome-icon :icon="['fas', 'trash-alt']" class="icon"></font-awesome-icon>
            </b-button>
            <b-button v-if="currentUser.isLibrarian || currentUser.isActionOfficer" variant="white" size="lg" class="actionbutton text-dark ml-1" @click="toggleHidden(data.item)" v-b-tooltip.hover.v-dark title="Hide for fleet users.">
              <font-awesome-icon :icon="['far', 'eye']" class="icon"></font-awesome-icon>
            </b-button>
          </template>
          <template #cell(Name)="data">
            <b-container fluid v-if="String(data.item.Name).indexOf('.doc') > 0">
              <b-row no-gutters>
                <b-col cols="1">
                  <div style="width: 16px; height: 16px">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPldvcmRfMTZ4PC90aXRsZT48cGF0aCBkPSJNMTYsNFYxYTEsMSwwLDAsMC0xLTFINEExLDEsMCwwLDAsMywxVjRMOS41LDUuMzc5WiIgZmlsbD0iIzQxYTVlZSIvPjxwb2x5Z29uIHBvaW50cz0iMTUuOTk5IDQgMi45OTkgNCAyLjk5OSA4IDkuNSA5LjE2OCAxNS45OTkgOCAxNS45OTkgNCIgZmlsbD0iIzJiN2NkMyIvPjxwb2x5Z29uIHBvaW50cz0iMTYgOCAzIDggMyAxMiA5LjQ5OSAxMyAxNiAxMiAxNiA4IiBmaWxsPSIjMTg1YWJkIi8+PHBhdGggZD0iTTMsMTJ2M2ExLDEsMCwwLDAsMSwxSDE1YTEsMSwwLDAsMCwxLTFWMTJaIiBmaWxsPSIjMTAzZjkxIi8+PHBhdGggZD0iTTEwLDQsMyw0LDMsMTRIOWEyLDIsMCwwLDAsMi0yVjVBMSwxLDAsMCwwLDEwLDRaIiBvcGFjaXR5PSIwLjUiLz48cmVjdCB5PSIzIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHJ4PSIxIiBmaWxsPSIjMTg1YWJkIi8+PHBhdGggZD0iTTMuMzUyLDkuNTRjLjAxNy4xNDIuMDI5LjI2Ni4wMzQuMzcyaC4wMTljLjAwOC0uMS4wMjMtLjIyMi4wNDYtLjM2NHMuMDQ0LS4yNjIuMDY1LS4zNkw0LjQyOSw1SDUuNjFsLjk0NSw0LjEyNmE2LjI2Nyw2LjI2NywwLDAsMSwuMTE4Ljc3OGguMDE2YTYuMzQ4LDYuMzQ4LDAsMCwxLC4xLS43NTNMNy41NDMsNUg4LjYxOEw3LjMsMTFINi4wMzlsLS45LTMuOTc1Yy0uMDI2LS4xMTQtLjA1Ni0uMjY0LS4wODktLjQ0OHMtLjA1My0uMzE4LS4wNjEtLjRINC45NzJjLS4wMS4xLS4wMy4yNDItLjA2MS40MzVzLS4wNTQuMzM1LS4wNzIuNDI3TDMuOTkyLDExSDIuNzE2TDEuMzgyLDVIMi40NzZMMy4zLDkuMkMzLjMxOCw5LjI4MywzLjMzNSw5LjQsMy4zNTIsOS41NFoiIGZpbGw9IiNmZmYiLz48L3N2Zz4="
                      class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                    />
                  </div>
                </b-col>
                <b-col cols="11">
                  <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                </b-col>
              </b-row>
            </b-container>
            <b-container fluid v-if="String(data.item.Name).indexOf('.xls') > 0">
              <b-row no-gutters>
                <b-col cols="1">
                  <div style="width: 16px; height: 16px">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPkV4Y2VsXzE2eDwvdGl0bGU+PHBhdGggZD0iTTEwLDBINEExLDEsMCwwLDAsMywxVjRsNyw0LDMsMS45NjhMMTYsOFY0WiIgZmlsbD0iIzIxYTM2NiIvPjxwb2x5Z29uIHBvaW50cz0iMTYgOCAzIDggMyAxMiAxMCAxMy40IDE2IDEyIDE2IDgiIGZpbGw9IiMxMDdjNDEiLz48cGF0aCBkPSJNMywxMnYzYTEsMSwwLDAsMCwxLDFIMTVhMSwxLDAsMCwwLDEtMVYxMloiIGZpbGw9IiMxODVjMzciLz48cGF0aCBkPSJNMTAsNEgzVjE0SDlhMiwyLDAsMCwwLDItMlY1QTEsMSwwLDAsMCwxMCw0WiIgb3BhY2l0eT0iMC41Ii8+PHJlY3QgeT0iMyIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiByeD0iMSIgZmlsbD0iIzEwN2M0MSIvPjxwYXRoIGQ9Ik0yLjI5MiwxMSw0LjIzNCw3Ljk5MiwyLjQ1NSw1SDMuODg2bC45NzEsMS45MTJjLjA4OS4xODIuMTUxLjMxNy4xODQuNDA2aC4wMTNxLjEtLjIxNy4yLS40MjNMNi4yOTIsNUg3LjYwNkw1Ljc4Miw3Ljk3NSw3LjY1MiwxMWgtMS40TDUuMTMzLDguOUExLjgwNiwxLjgwNiwwLDAsMSw1LDguNjE5SDQuOTgzYTEuMzQsMS4zNCwwLDAsMS0uMTMuMjcyTDMuNywxMVoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTYsMVY0SDEwVjBoNUExLDEsMCwwLDEsMTYsMVoiIGZpbGw9IiMzM2M0ODEiLz48L3N2Zz4="
                      class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                    />
                  </div>
                </b-col>
                <b-col cols="11">
                  <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                </b-col>
              </b-row>
            </b-container>
            <b-container fluid v-if="String(data.item.Name).indexOf('.ppt') > 0">
              <b-row no-gutters>
                <b-col cols="1">
                  <div style="width: 16px; height: 16px">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPlBvd2VyUG9pbnRfMTZ4PC90aXRsZT48cGF0aCBkPSJNOCwwQTguMDI0LDguMDI0LDAsMCwwLDAsOGwxMCwyLjM2M1oiIGZpbGw9IiNlZDZjNDciLz48cGF0aCBkPSJNOCwwVjhsNCwyLjU5TDE2LDhBOC4wMjQsOC4wMjQsMCwwLDAsOCwwWiIgZmlsbD0iI2ZmOGY2YiIvPjxwYXRoIGQ9Ik0xNiw4QTgsOCwwLDAsMSwwLDhaIiBmaWxsPSIjZDM1MjMwIi8+PHBhdGggZD0iTTEwLDRIMS4wODZBNy45Myw3LjkzLDAsMCwwLDIuNzM1LDE0SDlhMiwyLDAsMCwwLDItMlY1QTEsMSwwLDAsMCwxMCw0WiIgb3BhY2l0eT0iMC41Ii8+PHBhdGggZD0iTTEwLDRIMS4wODZBNy45Myw3LjkzLDAsMCwwLDIuNzM1LDE0SDlhMiwyLDAsMCwwLDItMlY1QTEsMSwwLDAsMCwxMCw0WiIgb3BhY2l0eT0iMC4xIi8+PHJlY3QgeT0iMyIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiByeD0iMSIgZmlsbD0iI2M0M2UxYyIvPjxwYXRoIGQ9Ik01LjMzNiw1QTIuMjc1LDIuMjc1LDAsMCwxLDYuOSw1LjQ4MWExLjc2NiwxLjc2NiwwLDAsMSwuNTQxLDEuMzkzLDIuMDIzLDIuMDIzLDAsMCwxLS4yNjcsMS4wNDIsMS44MzYsMS44MzYsMCwwLDEtLjc2Mi43MSwyLjQ4NCwyLjQ4NCwwLDAsMS0xLjE0NC4yNTNINC4xODJWMTFIMy4wNzJWNVpNNC4xODIsNy45NjJoLjk1NkExLjIsMS4yLDAsMCwwLDUuOTgzLDcuN2ExLjAxMiwxLjAxMiwwLDAsMCwuMjg1LS43NzdxMC0uOTkxLTEuMDk0LS45OTFINC4xODJaIiBmaWxsPSIjZmZmIi8+PC9zdmc+"
                      class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                    />
                  </div>
                </b-col>
                <b-col cols="11">
                  <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                </b-col>
              </b-row>
            </b-container>
            <b-container fluid v-if="String(data.item.Name).indexOf('.pdf') > 0">
              <b-row no-gutters>
                <b-col cols="1">
                  <div style="width: 16px; height: 16px">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAInSURBVDhPpVM9SytREI2ijdqqlYq2/gDBSqy19Qf4CyzsFMROUBBsLBTRQkSwE0QLazvzZRINSEx8eY/w8r3Z3WSzu+edmU2i4b3uHTjMvXdmzp07OxvCf0IFstksyuWystZswrq/hx2Pw263Ydu20jRN1Go1lEolFAoFZDKZL4F0Oo02gy3LgisHZ2fAyYms+tCNEaFkMqlnKpBKpWAYht7kycHNDXB4KKs+uK6rAvV6XXMEfQJNlu95KgEsLQX2G8Qnl/wlIOX0KugK7O8HlXzD9wr6npBIJPRQe8AgxdUV8P4OnJ8He8IhTbLGiyRHoAJxdlwa02CnW9z7xSKwsQFcXgJ7e8D6OvzlZbQvLtA8Pobx+Ij466ukBgLRaBSVahV1VuAwwGOwx350IY9y6Gvxy1hHR6i8vSH68qI+FQhzU3QcmPx8zvY2bJ5Jue0OW74PmzS4LrNHxUZDcwQq8MT3ZsNh5DgPeQ5Vge8rCtmoEvmbLMRiyDMpx2o/np/xdH39JfAzREP6YgcHYc7Po7KwgMbiIsq0zbk51PmsXgz5S2xXIDcwAI+JztgY3OFhtE5PUXl4gHtwAGd3F9bdHapra/BGRuCMjsJj/CfZE8h3VLv0t7bUOpwFY2cH2NwMfENDvRitWgSkw7crK4hNTiIyNRVwfByR2VlEJiYQJcVGZmYC3/S0xt6urup/E/LZ3R+cgQ/OQJafSinrf7Hjl1jJ8X0ffwD6zWt+lsTfRwAAAABJRU5ErkJggg=="
                      class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                    />
                  </div>
                </b-col>
                <b-col cols="11">
                  <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                </b-col>
              </b-row>
            </b-container>
            <b-container fluid v-if="String(data.item.Name).indexOf('.txt') > 0">
              <b-row no-gutters>
                <b-col cols="1">
                  <div style="width: 16px; height: 16px">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACKUlEQVR42n3TXUiTURgH8P+7D3MfOmwy9pU4J8LUVokXQSAEUSCklUqfiAtt5EVXFQQhIkFQXXVhLKWJJBVqpYEQBUERdCEadnRg6Ybti2GTtc0t3+09vRvJ2nvxPpwHznme8/w4N4dBIQx8Xq621Dh93vV3BoPxYDQaDfM1ulerNYaCgQVLjfW4d33Nxdee8BnKDTH/huXYV+ux37pvvWDR4VOSwwG1HN54GpRSWMsV+Jpg0aKUYMIXwdLdG2v4+cPGz7G7gA1d/SuBkXv4trCIWksVfm3FwOS6NL+grdDgu3cD9qZDMPXdBCaH6/myZxdoQOdVspEH5mGz1SMYCECtVuebiUQCRpMJHs8K9jc1oyoHTD1q5FvLBeCMk6yOPoCcchALlpGgrvc68NJVDDDtvST49CFKJYwokOYojJeugc6MCoCTDhJ+NgyFTCIKpDIc9Of7Qd+4BUBrN/G/cEEll4oCSTYL81kn6Nx4MSA5cZH4p0agKpGLAzsszJ194N5OCIBj50jotRtle8SB+B8WhlMOcO+fC4CjXSQ4M4ZyZako8Hs7DWN7D7gPk8WAtOU0IdNuaJQKUSC2nUJjhwPZj68EwJE24p0dR6WmTBTYjMVhaetG9vNsMSA73EqWpsegr6wQBcKbW7B39CDzZa4I0EnrmgO3B4dkDWYdCn9MGBTL/gjuDA5ksqvzJr4Q+f/mFYm+eoApUajEXkB3Ukku7Bvit49z579vfdIRFQuqxwAAAABJRU5ErkJggg=="
                      class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                    />
                  </div>
                </b-col>
                <b-col cols="11">
                  <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                </b-col>
              </b-row>
            </b-container>
            <b-container fluid v-if="String(data.item.Name).indexOf('.zip') > 0">
              <b-row no-gutters>
                <b-col cols="1">
                  <div style="width: 16px; height: 16px">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACS0lEQVR42qWRb0gTcRjHv3e3pq7z3Mz9ISSkjSCQQEEroiVIJCFmRPUiKwL3xlGkCyONqIiSaBmyXhWihC9WlJQWBJJBhpjV3gjR2ipGhba5P+3a5u6263c3BevFGPTAl/t97/l9P8fzHIX/LGrVeS9R5SovEXmI3hYCOPHoonqwfjP1V/zZjCROzUmBf0NRXuLHpsVOcuWFkijn6NGZYWsrTZNX2TQJyxLAacvAlpUAmTgCya3Qqn6Ay04hKy6h2RH1T3oyFhlQdLrdmrjZP0AjPU9yP4F0EBBCkMRF8owQQBTe8BZo2TXQiyOAmES3K5btdwsaGWC43L1/4XzvWRJcyAGEZYAcFsNEMXj5RnDUNxipMQJM4cpQHJcGBb0MsNy6sOfTyY623ODiLwUgCeTrYmRZBBCzglP/hlFykzFTGLifgMMlKCPU3j2nfne8icntlCEzMyxAFxGrWt5zBh/4gzCpv0NHjSt7GnqahK1vqVbuNjy4yk627lLn/d9fEoehIUwj41b86Ms0DvXyDTKg5flt/ePG+uK8AH9wN9auWw8TPaz4iTcpNNmD+2RA2/SI+V5ddUlewMdQC7RFCRhLJxQ/O5fE9iP+ozLAPje+07WpqjQv4PN8DTQaFUzcrOK9X+Oobn5llwFdnoc7nJYNmvyA0DYY2DTY4veK9wUSqDnw2iEDKnUsc6ecVVXkyetO9Vwzm/QV6Om0+YmPhHlxMcJn2ikUVl3HbB1Og47Djet9Z4h3rjQKBdRVbTQ/YWgKfp+vRd7hSuMPTCjhYRCYVvIAAAAASUVORK5CYII="
                      class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                    />
                  </div>
                </b-col>
                <b-col cols="11">
                  <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                </b-col>
              </b-row>
            </b-container>
          </template>
          <template #cell(Hidden)="data">
            <font-awesome-icon v-if="data.item.Hidden === 'Yes'" :icon="['fas', 'check']" class="icon"></font-awesome-icon>
          </template>
        </b-table>
      </b-col>
      <b-col cols="12" v-else>
        <b-table id="SupportingDocsTable" striped hover :items="supportingdocs" :fields="fields" :per-page="perPage" :current-page="currentPage">
          <template #cell(Name)="data">
            <b-container fluid v-if="String(data.item.Name).indexOf('.doc') > 0">
              <b-row no-gutters>
                <b-col cols="1">
                  <div style="width: 16px; height: 16px">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPldvcmRfMTZ4PC90aXRsZT48cGF0aCBkPSJNMTYsNFYxYTEsMSwwLDAsMC0xLTFINEExLDEsMCwwLDAsMywxVjRMOS41LDUuMzc5WiIgZmlsbD0iIzQxYTVlZSIvPjxwb2x5Z29uIHBvaW50cz0iMTUuOTk5IDQgMi45OTkgNCAyLjk5OSA4IDkuNSA5LjE2OCAxNS45OTkgOCAxNS45OTkgNCIgZmlsbD0iIzJiN2NkMyIvPjxwb2x5Z29uIHBvaW50cz0iMTYgOCAzIDggMyAxMiA5LjQ5OSAxMyAxNiAxMiAxNiA4IiBmaWxsPSIjMTg1YWJkIi8+PHBhdGggZD0iTTMsMTJ2M2ExLDEsMCwwLDAsMSwxSDE1YTEsMSwwLDAsMCwxLTFWMTJaIiBmaWxsPSIjMTAzZjkxIi8+PHBhdGggZD0iTTEwLDQsMyw0LDMsMTRIOWEyLDIsMCwwLDAsMi0yVjVBMSwxLDAsMCwwLDEwLDRaIiBvcGFjaXR5PSIwLjUiLz48cmVjdCB5PSIzIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHJ4PSIxIiBmaWxsPSIjMTg1YWJkIi8+PHBhdGggZD0iTTMuMzUyLDkuNTRjLjAxNy4xNDIuMDI5LjI2Ni4wMzQuMzcyaC4wMTljLjAwOC0uMS4wMjMtLjIyMi4wNDYtLjM2NHMuMDQ0LS4yNjIuMDY1LS4zNkw0LjQyOSw1SDUuNjFsLjk0NSw0LjEyNmE2LjI2Nyw2LjI2NywwLDAsMSwuMTE4Ljc3OGguMDE2YTYuMzQ4LDYuMzQ4LDAsMCwxLC4xLS43NTNMNy41NDMsNUg4LjYxOEw3LjMsMTFINi4wMzlsLS45LTMuOTc1Yy0uMDI2LS4xMTQtLjA1Ni0uMjY0LS4wODktLjQ0OHMtLjA1My0uMzE4LS4wNjEtLjRINC45NzJjLS4wMS4xLS4wMy4yNDItLjA2MS40MzVzLS4wNTQuMzM1LS4wNzIuNDI3TDMuOTkyLDExSDIuNzE2TDEuMzgyLDVIMi40NzZMMy4zLDkuMkMzLjMxOCw5LjI4MywzLjMzNSw5LjQsMy4zNTIsOS41NFoiIGZpbGw9IiNmZmYiLz48L3N2Zz4="
                      class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                    />
                  </div>
                </b-col>
                <b-col cols="11">
                  <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                </b-col>
              </b-row>
            </b-container>
            <b-container fluid v-if="String(data.item.Name).indexOf('.xls') > 0">
              <b-row no-gutters>
                <b-col cols="1">
                  <div style="width: 16px; height: 16px">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPkV4Y2VsXzE2eDwvdGl0bGU+PHBhdGggZD0iTTEwLDBINEExLDEsMCwwLDAsMywxVjRsNyw0LDMsMS45NjhMMTYsOFY0WiIgZmlsbD0iIzIxYTM2NiIvPjxwb2x5Z29uIHBvaW50cz0iMTYgOCAzIDggMyAxMiAxMCAxMy40IDE2IDEyIDE2IDgiIGZpbGw9IiMxMDdjNDEiLz48cGF0aCBkPSJNMywxMnYzYTEsMSwwLDAsMCwxLDFIMTVhMSwxLDAsMCwwLDEtMVYxMloiIGZpbGw9IiMxODVjMzciLz48cGF0aCBkPSJNMTAsNEgzVjE0SDlhMiwyLDAsMCwwLDItMlY1QTEsMSwwLDAsMCwxMCw0WiIgb3BhY2l0eT0iMC41Ii8+PHJlY3QgeT0iMyIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiByeD0iMSIgZmlsbD0iIzEwN2M0MSIvPjxwYXRoIGQ9Ik0yLjI5MiwxMSw0LjIzNCw3Ljk5MiwyLjQ1NSw1SDMuODg2bC45NzEsMS45MTJjLjA4OS4xODIuMTUxLjMxNy4xODQuNDA2aC4wMTNxLjEtLjIxNy4yLS40MjNMNi4yOTIsNUg3LjYwNkw1Ljc4Miw3Ljk3NSw3LjY1MiwxMWgtMS40TDUuMTMzLDguOUExLjgwNiwxLjgwNiwwLDAsMSw1LDguNjE5SDQuOTgzYTEuMzQsMS4zNCwwLDAsMS0uMTMuMjcyTDMuNywxMVoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTYsMVY0SDEwVjBoNUExLDEsMCwwLDEsMTYsMVoiIGZpbGw9IiMzM2M0ODEiLz48L3N2Zz4="
                      class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                    />
                  </div>
                </b-col>
                <b-col cols="11">
                  <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                </b-col>
              </b-row>
            </b-container>
            <b-container fluid v-if="String(data.item.Name).indexOf('.ppt') > 0">
              <b-row no-gutters>
                <b-col cols="1">
                  <div style="width: 16px; height: 16px">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHRpdGxlPlBvd2VyUG9pbnRfMTZ4PC90aXRsZT48cGF0aCBkPSJNOCwwQTguMDI0LDguMDI0LDAsMCwwLDAsOGwxMCwyLjM2M1oiIGZpbGw9IiNlZDZjNDciLz48cGF0aCBkPSJNOCwwVjhsNCwyLjU5TDE2LDhBOC4wMjQsOC4wMjQsMCwwLDAsOCwwWiIgZmlsbD0iI2ZmOGY2YiIvPjxwYXRoIGQ9Ik0xNiw4QTgsOCwwLDAsMSwwLDhaIiBmaWxsPSIjZDM1MjMwIi8+PHBhdGggZD0iTTEwLDRIMS4wODZBNy45Myw3LjkzLDAsMCwwLDIuNzM1LDE0SDlhMiwyLDAsMCwwLDItMlY1QTEsMSwwLDAsMCwxMCw0WiIgb3BhY2l0eT0iMC41Ii8+PHBhdGggZD0iTTEwLDRIMS4wODZBNy45Myw3LjkzLDAsMCwwLDIuNzM1LDE0SDlhMiwyLDAsMCwwLDItMlY1QTEsMSwwLDAsMCwxMCw0WiIgb3BhY2l0eT0iMC4xIi8+PHJlY3QgeT0iMyIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiByeD0iMSIgZmlsbD0iI2M0M2UxYyIvPjxwYXRoIGQ9Ik01LjMzNiw1QTIuMjc1LDIuMjc1LDAsMCwxLDYuOSw1LjQ4MWExLjc2NiwxLjc2NiwwLDAsMSwuNTQxLDEuMzkzLDIuMDIzLDIuMDIzLDAsMCwxLS4yNjcsMS4wNDIsMS44MzYsMS44MzYsMCwwLDEtLjc2Mi43MSwyLjQ4NCwyLjQ4NCwwLDAsMS0xLjE0NC4yNTNINC4xODJWMTFIMy4wNzJWNVpNNC4xODIsNy45NjJoLjk1NkExLjIsMS4yLDAsMCwwLDUuOTgzLDcuN2ExLjAxMiwxLjAxMiwwLDAsMCwuMjg1LS43NzdxMC0uOTkxLTEuMDk0LS45OTFINC4xODJaIiBmaWxsPSIjZmZmIi8+PC9zdmc+"
                      class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                    />
                  </div>
                </b-col>
                <b-col cols="11">
                  <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                </b-col>
              </b-row>
            </b-container>
            <b-container fluid v-if="String(data.item.Name).indexOf('.pdf') > 0">
              <b-row no-gutters>
                <b-col cols="1">
                  <div style="width: 16px; height: 16px">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAInSURBVDhPpVM9SytREI2ijdqqlYq2/gDBSqy19Qf4CyzsFMROUBBsLBTRQkSwE0QLazvzZRINSEx8eY/w8r3Z3WSzu+edmU2i4b3uHTjMvXdmzp07OxvCf0IFstksyuWystZswrq/hx2Pw263Ydu20jRN1Go1lEolFAoFZDKZL4F0Oo02gy3LgisHZ2fAyYms+tCNEaFkMqlnKpBKpWAYht7kycHNDXB4KKs+uK6rAvV6XXMEfQJNlu95KgEsLQX2G8Qnl/wlIOX0KugK7O8HlXzD9wr6npBIJPRQe8AgxdUV8P4OnJ8He8IhTbLGiyRHoAJxdlwa02CnW9z7xSKwsQFcXgJ7e8D6OvzlZbQvLtA8Pobx+Ij466ukBgLRaBSVahV1VuAwwGOwx350IY9y6Gvxy1hHR6i8vSH68qI+FQhzU3QcmPx8zvY2bJ5Jue0OW74PmzS4LrNHxUZDcwQq8MT3ZsNh5DgPeQ5Vge8rCtmoEvmbLMRiyDMpx2o/np/xdH39JfAzREP6YgcHYc7Po7KwgMbiIsq0zbk51PmsXgz5S2xXIDcwAI+JztgY3OFhtE5PUXl4gHtwAGd3F9bdHapra/BGRuCMjsJj/CfZE8h3VLv0t7bUOpwFY2cH2NwMfENDvRitWgSkw7crK4hNTiIyNRVwfByR2VlEJiYQJcVGZmYC3/S0xt6urup/E/LZ3R+cgQ/OQJafSinrf7Hjl1jJ8X0ffwD6zWt+lsTfRwAAAABJRU5ErkJggg=="
                      class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                    />
                  </div>
                </b-col>
                <b-col cols="11">
                  <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                </b-col>
              </b-row>
            </b-container>
            <b-container fluid v-if="String(data.item.Name).indexOf('.txt') > 0">
              <b-row no-gutters>
                <b-col cols="1">
                  <div style="width: 16px; height: 16px">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACKUlEQVR42n3TXUiTURgH8P+7D3MfOmwy9pU4J8LUVokXQSAEUSCklUqfiAtt5EVXFQQhIkFQXXVhLKWJJBVqpYEQBUERdCEadnRg6Ybti2GTtc0t3+09vRvJ2nvxPpwHznme8/w4N4dBIQx8Xq621Dh93vV3BoPxYDQaDfM1ulerNYaCgQVLjfW4d33Nxdee8BnKDTH/huXYV+ux37pvvWDR4VOSwwG1HN54GpRSWMsV+Jpg0aKUYMIXwdLdG2v4+cPGz7G7gA1d/SuBkXv4trCIWksVfm3FwOS6NL+grdDgu3cD9qZDMPXdBCaH6/myZxdoQOdVspEH5mGz1SMYCECtVuebiUQCRpMJHs8K9jc1oyoHTD1q5FvLBeCMk6yOPoCcchALlpGgrvc68NJVDDDtvST49CFKJYwokOYojJeugc6MCoCTDhJ+NgyFTCIKpDIc9Of7Qd+4BUBrN/G/cEEll4oCSTYL81kn6Nx4MSA5cZH4p0agKpGLAzsszJ194N5OCIBj50jotRtle8SB+B8WhlMOcO+fC4CjXSQ4M4ZyZako8Hs7DWN7D7gPk8WAtOU0IdNuaJQKUSC2nUJjhwPZj68EwJE24p0dR6WmTBTYjMVhaetG9vNsMSA73EqWpsegr6wQBcKbW7B39CDzZa4I0EnrmgO3B4dkDWYdCn9MGBTL/gjuDA5ksqvzJr4Q+f/mFYm+eoApUajEXkB3Ukku7Bvit49z579vfdIRFQuqxwAAAABJRU5ErkJggg=="
                      class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                    />
                  </div>
                </b-col>
                <b-col cols="11">
                  <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                </b-col>
              </b-row>
            </b-container>
            <b-container fluid v-if="String(data.item.Name).indexOf('.zip') > 0">
              <b-row no-gutters>
                <b-col cols="1">
                  <div style="width: 16px; height: 16px">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACS0lEQVR42qWRb0gTcRjHv3e3pq7z3Mz9ISSkjSCQQEEroiVIJCFmRPUiKwL3xlGkCyONqIiSaBmyXhWihC9WlJQWBJJBhpjV3gjR2ipGhba5P+3a5u6263c3BevFGPTAl/t97/l9P8fzHIX/LGrVeS9R5SovEXmI3hYCOPHoonqwfjP1V/zZjCROzUmBf0NRXuLHpsVOcuWFkijn6NGZYWsrTZNX2TQJyxLAacvAlpUAmTgCya3Qqn6Ay04hKy6h2RH1T3oyFhlQdLrdmrjZP0AjPU9yP4F0EBBCkMRF8owQQBTe8BZo2TXQiyOAmES3K5btdwsaGWC43L1/4XzvWRJcyAGEZYAcFsNEMXj5RnDUNxipMQJM4cpQHJcGBb0MsNy6sOfTyY623ODiLwUgCeTrYmRZBBCzglP/hlFykzFTGLifgMMlKCPU3j2nfne8icntlCEzMyxAFxGrWt5zBh/4gzCpv0NHjSt7GnqahK1vqVbuNjy4yk627lLn/d9fEoehIUwj41b86Ms0DvXyDTKg5flt/ePG+uK8AH9wN9auWw8TPaz4iTcpNNmD+2RA2/SI+V5ddUlewMdQC7RFCRhLJxQ/O5fE9iP+ozLAPje+07WpqjQv4PN8DTQaFUzcrOK9X+Oobn5llwFdnoc7nJYNmvyA0DYY2DTY4veK9wUSqDnw2iEDKnUsc6ecVVXkyetO9Vwzm/QV6Om0+YmPhHlxMcJn2ikUVl3HbB1Og47Djet9Z4h3rjQKBdRVbTQ/YWgKfp+vRd7hSuMPTCjhYRCYVvIAAAAASUVORK5CYII="
                      class="ms-Image-image is-loaded ms-Image-image--portrait image-104"
                    />
                  </div>
                </b-col>
                <b-col cols="11">
                  <b-link :href="data.item.RelativeURL">{{ data.item.Name }}</b-link>
                </b-col>
              </b-row>
            </b-container>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row no-gutters style="height: 50px">
      <b-col cols="12">
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="my-0 p-0"></b-pagination>
      </b-col>
    </b-row>
    <b-row no-gutters style="height: 50px">
      <b-col cols="12">
        <b-form-file v-model="file" no-drop v-if="currentUser.isLibrarian || currentUser.isActionOfficer" :state="Boolean(file1)" placeholder="Choose a new supporting document." @input="fileSelected()"></b-form-file>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { UserInt } from '../../../interfaces/User'
import { PublicationItem } from '../../../interfaces/PublicationItem'
import { SupportingDocItem } from '../../../interfaces/SupportingDocItem'
import axios from 'axios'

const users = namespace('users')
const publication = namespace('publication')

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component({
  name: 'SupportingDocs'
})
export default class SupportingDocs extends Vue {
  @Prop() Id: any
  @Prop() IsNato: any
  @Prop() DocID: any
  @Prop() ShowHidden: any
  @Prop() Title: any

  interval!: any
  iconsource!: any
  formReady = false
  totalRows = 0
  perPage = 15
  currentPage = 1
  file?: File
  buffer?: any = null
  fileUploaded?: boolean = false
  fileDeleted?: boolean = false
  fileUpdated?: boolean = false
  showhidden?: any
  overlayText?: 'Loading. Please Wait...'
  overlayVariant?: 'success'

  aofields = [
    { key: 'actions', label: 'Actions', tdClass: 'px80' },
    { key: 'Name', label: 'Document Name', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 1 },
    { key: 'Hidden', label: 'Hidden', sortable: true, type: 'default', format: 'checkbox', id: 2 }
  ]
  fields = [{ key: 'Name', label: 'Document Name', sortable: true, type: 'default', format: 'text', tdClass: 'text-left', id: 1 }]

  @users.State
  public currentUser!: UserInt

  @publication.State
  public digest!: string

  @publication.State
  public activepub!: PublicationItem

  @publication.State
  public publoaded!: boolean

  @publication.State
  public supportingdocsloaded!: boolean

  @publication.State
  public supportingdocs!: Array<SupportingDocItem>

  @publication.State
  public bufferloaded!: boolean

  @publication.State
  public pubBuffer!: ArrayBuffer

  @publication.Action
  public setPubLoaded!: (loaded: boolean) => void

  @publication.Action
  public getSupportingDocs!: () => Promise<boolean>

  @publication.Action
  public getPublicationById!: () => Promise<boolean>

  @publication.Action
  public getDigest!: () => Promise<boolean>

  mounted() {
    this.interval = setInterval(this.loadData, 500)
  }

  public loadData() {
    if (this.publoaded) {
      clearInterval(this.interval)
      this.getSupportingDocs()
      this.loadPub()
    }
  }

  public async loadPub() {
    if (this.supportingdocsloaded) {
      this.totalRows = this.supportingdocs.length
    } else {
      // wait for supporting docs to load
      this.interval = setInterval(this.waitForDocs, 500)
    }
  }

  public waitForDocs() {
    if (this.supportingdocsloaded) {
      clearInterval(this.interval)
      this.totalRows = this.supportingdocs.length
    }
  }

  public async refreshDocs() {
    console.log('REFRESHING SUPPORTING DOCUMENTS')
    if (this.fileUploaded || this.fileDeleted || this.fileUpdated) {
      this.fileUploaded = false
      this.fileDeleted = false
      this.fileUpdated = false
      this.getSupportingDocs()
    }
  }

  public async deleteItem(id: string, nato: string) {
    const that = this
    this.getDigest().then(function () {
      let url = ''
      if (nato === 'Yes') {
        url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('NATOSupportingDocuments')/items(" + id + ')'
      } else {
        url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('SupportingDocuments')/items(" + id + ')'
      }
      let headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': that.digest,
        'X-HTTP-Method': 'DELETE',
        'If-Match': '*'
      }
      let config = {
        headers: headers
      }
      that.deleteFile(url, config)
    })
  }

  public async deleteFile(uri: string, config: any) {
    await axios.post(uri, null, config)
    this.fileDeleted = true
    this.refreshDocs()
  }

  public async toggleHidden(item: any) {
    const that = this
    let hidden = item.Hidden
    if (hidden === 'No') {
      hidden = 'Yes'
    } else {
      hidden = 'No'
    }
    this.getDigest().then(function () {
      let url = ''
      if (item.IsNato === 'Yes') {
        url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('NATOSupportingDocuments')/items(" + item.Id + ')'
      } else {
        url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('SupportingDocuments')/items(" + item.Id + ')'
      }
      let headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': that.digest,
        'X-HTTP-Method': 'MERGE',
        'If-Match': '*'
      }
      let config = {
        headers: headers
      }
      let itemprops = {
        __metadata: { type: item.type },
        Hidden: hidden === 'Yes' ? true : false
      }
      that.updateFile(url, config, itemprops)
    })
  }

  public async updateFile(uri: string, config: any, itemprops: any) {
    await axios.post(uri, itemprops, config)
    this.fileUpdated = true
    this.refreshDocs()
  }

  public fileSelected() {
    // get the bufffer
    const that = this
    let buffer = this.getFileBuffer(this.file)
    buffer.then(function (buff: any) {
      that.buffer = buff
    })
    // get the digest so we can upload
    this.getDigest().then((response) => {
      if (response) {
        this.interval = setInterval(this.uploadFile, 500)
      }
    })
  }

  public async uploadFile() {
    // get a buffer for the file and then upload to the appropriate library
    // after upload we can then set the properties of the document and then refresh the supporting docs array
    if (this.digest !== '') {
      clearInterval(this.interval)
      const that = this
      if (this.buffer !== null) {
        let url = ''
        if (this.activepub !== null && this.activepub.IsNato === 'Yes') {
          url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('NATOSupportingDocuments')/RootFolder/Files/Add"
        } else {
          url = tp1 + slash + slash + tp2 + "/_api/lists/getbytitle('SupportingDocuments')/RootFolder/Files/Add"
        }
        url += "(url='"
        url += this.file?.name
        url += "',overwrite=true)"
        let headers = {
          Accept: 'application/json;odata=verbose',
          'X-RequestDigest': this.digest
        }
        try {
          let response = await axios({
            url: url,
            method: 'POST',
            data: this.buffer,
            headers: headers
          })
          // get the id and process the form data into the new document
          console.log('UPLOAD RESPONSE: ' + response)
          let itemlink = response.data.d.ListItemAllFields.__deferred.uri
          response = await axios({
            method: 'GET',
            url: itemlink,
            headers: {
              Accept: 'application/json;odata=verbose'
            }
          })
          let metadata = response.data.d.__metadata
          let id = response.data.d.Id
          console.log('RESPONSE METADATA: ' + metadata)
          // set the fields for updating
          let itemprops = {
            __metadata: { type: metadata.type },
            DocID: this.activepub !== null ? this.activepub.DocID : ''
          }
          const uheaders = {
            'Content-Type': 'application/json;odata=verbose',
            Accept: 'application/json;odata=verbose',
            'X-RequestDigest': this.digest,
            'X-HTTP-Method': 'MERGE',
            'If-Match': '*'
          }
          const config = {
            headers: uheaders
          }
          response = await axios.post(metadata.uri, itemprops, config)
          console.log('UPDATE RESPONSE: ' + response)
          this.fileUploaded = true
          this.refreshDocs()
        } catch (error) {
          console.log('Error Adding Document: ' + error)
        }
      }
    }
  }

  public getFileBuffer(file) {
    let p = new Promise(function (resolve, reject) {
      var reader = new FileReader()
      reader.onloadend = function (e) {
        resolve(e?.target?.result)
      }
      reader.onerror = function (e) {
        reject(e?.target?.error)
      }
      reader.readAsArrayBuffer(file)
    })
    return p
  }
}
</script>

<style>
#pubFrame {
  padding: 0;
}
#vpfdescription {
  height: 100px !important;
  overflow-y: scroll;
  line-height: 16px;
}

#SupportingDocsTable > tbody td,
#SupportingDocsTable > tbody th {
  border: 1px solid #000000 !important;
  height: 20px !important;
  padding: 2px 5px !important;
}
</style>
