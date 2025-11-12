import { orderListExpor } from "@/api/quotation/order"

export async function exportData (params: any ,fileName: string): Promise<void> {
    try {
        await orderListExpor(params,fileName)
    } catch (error) {
        console.error('导出失败:', error);
    }
} 