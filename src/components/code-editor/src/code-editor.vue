<template>
  <div class="code-editor__content-wrapper"
       :class="editorClass"
       :style="editorStyle">
    <div class="code-editor__content"
         :class="editorContentClass">
      <div class="code-editor__editor">
        <textarea ref="codeEditor"
                  v-model="value"
                  :readonly="readonly"></textarea>
        <div v-if="layout.status_bar">
          <!-- {{$$t('smart.platform.ui.codeEditor.current_word_count.label')}}： -->
          字数：
          <span style="color: red;">{{valueLength}}</span>
          <el-button :disabled="readonly"
                     :size="size"
                     @click="formatCode">
            <!-- {{$$t('smart.platform.ui.codeEditor.format.label')}} -->
            格式化
          </el-button>
        </div>
      </div>
      <div class="code-editor__slot"
           v-if="showCodeLibrary">
        <slot name="default">
          <sp-code-library :readonly="codeLibraryReadonly"
                           class="code-editor__plugin"
                           :class="pluginClass"
                           :allow-insert-template="allowInsertTemplate"
                           :size="size"
                           @select-code="insertCode"></sp-code-library>
        </slot>
      </div>
    </div>
    <div v-if="layout.status_bar">
      <!-- {{$$t('smart.platform.ui.codeEditor.current_word_count.label')}}： -->
      字数：
      <span style="color: red;">{{valueLength}}</span>
      <el-button :disabled="readonly"
                 type="text"
                 :size="size"
                 @click="formatCode">
        <!-- {{$$t('smart.platform.ui.codeEditor.format.label')}} -->
        格式化
      </el-button>
    </div>
  </div>
</template>

<script>
import baseMixin from './mixins/base'
import * as validator from '../../../utils/packages/validator'

export default {
  name: 'sp-code-editor-default',

  mixins: [baseMixin],

  computed: {
    value: {
      get () {
        let value = this.codeValue
        if (validator.isObject(value)) {
          value = JSON.stringify(value)
        }
        this.setEditorValue(value)
        return value
      },
      set (newVal) {
        // 转换数据格式
        if (this.valueType === 'object') {
          newVal = JSON.parse(newVal)
        }
        this.$emit('changeCodeValue', newVal)
        this.$emit('change', newVal)
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
