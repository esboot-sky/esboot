<template>
  <div class="page-container">
    <div class="operate-buttons">
      <el-button
        type="primary"
        :loading="exportLoading"
        @click="toExport"
        v-permission="'login:log:export'"
        >{{ $t('export') }}</el-button
      >
    </div>
    <baseFilter :config="filterConfig" @onSearch="searchHandle" @onReset="resetHandle"></baseFilter>
    <baseTable
      ref="tablePaginationRef"
      :config="tableConfig"
      :pagination="paginationConfig"
      :isTableLoading="isLoading"
    >
      <template v-slot:status>
        <el-table-column :label="$t('login_state')" align="center">
          <template #default="scope">
            {{ statusText(scope.row.status) }}
          </template>
        </el-table-column>
      </template>
    </baseTable>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import baseFilter from '@/components/base-filter/base-filter'
import baseTable from '@/components/base-table/base-table'
import { timeDiff } from '@/utils/common'
import { getUserLoginLog, operationLogExport, loginLogExport } from '@/api/subPro/subPro'

export default defineComponent({
  name: 'account-operation-log',
  components: {
    baseFilter,
    baseTable,
  },
  setup() {
    const { t } = useI18n()
    const tablePaginationRef = ref()
    const pageSize = ref(20)
    const currentPage = ref(1)
    const searchData = ref()
    const isLoading = ref<boolean>(false)
    const ordering = ref({
      asc: true,
      column: '',
    })

    /* 表格-start */
    const tableConfig = reactive({
      tableProps: {
        data: <{ date: string; name: string; address: string }[]>[],
      },
      tableEvent: {
        onSortChange: (column: Record<string, any>) => {
          const { order, prop } = column
          ordering.value.column = ''
          currentPage.value = 1
          paginationConfig.value.paginationProps.currentPage = 1

          if (order) {
            ordering.value = {
              asc: order === 'ascending',
              column: prop,
            }
          }
          return toGetUserLoginLog()
        },
      },
      customColumns: [
        { label: t('login_account'), prop: 'username', sortable: 'custom' },
        { label: t('fullName'), prop: 'nickname' },
        { label: t('login_terminal'), prop: 'appVersion' },
        { slot: 'status' },
        { label: t('ip_address'), prop: 'loginIp' },
        { label: t('login_time'), prop: 'loginTime', sortable: 'custom' },
      ],
    })
    const statusText = (num: number) => {
      const text = [t('failure'), t('success')]
      return text[num]
    }
    /* 表格-end */

    /* 分页-start */
    const paginationConfig = ref({
      paginationProps: { total: 0, 'page-size': 20, currentPage: 1 },
      paginationEvent: {
        onSizeChange: handleSizeChange,
        onCurrentChange: handleCurrentChange,
      },
    })
    function handleSizeChange(currentSize: number) {
      paginationConfig.value.paginationProps['page-size'] = currentSize
      tablePaginationRef.value?.toFirstPage()
      currentPage.value = 1
      pageSize.value = currentSize
      toGetUserLoginLog()
    }
    function handleCurrentChange(theCurrentPage: number) {
      currentPage.value = theCurrentPage
      paginationConfig.value.paginationProps.currentPage = theCurrentPage
      toGetUserLoginLog()
    }
    /* 分页-end */

    function toGetUserLoginLog() {
      isLoading.value = true
      const params = {
        ...searchData.value,
        pageSize: pageSize.value,
        pageNum: currentPage.value,
      }

      if (ordering.value.column) {
        Object.assign(params, {
          orders: [ordering.value],
        })
      }

      getUserLoginLog(params)
        .then((res: { [key: string]: any }) => {
          tableConfig.tableProps.data = res.result?.records
          paginationConfig.value.paginationProps.total = res.result?.total || 0
        })
        .finally(() => {
          isLoading.value = false
        })
    }
    toGetUserLoginLog()

    /* 过滤表单-start */
    const filterConfig = ref({
      formProps: {
        model: {
          loginTime: '',
          status: '',
          keyword: '',
        },
      },
      formItems: [
        {
          prop: 'loginTime',
          label: t('login_time'),
          innerEl: {
            elType: 'datePicke',
            props: { type: 'daterange', 'value-format': 'YYYY-MM-DD' },
          },
        },
        {
          prop: 'status',
          label: t('login_state'),
          innerEl: {
            elType: 'select',
            options: [
              { value: '', label: t('all') },
              { label: t('success'), value: 1 },
              { label: t('failure'), value: 0 },
            ],
          },
        },
        {
          prop: 'keyword',
          label: '',
          innerEl: {
            elType: 'input',
            props: { placeholder: t('please_enter_keyword') },
          },
        },
      ],
    })
    const searchHandle = (data: { [name: string]: any }) => {
      currentPage.value = 1
      tablePaginationRef.value?.toFirstPage()
      // 携带自定义插槽数据并请求查询
      const { loginTime, ...params } = data
      const [beginTime, endTime] = loginTime
      searchData.value = { beginTime, endTime, ...params }
      toGetUserLoginLog()
    }
    const resetHandle = (data: { [name: string]: any }) => {
      currentPage.value = 1
      tablePaginationRef.value?.toFirstPage()
      // 重置自定义插槽数据并请求查询
      const { loginTime, ...params } = data
      const [beginTime, endTime] = loginTime
      searchData.value = { beginTime, endTime, ...params }
      toGetUserLoginLog()
    }
    /* 过滤表单-end */

    // 导出
    const exportLoading = ref(false)
    const toExport = () => {
      const params = {
        ...searchData.value,
        pageSize: pageSize.value,
        pageNum: currentPage.value,
      }

      if (ordering.value.column) {
        Object.assign(params, {
          orders: [ordering.value],
        })
      }

      if (!params.beginTime && !params.endTime) {
        ElMessage.warning(t('export_message'))
        return
      }

      if (timeDiff(params.beginTime, params.endTime)) {
        ElMessage.warning(t('export_month_message'))
        return
      }

      exportLoading.value = true
      loginLogExport(params, `${t('login_logs')}.xlsx`).then(() => {
        exportLoading.value = false
      })
    }
    return {
      tablePaginationRef,
      tableConfig,
      paginationConfig,
      statusText,
      filterConfig,
      searchHandle,
      resetHandle,
      isLoading,
      toExport,
      exportLoading,
    }
  },
})
</script>

<style lang="scss" scoped>
.base-filter {
  :deep(.el-select) {
    width: 200px;
  }
}
</style>
