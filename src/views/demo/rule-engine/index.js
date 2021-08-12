import DemoRuleEngineEditor from './src'

DemoRuleEngineEditor.install = function (vue) {
  if (DemoRuleEngineEditor.install.installed) return
  vue.component(DemoRuleEngineEditor.name, DemoRuleEngineEditor)
}

export default DemoRuleEngineEditor
