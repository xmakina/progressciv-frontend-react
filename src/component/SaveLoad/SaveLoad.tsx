import { ReactElement } from 'react'

interface Props {
  save: () => string
}

export default function SaveLoad ({ save }: Props): ReactElement {
  return (
    <div className='saveload'>
      <button onClick={() => console.log(save())}>Save</button>
    </div>
  )
}
