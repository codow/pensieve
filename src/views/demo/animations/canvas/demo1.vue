<template>
  <div class="padding__small">
    <ul>
      <li>
        <p>绘制三角形的动画</p>
        <canvas ref="canvas1"
                width="1000"
                height="600"></canvas>
      </li>
    </ul>
  </div>
</template>

<script>

function degToRad (degrees) {
  return degrees * Math.PI / 180
};

function rand (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + (min)
}

export default {
  name: 'CanvasDemo01',
  methods: {
    initCanvas1 () {
      const { canvas1 } = this.$refs
      // 获取宽高
      let width = +canvas1.getAttribute('width') || 300
      let height = +canvas1.getAttribute('height') || 240
      // 获取上下文
      const ctx = canvas1.getContext('2d')
      // 填充颜色
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.fillRect(0, 0, width, height)

      // 移动画布原点到中心位置
      ctx.translate(width / 2, height / 2)

      let length = 250
      let moveOffset = 20

      let drawTriangle = function () {
        ctx.fillStyle = 'rgba(' + (255 - length) + ', 0, ' + (255 - length) + ', 0.9)'
        ctx.beginPath()
        ctx.moveTo(moveOffset, moveOffset)
        ctx.lineTo(moveOffset + length, moveOffset)
        let nextH = length / 2 // rand(length / 4, length / 2)
        let triHeight = nextH * Math.tan(degToRad(60))
        ctx.lineTo(moveOffset + nextH, moveOffset + triHeight)
        ctx.lineTo(moveOffset, moveOffset)
        ctx.fill()

        length--
        moveOffset += 0.7
        ctx.rotate(degToRad(5))
      }

      let drawRect = function () {
        ctx.fillStyle = 'rgba(' + (255 - length) + ', 0, ' + (255 - length) + ', 0.9)'
        ctx.fillRect(0, 0, 200, 120)

        length--
        moveOffset += 0.7
        ctx.rotate(degToRad(5))
      }
      let timer
      timer = setInterval(function () {
        if (length < 0) {
          clearInterval(timer)
          return
        }
        // drawTriangle()
        drawRect()
      }, 1000 / 60)
    }
  },
  mounted () {
    this.initCanvas1()
  }
}
</script>