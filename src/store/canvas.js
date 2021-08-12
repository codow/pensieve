import _debounce from 'lodash/debounce'

const Canvas = {
  state: {
    screen: {
      height: 0,
      width: 0,
      listener: null
    }
  },

  mutations: {
    initScreen (state) {
      // 如果监听方法已存在，则先取消监听
      if (state.screen.listener) window.removeEventListener('resize', state.screen.listener)
      // 初始化屏幕宽高
      state.screen.height = document.documentElement.clientHeight
      state.screen.width = document.documentElement.clientWidth
      // 包装去抖方法
      state.screen.listener = _debounce(function () {
        state.screen.height = document.documentElement.clientHeight
        state.screen.width = document.documentElement.clientWidth
      }, 10)
      // 监听屏幕高度事件
      window.addEventListener('resize', state.screen.listener, false)
    },
    setScreenHeight (state, height) {
      state.screen.height = isFinite(height) ? height : 0
    },
    setScreenWidth (state, width) {
      state.screen.width = isFinite(width) ? width : 0
    }
  }
}

export default Canvas
