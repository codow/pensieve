import DemoDesigner from './src'

DemoDesigner.install = function (vue) {
  if (DemoDesigner.install.installed) return
  vue.component(DemoDesigner.name, DemoDesigner)
}

export default DemoDesigner