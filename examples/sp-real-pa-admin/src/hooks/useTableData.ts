import request from '@/utils/request/request'
import { ElMessage } from 'element-plus'
import { ref, reactive, watch, onMounted } from 'vue'
import ConfigType from '@/types/requestType'

interface ResponseType {
  code: number // 为0成功,其余状态为异常态
  message: string
  result: any
  success: boolean
}

const commonRequset = (config: ConfigType) => {
  const { url, method, data, loading, HeaderConfig } = config
  return request(`${url}`, method, data, loading, HeaderConfig)
    .then((res) => res)
    .catch((err) => err)
}

const useTableData = (config: ConfigType) => {
  const tableData = ref<any[]>()
  const loading = ref(false)
  const pagination = reactive({
    paginationProps: {
      currentPage: 1 || config.data?.pageNum,
      pageSize: 20 || config.data?.pageSize,
      total: 0,
    },
    paginationEvent: {
      onSizeChange: (currentSize: number) => {
        pagination.paginationProps.currentPage = 1
        pagination.paginationProps.pageSize = currentSize
        getTableData(config)
      },
      onCurrentChange: (currentPage: number) => {
        pagination.paginationProps.currentPage = currentPage
        getTableData(config)
      },
    },
  })

  const getTableData = async (config: ConfigType) => {
    const params = {
      ...config,
      data: {
        ...config.data,
        pageNum: pagination.paginationProps.currentPage,
        pageSize: pagination.paginationProps.pageSize,
      },
    }
    loading.value = true
    const res: ResponseType = await commonRequset(params)
    loading.value = false
    if (res.code === 0) {
      const { records, total, current, size } = res.result
      tableData.value = records || []
      pagination.paginationProps.total = total || 0
      pagination.paginationProps.currentPage = current || 1
      pagination.paginationProps.pageSize = size || 20
      return
    }
    tableData.value = []
    ElMessage.error(res.message)
  }

  watch(
    config,
    (newVal) => {
      if (newVal.data?.pageNum) {
        pagination.paginationProps.currentPage = newVal.data.pageNum
      }
      if (newVal.data?.pageSize) {
        pagination.paginationProps.pageSize = newVal.data.pageSize
      }
      getTableData(newVal)
    },
    {
      deep: true,
    }
  )

  onMounted(() => {
    getTableData(config)
  })

  return {
    tableData,
    pagination,
    loading,
  }
}

export default useTableData
