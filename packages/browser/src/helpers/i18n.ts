type NestedObject = { [key: string]: any };

export function flattenLangObject(obj: NestedObject): NestedObject {
  const result: NestedObject = {};

  function recurse(currentObj: NestedObject, currentPath: string) {
    for (const key of Object.keys(currentObj)) {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      if (
        typeof currentObj[key] === 'object' &&
        currentObj[key] !== null &&
        !Array.isArray(currentObj[key])
      ) {
        recurse(currentObj[key], newPath);
      } else {
        result[newPath] = currentObj[key];
      }
    }
  }

  recurse(obj, '');
  return result;
}
