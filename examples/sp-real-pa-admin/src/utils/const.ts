export enum AvailableRegionsType {
  MAINLAND = 1,
  HK = 2,
  GLOBAL = 3,
  OTHER = 4,
}

export const availableRegions = (type: number, t: any) => {
  switch (type) {
    case AvailableRegionsType.MAINLAND:
      return t('region_mainland')
    case AvailableRegionsType.HK:
      return t('region_HongKong')
    case AvailableRegionsType.GLOBAL:
      return t('region_global')
    case AvailableRegionsType.OTHER:
      return t('region_other')
    default:
      return ''
  }
}
