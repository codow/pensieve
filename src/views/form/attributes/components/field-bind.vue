<template>
  <div>
    <el-row>
      <el-select v-model="computedValue.model"
                 placeholder="数据模型"
                 :size="size"
                 clearable
                 style="width: 100%;"
                 @change="handleModelChange">
        <el-option v-for="dataModel in dataModels"
                   :key="dataModel.id"
                   :value="dataModel.id"
                   :label="dataModel.label"></el-option>
      </el-select>
    </el-row>
    <el-row class="padding-top__small">
      <el-select v-model="computedValue.name"
                 placeholder="数据字段"
                 :size="size"
                 clearable
                 style="width: 100%;"
                 @change="handleCompoutedValueChange">
        <el-option v-for="field in fields"
                   :key="field.id"
                   :value="field.id"
                   :label="field.label"></el-option>
      </el-select>
    </el-row>
    <el-row v-if="showFieldBind"
            class="padding-top__small">
      <el-input v-model="computedValue.bind"
                placeholder="属性名称"
                clearable
                @change="handleCompoutedValueChange"></el-input>
    </el-row>
  </div>
</template>

<script>
import { isString } from '../../../../utils/packages/validator'

export default {
  name: 'form-attribute-field-bind',
  props: {
    value: [String, Object],
    size: String,
    defaultModel: {
      type: String,
      default: 'default'
    },
    dataModels: {
      type: Array,
      default () {
        return []
      }
    },
    fieldBind: String,
    showFieldBind: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      computedValue: {
        model: null,
        name: null,
        bind: this.fieldBind || null
      }
    }
  },
  computed: {
    fields () {
      return this.getModelFields(this.dataModels, this.computedValue.model)
    }
  },
  watch: {
    value: {
      handler (newVal) {
        let _value = newVal
        // 值相同时，不需要变化
        if (_value === this.computedValue || (!_value && !this.computedValue.model && !this.computedValue.name && !this.computedValue.bind)) {
          return
        }
        if (!_value) {
          _value = {
            model: null,
            name: null
          }
        }
        if (isString(_value)) {
          _value = {
            model: null,
            name: _value
          }
        }
        this.computedValue = _value
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    handleModelChange (model) {
      let fields = this.getModelFields(this.dataModels, model)
      if (!this.validModelFields(fields, this.computedValue.name)) {
        this.computedValue.name = null
      }
      this.submit()
    },

    handleCompoutedValueChange () {
      this.submit()
    },

    getModelFields (dataModels, model) {
      if (!dataModels) {
        return []
      }
      model = model || this.defaultModel
      let dataModel = dataModels.find(item => item.id === model)
      if (!dataModel) {
        return []
      }
      return dataModel.fields || []
    },

    validModelFields (fields, field) {
      if (!fields || !fields.length) {
        return false
      }
      return !!fields.find(item => item.id === field)
    },

    submit () {
      const { computedValue } = this
      let _value
      if (!computedValue.model && !computedValue.bind) {
        _value = computedValue.name || null
      } else {
        _value = computedValue
      }
      this.$emit('input', _value)
      this.$emit('change', _value)
    }
  }
}
</script>