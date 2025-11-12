import { createStore } from 'vuex'
import { login as loginApi, getMultiModuleList } from '@/api/authority/authority'
import { Imenu } from '@/project'
import accountManagementCenter from './module/account-management-center'
import { generateRoute } from '@/utils/authority'
import { getDefaultModulePath } from '@/utils/common'

interface rootState {
  language: string
  languageList: any
  isCollapse: boolean
  token: string
  menu: Imenu[]
  permissions: Record<string, boolean>
  hadDynamicRoute: boolean
  multiModuleList: any[]
  currentModule: { [key: string]: any }
  isByQiankun: boolean
  lastModuleRoutePath: Record<string, string>
}
type stateType = rootState

const defaultState: stateType = {
  language: localStorage.getItem('lang') || '',
  languageList: localStorage.getItem('languageList') || [
    ['zh-CN', '简体'],
    ['zh-TW', '繁体'],
  ],
  isCollapse: false,
  token: localStorage.getItem('token') || '',
  menu:
    (localStorage.getItem('menu') !== 'undefined' &&
      JSON.parse(localStorage.getItem('menu') as string)) ||
    [],
  permissions:
    (localStorage.getItem('permissions') !== 'undefined' &&
      JSON.parse(localStorage.getItem('permissions') as string)) ||
    {},
  hadDynamicRoute: false,
  lastModuleRoutePath: {},
  multiModuleList:
    (localStorage.getItem('multiModuleList') !== 'undefined' &&
      JSON.parse(localStorage.getItem('multiModuleList') as string)) ||
    [],
  currentModule:
    (localStorage.getItem('currentModule') !== 'undefined' &&
      JSON.parse(localStorage.getItem('currentModule') as string)) ||
    {},
  isByQiankun: false,
}
// Create a new store instance.
export default createStore({
  state() {
    return defaultState
  },
  mutations: {
    setLanguage(state: stateType, data: string) {
      state.language = data
      localStorage.setItem('lang', data)
    },
    setLanguageList(state: stateType, data: any) {
      state.languageList = data
    },
    setIsCollapse(state: stateType, data: boolean) {
      state.isCollapse = data
    },
    setToken(state: stateType, data: string) {
      state.token = data
      localStorage.setItem('token', data)
    },
    setMultiModuleList(state: stateType, data: any[]) {
      state.multiModuleList = data
      localStorage.setItem('multiModuleList', JSON.stringify(data))
    },
    setMenu(state: stateType, data: Imenu[]) {
      state.menu = data
      localStorage.setItem('menu', JSON.stringify(data))
    },
    setPermissions(state: stateType, data: string[]) {
      const permissionMap = data.reduce((pre: Record<string, boolean>, cur: string) => {
        pre[cur] = true
        return pre
      }, {})

      state.permissions = permissionMap
      localStorage.setItem('permissions', JSON.stringify(permissionMap))
    },
    setHadDynamicRoute(state: stateType, data: boolean) {
      state.hadDynamicRoute = data
    },
    setCurrentModule(state: stateType, data: object) {
      state.currentModule = data
      localStorage.setItem('currentModule', JSON.stringify(data))
    },
    setIsByQiankun(state: stateType, data: boolean) {
      state.isByQiankun = data
    },
    setLastModuleRoutePath(state: stateType, data: Record<string, string>) {
      state.lastModuleRoutePath[data.moduleCode] = data.routePath
    },
  },
  actions: {
    login({ commit }, data) {
      return loginApi(data, true).then((res) => {
        commit('setToken', res.result.token)
      })
    },
    logout({ commit }) {
      // 此处可能调用登出接口
      commit('setToken', '')
      commit('setMenu', [])
      commit('setPermissions', [])
    },
    initMultiModuleList({ commit, state }, payload: { router: any; shouldPush?: boolean }) {
      const { router: _router, shouldPush = true } = payload
      console.log(_router, '==========>_router')
      return getMultiModuleList().then((res) => {
        const multiModuleList = res.result
          .sort((a: any, b: any) => {
            if (a.isExternal && !b.isExternal) {
              return 1
            }
            if (!a.isExternal && b.isExternal) {
              return -1
            }
            return 0
          })
          .map((md: any) => {
            const dynamicRoute = generateRoute(md.menu)
            dynamicRoute?.forEach((route) => _router.addRoute('layout', route))

            return md
          })

        commit('setHadDynamicRoute', true)
        const module = state.currentModule.code ? state.currentModule : multiModuleList[0]
        const path = module.path || getDefaultModulePath(module)

        commit('setMultiModuleList', multiModuleList)

        console.log(module, path, shouldPush, _router, '==========>_module')
        const { menu = [], permission = [] } = module
        commit('setMenu', menu)
        commit('setPermissions', permission)
        commit('setCurrentModule', module)

        if (shouldPush && path) {
          _router.push(path)
        }
        return Promise.resolve(path)
      })
    },
    getMenuBtnList(
      { commit, state },
      { moduleCode, _router }: { moduleCode: string; _router: any }
    ) {
      const currentModule = state.multiModuleList.find((item: any) => item.code === moduleCode)
      if (currentModule) {
        commit('setCurrentModule', currentModule)
        commit('setMenu', currentModule.menu)
        commit('setPermissions', currentModule.permission)
      }

      const path = state.lastModuleRoutePath[moduleCode] || getDefaultModulePath(currentModule)
      if (path) {
        commit('setLastModuleRoutePath', { moduleCode, routePath: path })

        _router.push(path)
      }
      return Promise.resolve(currentModule)
    },
  },
  getters: {},
  modules: {
    accountManagementCenter,
  },
})
