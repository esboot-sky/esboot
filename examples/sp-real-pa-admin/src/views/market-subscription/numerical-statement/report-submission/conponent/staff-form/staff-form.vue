<template>
  <!-- 上报报表-员工表 -->
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
// import { settleExchangeRateExport } from '@/api/revenue/settle-mange'
const { t } = useI18n()

const isExportLoading = ref(false)

// 列表请求参数
const reqConfig = reactive<ConfigType>({
  url: '/dtc/settleExchangeRate/list',
  method: 'POST',
  data: {
    exchangeCode: 'HKEX',
    orders: [
      {
        asc: false,
        column: 'createTime',
      },
    ],
  },
})
// 排序
const ordering = ref({
  asc: false,
  column: 'createTime',
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
    { label: 'Purpose of the Units用途', width: '200' },
    { label: 'Staff Name員工名稱', prop: 'createTime', width: '200' },
    { label: 'Department and Position部門及職位', prop: 'clientAccCode', width: '200' },
    { label: 'Unique Device / User ID個別用戶編號 1', prop: 'gbNames', width: '200' },
    { label: 'Type of Device設備類別', prop: 'engNames', width: '200' },
    { label: 'Quantity數量', prop: 'engNames', width: '200' },
    { label: 'Start date開始日期', prop: 'engNames', width: '200' },
    { label: 'End date結束日期', prop: 'engNames', width: '200' },
    { label: 'Country Code', prop: 'engNames', width: '200' },
    { label: 'Location with detail Address位置及詳細地址', prop: 'engNames', width: '200' },
    {
      label:
        'Marketing Agent/ Third Party Provider/ Other Remarks (If the Unit was provided to Marketing Agent  or Third Party Service Agent, please state their names here)',
      prop: 'engNames',
      width: '300',
    },
  ],
})

// 查询条件
const formConfig = reactive({
  formProps: {
    model: {
      exchangeCode: 'HKEX',
    },
  },
  formItems: [
    {
      prop: 'date',
      label: t('reporting_month'),
      innerEl: {
        elType: 'datePicke',
        props: { type: 'daterange', 'value-format': 'YYYY-MM-DD' },
      },
    },
    {
      prop: 'keyword',
      innerEl: {
        elType: 'input',
        props: {
          placeholder: t('please_enter_user_account_keywords'),
          clearable: true,
        },
      },
    },
    {
      prop: 'status',
      innerEl: {
        elType: 'select',
        props: { placeholder: t('equipment_category'), clearable: true },
        options: [],
      },
    },
    {
      prop: 'status',
      innerEl: {
        elType: 'select',
        props: { placeholder: t('department_and_position'), clearable: true },
        options: [],
      },
    },
    {
      prop: 'status',
      innerEl: {
        elType: 'select',
        props: { placeholder: t('country_code'), clearable: true },
        options: [],
      },
    },
  ],
})

// 查询
const handle = (flag: boolean) => {
  console.log('=====>查询')
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
    params = Object.assign({ exchangeCode: 'HKEX' }, page)
  } else {
    let modelData: any = { exchangeCode: 'HKEX' }
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
const exportData = async () => {
  isExportLoading.value = true
  const params = {
    ...formConfig.formProps.model,
    exchangeCode: 'HKEX',
    pageSize: pagination.paginationProps.total,
    pageNum: 1,
  }

  delete params?.date
  if (ordering.value.column) {
    Object.assign(params, {
      orders: [ordering.value],
    })
  }
  console.log('params', params)
  await settleExchangeRateExport({ ...params }, `${t('Exchange_fee_settlement_list')}.xlsx`) // Exchange_fee_settlement_list '交易所费用结算列表.xlsx'
  isExportLoading.value = false
}
</script>

<style lang="scss" scoped>
:deep(.el-form .el-form-item .el-form-item__content > .el-input) {
  width: 300px;
}
</style>
