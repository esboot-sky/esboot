import _ from 'lodash'
import { MD5, SHA256 } from 'crypto-js'

// 下载
export const toDownload = (data: Blob, fileName: string) => {
  if ('download' in document.createElement('a')) {
    const url = window.URL.createObjectURL(data)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    ;(window.navigator as any).msSaveBlob(data, fileName)
  }
}

// 密码加密(CryptoJS:加密)
export function passwordEncrypt(password: string) {
  return SHA256(password).toString().substring(0, 20)
}

// 深拷贝
export const cloneDeep = _.cloneDeep

// 计算时间差是否超过30天
export const timeDiff = (startDate: string, endDate: string): boolean => {
  const diff = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  return diff > 30
}

export const getDefaultModulePath = (module: any) => {
  const { path, children } = module?.menu?.[0] ?? { path: '/', children: [] }

  return children.length ? children[0].path : path
}
