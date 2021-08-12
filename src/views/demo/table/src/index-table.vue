<template>
  <div>
    <div>表格初始化</div>
    <div style="margin-top: 20px;">
      <el-container>
        <el-main>
          <demo-table v-bind="tableOptions"></demo-table>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import DemoTable from './components/table/table'

export default {
  name: 'demo-table-new',

  components: {
    DemoTable
  },

  data () {
    return {
      // tableOptions: {
      //   "rowNumber": 5,
      //   "colNumber": 10,
      //   "border": true,
      //   "cells": [
      //     [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      //     [{}, {}, {}, {
      //       "text": "我的表格布局",
      //       "colSpan": 6
      //     }, {
      //       "merged": 1
      //     }, {
      //       "merged": 1
      //     }, {
      //       "merged": 1
      //     }, {
      //       "merged": 1
      //     }, {
      //       "merged": 1
      //     }, {}, {}],
      //     [{}, {
      //       "text": "制表人："
      //     }, {
      //       "text": "王钰博"
      //     }, {}, {}, {}, {}, {}, {}, {}, {}],
      //     [{}, {
      //       "text": "合同名称",
      //       "colSpan": 5
      //     }, {
      //       "merged": 1
      //     }, {
      //       "merged": 1
      //     }, {
      //       "merged": 1
      //     }, {
      //       "merged": 1
      //     }, {
      //       "text": "合同日期"
      //     }, {
      //       "text": "合同金额"
      //     }, {
      //       "text": "签订人"
      //     }, {
      //       "text": "负责人"
      //     }, {
      //       "text": "签订日期"
      //     }],
      //     [{}, {
      //       "text": "1二级欧式的分工啊撒都附件",
      //       "colSpan": 5
      //     }, {
      //       "merged": 1
      //     }, {
      //       "merged": 1
      //     }, {
      //       "merged": 1
      //     }, {
      //       "merged": 1
      //     }, {
      //       "text": "2020-01-01"
      //     }, {
      //       "text": "111111"
      //     }, {
      //       "text": "王钰博"
      //     }, {
      //       "text": "王钰博"
      //     }, {
      //       "text": "2020-01-01"
      //     }],
      //     [{}, {
      //       "text": "阿斯顿发射点发射点发射点发",
      //       "colSpan": 5
      //     }, {
      //       "merged": 1
      //     }, {
      //       "merged": 1
      //     }, {
      //       "merged": 1
      //     }, {
      //       "merged": 1
      //     }, {
      //       "text": "2020-08-11"
      //     }, {
      //       "text": "11111111"
      //     }, {
      //       "text": "王钰博"
      //     }, {
      //       "text": "五笔"
      //     }, {
      //       "text": "2020-02-02"
      //     }]
      //   ]
      // },
      tableOptions: {
        "rowNumber": 5,
        "colNumber": 10,
        "border": true,
        "cells": [
          [{
            "text": "asdfasdf",
            "colSpan": 10
          }, {
            "merged": 1
          }, {
            "merged": 1
          }, {
            "merged": 1
          }, {
            "merged": 1
          }, {
            "merged": 1
          }, {
            "merged": 1
          }, {
            "merged": 1
          }, {
            "merged": 1
          }, {
            "merged": 1
          }],
          [{
            "text": "asdf"
          }, {
            "text": "asdf"
          }, {}, {}, {}, {}, {}, {}, {}, {}],
          [{}, {}, {
            "text": "asdf"
          }, {
            "text": "asdf"
          }, {
            "text": "asdf"
          }, {}, {
            "text": "asdf"
          }, {
            "text": "asdf"
          }, {
            "text": "asdf"
          }, {}],
          [{}, {
            "text": "asdf"
          }, {
            "children": [{
              "value": "el-switch",
              "label": "开关"
            }]
          }, {}, {}, {
            "text": "asdf"
          }, {}, {}, {}, {}],
          [{
            "text": "asdf"
          }, {}, {}, {
            "children": [{
              "value": "el-button",
              "label": "按钮"
            }]
          }, {}, {}, {}, {}, {}, {}]
        ]
      }
    }
  }
}
</script>