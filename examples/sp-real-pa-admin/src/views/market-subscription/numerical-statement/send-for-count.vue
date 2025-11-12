
<template>
 <!-- 统计报表-串流行情套餐统计 -->
  <el-card>
    <div class="operate-buttons">
      <el-button
        v-permission="'statistics:export:quo'"
        :loading="loading"
        type="primary"
        size="small"
        @click="exportFunc"
        >{{ $t('export') }}</el-button
      >
    </div>
    <base-filter :config="filterConfig" @on-search="getData" @on-reset="getData" />
    <div class="table">
      <dz-table :config="tableConfig" :pagination="pagination" :is-table-loading="isLoading">
      </dz-table>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import baseFilter from '@/components/base-filter/base-filter'
import dzTable from '@/components/dz-table/dz-table'

import { quo, quoList, sendForCountExport } from '@/api/quotation'

import { formToParams } from '@/utils'

const { t } = useI18n()

const isLoading = ref(false)
const ordering = ref({
  asc: true,
  column: '',
})

// 行情套餐
const quoPackages = ref([])

/**
 *获取行情套餐
 */
function selectPackage() {
  quoList({ type: 1, status: 10 }).then((res) => {
    quoPackages.value = res.result.records.map((v: any) => ({ label: v.name, value: v.id }))
  })
}

// 表单配置
const formItems = [
  {
    prop: 'customerAccount',
    innerEl: { elType: 'input', props: { placeholder: t('please_enter_user_search_keyword') } },
  },
  {
    prop: 'packageId',
    label: t('market_package'),
    innerEl: {
      elType: 'select',
      props: {
        clearable: true,
      },
      options: quoPackages,
    },
  },
  {
    prop: 'regionSelect',
    label: t('apply_region'),
    innerEl: {
      elType: 'select',
      props: {
        clearable: true,
      },
      options: [
        { label: t('region_mainland'), value: 1 },
        // { label: t('region_HongKong'), value: 2 },
        // { label: t('region_global'), value: 3 },
        { label: t('region_other'), value: 4 },
      ],
    },
  },
  {
    prop: 'terminal',
    label: t('apply_terminal'),
    innerEl: {
      elType: 'select',
      props: {
        clearable: true,
      },
      options: [
        { label: t('mobile_terminal'), value: 1 },
        { label: t('pc_software'), value: 2 },
        // { label: t('WEB_software'), value: 3 },
      ],
    },
  },
  {
    prop: 'beginDate',
    label: t('starting_time'),
    innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
  },
  {
    prop: 'expireDate',
    label: t('expiration_time'),
    innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
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
    { label: t('middleground_account'), prop: 'cusNo', sortable: 'custom' },
    { label: t('transaction_account'), prop: 'tradeAccount' },
    { label: t('fullName'), prop: 'username' },
    { label: t('nickname'), prop: 'nickname' },
    { label: t('market_package'), prop: 'packageName' },
    { label: t('apply_region'), prop: 'regionSelectStr' },
    { label: t('apply_terminal'), prop: 'terminal' },
    { label: t('starting_time'), prop: 'enableStart', sortable: 'custom' },
    { label: t('expiration_time'), prop: 'enableEnd', sortable: 'custom' },
    { label: t('update_time'), prop: 'lastUpdateTime', sortable: 'custom' },
  ],
})

/** 表单数据 */
const filterConfig = reactive({
  formProps: {
    model: {},
  },
  // eslint-disable-next-line no-use-before-define
  formItems,
})

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
  const page: Record<string, any> = {}
  page.pageNum = pagination.paginationProps.currentPage
  page.pageSize = pagination.paginationProps.pageSize

  if (ordering.value.column) {
    Object.assign(page, {
      orders: [ordering.value],
    })
  }

  const data = formToParams(filterConfig.formProps.model)
  quo({ ...page, ...data })
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

const loading = ref(false)

/** 导出接口 */
function exportFunc() {
  loading.value = true

  const params = { ...filterConfig.formProps.model }
  if (ordering.value.column) {
    Object.assign(params, {
      orders: [ordering.value],
    })
  }

  sendForCountExport(params).then(() => {
    loading.value = false
  })
}

onBeforeMount(() => {
  getData()
})
onMounted(() => {
  selectPackage()
})
</script>
