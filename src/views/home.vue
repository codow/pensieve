<template>
  <div class="padding__medium">
    <div>首页</div>
    <el-form>
      <el-form-item label="所属部门">
        <el-input></el-input>
      </el-form-item>
      <el-form-item v-if="getSysAppOption('myApp', 'enableGroup')"
                    label="所属分组">
        <el-input></el-input>
      </el-form-item>
      <el-form-item v-if="getSysAppOption('myApp', 'enableCompany')"
                    label="所属公司">
        <el-input></el-input>
      </el-form-item>
      <el-form-item v-if="getSysAppOption('myApp', 'enableAdmin')"
                    label="管理员">
        <el-switch></el-switch>
      </el-form-item>
      <el-form-item v-if="getSysAppOption('myApp', 'enableDeptInChargen')"
                    label="负责人">
        <el-switch></el-switch>
      </el-form-item>
      <el-form-item v-if="getSysAppOption('myApp', 'enableCompany')"
                    label="分管人">
        <el-switch></el-switch>
      </el-form-item>
      <el-form-item label="审批人">
        <el-switch></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button @click="openAllField">开启全部字段</el-button>
        <el-button @click="closeField">关闭部分字段</el-button>
      </el-form-item>
      <component :is="tag">
        <template #default>
          hahahaha
        </template>
        asdfasdf
      </component>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'fr-home',
  data () {
    return {
      tag: 'div'
    }
  },
  methods: {
    openAllField () {
      this.setSysAppOptions({
        name: 'myApp',
        options: {
          enableGroup: true,
          enableCompany: true,
          enableAdmin: true,
          enableDeptInChargen: true,
          enableApplyAgent: true
        }
      })
    },
    closeField () {
      this.setSysAppOptions({
        name: 'myApp',
        options: {
          enableGroup: false,
          enableCompany: false,
          enableAdmin: false,
          enableDeptInChargen: false,
          enableApplyAgent: false
        }
      })
    }
  }
}
</script>
