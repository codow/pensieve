<template>
  <div>
    <textarea ref="text"
              :id="id"
              v-model="content"></textarea>
  </div>
</template>

<script>
import './tinymce'

// 生成唯一ID
let uidIndex = 0
const prefixInteger = function (num, length) {
  return (Array(length).join('0') + num).slice(-length)
}
const getUID = function (prefex) {
  prefex = prefex || 'richEidtor'
  ++uidIndex
  return prefex + prefixInteger(uidIndex, 5)
}

export default {
  name: 'rich-editor',
  props: {
    id: {
      type: String,
      default () {
        return getUID()
      }
    },
    value: String,
    htmlClass: { default: '', type: String },
    plugins: {
      default: function () {
        return [
          'advlist autolink lists link image charmap print preview hr anchor pagebreak',
          'searchreplace wordcount visualblocks visualchars code fullscreen',
          'insertdatetime media nonbreaking save table contextmenu directionality',
          'template paste textcolor colorpicker textpattern imagetools toc help emoticons hr'
        ]
      },
      type: Array
    },
    toolbar1: {
      default: 'formatselect | bold italic  strikethrough  forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
      type: String
    },
    toolbar2: {
      default: '',
      type: String
    },
    other_options: {
      default () { return {} },
      type: Object
    }
  },
  data () {
    return {
      content: '',
      editor: null,
      cTinyMce: null,
      checkerTimeout: null,
      inactive: false,
      isTyping: false
    }
  },
  mounted () {
    this.content = this.value
    this.init()
  },
  beforeDestroy () {
    this.editor.destroy()
  },
  deactivated () {
    this.inactive = true
    this.editor && this.editor.destroy()
    const { text } = this.$refs
    text.style.display = ''
  },
  activated () {
    if (this.inactive) {
      this.init()
    }
    this.inactive = false
  },
  watch: {
    value (newValue) {
      if (!this.isTyping) {
        if (this.editor !== null && this.newValue)
          this.editor.setContent(newValue)
      }
      // 内容保持一致
      this.content = newValue
    }
  },
  methods: {
    init () {
      // console.log('init ' + this.id)
      const { text } = this.$refs
      let options = {
        // selector: '#' + this.id,
        target: text,
        skin: false,
        toolbar1: this.toolbar1,
        toolbar2: this.toolbar2,
        plugins: this.plugins,

        setup: (editor) => {
          editor.on('init', (e) => {
            // 初始化内容
            if (this.content) editor.setContent(this.content)
          })
        },

        init_instance_callback: (editor) => {
          this.editor = editor
          editor.on('KeyUp', (e) => {
            this.submitNewContent()
          })
          editor.on('Change', (e) => {
            if (this.editor.getContent() !== this.value) {
              this.submitNewContent()
            }
          })
        }
      }
      tinymce.init(this.concatAssciativeArrays(options, this.other_options))
    },
    concatAssciativeArrays (array1, array2) {
      if (array2.length === 0) return array1
      if (array1.length === 0) return array2
      let dest = []
      for (let key in array1) dest[key] = array1[key]
      for (let key in array2) dest[key] = array2[key]
      return dest
    },
    submitNewContent () {
      this.isTyping = true
      // 清理定时器
      if (this.checkerTimeout !== null) clearTimeout(this.checkerTimeout)
      this.checkerTimeout = setTimeout(() => {
        this.isTyping = false
      }, 300)
      this.$emit('input', this.editor.getContent())
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
