<template>
  <el-dialog
    v-model="isShowDialog"
    :title="$t('import_data')"
    width="800px"
    center
    @close="closeHandle"
  >
    <div style="text-align: center">
      <el-row justify="center" class="mb20">
        <el-col :span="5">
          <el-upload
            ref="uploadCustomersRef"
            class="upload-demo"
            :action="uploadUrl"
            :headers="uploadHeader"
            :limit="1"
            :auto-upload="false"
            :on-success="uploadCustomerSuccess"
          >
            <template #trigger>
              <el-button type="primary" class="mb20">{{ $t('bulk_import') }}</el-button>
            </template>
            <el-button class="mb20" @click="uploadNewCustomers">{{
              $t('confirm_upload')
            }}</el-button>
          </el-upload>
        </el-col>
        <el-col :span="2">
          <el-link type="primary" @click="toDownloadTemplate">{{
            $t('download_template')
          }}</el-link>
        </el-col>
      </el-row>
      <div>
        {{ $t('uploading_file_prompt', 0) }}-<el-link type="primary" @click="toFileImportlog">{{
          $t('uploading_file_prompt', 1)
        }}</el-link>
        {{ $t('uploading_file_prompt', 2) }}
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import store from '@/store'

export default defineComponent({
  name: 'TopUpload',
  props: {
    action: String,
    isShowUploadDialog: Boolean,
    importLogUrl: {
      type: String,
      default: () => '',
    },
    downloadTemplate: {
      type: Function,
      default: () => {},
    },
  },
  emits: ['update:isShowUploadDialog'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const isShowDialog = ref(false)
    const uploadCustomersRef = ref()
    const uploadHeader: any = {
      token: store.state.token,
    }
    const router = useRouter()
    const uploadCustomerSuccess = (response: any) => {
      if (response.success) {
        ElMessage.success(t('upload_success'))
        isShowDialog.value = false
      } else {
        ElMessage.error(t('upload_failed'))
      }
      uploadCustomersRef.value.clearFiles()
    }
    const uploadNewCustomers = () => {
      uploadCustomersRef.value.submit()
    }
    const toDownloadTemplate = () => {
      props?.downloadTemplate()
    }
    const toFileImportlog = () => {
      router.push(props.importLogUrl)
    }
    const closeHandle = () => {
      emit('update:isShowUploadDialog')
    }

    watch(
      () => props.isShowUploadDialog,
      (newVal: boolean) => {
        if (newVal) isShowDialog.value = newVal
      }
    )
    return {
      isShowDialog,
      uploadUrl: props.action || '',
      uploadCustomersRef,
      uploadHeader,
      uploadCustomerSuccess,
      uploadNewCustomers,
      toDownloadTemplate,
      toFileImportlog,
      closeHandle,
    }
  },
})
</script>
