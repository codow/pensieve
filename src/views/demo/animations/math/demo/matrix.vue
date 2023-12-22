<template>
  <div class="padding__small">
    <ul>
      <li>
        <p>绘制一个矩阵</p>
        <canvas ref="canvas1"
                width="1000"
                height="600"></canvas>
      </li>
    </ul>
  </div>
</template>

<script>
function degToRad(degrees) {
  return (degrees * Math.PI) / 180
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default {
  name: 'EmMathMatrixDemo01',
  methods: {
    initCanvas1() {
      const { canvas1 } = this.$refs
      // 获取宽高
      let width = +canvas1.getAttribute('width') || 300
      let height = +canvas1.getAttribute('height') || 240
      // 获取上下文
      const ctx = canvas1.getContext('2d')
      // 填充颜色
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, width, height)
      // 绘制一个矩阵
      let m = 5 // 矩阵的行数
      let n = 10 // 矩阵的列数
      let bgColor = '#ffffff66' // 矩阵背景色
      let cellOptions = {
        width: 64, // 单元格宽度
        height: 64, // 单元格高度
        padding: 2, // 单元格内部填充
        margin: 2, // 单元格外部间距
        bgColor: 'rgba(255,255,255,1)' // 矩阵单元格背景色
      }
      // 矩阵数据
      let data = []
      // 填充一个随机数矩阵
      for (let i = 0; i < m; i++) {
        let row = []
        for (let j = 0; j < n; j++) {
          row.push(`a${i}${j}`)
        }
        data.push(row)
      }

      let drawMatrix = function () {
        // 计算总宽度，总高度
        let mWidth = n * (cellOptions.width + 2 * cellOptions.margin)
        let mHeight = m * (cellOptions.height + 2 * cellOptions.margin)
        // 移动画布原点到中心位置
        let originX = width / 2 - mWidth / 2
        let originY = height / 2 - mHeight / 2
        ctx.translate(originX, originY)
        // 绘制大括号
        ctx.fillStyle = '#333333'
        ctx.font = mHeight + 'px serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        let { width: braceWidth } = ctx.measureText('{')
        ctx.fillText('{', -braceWidth / 2, 0)
        // 绘制矩阵的整个框架
        ctx.fillStyle = bgColor
        ctx.fillRect(-braceWidth / 2, 0, mWidth + braceWidth, mHeight)
        //
        // 绘制矩阵单元格
        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {
            let offsetX =
              j * (cellOptions.width + 2 * cellOptions.margin) +
              cellOptions.margin
            let offsetY =
              i * (cellOptions.height + 2 * cellOptions.margin) +
              cellOptions.margin
            ctx.translate(offsetX, offsetY)
            ctx.fillStyle = cellOptions.bgColor
            ctx.fillRect(0, 0, cellOptions.width, cellOptions.height)
            // 绘制文本
            ctx.fillStyle = '#333333'
            ctx.font = '24px serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(
              data[i][j],
              cellOptions.width / 2,
              cellOptions.height / 2
            )
            // 画笔归位
            ctx.translate(-offsetX, -offsetY)
          }
        }
        // 绘制大括号
        ctx.fillStyle = '#333333'
        ctx.font = mHeight + 'px serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillText('}', mWidth + braceWidth / 2, 0)
      }

      drawMatrix()
    }
  },
  mounted() {
    this.initCanvas1()
  }
}
</script>