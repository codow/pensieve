<template>
  <div class="designer-outline-wrapper">
    <div class="designer-outline">
      <outline-item v-if="!refreshing"
                    :define="define"></outline-item>
    </div>
  </div>
</template>

<style>
.designer-outline-wrapper {
  height: 100%;
  overflow: auto;
}

.designer-outline {
  /* padding: 5px; */
}

.designer-outline-item {
  background: #ffffff;
  /* border: 1px dashed #afafaf; */
  padding: 5px;
}

.designer-outline-item__header {
}

.designer-outline-item__body {
  padding-left: 20px;
}

.designer-outline + .designer-outline {
  margin-top: 5px;
}

.drag-item__ghost {
  position: absolute;
  height: 2px !important;
  padding: 0px !important;
  line-height: 0px !important;
  display: inline !important;
}

.drag-from-container .drag-item-line {
  display: none;
}

.drag-to-container > .drag-item__ghost > * {
  display: none;
}

.drag-to-container > .drag-item__ghost > .drag-item-line {
  display: block;
}

.drag-item-line {
  height: 2px;
  position: relative;
  line-height: 0px;
  padding-left: 8px;
  background-color: #409eff;
}

.drag-item-line__dot {
  position: absolute;
  height: 4px;
  width: 4px;
  border-radius: 50%;
  border: 2px solid #409eff;
  background: #ffffff;
  top: -3px;
  left: -8px;
}
</style>

<script>
import OutlineItem from './outline-item.vue'

export default {
  name: 'form-designer-outline',

  inject: ['designerPage'],

  components: {
    OutlineItem
  },

  props: {
    define: Object
  },

  data () {
    return {
      refreshing: false
    }
  },

  methods: {
    refresh () {
      this.refreshing = true
      this.$nextTick(() => {
        this.refreshing = false
      })
    }
  }
}
</script>