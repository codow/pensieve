<template functional>
  <el-form-item v-if="showLabel"
                :prop="formItemPath"
                v-bind="formItemAttributes">
    <slot></slot>
  </el-form-item>
</template>

<script>
export default {
  props: {
    showLabel: Boolean,
    formItemPath: String,
    formItemAttributes: Object
  }
}
</script>
