<template>
  <div class="fr-page__container">
    <div class="fr-page__header"
         style="background-color: #662211;">
      我是头部
    </div>
    <div class="fr-page__main">
      <div class="fr-page__aside"
           style="background-color: #226611;">
        我是边框
      </div>
      <div class="fr-page__main"
           style="overflow: auto;">
        <div>
          <el-table ref="table"
                    :data="list"
                    row-key="id"
                    :size="size"
                    border
                    stripe
                    default-expand-all
                    :span-method="calcSpanMethod">
            <el-table-column label="#"
                             type="index"
                             width="60px"
                             align="center"></el-table-column>
            <el-table-column label="层级"
                             width="200px"
                             header-align="center">
              <template #default="{row}">
                第
                <template v-if="row.parent">
                  {{row.parent.level + 1}}
                </template>
                <template v-else>
                  1
                </template>
                级
              </template>
            </el-table-column>
            <el-table-column label="关联"
                             prop="relation"
                             width="60px"
                             align="center">
              <template #default="{row, column}">
                <el-button v-if="row.relation"
                           type="text"
                           :size="size"
                           @click="handleRelationChange(row)">{{row[column.property]}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="字段名"
                             prop="field">
              <template #default="{row, column}">
                <template v-if="row.type === 'group'">
                  {{row[column.property]}}
                </template>
                <el-input v-else
                          v-model="row[column.property]"
                          :size="size"
                          @change="handleFieldChange(row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="比较符"
                             prop="operator">
              <template #default="{row, column}">
                <el-input v-if="row.type !== 'group'"
                          v-model="row[column.property]"
                          :size="size"
                          @change="handleOperatorChange(row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="值"
                             prop="value">
              <template #default="{row, column}">
                <el-input v-if="row.type !== 'group'"
                          :size="size"
                          v-model="row[column.property]"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="170px">
              <template #header>
                <el-button type="text"
                           icon="el-icon-plus"
                           title="增加条件"
                           :size="size"
                           @click="insertCondition"></el-button>
                <el-button type="text"
                           title="增加括号"
                           icon="sp-icon-group-plus"
                           :size="size"
                           @click="insertCondition('group')"></el-button>
              </template>
              <template #default="{row, column, $index}">
                <el-button type="text"
                           icon="el-icon-minus"
                           title="删除条件"
                           :size="size"
                           @click="deleteCondition(row)"></el-button>
                <el-button type="text"
                           icon="el-icon-plus"
                           title="增加条件"
                           :size="size"
                           @click="insertCondition('item', row)"></el-button>
                <el-button type="text"
                           title="增加括号"
                           icon="sp-icon-group-plus"
                           :size="size"
                           @click="insertCondition('group', row)"></el-button>
                <el-button type="text"
                           title="上移"
                           icon="el-icon-sort-up"
                           :size="size"
                           @click="upCondition(row)"></el-button>
                <el-button type="text"
                           title="下移"
                           icon="el-icon-sort-down"
                           :size="size"
                           @click="downCondition(row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="fr-copyright">
          我是版权信息
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.fr-page__container {
  height: 100%;
}
.fr-page__header {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 48px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
}

.fr-page__main {
  overflow: auto;
}

.fr-page__container > .fr-page__main {
  height: calc(100% - 50px);
  padding-top: 50px;
}

.fr-page__header + .fr-page__main {
  padding-top: 50px;
}

.fr-page__aside {
  width: 280px;
  padding: 0 10px;
  float: left;
}

.fr-page__main > .fr-page__aside {
  height: 100%;
}

.fr-page__main > .fr-page__main {
  height: 100%;
}

.fr-page__aside + .fr-page__main {
  margin-left: 300px;
  width: auto;
}

.fr-copyright {
  width: 100%;
  height: 40px;
  line-height: 20px;
  padding: 10px 0;
  text-align: center;
}

.sp-icon-group-plus {
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  position: relative;
  top: -1px;
}

.sp-icon-group-plus::before {
  content: "()";
  position: relative;
  top: -1px;
}
.sp-icon-group-plus::after {
  content: "+";
}
</style>

<script>
import utils from '../utils'

export default {
  name: 'home',
  data () {
    return {
      list: [{ "id": "2FFB1D0D0BA64325821DAE6D40725036", "type": { "isTrusted": true }, "relation": null, "operator": "=", "field": "ccc" }, { "id": "B96243ABC9064D54AA63D9E9497C30A5", "type": "group", "relation": "AND", "children": [{ "id": "3B66ED50C23F42B29C30186DCB68E10A", "type": "item", "relation": null, "operator": "=", "field": "aaa" }, { "id": "63A68A7D0A634BE1BF2827DFD63A8CD1", "type": "group", "relation": "AND", "children": [{ "id": "6476AF24ABDA4A4C917887C081A5C0B4", "type": "item", "relation": null, "operator": "=", "field": "zzz" }, { "id": "6A2CAA5BD4FD4635BA81C699080A6BF0", "type": "item", "relation": "AND", "operator": "=", "field": "ddd" }, { "id": "108555AB9FD84319A1280589EF2E915E", "type": "item", "relation": "AND", "operator": "=", "field": "xxx" }], "operator": null, "field": "( zzz = ? AND ddd = ? AND xxx = ?)", "level": 2 }, { "id": "F00694C2B35242EABFEBB402C9B314BE", "type": "item", "relation": "AND", "operator": "=", "field": "bbb" }], "operator": null, "field": "( aaa = ? AND ( zzz = ? AND ddd = ? AND xxx = ?) AND bbb = ?)", "level": 1 }],
      size: 'mini',
      fields: [],
      operators: []
    }
  },
  methods: {
    insertCondition (type, row) {
      type = type || 'item'
      let item = {
        id: utils.string.uuid(),
        type: type,
        relation: null
      }
      if (type === 'group') {
        let subItem = {
          id: utils.string.uuid(),
          type: 'item',
          relation: null,
          operator: '='
        }
        utils.object.defineProperty(subItem, 'parent', item, {
          enumerable: false,
          writable: false
        })
        item.children = [subItem]
        item.operator = null
        item.field = '()'
      } else {
        item.operator = '='
      }
      let list = this.list
      if (row && row.type === 'group') {
        list = row.children
        utils.object.defineProperty(item, 'parent', row, {
          enumerable: false,
          writable: false
        })
      } else if (row && row.parent) {
        list = row.parent.children
        utils.object.defineProperty(item, 'parent', row.parent, {
          enumerable: false,
          writable: false
        })
      }
      if (item.type === 'group') {
        item.level = item.parent ? item.parent.level + 1 : 1
      }
      // 确定插入位置
      let index = list.indexOf(row)
      if (index >= 0) {
        index += 1
        item.relation = 'AND'
      } else if (list.length > 0) {
        index = 0
        list[0].relation = 'AND'
      }
      // 
      list.splice(index, 0, item)
    },

    deleteCondition (row) {
      let list = this.getList(row)
      let index = list.indexOf(row)
      list.splice(index, 1)
      // 更新
      if (list[0]) {
        list[0].relation = null
      }
      this.calcParentField(row)
    },

    upCondition (row) {
      let list = this.getList(row)
      let index = list.indexOf(row)
      if (index <= 0) {
        return
      }
      // 交换顺序
      list.splice(index, 1)
      list.splice(index - 1, 0, row)
      // 修改
      if (index === 1) {
        list[1].relation = row.relation || 'AND'
        row.relation = null
      }
      this.calcParentField(row)
    },

    downCondition (row) {
      let list = this.getList(row)
      let index = list.indexOf(row)
      if (index === list.length) {
        return
      }
      // 交换顺序
      list.splice(index, 1)
      list.splice(index + 1, 0, row)
      if (index === 0) {
        row.relation = list[0].relation || 'AND'
        list[0].relation = null
      }
      this.calcParentField(row)
    },

    getList (row) {
      let list = this.list
      let parent = row && row.parent
      if (parent) {
        list = parent.children
      }
      return list
    },

    calcSpanMethod ({ row, column, rowIndex, columnIndex }) {
      // 计算
      if (row.type === 'group') {
        if (column.property === 'field') {
          return [1, 3]
        } else if (columnIndex === 6) {
          return [1, 1]
        } else if (columnIndex > 2) {
          return [0, 0]
        }
      } else {
        return [1, 1]
      }
    },

    calcParentField (row) {
      if (row.parent) {
        this.calcGroupField(row.parent)
      }
    },

    calcGroupField (row) {
      // 根据下级节点的字段和条件
      let field = '('
      let list = row.children
      list.forEach(item => {
        if (item.field) {
          if (item.relation) {
            field += ' ' + item.relation
          }
          field += ' ' + item.field
          if (item.operator) {
            field += ' ' + item.operator
            field += ' ?'
          }
        }
      })
      field += ')'
      row.field = field
      if (row.parent) {
        this.calcGroupField(row.parent)
      }
    },

    handleRelationChange (row) {
      row.relation = row.relation === 'AND' ? 'OR' : 'AND'
      this.calcParentField(row)
    },

    handleFieldChange (row) {
      this.calcParentField(row)
    },

    handleOperatorChange (row) {
      this.calcParentField(row)
    }
  }
}
</script>