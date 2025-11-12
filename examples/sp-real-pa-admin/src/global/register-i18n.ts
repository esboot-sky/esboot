import { App } from 'vue'
import { createI18n } from 'vue-i18n'
import cn from '@/language/zh-cn.json'
import hk from '@/language/zh-hk.json'

const messages = {
  hk,
  cn,
}

export const i18n: any = createI18n({
  globalInjection: true,
  legacy: false,
  messages,
})

export default function registerI18n(app: App) {
  i18n.global.locale.value = localStorage.getItem('lang') || 'cn'

  app.use(i18n)
}
