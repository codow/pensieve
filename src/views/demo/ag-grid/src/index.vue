<template>
  <div>
    <div>ag grid 测试</div>
    <div>
      <ag-grid-vue style="width: 500px; height: 300px;"
                   class="ag-theme-alpine"
                   :columnDefs="columnDefs"
                   :rowData="rowData"
                   rowSelection="multiple">
      </ag-grid-vue>
    </div>
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
// import 'ag-grid-enterprise';
import { AgGridVue } from 'ag-grid-vue3'

export default {
  name: 'demo-ag-grid',
  components: {
    AgGridVue
  },
  data () {
    return {
      columnDefs: null,
      rowData: null
    }
  },
  beforeMount () {
    this.columnDefs = [
      { field: 'make', sortable: true, filter: true, checkboxSelection: true },
      { field: 'model', sortable: true, filter: true },
      { field: 'price', sortable: true, filter: true }
    ]

    // this.rowData = [
    //   { make: 'Toyota', model: 'Celica', price: 35000 },
    //   { make: 'Ford', model: 'Mondeo', price: 32000 },
    //   { make: 'Porsche', model: 'Boxter', price: 72000 }
    // ];

    // fetch('https://www.ag-grid.com/example-assets/small-row-data.json')
    fetch('https://www.ag-grid.com/example-assets/row-data.json')
      .then(result => result.json())
      .then(rowData => this.rowData = rowData)
  }
}
</script>