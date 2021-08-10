<template>
  <b-container fluid class="contentHeight m-0 p-0"></b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'
import { EventBus } from '../../main'

declare const _spPageContextInfo: any

@Component({
  name: 'dynamic-table'
})
export default class DynamicTable extends Vue {
  public notice!: 'Hello'
}
</script>
