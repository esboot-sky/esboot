/**
 * { low: ..., high: ... } 结构，转换为 [low, high]
 * @param obj
 * @returns
 */
export function transformFilterParams(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (value && typeof value === 'object' && 'low' in value && 'high' in value) {
      // 是 { low: ..., high: ... } 结构，转换为 [low, high]
      result[key] = [value.low, value.high];
    } else {
      // 其他情况（如数组），保持原样
      result[key] = value;
    }
  });

  return result;
}
