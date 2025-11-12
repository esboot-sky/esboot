<template>
  <div class="page-container">
    <div class="operate-buttons">
      <el-button v-permission="'dept:info:add'" type="primary" @click="openNewDepartmentDialog">{{
        $t('new')
      }}</el-button>
    </div>
    <baseFilter :config="filterConfig" @on-search="handle" @on-reset="handle"></baseFilter>
    <baseTable :config="tableConfig" :pagination="pagination" :is-table-loading="loading">
      <template #operate>
        <el-table-column :label="$t('operation')" align="center">
          <template #default="scope">
            <span
              v-permission="'dept:info:modify'"
              class="text-primary mr10"
              @click="openEditDepartmentDialog(scope.row)"
              >{{ $t('modify') }}</span
            >
            <el-popconfirm
              :title="$t('determine_deleted')"
              hide-icon
              @confirm="deleteRoleConfirm(scope.row.id)"
            >
              <template #reference>
                <span v-permission="'dept:info:delete'" class="text-primary mr10">{{
                  $t('delete')
                }}</span>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
    </baseTable>

    <insertForm ref="inserFormRef" @handle="handle" />
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import baseFilter from '@/components/base-filter/base-filter'
import baseTable from '@/components/base-table/base-table'
import insertForm from './components/insert-form.vue'
import useTableData from '@/hooks/useTableData'
import { deleteDepartment, getDepartmentCode } from '@/api/subPro/subPro'
import ConfigType from '@/types/requestType'
import { cloneDeep } from '@/utils/common'

const { t } = useI18n()
const searchData = ref()
const ordering = ref<Record<string, any>>({
  asc: true,
  column: '',
})

const inserFormRef = ref()

const reqConfig = reactive<ConfigType>({
  url: '/uc/dept/info/list',
  method: 'POST',
  data: {},
})

const { tableData, pagination, loading } = useTableData(reqConfig)

/* 表格-start */
// 选中行数
// 选中行
const tableConfig = reactive({
  tableProps: {
    data: tableData,
  },
  tableEvent: {
    onSortChange: (column: Record<string, any>) => {
      const { order, prop } = column
      ordering.value.column = prop
      if (!order) {
        ordering.value.column = undefined
        ordering.value.asc = undefined
      } else {
        ordering.value.asc = order === 'ascending' ? true : false
      }
      handle()
    },
  },
  customColumns: [
    { label: t('create_time'), prop: 'createTime', sortable: 'custom' },
    { label: t('department_number'), prop: 'code', sortable: 'custom' },
    { label: t('department_name'), prop: 'name' },
    { label: t('remarks'), prop: 'remark' },
    { slot: 'operate' },
  ],
})

/* 过滤表单-start */
const filterConfig = ref({
  formProps: {
    model: {
      keyword: '',
    },
  },
  formItems: [
    {
      prop: 'keyword',
      label: t('department_name'),
      innerEl: {
        elType: 'input',
        props: { placeholder: t('please_enter_department_name', 1) },
      },
    },
  ],
})

/* 过滤表单-end */

const openNewDepartmentDialog = () => {
  // 从后台获取部门编码
  getDepartmentCode().then((res: any) => {
    inserFormRef.value?.handleOpen()
    inserFormRef.value.newEditDepartmentForm.code = res.result
  })
}
const openEditDepartmentDialog = (row: any) => {
  const { code, name, remark, id } = row
  inserFormRef.value?.handleOpen({ code, name, remark, id })
}

// 操作列
const deleteRoleConfirm = async (id: number) => {
  const res = await deleteDepartment({ id })
  if (res.code === 0) {
    ElMessage.success(t('delete_success'))
    handle()
  }
  return res
}

const handle = () => {
  const params: Record<string, any> = cloneDeep(filterConfig.value.formProps.model)
  if (params.registerTime) {
    const [regBeginTime, regEndTime] = params.registerTime
    params.regBeginTime = regBeginTime
    params.regEndTime = regEndTime
  }
  if (ordering.value.column) {
    params.orders = [ordering.value]
  }
  searchData.value = cloneDeep(params)
  reqConfig.data = cloneDeep(params)
}
</script>
