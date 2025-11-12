<template>
  <el-dialog
    v-model="isShowNewEditDepartment"
    :close-on-click-modal="false"
    width="30%"
    :title="dialogTitle"
    center
    append-to-body
  >
    <el-form
      ref="newEditDepartmentRef"
      :model="newEditDepartmentForm"
      :rules="newEditDepartmentRule"
      label-width="100px"
      style="width: 80%; margin: 0 auto;"
    >
      <el-form-item :label="`${$t('department_number')}：`" prop="code">
        <el-input v-model="newEditDepartmentForm.code" disabled></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('department_name')}：`" prop="name">
        <el-input v-model="newEditDepartmentForm.name" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('remarks')}：`" prop="remark">
        <el-input v-model="newEditDepartmentForm.remark" maxlength="100"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isShowNewEditDepartment = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="newEditDepartmentConfirm">{{
          $t('determine')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { newDepartment, editDepartment } from '@/api/subPro/subPro'
import { cloneDeep } from '@/utils/common'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const emit = defineEmits(['handle'])

const isShowNewEditDepartment = ref(false)

const loading = ref(false)

const newEditDepartmentRef = ref()

const dialogTitle = computed(() =>
  newEditDepartmentForm.id ? t('modify_department') : t('add_department')
)

interface Department {
  id?: number | undefined
  code: string
  name: string
  remark: string
  [key: string]: any
}

const newEditDepartmentForm = reactive<Department>({
  code: '',
  name: '',
  remark: '',
})

const newEditDepartmentRule = reactive({
  code: [{ required: true, message: t('please_enter_department_number'), trigger: 'blur' }],
  name: [{ required: true, message: t('please_enter_department_name', 2), trigger: 'blur' }],
})

const newEditDepartmentConfirm = () => {

  newEditDepartmentRef.value.validate(async (validate: boolean) => {
    console.log('validate>>>', validate);

    if (validate) {
      loading.value = true
     try {
       const msg = newEditDepartmentForm.id ? t('modify_success') : t('add_success')
       const reqFunction = newEditDepartmentForm.id ? editDepartment : newDepartment
       const params = cloneDeep(newEditDepartmentForm)
       params.parentId = 0
       const res = await reqFunction(params)
       newEditDepartmentForm.code = ''
       newEditDepartmentForm.name = ''
       newEditDepartmentForm.remark = ''
      loading.value = false
      ElMessage.success(msg)
      isShowNewEditDepartment.value = false

      emit('handle')
     } catch (error) {
      console.log('error', error);
        loading.value = false
     }
    }
  })
}

const cleanForm = () => {
  const params: Department = {
    code: '',
    name: '',
    remark: '',
  }
  if (newEditDepartmentForm.id) {
    newEditDepartmentForm.id = undefined
  }
  Object.keys(params).forEach((item: string) => (newEditDepartmentForm[item] = params[item]))
}

const handleOpen = (row: any) => {
  cleanForm()
  isShowNewEditDepartment.value = true
  if (newEditDepartmentRef.value) {
    newEditDepartmentRef.value.resetFields()
  }
  if (row) {
    Object.keys(row).forEach((item: string) => (newEditDepartmentForm[item] = row[item]))
  }
}

defineExpose({
  handleOpen,
  newEditDepartmentForm,
})
</script>
