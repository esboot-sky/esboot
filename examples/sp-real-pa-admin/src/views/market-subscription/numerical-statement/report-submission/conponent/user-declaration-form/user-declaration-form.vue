<template>
  <div class="user-declaration-form page-container">
    <div class="operate-buttons">
      <el-button v-permission="'statistics:report:export'" :loading="isExportLoading" @click="exportData">{{ t('export') }}</el-button>
      <el-button v-permission="'statistics:report:import'"  @click="exportImport">{{ t('import') }}</el-button>
    </div>

    <div class="filter-box">
      <baseFilter :config="formConfig" @on-search="handle(true)" @on-reset="handle(false)" />
    </div>
    <baseTable :config="tableConfig" :pagination="pagination" :is-loading="isLoading">
      <template #cusNo>
        <el-table-column align="center" width="130">
          <template #header>
            <div>Subscriber ID</div>
            <div>{{t('middleground_account')}}</div>
          </template>
          <template #default="scope">
            <span>{{ scope.row.cusNo }}</span>
          </template>
        </el-table-column>
      </template>
      <template #identity>
        <el-table-column align="center" width="130">
          <template #header>
            <div>User Status</div>
            <div>{{t('identity')}}</div>
          </template>
          <template #default="scope">
            <span>{{ scope.row.answerResultName }}</span>
          </template>
        </el-table-column>
      </template>

      <template #operate>
        <el-table-column v-permission="'statistics:report:detail'" type="expand" :label="$t('details')" width="120px" fixed="right">
          <template #default="scope">
            <div>
              <div class="user-details-form">
                <div class="user-details-title">{{ t('contact_information') }}</div>
                <el-table :data="[scope.row.ud]">
                  <el-table-column
                    v-for="val in contactInformation"
                    :key="val.prop"
                    :prop="val.prop"
                    :label="val.label"
                    :width="val.width || 'auto'"
                  />
                </el-table>
              </div>
              <div class="user-details-form">
                <div class="user-details-title">{{ t('work_information') }}</div>
                <el-table :data="[scope.row.ud]">
                  <el-table-column v-for="val in workInformation" :key="val.prop" :prop="val.prop" :label="val.label" :width="val.width || auto" />
                </el-table>
              </div>
              <div class="user-details-form">
                  <div class="user-details-title">{{ t('questionnaire_information') }}</div>
                  <el-table :data="[scope.row.answerVO]">
                    <el-table-column v-for="val in questionnaireInformation" :key="val.prop" :prop="val.prop" :label="val.label">
                      <template #default="scopes">
                        <span>{{scopes.row[val.prop] ? '是': '否'}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
    </baseTable>
    <importDialog ref="importDialogRef" @callback="handle" />
  </div>
  <!-- <importDialog ref="importDialogRef" @callback="handle" /> -->
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import baseFilter from '@/components/base-filter/base-filter'
import useTableData from '@/hooks/useTableData'
import ConfigType from '@/types/requestType'
import importDialog from '../import-dialog/import-dialog.vue'
import baseTable from '@/components/base-table/base-table'
import { cloneDeep } from '@/utils/common'
import { userDeclarationExportOrder, getByTypes } from '@/api/quotation'
import { mount } from "@/main"

const { t } = useI18n()
const isExportLoading = ref(false)
const isLoading = ref(false)
const importDialogRef = ref<InstanceType<typeof importDialog>>()
const auditStatus = ref([])
// 查询条件
const formConfig = reactive({
  formProps: {
    model: {},
  },
  formItems: [
    {
      prop: 'keyword',
      innerEl: {
        elType: 'input',
        props: {
          placeholder: t('please_enter_user_account_keywords'),
          clearable: true,
        },
      },
    },
    {
      prop: 'beginDate',
      label: t('first_submission_time'),
      innerEl: { elType: 'datePicke', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } },
    },
    {
      prop: 'status',
      // label: t('audit_status'),
      innerEl: {
        elType: 'select',
        props: { placeholder: `KYC${t('audit_status')}`, clearable: true },
        options: auditStatus,
      },
    },
  ],
})
// 列表请求参数
const reqConfig = reactive<ConfigType>({
  url: '/quotation/statistics/us/pi/list',
  method: 'POST',
  data: {},
})
// 排序
const ordering = ref({
  asc: false,
  column: 'reportMonth',
})
const { pagination, tableData } = useTableData(reqConfig)
const tableConfig = reactive({
  tableProps: {
    data: tableData,
  },
  tableEvent: {
    onSortChange: (column: Record<string, any>) => {
      ordering.value.column = ''
      pagination.paginationProps.currentPage = 1
      const { order, prop } = column
      if (order && prop) {
        const propArr: string[] = prop.split('.')
        const attribute = propArr.length === 1 ? propArr[0] : propArr[1]
        ordering.value = {
          asc: order === 'ascending',
          column: attribute,
        }
      }
      return handle(true)
    },
  },
  customColumns: [
    { slot: 'cusNo' },
    { label: '英文全名', prop: 'userNameEn', minWidth: '150' },
    { slot: 'identity' },
    { label: `KYC ${t('audit_status')}`, prop: 'authProgressName', minWidth: '140' },
    { label: '出生日期', prop: 'dateOfBirth', minWidth: '100' },
    { label: '性別', prop: 'genderName', minWidth: '120' },
    { label: t('first_submission_time'), prop: 'firstAuthTime', minWidth: '200' },
    { label: t('last_update_time'), prop: 'updateTime', minWidth: '170' },
    { label: t('remarks'), prop: 'reviewRemark', minWidth: '170' },
    { slot: 'operate' },
  ],
})

const contactInformation = [
  {prop: "mobile", label: t('contact_phone'), width: "180"},
  {prop: "email", label: t('contact_email'), width: "260"},
  {prop:"residentialAddress", label: t('contact_residential_address')},
  {prop: "mailAddress", label: t('contact_communication_address')},
]

const workInformation = [
  { prop: 'occupation', label: t('employment_status'), width: '180' },
  { prop: 'employer', label: t('employer_name'), width: '180' },
  { prop: 'employerAddress', label: t('work_address') },
  { prop: 'employerTel', label: t('company_phone') },
  { prop: 'specificIndustry', label: t('business_nature') },
  { prop: 'positionName', label: t('position') },
  { prop: 'workTerm', label: t('years_of_service') }
]

const questionnaireInformation = [
  { prop: 'question_1', label: `${t('questionnaire_question')}_1` },
  { prop: 'question_2', label: `${t('questionnaire_question')}_2` },
  { prop: 'question_3', label: `${t('questionnaire_question')}_3` },
  { prop: 'question_4', label: `${t('questionnaire_question')}_4` },
  { prop: 'question_5', label: `${t('questionnaire_question')}_5` },
  { prop: 'question_6', label: `${t('questionnaire_question')}_6` },
  { prop: 'question_7', label: `${t('questionnaire_question')}_7` },
  { prop: 'question_8', label: `${t('questionnaire_question')}_8` },
  { prop: 'question_9', label: `${t('questionnaire_question')}_9` },
  { prop: 'question_10', label: `${t('questionnaire_question')}_10` }
]
const exportData = () => {
  isExportLoading.value = true

  const params = { ...formConfig.formProps.model }

  userDeclarationExportOrder(params, `${t('us_user_declaration_form')}.xls`).then(() => {
    isExportLoading.value = false
  })
}

const exportImport = () => {
  importDialogRef.value?.open()
}
const handle = (isSearch: boolean) => {
  console.log('++++++++++++++++++', formConfig.formProps.model)

  const page: Record<string, any> = {}
  page.pageNum = pagination.paginationProps.currentPage
  page.pageSize = pagination.paginationProps.pageSize

  if (ordering.value.column) {
    Object.assign(page, {
      orders: [ordering.value],
    })
  }

  let params = {}
  if (!isSearch) {
    params = Object.assign({}, page)
  } else {
    let modelData: Record<string, any> = {}
    const data: any = formConfig.formProps.model
    Object.keys(data).forEach((key) => {
      if (data[key] !== '') {
        if (key === 'beginDate') {
          modelData.firstAuthStart = data[key][0]
          modelData.firstAuthEnd = data[key][1]
        } else {
          modelData[key] = data[key]
        }
      }
    })
    params = Object.assign({}, page, modelData)
  }

  reqConfig.data = cloneDeep(params)
}

onMounted( async () => {
  const {result} = await getByTypes({types: ['kyc_status_name']})
  try {
    const {kyc_status_name} = result
    const list = kyc_status_name.map((item: any) => ({
      value: item[0],
      label: item[1],
    }))
    auditStatus.value = list
  } catch (error: any) {
    ElMessage.error(error.message || error.msg)
  }
})

const handleDetails = () => {}
</script>
<style lang="scss" scoped>
.user-details-form {
  display: flex;
  align-items: center;
  position: relative;
  background: #e9eaee;
}
.user-details-title {
  width: 100px;
  height: 100%;
  text-align: center;
}

.user-details-title::after {
  content: '';
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 1px;
  width: 100%;
  border-bottom: 1px solid #c8cad2;
}

.user-details-form:nth-of-type(1) {
  border-top: 1px solid #c8cad2;
}
</style>
