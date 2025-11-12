const getUrlParams = (url: string) => {
  // 获取？后面第一个字符串的索引
  const index = url.indexOf('?') + 1
  // 取得url后面的字符串name=zs&age=18&b=2
  const params = url.substr(index)
  // 使用&切割字符串，返回一个数组
  const arr = params.split('&')
  // 定义一个空对象
  const o: { [name: string]: any } = {}
  // 数组中每一项的样子 key=value
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < arr.length; i++) {
    // 临时数组
    const tmpArr = arr[i].split('=')
    const key = tmpArr[0]
    const value = tmpArr[1]
    o[key] = value
  }
  return o
}

export default {
  getUrlParams,
}
