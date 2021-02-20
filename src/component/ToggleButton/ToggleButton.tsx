import { ReactElement } from 'react'
import './ToggleButton.css'

interface Props {
  onClick: () => void
  state?: boolean
  icon: ReactElement
}

export default function ToggleButton ({ onClick = () => {}, state = false, icon }: Props): ReactElement {
  return (
    <div className={`button ${state ? 'open' : 'closed'}`} onClick={onClick}>
      {icon}
    </div>
  )
}
