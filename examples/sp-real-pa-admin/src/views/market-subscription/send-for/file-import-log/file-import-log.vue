<template>
   <!-- 订购管理-订购导入日志 -->
  <div class="page-container">
    <div class="operate-buttons">{{ $t('file_import_prompt') }}</div>
    <baseFilter
      ref="tablePaginationRef"
      :config="filterConfig"
      @on-search="handle(false)"
      @on-reset="handle(true)"
    ></baseFilter>
    <baseTable :config="tableConfig" :pagination="paginationConfig" :isLoading="isLoading">
      <template v-slot:logName>
        <el-table-column :label="$t('import_logs')" align="center">
          <template #default="scope">
            <span v-permission:disabled="'import:log:download'" @click="download(scope.row)" class="text-primary">{{ scope.row.logName }}</span>
          </template>
        </el-table-column>
      </template>
      <template v-slot:status>
        <el-table-column :label="$t('import_state')" align="center">
          <template #default="scope">
            {{ statusText(scope.row.status) }}
          </template>
        </el-table-column>
      </template>
    </baseTable>
  </div>
</template>
<script lang="ts">
import { defineComponent, onBeforeMount, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import baseFilter from '@/components/base-filter/base-filter'
import baseTable from '@/components/base-table/base-table'
import { getFileImportLogList, fileImportLogExport } from '@/api/subPro/subPro'
import { toDownload } from '@/utils/common'
import { cloneDeep } from '@/utils/common'
import { formToParams } from '@/utils'
import { useRoute } from "vue-router"

export default defineComponent({
  name: 'department-management',
  components: {
    baseFilter,
    baseTable,
  },
  setup() {
    const { t } = useI18n()
    const tablePaginationRef = ref()
    const isLoading = ref<boolean>(false)
    const ordering = ref({
      asc: true,
      column: '',
    })

    const route = useRoute()
    console.log('+++++++++++route+++++++++++++++', route);



    const tableConfig = reactive({
      tableProps: {
        data: <{ date: string; name: string; address: string }[]>[],
      },
      tableEvent: {
        onSortChange: (column: Record<string, any>) => {
          const { order, prop } = column
          ordering.value.column = ''
          paginationConfig.paginationProps.currentPage = 1

          if (order) {
            ordering.value = {
              asc: order === 'ascending',
              column: prop,
            }
          }
          return toGetFileImportLogList()
        },
      },
      customColumns: [
        { label: t('login_account'), prop: 'username', sortable: 'custom' },
        { label: t('fullName'), prop: 'nickname' },
        { label: t('import_file'), prop: 'sourceName' },
        { slot: 'logName' },
        { slot: 'status' },
        { label: t('import_time'), prop: 'createTime', sortable: 'custom' },
      ],
    })

    const filters = reactive({
      model: {
        importTime: '',
      },
    })

    /* 过滤表单-start */
    const filterConfig = reactive({
      formProps: {
        model: {
          importTime: '',
        },
      },
      formItems: [
        {
          prop: 'importTime',
          label: t('import_time'),
          innerEl: {
            elType: 'datePicke',
            props: { type: 'daterange', 'value-format': 'YYYY-MM-DD' },
          },
        },
        {
          prop: 'status',
          label: t('import_state'),
          innerEl: {
            elType: 'select',
            options: [
              { value: '', label: t('all') },
              { label: t('succeed'), value: 1 },
              { label: t('failure'), value: 0 },
            ],
          },
        },
        {
          prop: 'keyword',
          label: '',
          innerEl: {
            elType: 'input',
            props: { placeholder: t('please_enter_your_keyword') },
          },
        },
      ],
    })

    const statusText = (num: number) => {
      const text = [t('failure'), t('succeed')]
      return text[num]
    }
    /* 表格-end */

    /* 分页-start */
    const paginationConfig = reactive({
      paginationProps: { currentPage: 1, pageSize: 20, total: 0 },
      paginationEvent: {
        onSizeChange: (currentSize: number) => {
          paginationConfig.paginationProps.pageSize = currentSize
          paginationConfig.paginationProps.currentPage = 1
          toGetFileImportLogList(filters.model)
        },
        onCurrentChange: (currentPage: number) => {
          paginationConfig.paginationProps.currentPage = currentPage
          toGetFileImportLogList(filters.model)
        },
      },
    })
    /* 分页-end */

    interface paramsType {
      beginTime?: string
      endTime?: string
      pageSize: number
      pageNum: number
      type: string
    }

    function toGetFileImportLogList(params = filterConfig.formProps.model) {
      isLoading.value = true
      let type = 'save_quotation'
      if (route.name === 'numerical-statement-send-for-file-import-log-us') {
        // 股KYC导入日志
        type = 'review_pi'
      }

      const page: paramsType = {
        pageSize: paginationConfig.paginationProps.pageSize,
        pageNum: paginationConfig.paginationProps.currentPage,
        type: type,
      }

      if (ordering.value.column) {
        Object.assign(page, {
          orders: [ordering.value],
        })
      }

      if (filterConfig.formProps.model.importTime) {
        page['beginTime'] = filterConfig.formProps.model.importTime[0]
        page['endTime'] = filterConfig.formProps.model.importTime[1]
      }

      getFileImportLogList(formToParams({ ...page, ...params }))
        .then((res: { [key: string]: any }) => {
          tableConfig.tableProps.data = res.result?.records
          paginationConfig.paginationProps.total = res.result?.total || 0
        })
        .finally(() => {
          isLoading.value = false
        })
    }

    onBeforeMount(() => {
      toGetFileImportLogList()
    })

    const handle = (isReset: boolean | undefined) => {
      filters.model = cloneDeep(filterConfig.formProps.model)
      paginationConfig.paginationProps.currentPage = 1
      isReset ? (paginationConfig.paginationProps.pageSize = 20) : null
      toGetFileImportLogList()
    }
    /* 过滤表单-end */

    const download = (row: any) => {
      const { id, logName } = row
      fileImportLogExport({ id }).then((res) => {
        toDownload(res, `${logName}.xlsx`)
      })
    }

    return {
      statusText,
      tableConfig,
      paginationConfig,
      filterConfig,
      handle,
      isLoading,
      download,
      tablePaginationRef,
    }
  },
})
</script>
