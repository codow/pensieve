import DemoDynamicWatch from './src'

DemoDynamicWatch.install = function (vue) {
  if (DemoDynamicWatch.install.installed) return
  vue.component(DemoDynamicWatch.name, DemoDynamicWatch)
}

export default DemoDynamicWatch