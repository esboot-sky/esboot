import { App } from 'vue'
import registerElIcon from './register-el-icon'
import registerProperties from './register-properties'
import registerI18n from './register-i18n'
import registerDirective from './register-directive'
import SvgIcon from '@/components/svg-icon/svg-icon.vue'

export default (app: App): void => {
  registerElIcon(app)
  registerI18n(app)
  registerProperties(app)
  registerDirective(app)

  // 注册SvgIcon
  app.component('SvgIcon', SvgIcon)
}
