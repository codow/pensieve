<template>
  <el-container class="home-conatiner fr-full">
    <el-main>
      <el-form :model="formData">
        <el-form-item prop="username"
                      :rules="[{required: true, message: '请输入用户名', trigger: 'blur'}]">
          <el-input v-model="formData.username"
                    class="fr-input--prefix">
            <template #prefix>
              <i class="el-icon-user padding-horizontal__small"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password"
                      :rules="[{required: true, message: '请输入密码', trigger: 'blur'}]">
          <el-input v-model="formData.password"
                    class="fr-input--prefix"
                    show-password>
            <template #prefix>
              <i class="el-icon-lock padding-horizontal__small"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<style>
.fr-input--prefix.el-input--prefix .el-input__inner {
  padding-left: 40px;
}
</style>

<script>
export default {
  name: 'login',
  data () {
    return {
      formData: {}
    }
  },
  methods: {
    login () {
      // 登录
      this.$http.post('/login', this.formData, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.statusText !== 'ok') {
          this.$message.error('登录失败')
        } else {
          this.$message.success('登录成功')
        }
      })
    }
  }
}
</script>