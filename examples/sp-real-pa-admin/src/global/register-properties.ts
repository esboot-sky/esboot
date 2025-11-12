import { App } from 'vue'

function registerGlobalProperties(app: App) {
  app.config.globalProperties.$filters = {
    showStatus(enable: boolean) {
      return enable ? '启用' : '禁用'
    },
  }
}

export default registerGlobalProperties
