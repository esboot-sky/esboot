<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    width="775px"
    @close="close()"
  >
    <template #title>
      <span>批量审核</span>
    </template>
    <div class="order-content">
      <div class="order-info">
        <p>
          你即将对已选的
          <span class="order-num">{{ orderNum }}条订单</span>
          进行审批:
        </p>
        <p>{{ $t("order_quantity") }}: {{ orderCount }}</p>
        <p>{{ $t("give_num") }}: {{ giftCount }}</p>
      </div>
      <div class="form">
        <el-form ref="formRef" :model="form" :rules="rules">
          <el-form-item :label="$t('audit_status')" prop="resource">
            <el-radio-group v-model="form.resource">
              <el-radio label="通过" />
              <el-radio label="不通过" />
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('audit_reason')">
            <el-input v-model="form.desc" type="textarea" />
          </el-form-item>
        </el-form>
        <div class="operation">
          <el-button type="primary" :loading="isBtnLoading" @click="onSubmit">{{
            $t("determine")
          }}</el-button>
          <el-button @click="close">{{ $t("cancel") }}</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose, reactive, computed } from "vue";
// import { Upload } from '@element-plus/icons-vue'
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { orderBatchReview } from '@/api/quotation/order'
const { t } = useI18n();
const emits = defineEmits(["callback"]);
const props = defineProps({
  selectedData: {
    type: Array,
    default: () => [],
  },
});

const isBtnLoading = ref(false);
const formRef = ref<any>();
const visible = ref(false);
const form = reactive({
  resource: "",
  desc: "",
});

const rules = reactive({
  resource: [{ required: true, message: "请选择审核状态", trigger: "blur" }],
});

const orderNum = computed(() => {
  return props.selectedData.length;
});

// 订购量
const orderCount = computed(() => {
  return props.selectedData.reduce((total: number, item: any) => {
    if (!item.isGive) {
      total += item.num;
    }
    return total;
  }, 0);
});

// 赠送量
const giftCount = computed(() => {
  return props.selectedData.reduce((total: number, item: any) => {
    if (item.isGive) {
      total += item.num;
    }
    return total;
  }, 0);
});

function open() {
  visible.value = true;
}

function close() {
  visible.value = false;
}

function onSubmit() {
  if (!formRef.value) return;
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      isBtnLoading.value = true;
      const params = {
        ids: props.selectedData.map((item: any) => item.id),
        isPass: form.resource === "通过",
        reason: form.desc,
      };
      orderBatchReview(params)
        .then((res) => {
          console.log("res", res);
          if (res.code === 0) {
            ElMessage.success(t("audit_success"));
            close();
            emits("callback");
          } else {
            ElMessage.error(res.message);
          }
        })
        .finally(() => {
          isBtnLoading.value = false;
        });
    }
  });
}

defineExpose({
  open,
  close,
});
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
.order-content {
  padding: 0 10px;
}

.operation {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.order-num {
  font-size: 20px;
  font-weight: 500;
}
</style>
