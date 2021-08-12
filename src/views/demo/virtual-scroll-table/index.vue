<template>
  <div style="padding: 20px;">
    <div>测试表格</div>
    <table>
      <thead>
        <tr>
          <th v-for="column in columns"
              :key="column.prop"
              :id="column.prop">{{column.label}}</th>
          <th>
            操作
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableData"
            :key="index">
          <td v-for="(column, subIndex) in columns"
              :key="index + '-' + subIndex">
            {{item[column.prop]}}
          </td>
          <td>
            <el-button type="text"
                       @click="handleDetailClick(item)">详情</el-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'fr-virtual-scroll-table',
  data () {
    return {
      columns: [{
        label: 'ID',
        prop: 'id',
      }, {
        label: '姓名',
        prop: 'name',
      }, {
        label: '性别',
        prop: 'sex',
      }, {
        label: '电话',
        prop: 'phone',
      }],
      tableData: [{
        id: 1,
        name: '测试1',
        sex: 0,
        phone: 123
      }, {
        id: 2,
        name: '测试2',
        sex: 1,
        phone: 321
      }]
    }
  },
  methods: {
    handleDetailClick (item) {
      this.$router.push({
        path: '/demo/virtual-scroll-table-detail',
        title: `列表详情--${item.name}`,
        query: {
          id: item.id
        },
        params: {
          item
        }
      })
    }
  }
}
</script>
