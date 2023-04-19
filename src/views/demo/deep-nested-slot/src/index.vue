<template>
  <div>
    <div>测试多层数据嵌套的插槽</div>
    <div>
      <deep-nested-slot-component v-for="(item, index) of items"
                                  v-bind="item"
                                  :key="index">
        <template #chongqing1>
          我是重庆1插槽下面的
        </template>
        <!-- <template #hechuan>
          <span>我是合川下面的</span>
        </template> -->
        <template #qiantang>
          <span>{{qiantangText}}</span>
        </template>
      </deep-nested-slot-component>
    </div>
    <div>
      <el-button type=""
                 @click="changeText">改变文本</el-button>
      <el-button type=""
                 @click="closeChongqingSlot">关闭插槽</el-button>
      <el-button type=""
                 @click="openChongqingSlot">开启插槽</el-button>
      <el-button type=""
                 @click="changeChongqingSlot">修改插槽</el-button>
    </div>
  </div>
</template>

<script>
import DeepNestedSlotComponent from '../components/deep-nested-slot-component.js'

export default {
  name: 'demo-deep-nested-slot',
  components: {
    DeepNestedSlotComponent
  },
  data () {
    return {
      items: [{
        name: '重庆市',
        slotName: 'chongqing',
        children: [{
          name: '合川区',
          slotName: 'hechuan',
          children: [{
            name: '钱塘镇',
            slotName: 'qiantang'
          }]
        }]
      }],
      qiantangText: '我是钱塘镇下属'
    }
  },

  methods: {
    changeText () {
      this.qiantangText = '我是钱塘镇下属的城镇'
    },
    closeChongqingSlot () {
      this.$delete(this.items[0], 'slotName')
    },
    openChongqingSlot () {
      this.$set(this.items[0], 'slotName', 'chongqing')
    },
    changeChongqingSlot () {
      this.items[0].slotName = 'chongqing1'
    }
  }
}
</script>