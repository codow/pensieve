<template>
  <div class="padding__small">
    <p>官方示例--向右行走</p>
    <canvas ref="canvas"
            width="1000"
            height="600"></canvas>
  </div>
</template>

<script>
import WalkRightImage from '@/assets/images/walk-right.png'

export default {
  name: 'CanvasDemoWalkRight',
  data () {
    return {}
  },
  methods: {
    init () {
      // set up canvas
      const { canvas } = this.$refs
      const ctx = canvas.getContext('2d')
      this.ctx = ctx

      const width = canvas.width
      const height = canvas.height
      this.width = width
      this.height = height

      this.sprite = 0
      this.posX = 0

      ctx.translate(width / 2, height / 2)

      const image = new Image()
      image.src = WalkRightImage
      image.onload = this.draw
      this.image = image
    },
    draw () {
      let { width, height, ctx, image, sprite, posX } = this
      ctx.fillRect(-(width / 2), -(height / 2), width, height)

      ctx.drawImage(image, (sprite * 102), 0, 102, 148, 0 + posX, -74, 102, 148)

      if (posX % 13 === 0) {
        if (sprite === 5) {
          sprite = 0
        } else {
          sprite++
        }
      }

      if (posX > width / 2) {
        let newStartPos = -((width / 2) + 102)
        posX = Math.ceil(newStartPos / 13) * 13
        console.log(posX)
      } else {
        posX += 2
      }
      this.sprite = sprite
      this.posX = posX

      requestAnimationFrame(this.draw)
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    cancelAnimationFrame(this.draw)
  }
}
</script>