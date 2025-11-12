import { App } from 'vue'
import * as ElIconModules from '@element-plus/icons-vue'
import iconUtil from '@/utils/icon'

export const elIconNames = Object.keys(ElIconModules)

interface IElIcon<T> {
  [key: string]: T
}

function registerElIcon(app: App) {
  // 统一注册el-icon图标
  elIconNames?.forEach((name) => {
    app.component(iconUtil.transElIconName(name), (ElIconModules as IElIcon<object>)[name])
  })
}

export default registerElIcon
