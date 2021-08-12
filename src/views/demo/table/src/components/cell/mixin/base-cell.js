/**
 * 单元格基本功能
 * @author wangyubo
 * @createTime 2020-12-28 16:18:32
 */
import draggable from '../../../directives/draggable'

export default {
  directives: {
    draggable
  },

  props: {
    model: {
      type: Object,
      require: true
    },
    rowIndex: {
      type: Number,
      require: true
    },
    colIndex: {
      type: Number,
      require: true
    }
  },

  computed: {
    contentEditable () {
      return this.model && this.model.selected && this.model.editable
    },

    tdClass () {
      // 计算class
      let clazz = {}
      let tempClass = this.model.class
      if (typeof tempClass === 'string') {
        tempClass = tempClass.split(/\s+/)
      }
      if (Object.prototype.toString.call(tempClass) === '[object Array]') {
        tempClass.forEach(item => {
          clazz[item] = true
        })
      } else if (Object.prototype.toString.call(tempClass) === '[object Object]') {
        Object.assign(clazz, tempClass)
      }

      return Object.assign(clazz, {
        'selected': this.model.selected,
        'selected-original': this.model.selectedOriginal,
        [`cell-${this.rowIndex}-${this.colIndex}`]: true
        // 'selected-area-top': this.model.selectedAreaTopSide,
        // 'selected-area-bottom': this.model.selectedAreaBottomSide,
        // 'selected-area-left': this.model.selectedAreaLeftSide,
        // 'selected-area-right': this.model.selectedAreaRightSide
      })
    },

    tdStyle () {
      let style = {}
      let model = this.model
      let tempStyle = this.model.style
      if (typeof tempStyle === 'string') {
        tempStyle = tempStyle.split(/\s*;\s*/)
        tempStyle.forEach(item => {
          item = item.split(/\s*:\s*/)
          if (item[0] && item[1]) {
            style[item[0]] = item[1]
          }
        })
      } else if (tempStyle || Object.prototype.toString.call(tempStyle) === '[object Object]') {
        Object.assign(style, tempStyle)
      }
      // 宽高设置
      if (model.width) {
        style.width = model.width
      }
      if (model.height) {
        style.height = model.height
      }
      return style
    }
  },

  methods: {
    handleCellSelect ($event) {
      // 获取cell对象，设置对象选中状态
      this.$emit('select-cell', this.model, this.rowIndex, this.colIndex, $event)
      if ($event.button !== 2) {
        this.$emit('close-cell-menu', this.model, this.rowIndex, this.colIndex, $event)
      }
    },

    handleCellContSelect ($event) {
      this.$emit('cont-select-cell', this.model, this.rowIndex, this.colIndex, $event)
    },

    handleCellMenuOpen ($event) {
      this.$emit('open-cell-menu', this.model, this.rowIndex, this.colIndex, $event)
    },

    handleCellDblclick ($event) {
      if (!this.model.children || !this.model.children.length) {
        this.model.editable = true
        this.focus()
      }
      this.$emit('cell-dbl-click', this.model, this.rowIndex, this.colIndex, $event)
    },

    /**
     * 设置当前单元格为焦点
     */
    focus () {
      this.$nextTick(() => {
        this.$refs.td.focus()
      })
    }
  }
}