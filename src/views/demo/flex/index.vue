<template>
  <div class="padding__small">
    <div>flex测试</div>
    <div class="margin-top__medium"
         style="display: flex; flex-wrap: wrap;">
      <el-col :span="6"
              class="card-wrap">
        <div class="card"></div>
      </el-col>
      <el-col :span="6"
              class="card-wrap">
        <div class="card"></div>
      </el-col>
      <el-col :span="6"
              class="card-wrap">
        <div class="card"></div>
      </el-col>
      <el-col :span="6"
              class="card-wrap">
        <div class="card"></div>
      </el-col>
      <el-col :span="8"
              class="card-wrap">
        <div class="card"></div>
      </el-col>
      <el-col :span="16"
              class="card-wrap">
        <div class="card"></div>
      </el-col>
      <el-col :span="12"
              class="card-wrap">
        <div class="card"></div>
      </el-col>
      <el-col :span="12"
              class="card-wrap">
        <div class="card"></div>
      </el-col>
      <el-col :span="8"
              class="card-wrap">
        <div class="card"></div>
      </el-col>
      <el-col :span="8"
              class="card-wrap">
        <div class="card"></div>
      </el-col>
      <el-col :span="8"
              class="card-wrap">
        <div class="card"></div>
      </el-col>
    </div>
  </div>
</template>

<script>
export default {
  name: 'demo-flex'
}
</script>

<style scoped>
.card-wrap {
  padding: 10px;
}
.card {
  width: 100%;
  height: 320px;
  background: #ef8923;
  border-radius: 4px;
  border: 1px solid #efefef;
  box-shadow: 0 0 4px 4px #efefef;
}
</style>