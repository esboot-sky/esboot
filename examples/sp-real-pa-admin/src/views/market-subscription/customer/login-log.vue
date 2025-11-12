<script setup lang="ts">
import { reactive, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import baseFilter from '@/components/base-filter/base-filter'
import dzTable from '@/components/dz-table/dz-table'

import { loginLogList, loginListExport } from '@/api/quotation/customer'
import { formToParams } from '@/utils'
import { timeDiff } from '@/utils/common'

const { t } = useI18n()
const isLoading = ref<boolean>(false)
const ordering = ref({
  asc: true,
  column: '',
})

// 客户端
const clientSelect = [
  {
    label: 'PC',
    value: 'PC',
  },
  {
    label: 'IOS',
    value: 'IOS',
  },
  {
    label: 'ANDROID',
    value: 'ANDROID',
  },
  {
    label: 'WEB',
    value: 'WEB',
  },
]

// 表单配置
const formItems = [
  {
    prop: 'searchTime',
    label: t('login_time'),
    innerEl: { elType: 'datePicke', props: { type: 'daterange', 'value-format': 'YYYY-MM-DD' } },
  },
  {
    prop: 'keyword',
    label: t('user_account_keyword'),
    innerEl: { elType: 'input', props: { placeholder: t('please_enter_user_account_keyword') } },
  },
  {
    prop: 'channelType',
    label: t('client'),
    innerEl: {
      elType: 'select',
      options: clientSelect,
    },
  },
  {
    prop: 'country',
    label: t('country_region'),
    innerEl: { elType: 'input', props: { placeholder: t('please_enter_country_area_keyword') } },
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
      return getData(filterConfig.formProps.model)
    },
  },
  customColumns: [
    { label: t('middleground_account'), prop: 'cusNo', minWidth: '120', sortable: 'custom' },
    { slot: 'subaccount_type' },
    { label: t('fullName'), prop: 'name' },
    { label: t('nickname'), prop: 'nickname' },
    { label: t('mobile_number'), prop: 'mobile', minWidth: '100', sortable: 'custom' },
    { label: t('device_number'), prop: 'deviceNo' },
    { label: t('client'), prop: 'channelType' },
    { label: t('version_number'), prop: 'appVersion' },
    { label: t('operating_system'), prop: 'systemVersion' },
    { label: t('ip_address'), prop: 'loginIp' },
    { label: t('country_region'), prop: 'country' },
    { slot: 'status' },
    { label: t('login_time'), prop: 'loginTime', minWidth: '120', sortable: 'custom' },
  ],
})

/** 表单数据 */
const filterConfig = reactive({
  formProps: {
    model: {
      keyword: '',
      channelType: '',
      country: '',
      searchTime: [],
      accountType: 1,
    },
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
      getData(filterConfig.formProps.model)
    },
    onCurrentChange: (v: number | string) => {
      pagination.paginationProps.currentPage = v
      getData(filterConfig.formProps.model)
    },
  },
})

/**
 * 获取表格数据
 * @param data 传入数据
 */
function getData(data: Record<string, any> = {}) {
  isLoading.value = true
  const page: Record<string, any> = {}
  let beginTime, endTime
  page.pageNum = pagination.paginationProps.currentPage
  page.pageSize = pagination.paginationProps.pageSize
  if (data.searchTime) {
    ;[beginTime, endTime] = data.searchTime
  }

  const params = {
    accountType: 1,
    ...formToParams({ accountType: 1, ...page, ...data, beginTime, endTime }),
  }

  if (ordering.value.column) {
    Object.assign(params, {
      orders: [ordering.value],
    })
  }

  loginLogList(params)
    .then((res: Record<string, any>) => {
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

/** 导出接口 */
const isExportLoading = ref(false)
function exportFunc() {
  const { searchTime = [] } = filterConfig.formProps.model
  if (!searchTime || !searchTime.length) {
    ElMessage.warning(t('export_message'))
    return
  }

  const [beginTime, endTime] = searchTime
  if (timeDiff(beginTime, endTime)) {
    ElMessage.warning(t('export_month_message'))
    return
  }

  const params = { ...filterConfig.formProps.model, beginTime, endTime }
  if (ordering.value.column) {
    Object.assign(params, {
      orders: [ordering.value],
    })
  }

  isExportLoading.value = true
  loginListExport(params).then(() => {
    isExportLoading.value = false
  })
}

function searchHandle(data: Record<string, any>) {
  const [beginTime, endTime] = data.searchTime
  getData({ beginTime, endTime, ...data })
}

function resetHandle() {
  getData()
}

onBeforeMount(() => {
  getData()
})

const statusText = (num: number) => {
  const text = [t('failure'), t('succeed')]
  return text[num]
}
</script>

<template>
  <el-card>
    <div class="operate-buttons">
      <el-button
        v-permission="'cus:login:export'"
        type="primary"
        :loading="isExportLoading"
        @click="exportFunc"
        >{{ $t('export') }}</el-button
      >
    </div>
    <base-filter :config="filterConfig" @on-search="searchHandle" @on-reset="resetHandle" />
    <div class="table">
      <dz-table :config="tableConfig" :pagination="pagination" :is-table-loading="isLoading">
        <template #subaccount_type>
          <el-table-column :label="$t('subaccount_type')">
            <template #default="scope">
              <span>{{ scope.row.accountType === 1 && t('market') }}</span>
            </template>
          </el-table-column>
        </template>
        <template #status>
          <el-table-column :label="$t('login_state')" width="100">
            <template #default="scope">
              <span>{{ statusText(scope.row.status) }}</span>
            </template>
          </el-table-column>
        </template>
      </dz-table>
    </div>
  </el-card>
</template>
