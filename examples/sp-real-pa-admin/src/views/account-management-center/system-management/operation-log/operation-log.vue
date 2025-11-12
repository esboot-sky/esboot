<template>
  <div class="page-container">
    <div class="operate-buttons">
      <el-button
        v-permission="'sys:operationLog:export'"
        type="primary"
        :loading="exportLoading"
        @click="toExport"
        >{{ $t('export') }}</el-button
      >
    </div>
    <baseFilter :config="filterConfig" @onSearch="searchHandle" @onReset="resetHandle"></baseFilter>
    <baseTable
      ref="tablePaginationRef"
      :config="tableConfig"
      :pagination="paginationConfig"
      :is-table-loading="isLoading"
    >
      <template #operateExplain>
        <el-table-column :label="'操作数据'" align="center">
          <template #default="{ row }">
            <span v-if="row.data.length > 32">
              <span>{{ row.data.substring(0, 32) + '...' }}</span>
              <span class="allShow" @click="showAllSize(row)">展开</span>
            </span>
            <span v-else>{{ row.data }}</span>
          </template>
        </el-table-column>
      </template>
      <template #status>
        <el-table-column :label="'操作状态'" align="center">
          <template #default="scope">
            {{ scope.row.status ? '成功' : '失败' }}
          </template>
        </el-table-column>
      </template>
    </baseTable>
    <el-dialog v-model="isShowDialog" width="30%" title="操作数据" center append-to-body>
      <div>{{ tableConfig.showValue }}</div>
      <template #footer>
        <el-button @click="isShowDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import baseFilter from '@/components/base-filter/base-filter'
import baseTable from '@/components/base-table/base-table'
import { timeDiff } from '@/utils/common'
import { getUserOperationLog, operationLogExport } from '@/api/subPro/subPro'

export default defineComponent({
  name: 'AccountOperationLog',
  components: {
    baseFilter,
    baseTable,
  },
  setup() {
    const { t } = useI18n()
    const tablePaginationRef = ref()
    const pageSize = ref(20)
    const currentPage = ref(1)
    const isShowDialog = ref<boolean>(false)
    const searchData = ref()
    const isLoading = ref<boolean>(false)
    const ordering = ref({
      asc: true,
      column: '',
    })

    /* 表格-start */
    const tableConfig = reactive({
      showValue: '',
      tableProps: {
        // data: <{ date: string; name: string; address: string }[]>[]
        data: [],
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
        { label: '登录账号', prop: 'username' },
        { label: '姓名', prop: 'nickname' },
        { label: '业务模块', prop: 'moduleName' },
        { label: '操作名称', prop: 'name' },
        // { label: '操作数据', prop: 'data' },
        { slot: 'operateExplain' },
        { label: '操作说明', prop: 'remark' },
        // { label: '操作状态', prop: 'status' },
        { slot: 'status' },
        { label: 'IP地址', prop: 'ip' },
        { label: '操作时间', prop: 'createTime' },
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

      getUserOperationLog(params)
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
          label: t('operate_time'),
          innerEl: {
            elType: 'datePicke',
            props: { type: 'daterange', 'value-format': 'YYYY-MM-DD' },
          },
        },
        {
          prop: 'status',
          label: t('operate_status'),
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
    /*  点击展开弹框 */
    const showAllSize = (row: any) => {
      tableConfig.showValue = row.data
      isShowDialog.value = true
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
      operationLogExport(params, `操作日志导出.xlsx`).then(() => {
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
      showAllSize,
      isShowDialog,
    }
  },
})
</script>
<style lang="scss" scoped>
:deep(.allShow) {
  color: rgb(153, 153, 219);
  margin-left: 5px;
  cursor: pointer;
}
:deep(.el-form-item__content) {
  min-width: 100px;
}
</style>
