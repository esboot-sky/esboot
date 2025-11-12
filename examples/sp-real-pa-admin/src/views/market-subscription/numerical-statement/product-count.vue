<template>
 <!-- 统计报表-串流行情产品统计 -->
  <el-card>
    <div class="operate-buttons">
      <el-button
        v-permission="'statistics:export:quo:product'"
        :loading="exportLoading"
        type="primary"
        size="small"
        @click="exportFunc"
        >{{ $t('export') }}</el-button
      >
    </div>
    <base-filter :config="filterConfig" @on-search="getData" @on-reset="getData" />
    <div class="table">
      <dz-table :config="tableConfig" :pagination="pagination" :is-table-loading="isLoading">
        <template #isGive>
          <el-table-column :label="$t('is_presented')" width="100">
            <template #default="scope">
              <span>{{ giveText(scope.row.isGive) }}</span>
            </template>
          </el-table-column>
        </template>
      </dz-table>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import baseFilter from '@/components/base-filter/base-filter'
import dzTable from '@/components/dz-table/dz-table'

import { quoProduct, productExport, productList } from '@/api/quotation'

import { formToParams } from '@/utils'

const { t } = useI18n()

const isLoading = ref(false)
const ordering = ref({
  asc: true,
  column: '',
})

// 产品列表
const products = ref([])

function productListData() {
  productList().then((res: Record<string, any>) => {
    products.value = res.result.map((v: any) => ({ label: v.productName, value: v.id }))
  })
}

// 表单配置
const formItems = [
  {
    prop: 'customerAccount',
    innerEl: { elType: 'input', props: { placeholder: t('please_enter_user_search_keyword') } },
  },
  {
    prop: 'productId',
    innerEl: {
      elType: 'select',
      props: { placeholder: `${t('please_select')}${t('product_name')}` },
      options: products,
    },
  },
   {
    prop: 'terminal',
    innerEl: {
      elType: 'select',
      props: {
        clearable: true,
        placeholder: t('apply_terminal')
      },
      options: [
        { label: t('mobile_terminal'), value: 1 },
        { label: t('pc_software'), value: 2 },
        // { label: t('WEB_software'), value: 3 },
      ],
    },
  },
  {
    prop: 'regionSelect',
    innerEl: {
      elType: 'select',
      props: {
        clearable: true,
        placeholder: t('usable_region')
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
    { label: t('product_name'), prop: 'dataName', sortable: 'custom' },
    { label: t('apply_region'), prop: 'regionSelectStr' },
    { label: t('apply_terminal'), prop: 'terminal' },
    { label: t('starting_time'), prop: 'enableStart', sortable: 'custom' },
    { label: t('expiration_time'), prop: 'enableEnd', sortable: 'custom' },
    // { slot: 'isGive' },
    // { label: t('update_time'), prop: 'updateTime' }
    { label: t('update_time'), prop: 'updateTime', sortable: 'custom' },
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
    },
  },
  // eslint-disable-next-line no-use-before-define
  formItems,
})

const exportLoading = ref(false)

/** 导出接口 */
function exportFunc() {
  exportLoading.value = true

  const params = { ...filterConfig.formProps.model }
  if (ordering.value.column) {
    Object.assign(params, {
      orders: [ordering.value],
    })
  }

  productExport(params).then(() => {
    exportLoading.value = false
  })
}

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

  quoProduct({ ...page, ...data })
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

onBeforeMount(() => {
  getData()
  productListData()
})

const giveText = (isGive: boolean) => {
  const text = [t('yes'), t('no')]
  return text[isGive ? 0 : 1]
}
</script>

