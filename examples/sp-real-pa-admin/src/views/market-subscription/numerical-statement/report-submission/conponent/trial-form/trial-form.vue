<template>
  <!-- 上报报表-试用表 -->
  <div class="page-container">
    <div class="operate-buttons">
      <el-button :loading="isExportLoading" @click="exportData">{{ t('export') }}</el-button>
    </div>

    <div class="filter-box">
      <baseFilter :config="formConfig" @on-search="handle(true)" @on-reset="handle(false)" />
    </div>

    <baseTable :config="tableConfig" :pagination="pagination" :is-loading="isLoading"> </baseTable>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import ConfigType from '@/types/requestType'
import baseFilter from '@/components/base-filter/base-filter'
import baseTable from '@/components/base-table/base-table'
import useTableData from '@/hooks/useTableData'
import { cloneDeep } from '@/utils/common'
import { statisticsExportTrial } from '@/api/quotation/statistics'
const { t } = useI18n()

const isExportLoading = ref(false)

// 列表请求参数
const reqConfig = reactive<ConfigType>({
  url: '/quotation/statistics/trial/list',
  method: 'POST',
  data: {
    orders: [
      {
        asc: false,
        column: 'reportMonth',
      },
    ],
  },
})
// 排序
const ordering = ref({
  asc: false,
  column: 'reportMonth',
})
const isLoading = ref(false)

// 表格
const { pagination, tableData } = useTableData(reqConfig)
const tableConfig = reactive({
  tableProps: {
    data: tableData,
  },
  tableEvent: {
    onSortChange: (column: Record<string, any>) => {
      ordering.value.column = ''
      pagination.paginationProps.currentPage = 1
      const { order, prop } = column
      if (order && prop) {
        const propArr: string[] = prop.split('.')
        const attribute = propArr.length === 1 ? propArr[0] : propArr[1]
        ordering.value = {
          asc: order === 'ascending',
          column: attribute,
        }
      }
      return handle(true)
    },
  },
  customColumns: [
    { label: 'Reporting Month 報告月份', prop: 'reportMonth', width: '220' },
    { label: 'Unique Subscriber ID 個別用戶編號', prop: 'cusNo', width: '200' },
    { label: 'Subscriber Name 用戶姓名或公司名稱', prop: 'username', width: '220' },
    { label: 'Country Code 國家代碼', prop: 'countryCode', width: '220' },
    { label: '用戶地址 Address', prop: 'address', width: '220' },
    { label: 'Trial service commencement date 開始日期', prop: 'startDate', width: '220' },
    { label: 'Trial service termination date 結束日期', prop: 'endDate', width: '220' },
    {
      label: 'Become a Subscriber after the Free Trial 試用期後成功成為訂戶',
      prop: 'isSubscriber',
      width: '220',
      formatter: (r: any, c: any, value: any) => (value ? 'YES' : 'NO'),
    },
    {
      label: 'Name of the Marketing Agent (if applicable) / Other Remarks',
      prop: '',
      width: '220',
    },
  ],
})

// 国家代码
const countryCodes = [
  {
    label: t('CHN'),
    value: 'CHN',
  },
  {
    label: t('HKG'),
    value: 'HKG',
  },
]

// 是否成功成为订户
const isSubscribers = [
  {
    label: 'YES',
    value: 'true',
  },
  {
    label: 'NO',
    value: 'false',
  },
]

// 查询条件
const formConfig = reactive({
  formProps: {
    model: {},
  },
  formItems: [
    {
      prop: 'reportMonth',
      label: t('reporting_month'),
      innerEl: {
        elType: 'datePicke',
        props: { type: 'month', 'value-format': 'YYYY-MM' },
      },
    },
    {
      prop: 'keyword',
      label: t('account_name'),
      innerEl: {
        elType: 'input',
        props: {
          placeholder: t('please_enter_user_account_keywords'),
          clearable: true,
        },
      },
    },
    {
      prop: 'countryCode',
      label: t('country_code'),
      innerEl: {
        elType: 'select',
        props: { placeholder: t('please_select'), clearable: true },
        options: countryCodes,
      },
    },
    {
      prop: 'isSubscriber',
      label: t('isSubscriber'),
      innerEl: {
        elType: 'select',
        props: { placeholder: t('please_select'), clearable: true },
        options: isSubscribers,
      },
    },
  ],
})

// 查询
const handle = (flag: boolean) => {
  const page: Record<string, any> = {}
  page.pageNum = pagination.paginationProps.currentPage
  page.pageSize = pagination.paginationProps.pageSize

  if (ordering.value.column) {
    Object.assign(page, {
      orders: [ordering.value],
    })
  }

  let params = {}
  if (!flag) {
    params = Object.assign({}, page)
  } else {
    let modelData = {}
    Object.keys(formConfig.formProps.model).forEach((k) => {
      if (formConfig.formProps.model[k] !== '') {
        modelData[k] = formConfig.formProps.model[k]
      }
    })
    params = Object.assign({}, page, modelData)
  }

  reqConfig.data = cloneDeep(params)
}

// 导出
function exportData() {
  isExportLoading.value = true

  const params = { ...formConfig.formProps.model, type: 2 }
  if (ordering.value.column) {
    Object.assign(params, {
      orders: [ordering.value],
    })
  }

  statisticsExportTrial(params, `${t('hk_market_trial_table')}.xls`).then(() => {
    isExportLoading.value = false
  })
}
</script>

<style lang="scss" scoped>
:deep(.el-form .el-form-item .el-form-item__content > .el-input) {
  width: 300px;
}
</style>
