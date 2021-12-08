<template>
  <b-card no-gutters fluid class="contentHeight" style="min-width: 1000px">
    <b-card-header>
      <b-row style="padding-left:15px;"> </b-row>
    </b-card-header>
    <b-card-body class="m-0 p-0">
      <b-container fluid class="p-0">
        <b-row class="searchprops">
          <!-- <b-col cols="2"></b-col> -->
          <b-col cols="4" class="m-0 p-0"></b-col>
          <b-col cols="4" class="mt-1 p-0" style="font-size:large; text-align:center">
            Select "Send Email" below to request NWL Support
          </b-col>
          <b-col cols="4" class="mb-1 p-0"></b-col>
          <!--   <b-col cols="3" class="m-0 p-0"></b-col> -->
        </b-row>
        <b-row></b-row>
        <b-row class="searchprops">
          <b-col cols="1" class="m-0 p-0"></b-col>
          <b-col cols="4" class="mt-1 p-0"></b-col><b-button variant="success" href="mailto:nwdc_nrfk_fleet_pubs@navy.mil?subject=Request NWL Support&body=I am requesting NWL support for the following:">Send Email</b-button>
          <b-col cols="4" class="mb-1 p-0"></b-col>
          <b-col cols="3" class="m-0 p-0"></b-col>
        </b-row>
      </b-container>
    </b-card-body>
  </b-card>
</template>

<style>
.searchprops {
  text-align: center;
  align-self: center;
  /* font-family: 'Arial', Gadget, sans-serif;
  font-variant: small-caps;
  font-style: italic;
  font-size: 36px; */
}

.mt-100px {
  margin-top: 100px;
}
</style>
