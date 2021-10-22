<template>
  <div ref="wrap" class="axis-wrap" :style="wrapStyle" v-loading="loading">
    <div class="axis-x">
      <div v-for="xp in xPoints" :key="xp">
        <!-- 是否需要隐藏坐标 -->
        <template v-if="xp % 10 === 0">{{xp}}</template>
      </div>
    </div>
    <div class="axis-y">
      <div v-for="yp in yPoints" :key="yp">
        <!-- 是否需要隐藏坐标 -->
        <template v-if="yp % 10 === 0">{{yp}}</template>
      </div>
    </div>
    <div class="axis-content-wrap" @scroll="handleContentWrapScroll">
      <div class="axis-content">
        <slot></slot>
      </div>
    </div>
    <div class="axis-"></div>
  </div>
</template>

<script>
export default {
  name: 'fr-axis-area',
  props: {
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 600
    },
    // 精度
    precision: {
      type: Number,
      default: 20
    }
  },
  data () {
    return {
      loading: true,
      wrapWidth: this.width || window.innerWidth,
      wrapHeight: this.height || window.innerHeight,
      scrollLeft: 0,
      scrollTop: 0,
      scale: 1
    }
  },
  computed: {
    actScale () {
      // 计算缩放
      let scale = +this.scale
      if (isNaN(scale)) {
        scale = 1
      }
      return scale
    },
    // 实际精度
    actPrecision () {
      let axisPrecision = +this.precision
      // 根据缩放计算基本数
      axisPrecision = (axisPrecision / this.actScale)
      if (axisPrecision > 10) {
        axisPrecision = Math.floor(axisPrecision / 10) * 10
      } else {
        axisPrecision = Math.floor(axisPrecision / 2) * 2
      }
      return axisPrecision
    },
    actBase () {
      let base = 10
      let axisPrecision = +this.axisPrecision
      if (axisPrecision > 0) {
        base = axisPrecision / 2
      }
      return base
    },
    xAxisWidth () {
      let scale = Math.min(this.actScale, 1)
      // 根据缩放比例计算最大值
      let width = Math.max(this.actCanvasWidth * this.actScale, this.actWidth) + 20 * (this.actScale + 1)
      return width / scale
    },
    yAxisHeight () {
      let scale = Math.min(this.actScale, 1)
      // 根据缩放比例计算最大值
      let height = Math.max(this.actCanvasHeight * this.actScale, this.actHeight) + 20 * (this.actScale + 2)
      height = Math.max(height, 10000)
      return height / scale
    },
    wrapStyle () {
      return []
    },
    // x坐标开始节点
    xPoints () {
      let points = []
      let base = this.actBase
      // 改变计算方式，采用先计算需要多少刻度，然后计算数组
      let maxLength = Math.ceil(this.xAxisWidth / base)
      for (let i = 0; i < maxLength; i++) {
        points.push(i * base + this.startX)
      }
      return points
    },
    // y坐标开始节点
    yPoints () {
      let points = []
      let base = this.actAxisBase
      // 改变计算方式，采用先计算需要多少刻度，然后计算数组
      let maxLength = Math.ceil(this.yAxisHeight / base)
      for (let i = 0; i < maxLength; i++) {
        points.push(i * base + this.startY)
      }
      return points
    },
    // x轴的样式，包括偏移量等
    xAxisStyle () {
      return {}
    },
    // 增加滚动，包括偏移量等
    yAxisStyle () {
      return {}
    }
  },
  mounted () {
    // 完成信息初始化
    this.initWrap()
  },
  methods: {
    initWrap () {
      const { wrap } = this.$refs
      this.wrapWidth = wrap.offsetWidth
      this.wrapHeight = wrap.offsetHeight
    },
    handleContentWrapScroll ($evt) {
      // 获取滚动信息
      const target = $event.target
      // 获取滚动
      this.scrollLeft = target.scrollLeft
      this.scrollTop = target.scrollTop
      console.log('content scroll', this.scrollLeft, this.scrollTop)
    }
  }
}
</script>
