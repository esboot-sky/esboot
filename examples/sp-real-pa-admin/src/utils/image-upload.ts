import { ElMessage } from "element-plus";
import { uploadFileSys} from "@/api/quotation/quotation"

export function useImageUploader() {
    const uploadImage = async (file: any) => {        
      try {
        const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);
  
        const whiteList = ['jpeg', 'jpg', 'gif', 'png'];
        if (!whiteList.includes(fileSuffix)) {
          ElMessage.warning('文件格式不支持');
          return null;
        }
  
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          ElMessage.warning('文件大小超过限制');
          return null;
        }
  
        const formData = new FormData();
        formData.append('code', '1');
        formData.append("file", file.raw);

        const res = await uploadFileSys(formData);
        return res.data.result.url;
      } catch (error) {
        ElMessage.error('上传文件失败，请稍后重试');
        return null;
      }
    };
  
    return {
      uploadImage,
    };
  }


