import { Demand, ProductionList, Store, Supply, Upgrade, Entity, getComponent, hasComponent, HasComponent, ISystem } from 'progressciv'
import React, { ReactElement, useState } from 'react'
import { Link } from 'react-router-dom'
import { DisplayItem, EntityComponents } from '../../utils/DisplayItem'
import ToEmoji from '../../utils/ToEmoji'
import ToggleButton from '../ToggleButton/ToggleButton'
import './Storage.css'

interface StorageView {
  display: boolean
  product: string
  amount: number
  capacity: number
  open: boolean
  hasRequirements: boolean
  working: boolean
  canWork: boolean
  handleOpen: () => void
  handleWorking: () => void
}

export class StorageRenderSystem implements ISystem {
  public static setStorage: any = () => { }

  update (_: number, entities: Entity[]): void {
    const store = getComponent(entities
      .filter(HasComponent(Store))[0], Store)
    const items = entities
      .filter(HasComponent(Demand))
      .filter(HasComponent(ProductionList))
      .filter(HasComponent(Supply))
      .map<EntityComponents>((e) => ({
      demand: getComponent(e, Demand),
      productionList: getComponent(e, ProductionList),
      supply: getComponent(e, Supply),
      upgrade: hasComponent(e, Upgrade) ? getComponent(e, Upgrade) : new Upgrade({ upgrades: [] })
    }))

    const itemsView: StorageView[] = items.map<StorageView>((i) => ({
      display: DisplayItem(store, i),
      product: i.supply.product.resource,
      amount: store.stocks[i.supply.product.resource] ?? 0,
      capacity: store.capacities[i.supply.product.resource],
      open: i.demand.open,
      working: i.demand.working,
      canWork: i.productionList.maximumActive > 0,
      hasRequirements: Object.keys(i.demand.demands).length > 0,
      handleOpen: (): void => { i.demand.open = !i.demand.open },
      handleWorking: (): void => { i.demand.working = !i.demand.working }
    }))

    StorageRenderSystem.setStorage(itemsView)
  }
}

const ToStorageView = (unique: Unique<StorageView>, index: number): ReactElement =>
  <tr key={index}>
    <td className='open-button'>
      {unique.isUnique && unique.value.hasRequirements && unique.value.canWork && <ToggleButton icon={ToEmoji('allow demand to be met')} state={unique.value.open} onClick={() => unique.value.handleOpen()} />}
    </td>

    <td className='working-button'>
      {unique.isUnique && unique.value.canWork && <ToggleButton icon={ToEmoji('allow production')} state={unique.value.working} onClick={() => unique.value.handleWorking()} />}
    </td>

    <td className='product'>
      <Link to={`/${unique.value.product}`}>{ToEmoji(unique.value.product)}</Link>
    </td>
    <td className='stockpile'>
      <Link to={`/${unique.value.product}`}>
        {Math.floor(unique.value.amount)} / {unique.value.capacity}
      </Link>
    </td>
  </tr>

interface Unique<T> {
  value: T
  isUnique: boolean
}

export default function Storage (): ReactElement {
  const [storage, setStorage] = useState<StorageView[]>([])
  StorageRenderSystem.setStorage = setStorage

  const displayedResources = storage.filter((s) => s.display)

  const addUniqueness = displayedResources.map<Unique<StorageView>>((thing) => {
    const _thing = thing
    return {
      value: thing,
      isUnique: storage.filter(obj => {
        return obj.product === _thing.product
      }).length === 1
    }
  })

  const uniqueArray = addUniqueness.filter((thing, index) => {
    return index === addUniqueness.findIndex(obj => {
      return obj.value.product === thing.value.product
    })
  })

  return (
    <table className='storage'>
      <tbody>
        {uniqueArray.map(ToStorageView)}
      </tbody>
    </table>
  )
}
