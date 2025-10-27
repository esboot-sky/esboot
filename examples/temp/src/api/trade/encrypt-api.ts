import axios from 'axios';

export function initEncryptKey(url: string, postKey: string) {
  return axios({
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    data: postKey,
    url: `${url}/gateway/security/getToken`,
  }).then((rs: any) => {
    const { result } = rs.data;
    return result;
  });
}
