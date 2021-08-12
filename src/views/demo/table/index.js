import DemoTable from './src'

DemoTable.install = function (vue) {
  if (DemoTable.install.installed) return
  vue.component(DemoTable.name, DemoTable)
}

export default DemoTable