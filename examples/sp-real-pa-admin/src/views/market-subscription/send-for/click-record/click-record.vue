<template>
  <!-- 订购管理-点击记录 -->
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
      </base-table>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import baseFilter from '@/components/base-filter/base-filter'
import baseTable from '@/components/base-table/base-table'
import { clickList, clickExportList } from '@/api/quotation/order'
import { formToParams } from '@/utils'

const { t } = useI18n()
const isLoading = ref(false)
const ordering = ref({
  asc: false,
  column: 'createTime',
})

// 表单配置
const formItems = [
  {
    prop: 'customerAccount',
    label: t('user_account_keyword'),
    innerEl: {
      elType: 'input',
      props: { placeholder: t('please_enter_user_account_keyword') },
    },
  },
  {
    prop: 'packageName',
    label: t('stock_name'),
    innerEl: {
      elType: 'input',
      props: { placeholder: t('please_enter_the_stock_name_code') },
    },
  },
  {
    prop: 'payDate',
    label: t('click_time'),
    innerEl: {
      elType: 'datePicke',
      props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' },
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
    { label: t('middleground_account'), prop: 'cusNo' },
    { label: t('trading_account'), prop: 'tradeAccount'},
    { label: t('fullName'), prop: 'username' },
    { label: t('nickname'), prop: 'nickname' },
    { label: t('stock_code'), prop: 'stockCode' },
    { label: t('stock_name'), prop: 'stockName' },
    { label: t('click_time'), prop: 'createTime' },
  ],
})

/** 表单数据 */
const filterConfig = reactive({
  formProps: {
    model: {
      registerTime: '',
      registerSource: '',
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
  const params = { ...aParams }
  if (ordering.value.column) {
    Object.assign(params, {
      orders: [ordering.value],
    })
  }

  clickExportList(params).then(() => {
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

  clickList({ ...page, ...data })
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
</script>
