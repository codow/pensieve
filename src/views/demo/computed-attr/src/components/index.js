const { tempdir } = require("shelljs");

import A from './a'

const components = [
  A
]

const install = function (vue) {
  if (install.installed) return
  components.forEach(component => vue.component(component.name, component))
}

export default {
  install,
  A
}