<template>
  <div>
    <div>测试封装组件的基本套路</div>
    <div>
      <div>测试基本组件的封装</div>
      <div>{{text}}</div>
      <div>
        <form-comp component-name="el-input"
                   :component-value="text"></form-comp>
      </div>
    </div>
  </div>
</template>

<script>
import FormComp from '../components/form-comp'

export default {
  name: 'demo-c-container',
  components: {
    FormComp
  },
  data () {
    return {
      text: ''
    }
  }
}
</script>
