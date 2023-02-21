<template>
  <div class="padding__small">
    <div>测试属性编辑组件</div>
    <div>
      {{define}}
    </div>
    <el-container>
      <el-aside width="320px">
        <el-card>
          <template #header>
            属性编辑器
          </template>
          <el-form size="small">
            <el-form-item label="数据绑定">
              <FormAttributeFieldBind v-model="define.field"
                                      :dataModels="dataModels"></FormAttributeFieldBind>
            </el-form-item>
            <el-form-item label="字符串+Exp">
              <FormAttributeExpressionEditor v-model="define.strExp">
                <el-input v-model="define.strExp"></el-input>
              </FormAttributeExpressionEditor>
            </el-form-item>
            <el-form-item label="布尔+Exp">
              <FormAttributeExpressionEditor v-model="define.booleanExp"
                                             value-type="Boolean">
                <el-switch v-model="define.booleanExp"></el-switch>
              </FormAttributeExpressionEditor>
            </el-form-item>
          </el-form>
        </el-card>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import FormAttributeFieldBind from './components/field-bind.vue'
import FormAttributeExpressionEditor from './components/expression-editor.vue'

export default {
  name: 'form-attributes-editors',
  components: {
    FormAttributeFieldBind,
    FormAttributeExpressionEditor,
  },
  data () {
    return {
      dataModels: [
        {
          "id": "default",
          "label": "默认",
          "bind": "",
          "data_type": "Object",
          "model_type": "custom",
          "fields": [
            {
              "id": "test",
              "label": "测试字段",
              "data_type": "String"
            }
          ]
        },
        {
          "id": "contract_info",
          "label": "合同信息",
          "bind": "contract_info",
          "data_type": "Object",
          "model_type": "metadata",
          "fields": [
            {
              "id": "contract_no",
              "label": "合同编号",
              "data_type": "String"
            },
            {
              "id": "contract_name",
              "label": "合同名称",
              "data_type": "String"
            }
          ]
        },
        {
          "id": "contract_detail",
          "label": "合同明细",
          "bind": "contract_info.contract_detail",
          "data_type": "Array",
          "model_type": "metadata",
          "fields": [
            {
              "id": "item",
              "field": "item",
              "label": "合同事项",
              "data_type": "String"
            },
            {
              "id": "amount_rate",
              "field": "item",
              "label": "费用占比",
              "data_type": "Number"
            }
          ]
        }
      ],
      define: {
        field: null,
        text: null,
        strExp: null,
        booleanExp: {
          __exp__: true,
          expression: '#{props.readonly}'
        }
      }
    }
  }
}
</script>