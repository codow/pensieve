<template>
  <div class="padding__small">
    <div>
      测试响应式布局和表格布局的兼容设置
    </div>
    <fr-link href="../../../assets/css/dark.less"></fr-link>
    <div class="margin-top__medium">行1(响应式布局)</div>
    <el-row>
      <el-col :span="24">列1</el-col>
      <el-col :span="24">列2</el-col>
      <el-col :span="24">列3</el-col>
      <el-col :span="24">列4</el-col>
    </el-row>
    <div class="margin-top__medium">行2(display: table)</div>
    <el-row style="display: table; table-layout: fixed; width: 100%;">
      <div style="display: table-row;">
        <el-col :span="24"
                style="display: table-cell; width: auto; float: none;">列1</el-col>
        <el-col :span="24"
                style="display: table-cell; width: auto; float: none;">列2</el-col>
        <el-col :span="24"
                style="display: table-cell; width: auto; float: none;">列3</el-col>
        <el-col :span="24"
                style="display: table-cell; width: auto; float: none;">列4</el-col>
      </div>
    </el-row>
    <div class="margin-top__medium">行3(table)</div>
    <table style="width: 100%; table-layout: fixed;">
      <tr>
        <td style="width: 100px;">列1</td>
        <td style="width: 100%;">列2</td>
        <td style="width: 100%;">列3</td>
        <td style="width: 100%;">列4</td>
      </tr>
    </table>
    <!-- 滚动条研究 -->
    <!-- <div class="margin-top__small">滚动条研究</div>
    <div>
      <div style="background: #ef8934; padding: 10px; height: 400px">
        <div style="background: #89ef34; padding: 40px 20px; height: 100%; box-sizing: border-box;" class="auto-scroll">
          <div style="background: #34ef89; height: 200%; width: 200%;"></div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import FrLink from '../../../components/link'

export default {
  name: 'demo-table-div',
  components: {
    FrLink
  }
}
</script>

<style>
</style>