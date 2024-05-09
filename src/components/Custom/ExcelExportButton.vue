<template>
  <div>
    <b-button variant="success" @click="exportExcel">Export <font-awesome-icon :icon="['far', 'file-excel']" class="icon"></font-awesome-icon></b-button>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Prop, Vue } from 'vue-property-decorator'
import * as XLSX from 'xlsx'
const { utils, writeFile } = XLSX

@Component({
  name: 'excel-export-button'
})
export default class ExcelExportButton extends Vue {
  @Prop(Array) columns: any = []
  @Prop(Array) data: any = []
  @Prop(String) fileName: string = 'excel'
  @Prop(String) sheetName: string = 'Sheet1'
  @Prop(String) fileType: string = 'xlsx'

  public exportExcel(): void {
    let XSLXFormatObj: any = []
    let header: any = []
    let widths: any = []
    let vm = this
    if (vm.columns.length === 0) {
      alert('No columns selected for export.')
      return
    }
    if (vm.data.length === 0) {
      alert('No data selected for export.')
      return
    }
    vm.columns.map((column: { label: any }) => {
      header.push(column.label)
    })
    vm.columns.map((column: { width: any }) => {
      widths.push({ wpx: column.width })
    })
    XSLXFormatObj.push(header)
    vm.data.map((value: object) => {
      let innerRowData: any = []
      vm.columns.map((val: { field: string; dataFormat: (arg0: any) => any }) => {
        let fieldValue: any = value[val.field]
        if (val.field.split('.').length > 1) {
          fieldValue = vm.getNestedValue(value, val.field)
        }
        if (val.dataFormat && typeof val.dataFormat === 'function') {
          innerRowData.push(val.dataFormat(fieldValue))
        } else {
          innerRowData.push(fieldValue)
        }
      })
      XSLXFormatObj.push(innerRowData)
    })
    let fileName = vm.fileName + '.' + vm.fileType
    let wsName = vm.sheetName
    let wb = XLSX.utils.book_new()
    let ws = XLSX.utils.aoa_to_sheet(XSLXFormatObj)
    ws['!cols'] = widths
    XLSX.utils.book_append_sheet(wb, ws, wsName)
    XLSX.writeFile(wb, fileName)
  }

  public getNestedValue(obj: object, val: string) {
    val = val.replace(/\[(\w+)\]/g, '.$1')
    val = val.replace(/^\./, '')
    let a = val.split('.')
    for (let i = 0; i < a.length; i++) {
      let k = a[i]
      if (k in obj) {
        obj = obj[k]
      } else {
        return
      }
    }
    return obj
  }
}
</script>

<style></style>
