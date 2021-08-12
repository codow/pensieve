<template>
  <div>
    <div>组件A</div>
    <div>
      <el-form :model="form">
        <el-form-item label="prefix">
          <el-input v-model="form.prefix"></el-input>
        </el-form-item>
        <el-form-item label="Suffix">
          <el-input v-model="form.Suffix"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type=""
                     @click="setPrefix">setPrefix</el-button>
          <el-button type=""
                     @click="setSuffix">setSuffix</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>实际ID：{{actId}}</div>
  </div>
</template>

<script>
export default {
  name: 'component-a',
  props: {
    id: { type: String },
    text: { type: String },
    options: {
      type: Object
    }
  },
  computed: {
    actId () {
      let id = this.parseAttributes() || '默认的ID'
      return id
    }
  },
  data () {
    return {
      config: {
        prefix: ''
      },
      form: {
        prefix: '',
        suffix: ''
      }
    }
  },
  methods: {
    parseAttributes () {
      if (!this.text || !this.id) return
      let id = this.text + '-' + this.id
      if (this.config && this.config.prefix) {
        id = this.config.prefix + '-' + id
      }
      return id
    },

    setPrefix () {
      if (!this.config) {
        this.config = {}
      }
      this.config.prefix = this.form.prefix
    },

    setSuffix () {
      if (!this.config) {
        this.config = {}
      }
      this.config.suffix = this.form.suffix
    }
  }
}
</script>