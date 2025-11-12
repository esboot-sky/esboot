<template>
  <!-- 上报报表-订购明细表 -->
  <div class="page-container">
    <div class="operate-buttons">
      <el-button v-permission="'statistics:report:export'" :loading="isExportLoading" @click="exportData">{{ t('export') }}</el-button>
    </div>

    <div class="filter-box">
      <baseFilter :config="formConfig" @on-search="handle(true)" @on-reset="handle(false)" />
    </div>

    <baseTable :config="tableConfig" :pagination="pagination" :is-loading="isLoading">
      <template #Licensee>
        <el-table-column
          align="center"
          width="150px"
          prop="amount"
        >
          <template #header>
            <div>Licensee Code</div>
            <div>(filled by HKEX-IS)</div>
          </template>
          <template #default="{ row }">
            <div> </div>
          </template>

        </el-table-column>
      </template>
      <el-table-colum
        v-for="(column, index) in tableConfig.customColumns"
        :key="index"
        :label="column.label"
      >
        <template v-if="column.children">
          <el-table-column
            v-for="(child, i) in column.children"
            :key="i"
            :label="child.label"
            :prop="child.prop"
          ></el-table-column>
        </template>
      </el-table-colum>
    </baseTable>
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
import { statisticsExportOrder } from '@/api/quotation/statistics'
const { t } = useI18n()

const isExportLoading = ref(false)

// 列表请求参数
const reqConfig = reactive<ConfigType>({
  url: '/quotation/statistics/order/detail',
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

    { slot: 'Licensee'},
    { label: 'Reporting Month[YYYY/MM]', prop: 'reportMonth', width: '150' },
    { label: 'Subscriber ID', prop: 'cusNo', width: '130' },
    { label: 'Company Name', prop: 'username', width: '140' },
    { label: 'Address', prop: 'address', width: '100' },
    { label: 'Country Code', prop: 'countryCode', width: '150' },
    {
      label: 'Type of Subscriber Device(refer to Appendix I)',
      prop: 'terminalName',
      width: '210',
    },
    {
      label: 'Type of subscriber unit(same as Fee Item Code)',
      prop: 'typeName',
      width: '192',
    },
    { label: 'Reference Subscriber Fee per unit (HK$)', prop: 'price', width: '180' },
    { label: 'No. of subscriber unit', prop: 'number', width: '150' },
    {
      label: 'Percentage discount (0%, 10%, 15%... etc)',
      prop: 'engNames',
      width: '180',
    },
    { label: 'Reference Total Subscriber Fee Payable (HK$)', prop: 'amount', width: '200' },
    { label: 'Date of service commenced[YYYY-MMM-DD]', prop: 'startDate', width: '212' },
    { label: 'Date of service terminated[YYYY-MMM-DD]', prop: 'endDate', width: '212' },
    { label: 'Remarks', prop: 'engNames', width: '120' },
  ],
})

// 设备类别
const category = [
  {
    label: t('MOB'),
    value: '1',
  },
  {
    label: t('TER'),
    value: '2',
  },
  { label: t('WEB'), value: '3' },
]
// 部门及职位
const quotation = [
  {
    label: 'L1',
    value: '10',
  },
  {
    label: 'L2',
    value: '20',
  },
]
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
        clearable: true,
      },
    },
    {
      prop: 'customerAccount',
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
      prop: 'terminal',
      label: t('equipment_category'),
      innerEl: {
        elType: 'select',
        props: { placeholder: t('please_select'), clearable: true },
        options: category,
      },
    },
    {
      prop: 'quoType',
      label: t('quotation_category'),
      innerEl: {
        elType: 'select',
        props: { placeholder: t('please_select'), clearable: true },
        options: quotation,
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

  const params = { ...formConfig.formProps.model }
  if (ordering.value.column) {
    Object.assign(params, {
      orders: [ordering.value],
    })
  }

  statisticsExportOrder(params, `${t('hk_market_order_details_table')}.xls`).then(() => {
    isExportLoading.value = false
  })
}
</script>

<style lang="scss" scoped>
:deep(.el-form .el-form-item .el-form-item__content > .el-input) {
  width: 300px;
}
</style>
