import React, { ReactElement } from 'react'
import { ProductionView } from '../Items/Items'
import ProgressBar from '../ProgressBar/ProgressBar'
import './Production.css'

const ToProduction = (item: ProductionView, index: number): ReactElement =>
  <div className='production' key={index}>
    <ProgressBar percent={item.percent} always={(item.productionTime / 1000).toFixed(2) === '0.00'} />
  </div>

interface Props {
  productions: ProductionView[]
}

export default function Productions ({ productions }: Props): ReactElement {
  return (
    <div className='productions'>
      {productions.map(ToProduction)}
    </div>
  )
}
