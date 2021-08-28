<template>
  <div class="padding__small">
    <div>测试封装组件的基本套路</div>
    <div>
      <div>测试基本组件的封装</div>
      <div>{{text}}</div>
      <div>
        <form-comp component-name="el-input"
                   :component-value="text"></form-comp>
      </div>
    </div>
    <div>
      <div>测试容器样式</div>
      <div>
        <label>高度控制</label>
        <el-input v-model="height">
        </el-input>
      </div>
      <div style="height: 400px; background: red;"
           class="padding__medium">
        <span ref="spanContainer"
              style="display: block;">
          <div ref="divContent"
               style="background: green;"
               :style="{height: height}"></div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import ResizeObserver from 'resize-observer-polyfill'

import FormComp from '../components/form-comp'

export default {
  name: 'demo-c-container',
  components: {
    FormComp
  },
  data () {
    return {
      text: '',
      height: '100%'
    }
  },
  created () {
    this.ro = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        const { left, top, width, height } = entry.contentRect

        console.log('Element:', entry.target)
        console.log(`Element's size: ${width}px x ${height}px`)
        console.log(`Element's paddings: ${top}px ; ${left}px`)
      }
    })
    window.ro = this.ro
  },
  mounted () {
    const { spanContainer, divContent } = this.$refs
    console.log('spanContainer', spanContainer, 'divContent', divContent)
    this.ro.observe(spanContainer)
    // this.ro.observe(divContent)
  },
  destroyed () {
    this.ro.disconnect()
    this.ro = null
    console.log('hahahaha')
  }
}
</script>
