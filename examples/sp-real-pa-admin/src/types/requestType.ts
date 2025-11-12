import { Method } from 'axios'
interface ConfigType {
  url: string
  method: Method
  data: any // 请求参数
  loading?: boolean // 是否启用全局遮罩loading
  HeaderConfig?: any // 请求头配置
}

export default ConfigType
