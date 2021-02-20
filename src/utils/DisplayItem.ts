import { Demand, ProductionList, Store, Supply, Upgrade } from 'progressciv/dist/component'

export const DisplayItem = (store: Store, i: EntityComponents): boolean => {
  const hasProduction = i.productionList.maximumActive > 0
  const hasExisted = store.existed[i.supply.product.resource]
  const hasNoDemands = Object.keys(i.demand.demands).length === 0
  const hasAllDemandsCreated = Object.keys(i.demand.demands).reduce<boolean>((acc, k) => acc && store.existed[k], true)
  const hasProductionUpgrades = i.upgrade.upgrades.filter((u) => u.aspect === 'production').length > 0
  const hasProductionUpgradesWhichCanBeBuilt = i.upgrade.upgrades
    .filter((u) => u.aspect === 'production')
    .reduce<string[]>((acc, u) => [...acc, ...Object.keys(u.demands)], [])
    .reduce<boolean>((acc, k) => acc && store.existed[k], true)

  if (hasExisted) {
    return true
  }

  if (hasProduction && hasNoDemands) {
    return true
  }

  if (hasProduction && hasAllDemandsCreated) {
    return true
  }

  if (hasProductionUpgrades && hasProductionUpgradesWhichCanBeBuilt) {
    return true
  }

  return false
}

export interface EntityComponents {
  demand: Demand
  productionList: ProductionList
  supply: Supply
  upgrade: Upgrade
}
