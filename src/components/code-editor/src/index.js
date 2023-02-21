import SpCodeEditor from './code-editor'
import SpCodeEditorDialog from './code-editor-dialog'
// 引入codemirror基本的功能
import 'codemirror/keymap/sublime'
import './mode'
import './addons'

export default {
  name: 'sp-code-editor',
  functional: true,
  render: function (createElement, context) {
    /**
     * 判断合适的组件，返回组件配置
     */
    function appropriateComponent () {
      let type = context.props.codeEditorType || context.props.type

      if (type === 'dialog') return SpCodeEditorDialog

      return SpCodeEditor
    }

    return createElement(
      appropriateComponent(),
      context.data,
      context.children
    )
  }
}
