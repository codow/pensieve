<template>
  <el-input v-model="formData.text"
            ref="text"
            :style="{ width: width + 'px' }"
            @change="handleTextChange">
    <template v-if="finalLangs.length > 1"
              #append>
      <el-popover placement="bottom-end"
                  :width="popoverWidth"
                  trigger="click">
        <el-form :model="formData"
                 label-position="right"
                 label-width="80px">
          <el-form-item v-for="lang in finalLangs"
                        :key="lang.id"
                        :label="lang.label"
                        :prop="lang.field">
            <el-input v-model="formData[lang.field]"
                      @change="handleLangTextChange(formData[lang.field], lang)"></el-input>
          </el-form-item>
        </el-form>
        <template #reference>
          <el-button icon="el-icon-s-operation"
                     @click="calcPopoverWidth"></el-button>
        </template>
      </el-popover>
    </template>
  </el-input>
</template>

<script>

const systemLang = 'zh-HK'

export default {
  name: 'InputMultilingual',
  props: {
    model: {
      type: Object,
      default () {
        return {}
      }
    },
    value: String,
    field: {
      type: String,
      default: ''
    },
    width: Number,
    langs: {
      type: Array,
      default () {
        return [{
          id: 'zh-CN',
          prefix: '_cn',
          label: '简体中文'
        }, {
          id: 'zh-HK',
          prefix: '_hk',
          label: '繁體中文'
        }, {
          id: 'en',
          prefix: '_en',
          label: 'English'
        }]
      }
    },
    lazy: { type: Boolean, default: false }
  },
  data () {
    return {
      formData: {
        text: this.value
      },
      finalLangs: [],
      popoverWidth: 300
    }
  },
  watch: {
    value: {
      handler (newVal) {
        this.formData.text = newVal
      }
    },
    langs: {
      handler () {
        this.initLangs()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    initLangs () {
      let langs = this.langs || []
      langs = langs.map(item => {
        return Object.assign({}, item, {
          field: this.field + item.prefix
        })
      })
      this.finalLangs = langs
    },
    handleTextChange () {
      if (!this.finalLangs.length) {
        return
      }
      // 解析数据
      let value = this.formData.text
      // 根据当前的系统语言设置值
      let lang = this.finalLangs.find(item => item.id === systemLang)
      if (!lang) {
        return
      }
      // 设置formData中语言的值
      this.$set(this.formData, lang.field, value)
      this.submitChange()
    },

    handleLangTextChange (value, lang) {
      if (lang.id === systemLang) {
        this.formData.text = value
      }
      this.submitChange()
    },

    calcPopoverWidth () {
      // 获取当前组件的宽度
      const { text } = this.$refs
      let width = text.$el.offsetWidth
      this.popoverWidth = Math.max(300, width - 26)
    },

    submitChange () {
      // 提交当前语言的值
      let value = this.formData.text
      this.$emit('input', value)
      // 获取所有语言的值，提交修改到model中
      this.finalLangs.forEach(lang => {
        let v = this.formData[lang.field] || null
        this.$set(this.model, lang.field, v)
      })
    }
  }
}
</script>
