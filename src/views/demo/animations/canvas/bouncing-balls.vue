<template>
  <div class="padding__small">
    <p>官方示例--碰撞小球</p>
    <canvas ref="canvas"
            width="1000"
            height="600"></canvas>
  </div>
</template>

<script>
export default {
  name: 'CanvasDemoBouncingBall',
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

      // function to generate random number
      function random (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
      }

      // function to generate random RGB color value

      function randomRGB () {
        return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`
      }

      class Ball {

        constructor(x, y, velX, velY, color, size) {
          this.x = x
          this.y = y
          this.velX = velX
          this.velY = velY
          this.color = color
          this.size = size
        }

        draw () {
          ctx.beginPath()
          ctx.fillStyle = this.color
          ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
          ctx.fill()
        }

        update () {
          if ((this.x + this.size) >= width) {
            this.velX = -(Math.abs(this.velX))
          }

          if ((this.x - this.size) <= 0) {
            this.velX = Math.abs(this.velX)
          }

          if ((this.y + this.size) >= height) {
            this.velY = -(Math.abs(this.velY))
          }

          if ((this.y - this.size) <= 0) {
            this.velY = Math.abs(this.velY)
          }

          this.x += this.velX
          this.y += this.velY
        }

        collisionDetect () {
          for (const ball of balls) {
            if (!(this === ball)) {
              const dx = this.x - ball.x
              const dy = this.y - ball.y
              const distance = Math.sqrt(dx * dx + dy * dy)

              if (distance < this.size + ball.size) {
                ball.color = this.color = randomRGB()
              }
            }
          }
        }
      }

      const balls = []

      while (balls.length < 25) {
        const size = random(10, 20)
        const ball = new Ball(
          // ball position always drawn at least one ball width
          // away from the edge of the canvas, to avoid drawing errors
          random(0 + size, width - size),
          random(0 + size, height - size),
          random(-7, 7),
          random(-7, 7),
          randomRGB(),
          size
        )

        balls.push(ball)
      }
      this.balls = balls


      this.loop()
    },
    loop () {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
      this.ctx.fillRect(0, 0, this.width, this.height)

      for (const ball of this.balls) {
        ball.draw()
        ball.update()
        ball.collisionDetect()
      }

      requestAnimationFrame(this.loop)
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    cancelAnimationFrame(this.loop)
  }
}
</script>