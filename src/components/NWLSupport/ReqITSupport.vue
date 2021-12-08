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
            Request Portal / IT Support
          </b-col>
          <b-col cols="4" class="mb-1 p-0"></b-col>
          <!--   <b-col cols="3" class="m-0 p-0"></b-col> -->
        </b-row>
        <b-row class="searchprops">
          <!-- <b-col cols="2"></b-col> -->
          <b-col cols="4" class="m-0 p-0"></b-col>
          <b-col cols="4" class="mt-1 p-0" style="font-size:large; text-align:center"> </b-col>
          <b-col cols="4" class="mb-1 p-0"></b-col>
          <!--   <b-col cols="3" class="m-0 p-0"></b-col> -->
        </b-row>
        <b-row></b-row>
        <b-row class="searchprops">
          <!-- <b-col cols="1" class="m-0 p-0"></b-col> -->
          <b-col cols="4" class="mt-1 p-0" style="font-size:large; text-align:right">
            Send Email to Request IT Support
          </b-col>
          <b-col cols="2" class="mt-1 p-0"></b-col><b-button variant="success" href="mailto:jeangrunwald@nexagen.com?subject=Request NWL Support&cc=jeangrunwald@nexagen.com&body=I am requesting NWL support for the following:">Send Email</b-button>
          <b-col cols="3" class="mb-1 p-0"></b-col>
          <b-col cols="3" class="m-0 p-0"></b-col>
        </b-row>
        <b-row class="searchprops">
          <!-- <b-col cols="2"></b-col> -->
          <b-col cols="4" class="m-0 p-0"></b-col>
          <b-col cols="4" class="mt-1 p-0" style="font-size:large; text-align:right"> </b-col>
          <b-col cols="4" class="mb-1 p-0"></b-col>
          <!--   <b-col cols="3" class="m-0 p-0"></b-col> -->
        </b-row>
        <b-row class="searchprops">
          <!-- <b-col cols="1" class="m-0 p-0"></b-col> -->
          <b-col cols="4" class="mt-1 p-0" style="font-size:large; text-align:right">
            Create IT Request
          </b-col>
          <b-col cols="2" class="mt-1 p-0"></b-col><b-button variant="success" href="https://nwdc.navy.mil/CustomerSupport/it/Lists/ITRequests/ITR%20Default/newifs.aspx" target="_blank">Create IT Request</b-button>
          <b-col cols="3" class="mb-1 p-0"></b-col>
          <b-col cols="3" class="m-0 p-0"></b-col>
        </b-row>
      </b-container>
    </b-card-body>
  </b-card>
</template>

<style>
.searchprops {
  text-align: right;
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
