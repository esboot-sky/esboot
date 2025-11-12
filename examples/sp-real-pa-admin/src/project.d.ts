export interface Imenu {
  path: string
  title: string
  icon?: string
  children?: Array<Imenu>
}
