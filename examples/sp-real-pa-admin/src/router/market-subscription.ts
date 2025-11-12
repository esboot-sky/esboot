import { RouteRecordRaw } from 'vue-router'
import TakeNodes from '@/views/market-subscription/send-for/take-nodes/take-nodes.vue'

import ReportOrderRecord from '@/views/market-subscription/send-for/report-order-record/report-order-record.vue' //新增-点击报表订购记录

import PackageManageMent from '@/views/market-subscription/send-for/package-management/package-management.vue'

import ClickQuotationPackage from '@/views/market-subscription/send-for/click-quotation-package/click-quotation-package.vue' // 新增点击报价套餐

import CustomerList from '@/views/market-subscription/customer/list/list.vue'

import LoginLog from '@/views/market-subscription/customer/login-log.vue'

import ClickLog from '@/views/market-subscription/customer/click-log.vue'

import SendForCount from '@/views/market-subscription/numerical-statement/send-for-count.vue'

import ProductCount from '@/views/market-subscription/numerical-statement/product-count.vue'

import ReportSubmission from '@/views/market-subscription/numerical-statement/report-submission/report-submission.vue' // 新增上报报表

import PriceCount from '@/views/market-subscription/numerical-statement/price-count.vue' // 新增点击报价套餐统计

import DeductionFee from '@/views/market-subscription/numerical-statement/deduction-fee.vue'

import OrderList from '@/views/market-subscription/numerical-statement/order-list.vue'

import fileLog from '@/views/market-subscription/send-for/file-import-log/file-import-log.vue'

import TakeSeparate from '@/views/market-subscription/send-for/take-separate/take-separate.vue'

import ClickRecord from '@/views/market-subscription/send-for/click-record/click-record.vue' // 新增点击记录

import SettingManageMent from '@/views/market-subscription/send-for/setting-management/setting-management.vue'

import FreeRulesManageMent from '@/views/market-subscription/send-for/free-rules-management/free-rules-management.vue'

const routes: RouteRecordRaw[] = [
  /** 客户管理 */
  {
    path: '/market-subscription/customer/list',
    name: 'market-subscription-customer-list',
    meta: {
      title: '客户列表',
    },
    component: CustomerList,
  },
  {
    path: '/market-subscription/customer/login-log',
    name: 'market-subscription-customer-login-log',
    meta: {
      title: '客户登录日志',
    },
    component: LoginLog,
  },
  {
    path: '/market-subscription/customer/click-log',
    name: 'market-subscription-customer-click-log',
    meta: {
      title: '客户点击日志',
    },
    component: ClickLog,
  },
  /** 订购管理 */
  /*订单记录，更名为“串流行情订购记录*/
  {
    path: '/market-subscription/send-for/take-nodes',
    name: 'market-subscription-send-for-take-nodes',
    meta: {
      title: '订单记录',
    },
    component: TakeNodes,
  },
  /**新增-点击报价订购记录**/
  {
    path: '/market-subscription/send-for/report-order-record',
    name: 'market-subscription-send-for-report-order-record',
    meta: {
      title: '点击报价订购记录',
    },
    component: ReportOrderRecord,
  },
  {
    path: '/market-subscription/send-for/take-separate',
    name: 'market-subscription-send-for-take-separate',
    meta: {
      title: '套餐分配记录',
    },
    component: TakeSeparate,
  },
  /**新增-点击记录**/
  {
    path: '/market-subscription/send-for/click-record',
    name: 'market-subscription-send-for-click-record',
    meta: {
      title: '点击记录',
    },
    component: ClickRecord,
  },
  /*套餐列表，更名为串流行情套餐*/
  {
    path: '/market-subscription/send-for/package-management',
    name: 'market-subscription-send-for-package-management',
    meta: {
      title: '套餐列表',
    },
    component: PackageManageMent,
  },
  /*新增-点击报价套餐*/
  {
    path: '/market-subscription/send-for/click-quotation-package',
    name: 'market-subscription-send-for-click-quotation-package',
    meta: {
      title: '点击报价套餐',
    },
    component: ClickQuotationPackage,
  },
  {
    path: '/market-subscription/send-for/setting-management',
    name: 'market-subscription-send-for-setting-management',
    meta: {
      title: '默认套餐设置',
    },
    component: SettingManageMent,
  },
  {
    path: '/market-subscription/send-for/free-rules-management',
    name: 'market-subscription-send-for-free-rules-management',
    meta: {
      title: '赠送规则设置',
    },
    component: FreeRulesManageMent,
  },
  {
    path: '/market-subscription/send-for/file-import-log',
    name: 'file-import-log',
    meta: {
      title: '文件导入日志',
    },
    component: fileLog,
  },
  /** 统计报表 */
  {
    path: '/market-subscription/numerical-statement/send-for-count',
    name: 'numerical-statement-send-for-send-for-count',
    meta: {
      title: '串流行情套餐统计',
    },
    component: SendForCount,
  },
  {
    path: '/market-subscription/numerical-statement/product-count',
    name: 'numerical-statement-send-for-product-count',
    meta: {
      title: '串流行情产品统计',
    },
    component: ProductCount,
  },
  {
    path: '/market-subscription/numerical-statement/price-count',
    name: 'numerical-statement-send-for-price-count',
    meta: {
      title: '点击报价套餐统计',
    },
    component: PriceCount,
  },
  /*新增：上报报表*/
  {
    path: '/market-subscription/numerical-statement/report-submission',
    name: 'numerical-statement-report-submission',
    meta: {
      title: '上报报表',
    },
    component: ReportSubmission,
  },
  {
    path: '/market-subscription/numerical-statement/deduction-fee',
    name: 'numerical-statement-send-for-deduction-fee',
    meta: {
      title: '扣费记录',
    },
    component: DeductionFee,
  },
  {
    path: '/market-subscription/numerical-statement/order-list',
    name: 'numerical-statement-send-for-order-list',
    meta: {
      title: '套餐订购报表',
    },
    component: OrderList,
  },
  {
    path: '/market-subscription/numerical-statement/file-import-log-us',
    name: 'numerical-statement-send-for-file-import-log-us',
    meta: {
      title: '美股KYC导入日志',
    },
    component: fileLog,
  },
  // ==================系统管理start==================
  {
    path: '/account-management-center/user-management',
    name: 'account-management-center-user-management',
    meta: {
      title: '用户管理',
    },
    component: () =>
      import(
        '@/views/account-management-center/system-management/user-management/user-management.vue'
      ),
  },
  {
    path: '/account-management-center/role-management',
    name: 'account-management-center-role-management',
    meta: {
      title: '角色管理',
    },
    component: () =>
      import(
        '@/views/account-management-center/system-management/role-management/role-management.vue'
      ),
  },
  {
    path: '/account-management-center/department-management',
    name: 'account-management-center-department-management',
    meta: {
      title: '部门管理',
    },
    component: () =>
      import(
        '@/views/account-management-center/system-management/department-management/department-management.vue'
      ),
  },
  {
    path: '/account-management-center/login-log',
    name: 'account-management-center-login-log',
    meta: {
      title: '登录日志',
    },
    component: () =>
      import('@/views/account-management-center/system-management/login-log/login-log.vue'),
  },
  {
    path: '/account-management-center/operation-log',
    name: 'account-management-center-operation-log',
    meta: {
      title: '操作日志',
    },
    component: () =>
      import('@/views/account-management-center/system-management/operation-log/operation-log.vue'),
  },
  // ==================系统管理end==================
]

export default routes
