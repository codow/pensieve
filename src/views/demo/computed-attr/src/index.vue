<template>
  <div>
    <div>测试计算属性</div>
    <div>
      <el-form :model="form">
        <el-form-item label="id">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="text">
          <el-input v-model="form.text"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="setId">setId</el-button>
          <el-button @click="setText">setText</el-button>
          <el-button @click="setAll">setAll</el-button>
        </el-form-item>
      </el-form>
    </div>
    <component-a :id="id"
                 :text="text"></component-a>
  </div>
</template>

<script>
import ComponentA from './components/a'

export default {
  name: 'demo-computed-attr',
  components: {
    ComponentA
  },
  data () {
    return {
      id: '',
      text: '',
      form: {
        id: '',
        text: ''
      }
    }
  },
  activated () {
    console.log('1 activated')
  },
  deactivated () {
    console.log('1 deactivated')
  },
  created () {
    console.log('1 created')
  },
  methods: {
    setId () {
      this.id = this.form.id
    },

    setText () {
      this.text = this.form.text
    },

    setAll () {
      this.setId()
      this.setText()
    }
  }
}
</script>