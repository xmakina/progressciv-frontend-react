import { ReactElement, ReactNode } from 'react'
import './ProgressBar.css'

interface Props {
  percent: number
  always?: boolean
  children?: ReactNode
}

export default function ProgressBar ({ percent = 0, always = false, children }: Props): ReactElement {
  return (
    <div className='production-bar' style={{ width: '100%' }}>
      <span className='label'>{children}</span>
      {!always && <div className='production-progress-bar bg-success' style={{ width: `${percent}%` }} />}
      {always && <div className='production-progress-bar bg-success meter always'><span style={{ width: '100%' }}><span /></span></div>}
    </div>
  )
}
