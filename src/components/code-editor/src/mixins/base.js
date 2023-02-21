/**
 * 代码编辑器基本的功能
 * @author wangyubo
 * @createTime 2020-08-27 19:58:22
 */
import CodeMirror from 'codemirror'
import JsBeautify from 'js-beautify'
import SqlFormatter from 'sql-formatter'

export default {
  model: {
    prop: 'codeValue',
    event: 'changeCodeValue'
  },
  props: {
    codeValue: {},
    valueType: {
      type: String,
      default: 'string'
    },
    mode: {
      type: String,
      default: 'text'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    codeLibraryReadonly: {
      type: Boolean,
      default: true
    },
    beautify: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'default'
    },
    showCodeLibrary: {
      type: Boolean,
      default: false
    },
    allowInsertTemplate: {
      type: Boolean,
      default: true
    },
    showOperation: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: '400px'
    },
    width: {
      type: String,
      default: '100%'
    },
    theme: {
      type: String,
      default: 'idea'
    },
    scrollbarStyle: {
      type: String,
      default: 'native'
    },
    size: String
  },
  computed: {
    valueLength: function () {
      return !this.value ? 0 : this.value.length
    },
    editorClass () {
      return {
        'no-border': !this.border
      }
    },
    editorStyle () {
      return {
        'height': this.height,
        'width': this.width
      }
    },
    pluginClass () {
      return {
        'no-border': !this.border
      }
    },
    editorContentClass () {
      return {
        'code-editor__show-right-aside': this.showCodeLibrary
      }
    }
  },
  watch: {
    mode (newVal) {
      this.instance && this.instance.setOption('mode', newVal)
    },
    theme (newVal) {
      this.instance && this.instance.setOption('theme', newVal)
    },
    codeValue (newVal) {
      this.setEditorValue(newVal)
    }
  },
  data: function () {
    return {
      initFlag: false,
      editing: false,
      instance: null,
      layout: {
        status_bar: false
      },
      defaultFormatOption: {
        indent_size: '2',
        indent_char: ' ',
        max_preserve_newlines: '5',
        preserve_newlines: true,
        keep_array_indentation: false,
        break_chained_methods: false,
        indent_scripts: 'normal',
        brace_style: 'collapse',
        space_before_conditional: true,
        unescape_strings: false,
        jslint_happy: false,
        end_with_newline: false,
        wrap_line_length: '0',
        indent_inner_html: false,
        comma_first: false,
        e4x: false,
        indent_empty_lines: false
      }
    }
  },
  methods: {
    getEditorValue () {
      return this.instance ? this.instance.getDoc().getValue() : this.value
    },
    setEditorValue (newVal) {
      if (this.instance && this.instance.getDoc().getValue() !== newVal) {
        this.instance.getDoc().setValue(newVal === null || newVal === undefined ? '' : newVal)
      }
    },
    init () {
      this.instance = CodeMirror.fromTextArea(this.$refs.codeEditor, {
        keyMap: 'sublime',
        extraKeys: this.readonly ? {} : {
          'Ctrl-Enter': this.formatCode,
          'Ctrl-S': this.saveCode,
          'Alt-Enter': 'autocomplete'
        },
        theme: this.theme,
        readOnly: this.readonly,
        mode: this.mode,
        lineNumbers: true,
        lineWrapping: true,
        foldGutter: true,
        tabSize: 2,
        scrollbarStyle: this.scrollbarStyle,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
      })
      // 默认美化代码
      this.onEvent()
      this.refresh()
      this.initFlag = true
    },
    onEvent () {
      if (!this.instance) return
      this.instance.on('change', this.editorValueChange)
    },
    editorValueChange (instance) {
      this.editing = true
      this.value = instance.getValue()
    },
    saveCode () {
      let text = this.getEditorValue()
      this.value = text
      this.$emit('save', ...arguments)
    },
    formatCode () {
      let value = this.beautifyCode(this.getEditorValue())
      if (value !== this.value) {
        this.editing = true
      }
      this.setEditorValue(value)
    },
    beautifyCode (code) {
      let result
      if (this.mode === 'javascript') {
        result = JsBeautify.js(code, this.formatOption)
      } else if (this.mode === 'css') {
        result = JsBeautify.css(code, this.formatOption)
      } else if (this.mode === 'text/html') {
        result = JsBeautify.html(code, this.formatOption)
      } else if (this.mode === 'sql') {
        result = SqlFormatter.format(code)
      } else {
        result = code
      }
      return result
    },
    refresh () {
      this.$nextTick(() => {
        // 默认美化代码
        if (this.beautify) {
          this.formatCode()
        }
        this.instance.refresh()
      })
    },
    insertContent (content) {
      // 获取当前实例，
      if (this.instance && content) {
        let doc = this.instance.doc
        if (doc.getSelection()) {
          doc.replaceSelection(content)
        } else {
          let cursor = doc.getCursor()
          doc.replaceRange(content, cursor, cursor)
        }
      }
    },
    // api
    insertCode (content) {
      // 获取当前打开的编辑器
      this.insertContent(content)
    }
  }
}
