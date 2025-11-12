import dynamicRoute from '@/router/dynamic-route'

interface INestedMenu {
  path: string
  title: string
  icon?: string
  children?: INestedMenu[]
}
type IFlatMenu = Omit<INestedMenu, 'children'>
// 扁平菜单
export const makeMenuFlat = (nestedMenu: INestedMenu[]) => {
  if (nestedMenu?.length === 0) return []
  let flatMenu: IFlatMenu[] = []
  nestedMenu?.forEach((menuItem) => {
    if (
      Object.prototype.hasOwnProperty.call(menuItem, 'children') &&
      menuItem.children?.length !== 0
    ) {
      flatMenu = [...flatMenu, ...makeMenuFlat(menuItem.children || [])]
    } else {
      flatMenu.push(menuItem)
    }
  })
  return flatMenu
}
export const generateRoute = (authorityMenu: INestedMenu[]) => {
  const flatMenu = makeMenuFlat(authorityMenu)
  return dynamicRoute.filter((route) => flatMenu.some((menuItem) => route.path === menuItem.path))
}
