import DemoComputedAttr from './src'

DemoComputedAttr.install = function (vue) {
  if (DemoComputedAttr.install.installed) return
  vue.component(DemoComputedAttr.name, DemoComputedAttr)
}

export default DemoComputedAttr