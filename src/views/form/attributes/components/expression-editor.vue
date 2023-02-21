<template>
  <div style="display: flex;">
    <div style="flex: 1;">
      <sp-code-editor v-if="expEditorFlag"
                      v-model="computedValue"
                      type="dialog"
                      @change="handleExpressionChange"></sp-code-editor>
      <slot v-else></slot>
    </div>
    <div style="flex-basis: 36px; text-align: right;">
      <el-button type="text"
                 @click="toggleExpEditor">
        <template v-if="expEditorFlag">Orgi</template>
        <template v-else>Exp.</template>
      </el-button>
    </div>
  </div>
</template>

<script>
import SpCodeEditor from '../../../../components/code-editor/index'
import { isString, isObject } from '../../../../utils/packages/validator'

export default {
  name: 'form-attribute-expression-editor',
  components: {
    SpCodeEditor
  },
  props: {
    value: {},
    valueType: {
      type: String,
      default: 'String'
    }
  },
  data () {
    return {
      isExp: false,
      expEditorFlag: false,
      computedValue: null
    }
  },
  watch: {
    value: {
      handler (newVal) {
        // 判断是否表达式
        if (this.isExpression(newVal)) {
          this.isExp = true
          this.expEditorFlag = true
          let _exp = this.getExpression(newVal)
          if (_exp !== this.computedValue) {
            this.computedValue = newVal
          }
        } else {
          this.isExp = false
          this.expEditorFlag = false
          this.computedValue = null
        }
      },
      immediate: true
    }
  },
  methods: {
    isExpression (exp) {
      if (isObject(exp) && exp.__exp__) {
        return true
      }
      const regexp = /\#\{(.)+\}/g
      return isString(exp) && regexp.test(exp)
    },
    getExpression (exp) {
      let _exp
      if (isObject(exp)) {
        _exp = exp.expression
      } else if (isString(exp)) {
        _exp = exp
      }
      return _exp || null
    },
    toggleExpEditor () {
      this.expEditorFlag = !this.expEditorFlag
      if (!this.expEditorFlag && this.valueType !== 'String') {
        this.handleExpressionChange(null)
      }
    },
    handleExpressionChange (exp) {
      let _val = exp
      if (!_val) {
        this.isExp = false
      }
      if (this.isExpression(_val)) {
        _val = {
          __exp__: true,
          expression: _val
        }
      }
      this.$emit('input', _val)
      this.$emit('change', _val)
    }
  }
}
</script>