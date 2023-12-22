<template>
  <div class="padding__medium">
    <div style="display: table; table-layout: fixed; width: 100%;">
      <div class="padding__medium"
           style="display: table-cell;vertical-align: middle; text-align: right; width: 0px;position: relative;">
        <el-button :icon="lock ? 'el-icon-lock' : 'el-icon-unlock'"
                   type="text"
                   class="lock-btn"
                   @click="toggleLock">
        </el-button>
        <div class="lock-range-border"></div>
      </div>
      <div style="display: table-cell;">
        <el-form :model="colorForm"
                 label-position="right"
                 label-width="120px">
          <el-form-item label="红">
            <el-input v-model="colorForm.red"
                      placeholder="0~255"></el-input>
          </el-form-item>
          <el-form-item label="绿">
            <el-input v-model="colorForm.green"
                      placeholder="0~255"></el-input>
          </el-form-item>
          <el-form-item label="蓝">
            <el-input v-model="colorForm.blue"
                      placeholder="0~255"></el-input>
          </el-form-item>
          <el-form-item label="透明度">
            <el-input v-model="colorForm.opacity"
                      placeholder="0~1"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary"
                       @click="calcCssColorExpression">计算CSS颜色表达式</el-button>
          </el-form-item>
          <el-form-item label="CSS颜色表达式">
            <el-input v-model="cssColorExpression"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary">计算颜色值</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="display: table-cell;vertical-align: middle;text-align: center; width: 300px;">
        <div style="display: inline-block; width: 280px; height: 280px;"
             :style="{ background: cssColorExpression }"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { fillStr } from '../../../utils/packages/string'

export default {
  name: 'ColorEditor',

  data() {
    return {
      lock: true,
      cssColorExpression: '#000000',
      colorForm: {
        red: '',
        green: '',
        blue: '',
        opacity: ''
      }
    }
  },

  watch: {
    colorForm: {
      handler() {
        this.lock && this.calcCssColorExpression()
      },
      deep: true
    },
    cssColorExpression: {
      handler() {
        this.lock && this.calcCssColorValue()
      }
    }
  },

  methods: {
    toggleLock() {
      this.lock = !this.lock
      if (this.lock) {
        this.calcCssColorExpression()
      }
    },
    calcCssColorExpression() {
      // 取红绿蓝和透明度
      let red = Math.min(+this.colorForm.red, 255)
      let green = Math.min(+this.colorForm.green, 255)
      let blue = Math.min(+this.colorForm.blue, 255)
      let opacity = Math.min(+this.colorForm.opacity, 1)
      //
      if (!isFinite(red) || !isFinite(green) || !isFinite(blue)) {
        this.cssColorExpression = ''
        return
      }
      if (opacity > 0) {
        this.cssColorExpression = `rgba(${red}, ${green}, ${blue}, ${opacity})`
      } else {
        red = fillStr(Number(red).toString(16), 2, '0')
        green = fillStr(Number(green).toString(16), 2, '0')
        blue = fillStr(Number(blue).toString(16), 2, '0')
        this.cssColorExpression = `#${red}${green}${blue}`
      }
    },
    calcCssColorValue() {
      return
    }
  }
}
</script>