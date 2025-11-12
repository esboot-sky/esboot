import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import store from './store/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import routes from './router/constant-route'
import registerApp from './global'
import { getDefaultModulePath } from '@/utils/common'
import 'normalize.css'
import '@/assets/css/index.scss'

let router: any = null
let instance: any = null
let history: any = null
function render(props = {}) {
  const { container, routerBase, getCurrentGlobalState, setGlobalState } = props as any

  if (window.__POWERED_BY_QIANKUN__) {
    const mainAppState = getCurrentGlobalState()
    store.commit('setToken', mainAppState?.token)
    store.commit('setMenu', mainAppState?.currentModule?.menu)
    store.commit('setPermissions', mainAppState?.currentModule?.permission)
    store.commit('setLanguage', mainAppState?.language)
    store.commit('setLanguageList', mainAppState?.languageList)
    store.commit('setHadDynamicRoute', false)
  }

  history = createWebHashHistory(
    window.__POWERED_BY_QIANKUN__ ? routerBase : window.APP_CONFIG.PUBLIC_PATH
  )

  router = createRouter({
    history,
    routes: routes,
  })

  // 设置白名单, 未登录可访问，前提条件是路由在constant-route.ts配置过，不适合动态挂载路由
  const whiteList = ['/login']
  router.beforeEach(
    async (to: Record<string, any>, from: Record<string, any>, next: (...args: any[]) => any) => {
      if (store.state.token) {
        if (to.path === '/login') {
          const redirect = to.query.redirect as string
          if (redirect) {
            return next(redirect)
          }

          const defaultPath =
            store.state.currentModule?.path || getDefaultModulePath(store.state.multiModuleList[0])
          return next(defaultPath || '/')
        }

        if (store.state.hadDynamicRoute) {
          store.commit('setLastModuleRoutePath', {
            moduleCode: store.state.currentModule.code,
            routePath: to.path,
          })
          return next()
        }

        if (!store.state.hadDynamicRoute) {
          await store.dispatch('initMultiModuleList', { router, shouldPush: true })
          store.commit('setLastModuleRoutePath', {
            moduleCode: store.state.currentModule.code,
            routePath: to.path,
          })
          return next()
        }

        return next()
      }

      if (whiteList.includes(to.path)) {
        return next()
      }

      if (window.__POWERED_BY_QIANKUN__) {
        // 跳转到主项目的login页面
        setGlobalState({ jumpLogin: true })
      }

      return next(`/login?redirect=${to.path}`)
    }
  )

  instance = createApp(App) //创建vue实例
  instance.use(router) // 注册路由。
  instance.use(store).use(ElementPlus) // store（状态管理）和ElementPlus插件
  registerApp(instance) // 应用程序实例注册
  instance.mount(container ? container.querySelector('#app') : document.getElementById('app')) // 将应用程序实例挂载到指定的 HTML 元素上。如果 container 存在 则获取元素
  // 是否为qiankun环境
  store.commit('setIsByQiankun', window.__POWERED_BY_QIANKUN__) //储存环境的信息到vx
  if (window.__POWERED_BY_QIANKUN__) {
    console.log('我正在作为子应用运行')
  }
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({})
}

export async function mount(props: any) {
  console.log('mount ===========》 props', props)
  render(props)
}
export async function bootstrap() {
  console.log('bootstrap')
}
export async function unmount() {
  console.log('unmount')
  instance.unmount()
  instance._container.innerHTML = ''
  history.destroy() // 不卸载  router 会导致其他应用路由失败
  router = null
  instance = null
}
