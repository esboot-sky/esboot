import { authorizedCommonJavaInst } from '../common-java-instance'
import { IJavaAPICommonResponse } from '../types'

export function fetchRolePermissions(
  moduleCode: string,
  params: any
): Promise<IJavaAPICommonResponse<any>> {
  return authorizedCommonJavaInst.post('/uc/role/info/permission/list', params, {
    headers: { moduleCode },
  })
}
