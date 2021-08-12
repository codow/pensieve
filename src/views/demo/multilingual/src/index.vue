<template>
  <div style="padding: 20px;">
    <div style="margin-bottom: 20px">测试多语言设置</div>
    <div style="margin-bottom: 20px">
      formData: {{formData}}
    </div>
    <div>
      <input-multilingual v-model="formData.name"
                          :model="formData"
                          field="name"
                          style="width: 240px;"></input-multilingual>
    </div>
  </div>
</template>

<script>
import InputMultilingual from './components'

export default {
  name: 'DemoInputMultilingual',
  components: {
    InputMultilingual
  },
  data () {
    return {
      formData: {
        name: null
      }
    }
  }
}
</script>
