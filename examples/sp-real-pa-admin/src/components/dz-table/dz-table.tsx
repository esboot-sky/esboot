import { defineComponent, toRefs, ref } from "vue"
import { useI18n } from 'vue-i18n'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/pagination/style/css'

export default defineComponent({
  components: { ElTable, ElTableColumn, ElPagination },
  props: {
    config: {
      type: Object
    },
    pagination: {
      type: Object
    },
    isTableLoading: {
      type: Boolean,
      default: false
    },
  },
  setup(props, { slots, expose }: { [name: string]: any }) {
    const { t } = useI18n()
    const { config, pagination,isTableLoading } = toRefs(props)
    const currentPage = ref(1)
    const toFirstPage = () => {
      currentPage.value = 1
    }
    const baseTable = ref()
    expose({
      toFirstPage,
      baseTable
    })
    return () => (
      <>
        <el-table
          ref={baseTable}
          empty-text={isTableLoading.value ? ' ' : t('temporarily_no_data')}
          v-loading={isTableLoading.value}
          {...{ ...config.value?.tableProps, ...config.value?.tableEvent }}
        >
          {
            config.value?.customColumns.map((column: typeof ElTableColumn, columnIndex: number) => {
              if (column.slot) return (slots[column.slot]())
              if (column.type) return <el-table-column align="center" {...column} key={columnIndex}></el-table-column>
              return <el-table-column align="center" {...column} key={columnIndex}>
                  {
                    {
                      default: (scope: any) => {
                        if (column.render) {
                          return column.render(scope)
                        }

                        return scope.row[column.prop]
                      }
                    }
                  }
                </el-table-column>
          })}
        </el-table>

        {pagination.value && <el-pagination
          v-model:currentPage={currentPage.value}
          page-sizes={[20, 50, 100, 200]}
          page-size={100}
          layout="total, sizes, prev, pager, next, jumper"
          total={400}
          onSizeChange={() => { }}
          onCurrentChange={() => { }}
          {...{ ...pagination.value?.paginationProps, ...pagination.value?.paginationEvent }}
          style={{ textAlign: 'right', marginTop: '50px' }}
        />}
      </>
    )
  }
})
