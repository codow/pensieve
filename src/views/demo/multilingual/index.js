import DemoInputMultilingual from './src'

DemoInputMultilingual.install = function (Vue) {
  if (DemoInputMultilingual.install.installed) return
  Vue.component(DemoInputMultilingual.name, DemoInputMultilingual)
}

export default DemoInputMultilingual
