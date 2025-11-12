<script setup lang="ts">
import { reactive, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import baseFilter from '@/components/base-filter/base-filter'
import dzTable from '@/components/dz-table/dz-table'

const { t } = useI18n()

// 行情套餐
const setMealSelect = [
  {
    label: t('stream_market_package'),
    value: '1',
  },
]

// 所属机构
const institution = [
  {
    label: t('theInstitution'),
    value: '1',
  },
]

// 表单配置
const formItems = [
  {
    prop: 't1',
    label: t('registration_time'),
    innerEl: { elType: 'datePicke', props: { type: 'daterange' } },
  },
  {
    prop: 't2',
    label: t('market_package'),
    innerEl: {
      elType: 'select',
      options: setMealSelect,
    },
  },
  {
    prop: 't3',
    label: t('theInstitution'),
    innerEl: {
      elType: 'select',
      options: institution,
    },
  },
  {
    prop: 't4',
    label: t('user_search_keyword'),
    innerEl: { elType: 'input', props: { placeholder: t('please_enter_user_search_keyword') } },
  },
]

const tableConfig: Record<string, any> = reactive({
  tableProps: {
    data: [],
    height: '580',
  },
  customColumns: [
    { label: t('middleground_account'), prop: 'a' },
    { label: t('fullName'), prop: 'd' },
    { label: t('nickname'), prop: 'e' },
    { label: t('mobile_number'), prop: 'f' },
    { label: t('stock_symbol_name'), prop: 'e' },
    { label: t('belongs_market'), prop: 'e' },
    { label: t('device_number'), prop: 'b' },
    { label: t('client'), prop: 'e' },
    { label: t('version_number'), prop: 'b' },
    { label: t('operating_system'), prop: 'b' },
    { label: t('ip_address'), prop: 'g' },
    { label: t('country_region'), prop: 'h' },
    { label: t('operation_time'), prop: 'j' },
  ],
})

/** 导出接口 */
function exportFunc() {
  console.log('导出')
}

/**
 * 获取表格数据
 * @param data 传入数据
 */
function getData() {
  tableConfig.tableProps.data = new Array(10).fill({
    a: '2016-05-03',
    b: 'Tom',
    c: 'No. 189, Grove St, Los Angeles',
    d: 'No. 189, Grove St, Los Angeles',
    e: 'No. 189, Grove St, Los Angeles',
    f: 'No. 189, Grove St, Los Angeles',
    g: 'No. 189, Grove St, Los Angeles',
    h: 'No. 189, Grove St, Los Angeles',
    i: 'No. 189, Grove St, Los Angeles',
    j: 'No. 189, Grove St, Los Angeles',
  })
}

const pagination = reactive({
  paginationProps: {
    currentPage: 1,
    pageSize: 10,
    total: 100,
  },
  paginationEvent: {
    onSizeChange: (v: number | string) => {
      console.log(v)
    },
    onCurrentChange: (v: number | string) => {
      console.log(v, '---------- current')
    },
  },
})

/** 表单数据 */
const filterConfig = reactive({
  formProps: {
    model: {
      registerTime: '',
      registerSource: '',
      status: '',
      account: '',
    },
  },
  // eslint-disable-next-line no-use-before-define
  formItems,
})

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

<template>
  <el-card>
    <el-button size="small" @click="exportFunc">{{ $t('export') }}</el-button>
    <base-filter :config="filterConfig" @on-search="searchHandle" @on-reset="resetHandle" />
    <div class="table">
      <dz-table :config="tableConfig" :pagination="pagination" />
    </div>
  </el-card>
</template>
