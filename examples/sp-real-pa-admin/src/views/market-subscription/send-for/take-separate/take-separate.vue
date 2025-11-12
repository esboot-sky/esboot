<template>
  <!-- 订购管理-套餐分配记录 -->
  <el-card>
    <div class="operate-buttons">
      <el-button
        v-permission="'allocation:list:export'"
        type="primary"
        size="small"
        :loading="isExportLoading"
        @click="exportFunc"
        >{{ $t('export') }}</el-button
      >
    </div>
    <base-filter :config="filterConfig" @on-search="searchHandle" @on-reset="resetHandle" />
    <div class="table">
      <base-table :config="tableConfig" :pagination="pagination" :is-table-loading="isLoading">
        <template #tradeAccount>
          <el-table-column :label="$t('trading_account')" align="center">
            <template #default="scope">
              <div>
                <p v-for="item in scope.row.trades" :key="item">{{ item.tradeAccount }}</p>
              </div>
            </template>
          </el-table-column>
        </template>
      </base-table>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import baseFilter from '@/components/base-filter/base-filter'
import baseTable from '@/components/base-table/base-table'

// 获取列表
import { separateList, exportQue } from '@/api/quotation/quoSeparate'
// 套餐列表
// import { quoList } from '@/api/quotation/quotation'
import { quoList } from '@/api/quotation/settingQuo'

import { timeDiff } from '@/utils/common'

const { t } = useI18n()
const isLoading = ref<boolean>(false)
const ordering = ref({
  asc: false,
  column: 'createTime',
})
// 行情套餐
const setMealSelect = ref([])
/**
 *获取行情套餐
 */
function selectPackage() {
  quoList({
    type: 1,
    enable: true,
    status: '10',
    orders: [{ asc: false, column: 'createTime' }],
    pageNum: 1,
    pageSize: 10000,
  }).then((res) => {
    setMealSelect.value = res.result.records.map((v: any) => ({
      label: v.packageName,
      value: v.id,
    }))
  })
}

// 表单配置
const formItems = [
  {
    prop: 'customerAccount',
    label: '',
    innerEl: { elType: 'input', props: { placeholder: t('please_enter_account_name_nickName') } },
  },
  {
    prop: 'packageId',
    label: t('package'),
    innerEl: {
      elType: 'select',
      options: setMealSelect,
    },
  },
  {
    prop: 'createDate',
    label: t('separate_times'),
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
      return getData(filterConfig.formProps.model)
    },
  },
  customColumns: [
    { label: t('middleground_account'), prop: 'cusNo', sortable: 'custom' },
    { slot: 'tradeAccount' },
    { label: t('fullName'), prop: 'username' },
    { label: t('nickname'), prop: 'nickname' },
    { label: t('package'), prop: 'packageName' },
    { label: t('separate_times'), prop: 'createTime', sortable: 'custom' },
  ],
})

/** 表单数据 */
const filterConfig = reactive({
  formProps: {
    model: {
      createDate: [],
      packageId: '',
      clickId: '',
      customerAccount: '',
    },
  },
  formItems,
})

/** 导出接口 */
const isExportLoading = ref(false)
function exportFunc() {
  // const { createDate = [] } = filterConfig.formProps.model
  // if (!createDate || !createDate.length) {
  //   ElMessage.warning(t('export_message'))
  //   return
  // }

  // const [beginTime, endTime] = createDate
  // if (timeDiff(beginTime, endTime)) {
  //   ElMessage.warning(t('export_month_message'))
  //   return
  // }

  isExportLoading.value = true

  const params = { ...filterConfig.formProps.model }
  if (ordering.value.column) {
    Object.assign(params, {
      orders: [ordering.value],
    })
  }

  exportQue(params).then(() => {
    isExportLoading.value = false
  })
}

/**
 * 获取表格数据
 * @param data 传入数据
 */
function getData(data?: Record<string, any>) {
  isLoading.value = true

  const page: Record<string, any> = {}
  page.pageNum = pagination.paginationProps.currentPage
  page.pageSize = pagination.paginationProps.pageSize

  // if (ordering.value.column) {
  //   Object.assign(page, {
  //     orders: [ordering.value],
  //   })
  // }

  if (data && !data.createDate) {
    delete data.createDate
  }

  Object.assign(page, {
    orders: [ordering.value],
  })

  separateList({ ...page, ...data })
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

function searchHandle(d: Record<string, any>) {
  !d.createDate && delete d.createDate
  getData(d)
}

function resetHandle() {
  getData()
}

onBeforeMount(() => {
  getData(filterConfig.formProps.model)
})

onMounted(() => {
  selectPackage()
})
</script>

<style scoped>
.market-package {
  display: block;
}
</style>
