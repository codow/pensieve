<template>
  <el-col v-if="showResponsive && visible"
          v-bind="responsiveAttributes">
    <el-form-item v-if="showLabel"
                  :prop="formItemPath"
                  v-bind="formItemAttributes">
      <component :is="componentName"
                 v-model="componentValue"
                 v-bind="attributes"
                 v-on="events"></component>
    </el-form-item>
    <sp-label v-else
              v-model="componentValue"
              v-bind="attributes"
              v-on="events"></sp-label>
  </el-col>
  <el-form-item v-else-if="showLabel && visible"
                :prop="formItemPath"
                v-bind="formItemAttributes">
    <component :is="componentName"
               v-model="componentValue"
               v-bind="attributes"
               v-on="events"></component>
  </el-form-item>
  <component v-else-if="visible"
             :is="componentName"
             v-model="componentValue"
             v-bind="attributes"
             v-on="events"></component>
  <!-- <div>{{componentName}}</div> -->
</template>

<script>
export default {
  props: {
    visible: { type: Boolean, default: true },
    showLabel: Boolean,
    formItemPath: String,
    formItemAttributes: Object,
    showResponsive: Boolean,
    responsiveAttributes: Object,
    attributes: Object,
    events: Object,
    componentName: String,
    componentValue: {}
  }
}
</script>