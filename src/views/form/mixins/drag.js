/**
 * 拖拽相关的功能
 * 
 * @author wangyb
 * @createTime 2022-09-01 10:22:15
 */

import Draggable from "vuedraggable"

export default {
  components: {
    Draggable
  },

  methods: {
    dragSetData (dataTransfer, srcEl) {
      let dragImage = this.designerPage.drag.image
      if (dragImage) {
        dragImage.remove()
      }
      // 创建拖拽样式
      dragImage = document.createElement('div')

      // 数据调整
      dragImage.innerHTML = `<div class="drag-item-title">组件</div>
      <div class="drag-item-line">
        <div class="drag-item-line__dot"></div>
      </div>`
      dragImage.style.position = 'absolute'
      dragImage.style.left = '-10000px'
      dragImage.style.top = '-10000px'
      dragImage.style.display = 'inline'
      dragImage.style.padding = '10px'
      document.body.appendChild(dragImage)
      dataTransfer.setDragImage(dragImage, 0, 0)
      this.designerPage.drag.image = dragImage
    }
  }
}