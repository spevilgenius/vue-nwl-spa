<template>
  <div>
    {{ count }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { PublicationItem } from '@/interfaces/PublicationItem'
import axios from 'axios'

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

@Component
export default class DynamicItemCounter extends Vue {
  @Prop(String) branch!: string
  @Prop(String) type!: string
  @Prop() items!: []
  count = 0
  pubs!: Array<PublicationItem>

  mounted() {
    console.log(this.type + ', ' + this.branch)
    switch (this.type) {
      case 'branch': {
        let a = this.items
        let b = a.filter(search => Vue._.isEqual(search['Branch'], this.branch))
        console.log('A: ' + this.items.length + ', B: ' + b.length)
        this.count = b.length
        // go get the count of items that meet this criteria
        /* let url = tp1 + slash + slash + tp2
        url += "/_api/lists/getbytitle('"
        if (this.isnato) {
          url += 'NATOPublications'
        } else {
          url += 'ActivePublications'
        }
        url += "')/items?$select=Title"
        let j: any[] = []
        const that = this
        async function getAllPubs(url: string): Promise<void> {
          const response = await axios.get(url, {
            headers: {
              accept: 'application/json;odata=verbose'
            }
          })
          j = j.concat(response.data.d.results)
          // recursively load items if there is a next result
          if (response.data.d.__next) {
            url = response.data.d.__next
            return getAllPubs(url)
          } else {
            // nothing to do here
            that.count = j.length
          }
        }
        getAllPubs(url) */
        break
      }
    }
  }
}
</script>
