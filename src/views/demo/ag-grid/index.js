import DemoAgGrid from './src'

DemoAgGrid.install = function (Vue) {
  if (DemoAgGrid.install.installed) return
  Vue.component(DemoAgGrid.name, DemoAgGrid)
}

export default DemoAgGrid
