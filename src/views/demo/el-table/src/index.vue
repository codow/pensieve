<template>
  <div>
    <div>测试el-table</div>
    <div>
      <el-table :data="list">
        <el-table-column label="#"
                         type="index"></el-table-column>
        <el-table-column label="合同ID"
                         prop="contract_id"></el-table-column>
        <el-table-column label="合同名称"
                         prop="contract_name"></el-table-column>
        <el-table-column label="签约时间"
                         prop="create_time"></el-table-column>
      </el-table>
    </div>
    <div>列拖拽测试</div>
    <div>
      <vue-draggable tag="el-table"
                     :attrs="{
                        data: list
                      }">
        <el-table-column label="#"
                         type="index"></el-table-column>
        <el-table-column label="合同ID"
                         prop="contract_id"></el-table-column>
        <el-table-column label="合同名称"
                         prop="contract_name"></el-table-column>
        <el-table-column label="签约时间"
                         prop="create_time"></el-table-column>
      </vue-draggable>
    </div>

    <div>列拖拽测试</div>
    <div>
      <el-table :data="list">
        <vue-draggable>
          <el-table-column label="#"
                           type="index"></el-table-column>
          <el-table-column label="合同ID"
                           prop="contract_id"></el-table-column>
          <el-table-column label="合同名称"
                           prop="contract_name"></el-table-column>
          <el-table-column label="签约时间"
                           prop="create_time"></el-table-column>
        </vue-draggable>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
</style>

<script>
import VueDraggable from 'vuedraggable'

export default {
  name: 'demo-el-table',

  components: {
    VueDraggable
  },

  data () {
    return {
      list: [{
        contract_id: 1,
        contract_name: '3A游戏开发合同',
        contract_amount: 60000000,
        create_time: '2020-12-10 12:23:12'
      }]
    }
  }
}
</script>
