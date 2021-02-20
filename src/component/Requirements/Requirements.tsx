import React, { ReactElement } from 'react'
import StorageView from '../../interface/StorageView'
import ToEmoji from '../../utils/ToEmoji'
import ProgressBar from '../ProgressBar/ProgressBar'
import './Requirements.css'

interface Props {
  requirements?: StorageView[]
  met?: boolean
}

const ToRequirement = (r: StorageView, i: number): ReactElement =>
  <div className='requirement' key={i}>
    <ProgressBar percent={(r.quantity / r.capacity) * 100}>
      {r.quantity} / {r.capacity} {ToEmoji(r.resource)}
    </ProgressBar>
  </div>

export default function Requirements ({ requirements = [], met = false }: Props): ReactElement {
  if (requirements.length === 0) {
    return (<div className='requirements none' />)
  }

  return (
    <div className='requirements'>
      {requirements.map(ToRequirement)}
    </div>
  )
}
