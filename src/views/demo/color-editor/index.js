import DemoColorEditor from './src'

DemoColorEditor.install = function (vue) {
  if (DemoColorEditor.install.installed) return
  vue.component(DemoColorEditor.name, DemoColorEditor)
}

export default DemoColorEditor
