<template>
  <!-- 统计报表-扣费记录 -->
  <el-card>
    <div class="operate-buttons">
      <el-button
        v-permission="'export:pay:log'"
        :loading="exportLoading"
        type="primary"
        size="small"
        @click="exportFunc"
        >{{ $t('export') }}</el-button
      >
    </div>
    <base-filter :config="filterConfig" @on-search="searchHandle" @on-reset="resetHandle" />
    <div class="table">
      <base-table :config="tableConfig" :pagination="pagination" :is-table-loading="isLoading">
        <template #channel>
          <el-table-column :label="$t('deduction_channels')" width="100">
            <template #default="scope">
              <span>{{ channelText(scope.row.channel) }}</span>
            </template>
          </el-table-column>
        </template>
      </base-table>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import baseFilter from '@/components/base-filter/base-filter'
import baseTable from '@/components/base-table/base-table'

import { payList } from '@/api/quotation'
import { reductExport } from '@/api/quotation/order'

import { formToParams } from '@/utils'

const { t } = useI18n()
const isLoading = ref(false)
const ordering = ref({
  asc: true,
  column: '',
})

// 表单配置
const formItems = [
  {
    prop: 'customerAccount',
    innerEl: { elType: 'input', props: { placeholder: t('please_enter_user_account_keyword') } },
  },
  {
    prop: 'packageName',
    innerEl: { elType: 'input', props: { placeholder: t('please_enter_package_name') } },
  },
  {
    prop: 'payDate',
    label: t('deduction_time'),
    innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
  },
  {
    prop: 'orderId',
    innerEl: { elType: 'input', props: { placeholder: t('please_enter_order_number') } },
  },
  {
    prop: 'payId',
    innerEl: { elType: 'input', props: { placeholder: t('please_enter_deductions_order') } },
  },
  {
    prop: 'channel',
    label: t('deduction_channels'),
    innerEl: {
      elType: 'select',
      options: [
        {
          value: '1',
          label: t('counter'),
        },
        {
          value: '2',
          label: t('artificial'),
        },
      ],
    },
  },
  {
    prop: 'currency',
    label: t('currency'),
    innerEl: {
      elType: 'select',
      options: [
        {
          value: 'CNY',
          label: t('RMB'),
        },
        {
          value: 'HKD',
          label: t('HKD'),
        },
        {
          value: 'USD',
          label: t('USD'),
        },
      ],
    },
  },
]

const tableConfig = reactive({
  tableProps: {
    data: [],
    height: '580',
  },
  tableEvent: {
    onSortChange: (column: Record<string, any>) => {
      const { order, prop } = column
      ordering.value.column = ''
      pagination.paginationProps.currentPage = 1

      if (order) {
        ordering.value = {
          asc: order === 'ascending',
          column: prop,
        }
      }
      return getData()
    },
  },
  customColumns: [
    { label: t('deductions_order'), prop: 'payId' },
    { label: t('order_number'), prop: 'orderId' },
    { label: t('middleground_account'), prop: 'cusNo', sortable: 'custom' },
    { label: t('transaction_account'), prop: 'tradeAccount', sortable: 'custom' },
    { label: t('fullName'), prop: 'username' },
    { label: t('nickname'), prop: 'nickname' },
    { label: t('mobile_number'), prop: 'mobile', sortable: 'custom' },
    { label: t('package_name'), prop: 'packageName', sortable: 'custom' },
    { label: t('amount'), prop: 'amount', sortable: 'custom' },
    { label: t('currency'), prop: 'currency' },
    { label: t('deduction_time'), prop: 'payTime', sortable: 'custom' },
    { slot: 'channel' },
    { label: t('state'), prop: 'status' },
  ],
})

/** 表单数据 */
const filterConfig = reactive({
  formProps: {
    model: {
      registerTime: '',
      registerSource: '',
      status: '',
      account: '',
      keyword: '',
      payStart: '',
      payEnd: '',
      payDate: [],
    },
  },
  // eslint-disable-next-line no-use-before-define
  formItems,
})
const exportLoading = ref(false)

/** 导出接口 */
function exportFunc() {
  exportLoading.value = true

  const aParams = formToParams(filterConfig.formProps.model)
  console.log('aParams>>>', aParams)

  const params = { ...aParams }
  if (ordering.value.column) {
    Object.assign(params, {
      orders: [ordering.value],
    })
  }
  console.log('params>>>', params)
  reductExport(params).then(() => {
    exportLoading.value = false
  })
}

const pagination: Record<string, any> = reactive({
  paginationProps: {
    currentPage: 1,
    pageSize: 20,
    total: 0,
  },
  paginationEvent: {
    onSizeChange: (v: number | string) => {
      pagination.paginationProps.pageSize = v
      getData()
    },
    onCurrentChange: (v: number | string) => {
      pagination.paginationProps.currentPage = v
      getData()
    },
  },
})

/**
 * 获取表格数据
 * @param data 传入数据
 */
function getData() {
  isLoading.value = true
  const data = formToParams(filterConfig.formProps.model)
  const page: Record<string, any> = {}
  page.pageNum = pagination.paginationProps.currentPage
  page.pageSize = pagination.paginationProps.pageSize

  if (ordering.value.column) {
    Object.assign(page, {
      orders: [ordering.value],
    })
  }

  payList({ ...page, ...data })
    .then((res) => {
      tableConfig.tableProps.data = res.result.records
      pagination.paginationProps.currentPage = res.result.current
      pagination.paginationProps.pageSize = res.result.size
      pagination.paginationProps.total = res.result.total
      isLoading.value = false
    })
    .catch((err) => {
      console.log(err)
      isLoading.value = false
    })
}

function searchHandle() {
  getData()
}

function resetHandle() {
  getData()
}

onBeforeMount(() => {
  getData()
})
const channelText = (channel: number) => {
  const text = [t('counter'), t('artificial')]
  return text[channel - 1]
}
</script>
