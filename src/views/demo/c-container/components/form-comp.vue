<template>
  <el-col v-if="showResponsive && visible"
          v-bind="responsiveAttributes">
    <el-form-item v-if="showLabel"
                  v-bind="formItemAttributes"
                  :prop="formItemPath">
      <component :is="componentName"
                 v-bind="attributes"
                 v-on="events"
                 v-model="componentValue"></component>
    </el-form-item>
    <sp-label v-else
              v-bind="attributes"
              v-on="events"
              v-model="componentValue"></sp-label>
  </el-col>
  <el-form-item v-else-if="showLabel && visible"
                v-bind="formItemAttributes"
                :prop="formItemPath">
    <component :is="componentName"
               v-bind="attributes"
               v-on="events"
               v-model="componentValue"></component>
  </el-form-item>
  <component v-else-if="visible"
             v-bind="attributes"
             v-on="events"
             :is="componentName"
             v-model="componentValue"></component>
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
  },
  data () {
    return {
      componentValue: {}
    }
  }
}
</script>