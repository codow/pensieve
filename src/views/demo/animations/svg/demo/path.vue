<template>
  <div class="padding__small">
    <div class="padding__small">
      path绘制
    </div>
    <div class="padding__small">
      <ul>
        <li>
          <label>大小弧示例</label>
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
      </ul>
      <svg xmlns="http://www.w3.org/2000/svg"
           version="1.1"
           width="1000"
           height="1000">

        <path d="M600,350 l 50,-25 
           a25,25 -30 0,1 50,-25 l 50,-25 
           a25,50 -30 0,1 50,-25 l 50,-25 
           a25,75 -30 0,1 50,-25 l 50,-25 
           a25,100 -30 0,1 50,-25 l 50,-25"
              fill="none"
              stroke="red"
              stroke-width="5" />
      </svg>
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
      radianColors: [...colors]
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