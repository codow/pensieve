import DemoCContainer from './src'

DemoCContainer.install = function (vue) {
  if (DemoCContainer.install.installed) return
  vue.component(DemoCContainer.name, DemoCContainer)
}

export default DemoCContainer
