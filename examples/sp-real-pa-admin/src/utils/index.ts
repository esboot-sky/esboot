/* eslint-disable guard-for-in */
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import _ from 'lodash'
import store from '@/store'
import { i18n } from '@/global/register-i18n'
import { SHA256 } from 'crypto-js'
const t = i18n.global.t

/**
 * 国际化映射
 * @returns
 */
export const languageMapping: Record<string, string> = {
  cn: 'zh-CN',
  hk: 'zh-TW',
  us: 'en-US',
}

/**
 * 时间固定格式转换
 * @param timeArr
 * @returns
 */
export function dateFormat(timeArr: [Date, Date]) {
  return timeArr.map((v) => {
    let str = v.toJSON()
    str = str.replace('T', ' ')
    return str.slice(0, str.lastIndexOf('.'))
  })
}

/**
 * 查询参数过滤空值 ---- 待优化
 * @param data
 * @returns
 */
export function formToParams(data: Record<string, any> | undefined): Record<string, any> {
  const params: Record<string, any> = {}
  if (!data) return params

  // eslint-disable-next-line no-restricted-syntax
  for (const key in data) {
    if (['boolean', 'number'].includes(typeof data[key])) {
      params[key] = data[key]
      // eslint-disable-next-line no-continue
      continue
    }
    if (data[key] && data[key] !== '') {
      if (data[key] instanceof Array) {
        if (data[key].length) params[key] = data[key]
        // eslint-disable-next-line no-continue
        continue
      }

      params[key] = data[key]
    }
  }

  return params
}

/**
 * 文件流转blob下载
 */
export function fileDownload(file: Buffer, fileName: string): void {
  const blob = new Blob([file])
  const a = document.createElement('a')
  const url = URL.createObjectURL(blob)
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

/** get 导出文件 */
export function exportFile(
  baseUrl: string,
  path: string,
  data: Record<string, any>,
  fileName = '表格数据.xls' as string
) {
  const aParams = formToParams(data)
  const aParamsStr = Object.keys(aParams).reduce((pre: string, val: any) => {
    const paramsValue = aParams[val]
    if (paramsValue instanceof Array) {
      const result = paramsValue
        .map((item: any, index: number) => {
          if (typeof item !== 'object') {
            return `${val}=${item}&`
          }

          const keys = Object.keys(item).reduce(
            (pre: string, key: string) => (pre += `${val}[${index}].${key}=${item[key]}&`),
            ''
          )
          return keys
        })
        .join('')

      pre += result
      return pre
    }

    pre += `${val}=${aParams[val]}&`
    return pre
  }, '?')

  const url = `${baseUrl}/${path}${encodeURI(
    aParamsStr ? aParamsStr.substring(0, aParamsStr.length - 1) : ''
  )}`

  return new Promise((resolve) => {
    axios(url, {
      headers: {
        method: 'GET',
        token: store.state.token,
        'Accept-Language': languageMapping[store.state.language] || languageMapping.cn,
      },
      responseType: 'blob',
    })
      .then((res: Record<string, any>) => {
        if (res.data.code) {
          ElMessage.error(res.data.message)
          return
        }
        fileDownload(res.data, fileName)
      })
      .catch(() => {
        ElMessage.error('导出失败')
      })
      .finally(() => {
        resolve('')
      })
  })
}

export function perfectI18nArray(
  arr?: [],
  templateData = {
    name: '',
    remark: '',
    path: '',
  }
) {
  if (arr && arr.length) {
    const newArr = arr.map((item) => {
      const obj = {
        ...item,
      }
      return obj
    })
    return newArr
  }

  const { languageList = [] } = store.state
  if (languageList.length) {
    const resultArr = languageList.map((item: string[]) => {
      return {
        lang: item[0],
        ...templateData,
      }
    })
    return resultArr
  }

  return [
    {
      lang: languageMapping.cn,
      ...templateData,
    },
    {
      lang: languageMapping.hk,
      ...templateData,
    },
    {
      lang: languageMapping.en,
      ...templateData,
    },
  ]
}

/**
 * 验证是否有未填项
 * @param original 原数据
 * @param current 当前数据
 * @param path  属性路径
 * @returns {boolean} true: 有 false: 没有
 */
export function verifyI18ns(original: any, current: any, path = ''): boolean {
  if (_.isPlainObject(current)) {
    for (const key in current) {
      const currentPath = path ? `${path}.${key}` : key
      const result = verifyI18ns(original, current[key], currentPath)
      if (result) return true
    }

    return false
  }

  if (_.isArray(current)) {
    const result = current.find((item: any, index: number) => {
      const currentPath = path ? `${path}[${index}]` : `[${index}]`
      const result = verifyI18ns(original, item, currentPath)
      return result
    })

    return result !== undefined
  }

  if (_.get(original, path)) return false

  return true
}

/**
 * 填充数据
 * @param fill 需要填充的数据
 * @param current 被填充的数据
 * @param parentPath 属性路径
 * @returns
 */
export function fillData(fill: any, current: any, parentPath = '') {
  if (_.isPlainObject(current)) {
    for (const key in current) {
      const currentKey = parentPath ? `${parentPath}.${key}` : key
      fillData(fill, current[key], currentKey)
    }
    return
  }

  if (_.isArray(current)) {
    current.forEach((item: any, index: number) => {
      const currentPath = parentPath ? `${parentPath}[${index}]` : `[${index}]`
      fillData(fill, item, currentPath)
    })
    return
  }

  if (_.get(fill, parentPath)) return

  _.set(fill, parentPath, current)
}

/**
 * 数组遍历填充
 * @param arr
 * @returns
 */
function fillByArray(arr: Record<string, any>[]) {
  return arr.map((item) => {
    const cache = { ...item }
    const { lang } = cache

    if (lang === languageMapping.cn) {
      // 以繁体填充
      const hk = arr.find((item) => item.lang === languageMapping.hk) || {}
      const hkCache = { ...hk }

      fillData(cache, hkCache)
      return cache
    }

    // 以简体填充
    const cn = arr.find((item) => item.lang === languageMapping.cn) || {}
    const cnCache = { ...cn }

    fillData(cache, cnCache)
    return cache
  })
}

/**
 * 国际化数据填充
 * @param arr
 * @returns
 */
export function fillByI18ns(arr: Record<string, any>[]) {
  return new Promise((resolve, reject) => {
    const resultArr = verifyI18ns(arr, arr)
    if (!resultArr) {
      return resolve('')
    }

    ElMessageBox.confirm(t('internationalization_tips'), {
      confirmButtonText: t('determine'),
      cancelButtonText: t('cancel'),
      type: 'warning',
    })
      .then(() => {
        const result = fillByArray(arr)
        resolve(result)
      })
      .catch(() => {
        reject('')
      })
  })
}
export function fillByI18nText(arr: Record<string, any>[]) {
  return new Promise((resolve, reject) => {
    const resultArr = verifyI18ns(arr, arr)
    if (!resultArr) {
      return resolve('')
    }

    ElMessageBox.confirm(t('reject_it'), {
      confirmButtonText: t('determine'),
      cancelButtonText: t('cancel'),
      type: 'warning',
    })
      .then(() => {
        const result = fillByArray(arr)
        resolve(result)
      })
      .catch(() => {
        reject('')
      })
  })
}

// 密码加密
export function passwordEncrypt(password: string) {
  return SHA256(password).toString().substring(0, 20)
}
