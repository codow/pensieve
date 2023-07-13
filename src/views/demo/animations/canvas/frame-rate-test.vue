<template>
  <div class="padding__small">
    <el-form @submit.native.prevent>
      <ul>
        <li>
          <p>测试window.requestAnimationFrame的实际帧率</p>
          <p>
            <el-form-item label="每帧处理时长ms">
              <el-input-number v-model="raf.interval"></el-input-number>
            </el-form-item>
          </p>
          <p>当前帧数：{{ raf.rate }}</p>
        </li>
        <li>
          <p>使用SetTimeout模拟requestAnimationFrame效果</p>
          <p>性能没有requestAnimationFrame好</p>
          <p>
            <el-form-item label="每帧处理时长ms">
              <el-input-number v-model="caf.interval"></el-input-number>
            </el-form-item>
          </p>
          <p>当前帧数：{{ caf.rate }}</p>
        </li>
      </ul>
    </el-form>
  </div>
</template>

<script>
import { round } from 'lodash'

// 睡眠方法
const sleep = function (time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}

const loopCache = {}

const runFrame = function (func) {
  if (func in loopCache) {
    if (loopCache[func] === -2) {
      // 终止
      delete loopCache[func]
      return
    }
    if (loopCache[func] !== -1) {
      setTimeout(() => {
        delete loopCache[func]
        runFrame(func)
      }, loopCache[func])
      // 防止重复触发
      loopCache[func] = -1
    }
    return
  }
  let startTime = performance.now()
  func(startTime)
  let takeTime = performance.now() - startTime
  let offsetTime = Math.max(0, 12 - takeTime)
  loopCache[func] = offsetTime
}

const cancelFrame = function (func) {
  loopCache[func] = -2
}

export default {
  name: 'CanvasFrameRateTest',
  data () {
    return {
      raf: {
        interval: 5,
        rate: 0,
        lastTime: 0
      },
      caf: {
        interval: 5,
        rate: 0,
        lastTime: 0
      }
    }
  },
  mounted () {
    this.initAnimationDemo()
    this.initCustomFrame()
  },
  destroyed () {
    window.cancelAnimationFrame(this.animationLoop)
    cancelFrame(this.customLoop)
  },
  methods: {
    initAnimationDemo () {
      window.requestAnimationFrame(this.animationLoop)
    },
    async animationLoop (currentTime) {
      const { interval, lastTime } = this.raf
      if (lastTime !== 0) {
        // 计算帧率
        this.raf.rate = round(1000 / (currentTime - lastTime), 0)
      }
      this.raf.lastTime = currentTime
      await sleep(interval)
      window.requestAnimationFrame(this.animationLoop)
    },
    initCustomFrame () {
      runFrame(this.customLoop)
    },
    async customLoop (currentTime) {
      const { interval, lastTime } = this.caf
      if (lastTime !== 0) {
        // 计算帧率
        this.caf.rate = round(1000 / (currentTime - lastTime), 0)
      }
      this.caf.lastTime = currentTime
      await sleep(interval)
      runFrame(this.customLoop)
    },
  }
}
</script>