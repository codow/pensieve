const app = {
  namespaced: true,

  state: {
    apps: {}
  },

  mutations: {
    registApp (state, { name, app }) {
      let newApps = {}
      newApps[name] = app
      state.apps = Object.assign({}, state.apps, newApps)
    },
    setAppOptions (state, { name, options }) {
      let app = state.apps[name] || {}
      app.options = Object.assign({}, app.options, options)
      let newApps = {}
      newApps[name] = app
      state.apps = Object.assign({}, state.apps, newApps)
    }
  },

  getters: {
    getApp: (state) => (name) => state.apps[name],

    getAppOptions: (state) => (name) => (state.apps[name] || {}).options || {},

    getAppOption: (state) => {
      return (name, optionName) => {
        let app = state.apps[name] || {}
        let appOptions = app.options || {}
        return appOptions[optionName]
      }
    }
  }
}

export default app
