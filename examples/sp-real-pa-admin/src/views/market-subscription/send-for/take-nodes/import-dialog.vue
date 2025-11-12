<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" width="775px" @close="close()">
    <template #title>
      <span>{{title || $t('bulk_import')}}</span>
    </template>
    <div class="tool">
      <div class="tool-content">
        <el-upload action="" :auto-upload="true" :file-list="fileList" :http-request="uFile">
          <el-button size="small">
            {{ title|| $t('bulk_import') }}<el-icon class="el-icon--right"><Upload /></el-icon
          ></el-button>
        </el-upload>
        <el-button type="text" size="small" @click="dowmload()">{{
          $t('download_template')
        }}</el-button>
      </div>
      <div class="confirm-upload-box">
        <el-button type="primary" size="small" :loading="isBtnLoading" @click="uploadOrder">{{
          $t('confirm_upload')
        }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { uploadFile } from '@/api/quotation/quotation'
import { templateExport } from '@/api/quotation/order'

const { t } = useI18n()
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['callback'])

const isBtnLoading = ref(false)
const fileList = ref([])
const visible = ref(false)
let fileData = new FormData()

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
}

// 文件上传
function uploadOrder() {
  const file = fileData.get('file')
  if (!file) {
    ElMessage.warning(t('upload_file_prompt'))
    return
  }

  const { name } = file
  if (name.includes('xls') || name.includes('xlsx')) {
    isBtnLoading.value = true

    uploadFile(fileData)
      .then((res) => {
        if (res.data.code === 0) {
          ElMessage.success(t('import_success'))
          close()
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
  width: 144px;
  margin: 0 auto;
  display: flex;
}

.confirm-upload-box {
  width: 144px;
  margin: 20px auto 10px;
}
</style>
