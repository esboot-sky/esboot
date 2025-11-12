import { defineComponent, toRefs, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/pagination/style/css'

export default defineComponent({
  components: { ElTable, ElTableColumn, ElPagination },
  props: {
    config: {
      type: Object,
    },
    pagination: {
      type: Object,
    },
    isTableLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots, expose }: { [name: string]: any }) {
    const { t } = useI18n()
    const { config, pagination, isTableLoading } = toRefs(props)
    const currentPage = ref(1)
    const baseTable = ref()

    const toFirstPage = () => {
      currentPage.value = 1
    }

    expose({
      toFirstPage,
      baseTable,
    })

    return () => (
      <>
        <el-table
          ref={baseTable}
          empty-text={isTableLoading.value ? ' ' : t('temporarily_no_data')}
          v-loading={isTableLoading.value}
          height="550"
          {...{ ...config.value?.tableProps, ...config.value?.tableEvent }}
        >
          {config.value?.customColumns.map((column: typeof ElTableColumn, columnIndex: number) => {
            return column.slot ? (
              slots[column.slot]()
            ) : (
              <el-table-column align="center" {...column} key={columnIndex}></el-table-column>
            )
          })}
        </el-table>

        <el-pagination
          v-model:currentPage={currentPage.value}
          page-sizes={[20, 50, 100, 200]}
          page-size={20}
          layout="total, sizes, prev, pager, next, jumper"
          total={0}
          onSizeChange={() => {}}
          onCurrentChange={() => {}}
          {...{ ...pagination.value?.paginationProps, ...pagination.value?.paginationEvent }}
          style={{ textAlign: 'right', marginTop: '50px' }}
        ></el-pagination>
      </>
    )
  },
})
