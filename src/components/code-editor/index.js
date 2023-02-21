import CodeEditor from './src'

CodeEditor.install = function (Vue) {
  if (CodeEditor.install.installed) return
  Vue.component(CodeEditor.name, CodeEditor)
}

export default CodeEditor
