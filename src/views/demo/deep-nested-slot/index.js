import DemoDeepNestedSlot from './src'

DemoDeepNestedSlot.install = function (vue) {
  if (DemoDeepNestedSlot.install.installed) return
  vue.component(DemoDeepNestedSlot.name, DemoDeepNestedSlot)
}

export default DemoDeepNestedSlot
