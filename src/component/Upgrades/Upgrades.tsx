import React, { ReactElement } from 'react'
import { UpgradeView } from '../../interface/UpgradeView'
import ToEmoji from '../../utils/ToEmoji'
import ToggleButton from '../ToggleButton/ToggleButton'
import './Upgrades.css'
interface Props {
  upgrades: UpgradeView[]
}

const ToDemand = (k: string, amount: number, u: UpgradeView): ReactElement =>
  <div className='demand' key={k}>
    <div className='resource'>{ToEmoji(k)}</div>
    <div className='amount'>x{amount}</div>
    <ToggleButton icon={ToEmoji('shopping-cart')} state={u.requested} onClick={() => u.requestToggle()} />
  </div>

const ToUpgrade = (u: UpgradeView, index: number): ReactElement =>
  <div className='upgrade' key={index}>
    <div className='effect'>
      <div className='aspect'>{ToEmoji(u.aspect)}</div>
      <div className='improvement'>{u.operation}{u.amount}</div>
    </div>
    <div className='demands'>{Object.keys(u.demands).map((k) => ToDemand(k, u.demands[k], u))}</div>
  </div>

export default function Upgrades ({ upgrades }: Props): ReactElement {
  return (
    <div className='upgrades'>
      {upgrades
        .sort((a, b) => a.aspect < b.aspect ? 1 : -1)
        .map(ToUpgrade)}
    </div>
  )
}
