import { App } from 'vue'
import store from '@/store'

export default function registerDirective(app: App) {
  // 注册一个全局自定义指令 `v-permission`
  app.directive('permission', {
    mounted(el, binding) {
      const rule = binding.value
      if (store.state.permissions[rule]) {
        return
      }

      if (binding.arg === 'disabled') {
        // 标签禁止点击
        el.style.pointerEvents = 'none'
        return
      }

      // 删除节点
      el.remove()
    },
  })

  app.directive('debounce', (el, binding) => {
    let timer: any
    if (binding.oldValue) {
      el.addEventListener('click', () => {
        if (!timer) {
          binding.value()
        }
        timer = setTimeout(() => {
          clearTimeout(timer)
          timer = null
        }, 3000)
      })
    }
  })
}
