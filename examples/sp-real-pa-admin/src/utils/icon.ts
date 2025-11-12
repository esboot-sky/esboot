import { microAppDict } from '@/constants/micro-app'

// icon name 风格转换，如 AaBb -> i-aa-bb
const transElIconName = (iconName: string) =>
  `i${iconName.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`

const allIcons = {
  icon: 'menu-all',
  activeIcon: 'menu-all-active'
}

// 获取指定模块图标
export const getMenuIconName = (
  currentModule: Record<string, any>,
  activeModule: Record<string, any>
) => {
  const { code, isExternal } = currentModule
  const { code: activeCode } = activeModule

  if (code === 'all') {
    return allIcons.icon
  }

  // 判断内容管理平台
  if (isExternal) {
    return 'menu-content'
  }

  for (const microName in microAppDict) {
    const microInfo = microAppDict[microName]
    if (microInfo.beCode === code) {
      if (code === activeCode) {
        return microInfo.activeIcon
      }

      return microInfo.icon
    }
  }

  return 'menu-default'
}

export default {
  transElIconName
}
