import DemoElTable from './src'

DemoElTable.install = function (Vue) {
  if (DemoElTable.install.installed) return
  Vue.component(DemoElTable.name, DemoElTable)
}

export default DemoElTable
