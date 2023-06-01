<template>
  <svg version="1.1"
       xmlns="http://www.w3.org/2000/svg"
       :width="width"
       :height="height"
       draggable
       @dragstart="onDragstart"
       @click="onClick">
    <rect width="100%"
          height="100%"
          :fill="fill"
          :stroke-width="borderWidth"
          :stroke="borderColor"></rect>
    <svg version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         width="20"
         height="20"
         :x="width - 30"
         :y="10"
         @click="onClose">
      <rect width="100%"
            height="100%"
            fill="transparent"></rect>
      <line :x1="0"
            :y1="0"
            :x2="20"
            :y2="20"
            stroke-width="2"
            stroke="#ffffff"></line>
      <line :x1="20"
            :y1="0"
            :x2="0"
            :y2="20"
            stroke-width="2"
            stroke="#ffffff"></line>
    </svg>
  </svg>
</template>

<script>
export default {
  name: 'VueSvgRect',
  props: {
    width: { type: Number, default: 200 },
    height: { type: Number, default: 200 },
    fill: { type: String, default: 'red' },
    borderWidth: { type: Number, default: 2 },
    borderColor: { type: String, default: 'green' },
  },
  methods: {
    onDragstart (e) {
      console.log('拖拽开始', e)
    },
    onClick (e) {
      console.log('点击图形', e)
    },
    onClose (e) {
      e.stopPropagation()
      console.log('e', e)
      console.log('删除图形', e)
    }
  }
}
</script>