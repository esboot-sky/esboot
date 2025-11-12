<template>
  <div class="page-container">
    <div class="operate-buttons">
      <el-button v-permission="'statistics:report:export'" :loading="isExportLoading" @click="exportData">{{ t('export') }}</el-button>
    </div>

    <div class="filter-box">
      <baseFilter :config="formConfig" @on-search="handle(true)" @on-reset="handle(false)" />
    </div>
    <baseTable :config="tableConfig" :pagination="pagination" :is-loading="isLoading">
      <template #identity>
        <el-table-column  width="120">
          <template #header>
            <div>User Status</div>
            <div>{{t('identity')}}</div>
          </template>
          <template #default="scope">
            <div>
              <span v-if="scope.row.isPi">{{ t('professional_investor') }}</span>
              <span v-else>{{ t('non_professional_investor') }}</span>
            </div>
          </template>
        </el-table-column>
      </template>
      <template #price>
        <el-table-column  width="180">
          <template #header>
            <div>Reference Subscriber Fee per unit($)</div>
            <div>{{t('reference_quotation_per_unit1')}}</div>
            <div>{{t('reference_quotation_per_unit2')}}</div>
          </template>
          <template #default="scope">
            <div>
              <span>{{ scope.row.price }}</span>
            </div>
          </template>
        </el-table-column>
      </template>
    </baseTable>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import baseFilter from '@/components/base-filter/base-filter'
import useTableData from '@/hooks/useTableData'
import ConfigType from '@/types/requestType'
import baseTable from '@/components/base-table/base-table'
import { cloneDeep } from '@/utils/common'
import { marketReportExportOrder } from '@/api/quotation'

const { t } = useI18n()
const isExportLoading = ref(false)
const isLoading = ref(false)

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
  ],
})
// 列表请求参数
const reqConfig = reactive<ConfigType>({
  url: '/quotation/statistics/us/order/detail',
  method: 'POST',
  data: {},
})
// 排序
const ordering = ref({
  asc: false,
  column: 'reportMonth',
})
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
    { label: `Reporting month ${t('reporting_month')}`, prop: 'reportMonth', width: '150' },
    {
      label: `Subscriber ID ${t('middleground_account')}`,
      prop: 'cusNo',
      width: '120',
    },
    { label: '英文全名', prop: 'userNameEn', width: '150' },
    { slot: 'identity' },
    { label: t('market_type'), prop: 'typeName', width: '140' },
    { label: `No. of subscriber unit ${t('quantity_ordered')}`, prop: 'number', width: '172' },
    {
      slot: 'price'
    },
    {
      label: `Reference Total Subscriber Fee Payable ($) ${t('reference_total_cost')}`,
      prop: 'amount',
      width: '175',
    },
    {
      label: `Activation Date ${t('market_authorization_start_time')}`,
      prop: 'startDate',
      width: '142',
    },
    {
      label: `Termination Date ${t('market_authorization_end_time')}`,
      prop: 'endDate',
      width: '160',
    },
  ],
})
const exportData = () => {
  isExportLoading.value = true

  const params = { ...formConfig.formProps.model }

  marketReportExportOrder(params, `${t('us_market_report')}.xls`).then(() => {
    isExportLoading.value = false
  })
}

const handle = (isSearch: boolean) => {
  console.log('++++++++++++++++++', formConfig.formProps.model)

  const page: Record<string, any> = {}
  page.pageNum = pagination.paginationProps.currentPage
  page.pageSize = pagination.paginationProps.pageSize

  if (ordering.value.column) {
    Object.assign(page, {
      orders: [ordering.value],
    })
  }

  let params = {}
  if (!isSearch) {
    params = Object.assign({}, page)
  } else {
    // let modelData: Record<string, any> = {}
    const data: any = formConfig.formProps.model
    params = Object.assign({}, page, data)
  }

  reqConfig.data = cloneDeep(params)
}

const handleDetails = () => {}
</script>
<style lang="scss">
:deep(.cell) {
  background-color: red;
  color: #fff !important;
}
</style>
