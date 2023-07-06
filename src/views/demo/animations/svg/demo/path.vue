<template>
  <div class="padding__small">
    <div class="padding__small">
      path绘制
    </div>
    <div class="padding__small">
      <ul>
        <li>
          <label>官方例子</label>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg"
                 version="1.1"
                 width="500"
                 height="400">
              <path id="lineAB"
                    d="M 100 350 l 150 -300"
                    stroke="red"
                    stroke-width="3"
                    fill="none" />
              <path id="lineBC"
                    d="M 250 50 l 150 300"
                    stroke="red"
                    stroke-width="3"
                    fill="none" />
              <path d="M 175 200 l 150 0"
                    stroke="green"
                    stroke-width="3"
                    fill="none" />
              <path d="M 100 350 q 150 -300 300 0"
                    stroke="blue"
                    stroke-width="5"
                    fill="none" />
              <!-- Mark relevant points -->
              <g stroke="black"
                 stroke-width="3"
                 fill="black">
                <circle id="pointA"
                        cx="100"
                        cy="350"
                        r="3" />
                <circle id="pointB"
                        cx="250"
                        cy="50"
                        r="3" />
                <circle id="pointC"
                        cx="400"
                        cy="350"
                        r="3" />
              </g>
              <!-- Label the points -->
              <g font-size="30"
                 font="sans-serif"
                 fill="black"
                 stroke="none"
                 text-anchor="middle">
                <text x="100"
                      y="350"
                      dx="-30">A</text>
                <text x="250"
                      y="50"
                      dy="-10">B</text>
                <text x="400"
                      y="350"
                      dx="30">C</text>
              </g>
            </svg>
          </div>
        </li>
        <li>
          <label>大小弧和方向示例</label>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg"
                 version="1.1"
                 width="350"
                 height="200">
              <rect width="100%"
                    height="100%"
                    fill="#ffffff"></rect>
              <path d="M 125,75 a100,50 0 0,1 100,50"
                    fill="none"
                    stroke-width="6"
                    :stroke="radianColors[0]"
                    @mouseenter="onMouseenter(0)"
                    @mouseout="onMouseout(0)" />
              <path d="M 125,75 a100,50 0 1,0 100,50"
                    fill="none"
                    stroke-width="6"
                    :stroke="radianColors[1]"
                    @mouseenter="onMouseenter(1)"
                    @mouseout="onMouseout(1)" />
              <path d="M 125,75 a100,50 0 1,1 100,50"
                    fill="none"
                    stroke-width="6"
                    :stroke="radianColors[2]"
                    @mouseenter="onMouseenter(2)"
                    @mouseout="onMouseout(2)" />
              <path d="M 125,75 a100,50 0 0,0 100,50"
                    fill="none"
                    stroke-width="6"
                    :stroke="radianColors[3]"
                    @mouseover="onMouseenter(3)"
                    @mouseout="onMouseout(3)" />
            </svg>
          </div>
        </li>
        <li>
          <label>大小弧度和方向切换示例</label>
          <el-form inline
                   @submit.native.prevent>
            <el-form-item label="大弧度标记">
              <el-switch v-model="largeArcFlag"
                         :inactive-value="0"
                         inactive-text="小弧"
                         :active-value="1"
                         active-text="大弧"></el-switch>
            </el-form-item>
            <el-form-item label="扫描方向">
              <el-switch v-model="sweepFlag"
                         :inactive-value="0"
                         inactive-text="逆时针"
                         :active-value="1"
                         active-text="顺时针"></el-switch>
            </el-form-item>
          </el-form>
          <svg xmlns="http://www.w3.org/2000/svg"
               version="1.1"
               width="400"
               height="400">
            <rect width="100%"
                  height="100%"
                  fill="#ffffff"></rect>
            <path :d="'M 200,100 a 100,100 ' + xAxisRotation + ' ' + largeArcFlag + ',' + sweepFlag + ' 100,100'"
                  fill="none"
                  stroke-width="6"
                  :stroke="radianColors[0]"
                  @mouseenter="onMouseenter(0)"
                  @mouseout="onMouseout(0)" />
            <path :d="'M 300,200 a 100,100 ' + xAxisRotation + ' ' + largeArcFlag + ',' + sweepFlag + ' -100,100'"
                  fill="none"
                  stroke-width="6"
                  :stroke="radianColors[1]"
                  @mouseenter="onMouseenter(1)"
                  @mouseout="onMouseout(1)" />
            <path :d="'M 200,300 a 100,100 ' + xAxisRotation + ' ' + largeArcFlag + ',' + sweepFlag + ' -100,-100'"
                  fill="none"
                  stroke-width="6"
                  :stroke="radianColors[2]"
                  @mouseenter="onMouseenter(2)"
                  @mouseout="onMouseout(2)" />
            <path :d="'M 100,200 a 100,100 ' + xAxisRotation + ' ' + largeArcFlag + ',' + sweepFlag + ' 100,-100'"
                  fill="none"
                  stroke-width="6"
                  :stroke="radianColors[3]"
                  @mouseover="onMouseenter(3)"
                  @mouseout="onMouseout(3)" />
          </svg>
        </li>
        <li>
          <label>x轴旋转示例</label>
          <el-form inline
                   @submit.native.prevent>
            <el-form-item label="x轴旋转角度">
              <el-input-number v-model="xAxisRotation1"
                               placeholder=""></el-input-number>
            </el-form-item>
          </el-form>
          <svg xmlns="http://www.w3.org/2000/svg"
               version="1.1"
               width="600"
               height="400">
            <rect width="100%"
                  height="100%"
                  fill="#ffffff"></rect>

            <path :d="'M 75 75 a 25 50 ' + xAxisRotation1 + ' 0,1 50 0'"
                  fill="none"
                  stroke="red"
                  stroke-width="5"></path>

            <path :d="'M 75 75 a 25 50 ' + xAxisRotation1 + ' 1,0 50 0'"
                  fill="none"
                  stroke="blue"
                  stroke-width="5"></path>

            <path :d="'M 75 75 a 25 50 ' + (xAxisRotation1 + 90) + ' 0,1 50 0'"
                  fill="none"
                  stroke="red"
                  stroke-width="5"></path>

            <path :d="'M 75 75 a 25 50 ' + (xAxisRotation1 + 90) + ' 1,0 50 0'"
                  fill="none"
                  stroke="blue"
                  stroke-width="5"></path>

            <path :d="'M 50 225 a 50 50 ' + xAxisRotation1 + ' 0,1 100 0'"
                  fill="none"
                  stroke="red"
                  stroke-width="5"></path>

            <path :d="'M 50 225 a 50 50 ' + xAxisRotation1 + ' 1,0 100 0'"
                  fill="none"
                  stroke="blue"
                  stroke-width="5"></path>
          </svg>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ColorEnum } from '../encapsulation/ts/constants'
export default {
  name: 'SvgPathDemo',
  data () {
    let colors = [ColorEnum.Success, ColorEnum.Cyan, ColorEnum.Warn, ColorEnum.Danger]
    return {
      colors,
      radianColors: [...colors],
      xAxisRotation: 0,
      xAxisRotation1: -25,
      largeArcFlag: 0,
      sweepFlag: 1,
    }
  },
  methods: {
    onMouseenter (index) {
      let radianColors = []
      for (let i = 0; i < 4; i++) {
        radianColors.push(i === index ? ColorEnum.Primary : ColorEnum.Info)
      }
      this.radianColors = radianColors
    },
    onMouseout (index) {
      this.radianColors = [].concat(this.colors)
    }
  }
}
</script>