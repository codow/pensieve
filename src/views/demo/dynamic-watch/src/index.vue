<template>
  <div>
    <div>动态监听</div>
    <div>
      <el-form :model="form">
        <el-form-item label="id">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="text">
          <el-input v-model="form.text"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="setAll">setAll</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'demo-dynamic-watch',

  data () {
    return {
      id: '',
      text: '',
      dynamicWatch: '',
      form: {
        id: '',
        text: ''
      }
    }
  },

  activated () {
    console.log('2 activated')
  },
  deactivated () {
    console.log('2 deactivated')
  },

  created () {
    console.log('2 created')
    // 创建动态监听
    this.createDynamicWatch()
  },

  destroyed () {
    // 销毁动态监听
    this.destroyDynamicWatch()
  },

  methods: {
    createDynamicWatch () {
      if (this.dynamicWatch) {
        this.destroyDynamicWatch()
      }
      // 创建一个动态监听，监听id，和text变化
      this.dynamicWatch = this.$watch(function () {
        return this.id + this.text
      }, function (newVal, oldVal) {
        console.log(newVal, oldVal)
      })
    },

    destroyDynamicWatch () {
      this.dynamicWatch && this.dynamicWatch()
    },

    setAll () {
      this.id = this.form.id
      this.text = this.form.text
    }
  }
}
</script>