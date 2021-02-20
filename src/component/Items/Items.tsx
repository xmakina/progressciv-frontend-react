import { Demand, ProductionList, Store, Supply, Upgrade } from 'progressciv/dist/component'
import { ISystem, Entity, HasComponent, getComponent, hasComponent } from 'progressciv/dist/utils'
import React, { ReactElement, useState } from 'react'
import StorageView from '../../interface/StorageView'
import ToEmoji, { HasEmoji } from '../../utils/ToEmoji'
import Requirements from '../Requirements/Requirements'
import './Items.css'
import ToggleButton from '../ToggleButton/ToggleButton'
import { UpgradeView } from '../../interface/UpgradeView'
import Upgrades from '../Upgrades/Upgrades'
import Productions from '../Productions/Productions'
import { useParams } from 'react-router-dom'
import { DisplayItem, EntityComponents } from '../../utils/DisplayItem'

export class ItemRenderSystem implements ISystem {
  public static setItems: any = () => {}

  update (_: number, entities: Entity[]): void {
    const store = getComponent(entities
      .filter(HasComponent(Store))[0], Store)
    const items = entities
      .filter(HasComponent(Demand))
      .filter(HasComponent(ProductionList))
      .filter(HasComponent(Supply))
      .map<EntityComponents>((e) => ({
      id: e.id,
      demand: getComponent(e, Demand),
      productionList: getComponent(e, ProductionList),
      supply: getComponent(e, Supply),
      upgrade: hasComponent(e, Upgrade) ? getComponent(e, Upgrade) : new Upgrade({ upgrades: [] })
    }))

    const itemsView: ItemView[] = items.map<ItemView>((i) => ({
      displayItem: DisplayItem(store, i),
      product: i.supply.product.resource,
      quantity: i.supply.product.quantity,
      storage: store.stocks[i.supply.product.resource],
      capacity: store.capacities[i.supply.product.resource],
      met: i.demand.met,
      productions: i.productionList.productions.map((p) => ({
        percent: Math.min(p.progress / p.productionTime * 100, 100),
        productionTime: p.productionTime
      })),
      open: i.demand.open,
      working: i.demand.working,
      canWork: i.productionList.maximumActive > 0,
      handleOpen: (): void => { i.demand.open = !i.demand.open },
      handleWorking: (): void => { i.demand.working = !i.demand.working },
      requirements: Object.keys(i.demand.demands)
        .map((k) => ({
          resource: k, quantity: i.demand.store.stocks[k] ?? 0, capacity: i.demand.store.capacities[k]
        })),
      upgrades: i.upgrade.upgrades.map((u) => ({
        amount: u.amount,
        aspect: u.aspect,
        operation: u.operation,
        demands: u.demands,
        requested: u.requested,
        requestToggle: (): void => {
          u.requested = !u.requested
        }
      }))
    }))

    ItemRenderSystem.setItems(itemsView)
  }
}

export interface ProductionView {
  percent: number
  productionTime: number
}

interface ItemView {
  displayItem: boolean
  product: string
  quantity: number
  storage: number
  capacity: number
  requirements: StorageView[]
  met: boolean
  productions: ProductionView[]
  open: boolean
  working: boolean
  canWork: boolean
  handleOpen: () => void
  handleWorking: () => void
  upgrades: UpgradeView[]
}

const ToItem = (item: ItemView, i: number): ReactElement =>
  <div className='item' key={i}>
    {i === 0 &&
      <h1 className='label'>
        {ToEmoji(item.product)} <span hidden={!HasEmoji(item.product)}>{item.product}</span>
      </h1>}
    {item.displayItem &&
      <div className='item-details'>
        <div className='storehouse'>
          <div className='open-button'>
            {item.canWork && item.requirements.length > 0 && <ToggleButton icon={ToEmoji('allow demand to be met')} state={item.open} onClick={() => item.handleOpen()} />}
          </div>
          <Requirements requirements={item.requirements} met={item.met} />
        </div>
        <div className='workhouse'>
          <div className='working-button'>
            {item.canWork && <ToggleButton icon={ToEmoji('allow production')} state={item.working} onClick={() => item.handleWorking()} />}
          </div>
          <Productions productions={item.productions} />
        </div>
        <Upgrades upgrades={item.upgrades} />
      </div>}
  </div>

interface Params {
  id: string
}

export default function Items (): ReactElement {
  const { id } = useParams<Params>()
  const [items, setItems] = useState<ItemView[]>([])
  ItemRenderSystem.setItems = setItems

  return (
    <div id='items'>
      {items.filter((i) => i.product === id).map(ToItem)}
    </div>
  )
}
