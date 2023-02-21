<template>
  <div class="code-editor__wrapper">
    <el-input v-model="value"
              :size="size">
      <template #append>
        <el-button type="text"
                   icon="el-icon-edit"
                   :size="size"
                   @click="triggerEditorVisible"></el-button>
      </template>
    </el-input>
    <!-- $$t('smart.platform.ui.codeEditor.editor.label') -->
    <el-dialog title="代码编辑器"
               :visible.sync="editorVisible"
               :close-on-click-modal="false"
               :append-to-body="true"
               :size="size">
      <slot name="prepend"></slot>
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
              <el-button type="text"
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
                               @selectedCode="insertCode"></sp-code-library>
            </slot>
          </div>
        </div>
      </div>
      <slot name="append"></slot>
      <div class="code-editor__footer"
           v-if="showOperation">
        <div style="margin-top: 10px; text-align: right;">
          <el-button @click="close"
                     :size="size">
            <!-- {{$$t('system.common.button.close.label')}} -->
            关闭
          </el-button>
          <el-button :disabled="readonly"
                     type="primary"
                     :size="size"
                     @click="saveCode">
            <!-- {{$$t('system.common.button.save.label')}} -->
            保存
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import baseMixin from './mixins/base'
import * as validator from '../../../utils/packages/validator'

export default {
  name: 'sp-code-editor-dialog',

  mixins: [baseMixin],

  computed: {
    value: {
      get () {
        let value = this.codeValue
        if (validator.isObject(value)) {
          value = JSON.stringify(value)
        }
        return value
      },
      set (newVal) {
        newVal = newVal === '' ? null : newVal
        this.$emit('changeCodeValue', newVal)
        this.$emit('change', newVal)
      }
    }
  },
  data () {
    return {
      editorVisible: false
    }
  },
  methods: {
    editorValueChange (instance) {
      this.editing = true
    },
    triggerEditorVisible () {
      this.editorVisible = !this.editorVisible
      if (this.editorVisible && !this.initFlag) {
        this.$nextTick(() => {
          this.init()
        })
      }
    },
    close () {
      if (this.editing) {
        // this.$confirm(this.$$t('smart.platform.ui.codeEditor.deleted_warning.message'), this.$$t('system.common.fields.tips.label'), {
        //   confirmButtonText: this.$$t('system.common.button.ok.label'),
        //   cancelButtonText: this.$$t('system.common.button.cancel.label'),
        //   type: 'warning'
        // }).then(() => {
        //   this.unsaveCode()
        // })
        this.$confirm('未保存的数据将丢失', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.unsaveCode()
        })
      } else {
        this.triggerEditorVisible()
      }
    },
    unsaveCode () {
      // 还原修改的内容
      this.editing = false
      this.setEditorValue(this.codeValue)
      this.triggerEditorVisible()
      this.$emit('unsave')
    },
    saveCode () {
      let value = this.getEditorValue()
      // 触发脚本值修改
      this.$emit('changeCodeValue', value)
      this.$emit('change', value)
      // 触发save事件
      this.$emit('save', value)
      this.editing = false
      this.triggerEditorVisible()
    }
  }
}
</script>
