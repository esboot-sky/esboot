<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" width="775px" @close="close()">
    <template #title>
      <span v-if="showType === 'import'">{{t('import_data')}}</span>
      <span v-else>{{t('import_result')}}</span>
    </template>
    <div class="tool" v-if="showType === 'import'">
      <div class="tool-content">
        <el-upload
          ref="uploadRef"
          action=""
          :auto-upload="true"
          :limit="1"
          :multiple="false"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :http-request="uFile"
          :on-change="handleChange"
          :on-remove="handleRemove"
        >
          <el-button size="small">
            {{ $t('bulk_import') }}<el-icon class="el-icon--right"><Upload /></el-icon
          ></el-button>
        </el-upload>
        <!-- <el-button type="text" size="small" @click="dowmload()">{{
          $t('download_template')
        }}</el-button> -->
      </div>
      <div class="confirm-upload-box" >
        <el-button type="primary" size="small" :disabled="!isUploadFile"  :loading="isBtnLoading" @click="uploadOrder">{{
          $t('confirm_upload')
        }}</el-button>
      </div>
    </div>
    <div v-else class="import-result">
      <p><span>{{t('total_count')}}:</span><span>{{importSuccess.total}}</span></p>
      <p><span>{{t('success_count')}}:</span><span>{{importSuccess.successCount}}</span></p>
      <p><span>{{t('failure_count')}}:</span><span :class="importSuccess.failCount>0?'error-count':''">{{importSuccess.failCount}}</span></p>
      <div class="import-result-btn"><el-button type="primary" @click="goLink">{{t('view_import_log')}}</el-button></div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose, reactive, computed } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { uploadFile } from '@/api/quotation/quotation'
import { templateExport } from '@/api/quotation/order'
import { useRouter } from "vue-router"
import { getProgress } from "@/api/quotation"

const { t } = useI18n()
const emits = defineEmits(['callback'])

const showType = ref('import')
const isBtnLoading = ref(false)
const fileList = ref([])
const visible = ref(false)
const uploadRef = ref()
const isUploadFile = ref(false)
const importSuccess = reactive({
  total: 0,
  successCount: 0,
  failCount: 0,
  key: ''
})
const router = useRouter()
let fileData = new FormData()


const beforeUpload = (file: File) => {
  console.log(file);
  const isXlsFile = file.name.includes('xls') || file.name.includes('xlsx');
  const isFileSizeValid = file.size <= 10 * 1024 * 1024; // 10MB限制

  if (!isXlsFile) {
    ElMessage.warning(t('model_file_tip'));
    return false;
  }

  if (!isFileSizeValid) {
    ElMessage.warning('文件大小<=10MB');
    return false;
  }

  return true
}

const handleExceed = (files: File[]) => {
  ElMessage.warning(t('a_single_file_tips'));
};

const goLink = () => {
  router.push({ path: '/market-subscription/numerical-statement/file-import-log-us'})
}
function uFile(params: Record<string, any>) {
  fileData.append('file', params.file)
}

function open() {
  visible.value = true
}

function close() {
  fileData = new FormData()
  fileList.value = []
  visible.value = false
  showType.value = 'import'
}

const handleChange = () => {
  isUploadFile.value = true
};

const handleRemove = () => {
  isUploadFile.value = false
};

// 文件上传
function uploadOrder() {
  const file = fileData.get('file')
  if (!file) {
    ElMessage.warning(t('upload_file_prompt'))
    return
  }

  const { name } = file
  if (name.includes('xls') || name.includes('xlsx')) {
    if (isBtnLoading.value) return
    isBtnLoading.value = true

    uploadFile(fileData, '/statistics/import')
      .then((res) => {
        console.log("res", res);

        if (res.data.code === 0) {
          ElMessage({
            message: t('import_success'),
            type: 'success',
            duration: 1000,
            onClose: async () => {
              const { key} = res.data.result
              const progress = await getProgress({key: key})
              const {failCount, successCount, total} = progress.result

              isBtnLoading.value = false
              importSuccess.failCount = failCount
              importSuccess.key = key
              importSuccess.successCount = successCount
              importSuccess.total = total
              showType.value = 'success'
            }
          })
          // close()
          emits('callback')
        } else {
          ElMessage.error(res.data.message)
        }
      })
      .finally(() => {
        isBtnLoading.value = false
      })
    return
  }

  ElMessage.warning(t('model_file_tip'))
}

function dowmload() {
  templateExport()
}

defineExpose({
  open,
  close,
})
</script>

<style lang="scss" scoped>
.el-dialog__header {
  span {
    font-family: PingFangSC-Medium;
    font-weight: 500;
    font-size: 20px;
    color: #212121;
  }
}
.tool-content {
  text-align: center;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.confirm-upload-box {
  text-align: center;
  margin: 20px auto 10px;
}
.import-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;

  p {
    padding-top: 18px;
    margin: 0;
  }

  .error-count {
    color: red;
  }

  .import-result-btn {
    padding-top: 20px;
    font-size: 16px;
  }
}
</style>
