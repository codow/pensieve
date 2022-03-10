<template>
  <div>
    富文本框演示
    <div>
      <rich-editor v-model="text1"></rich-editor>
    </div>
    <div>
      <rich-editor></rich-editor>
    </div>
    <div>
      <rich-editor></rich-editor>
    </div>
  </div>
</template>

<script>
import RichEditor from '../../../components/rich-editor'

export default {
  name: 'demo-rich-editor',
  components: {
    RichEditor
  },
  data () {
    return {
      text1: null
    }
  }
}
</script>
