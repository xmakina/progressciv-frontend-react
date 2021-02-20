import React, { ReactElement } from 'react'
import {
  Switch,
  Route
} from 'react-router-dom'
import Items from '../Items/Items'
import Storage from '../Storage/Storage'
import './Home.css'

export default function Home (): ReactElement {
  return (
    <div className='home'>
      <Storage />
      <Switch>
        <Route path='/:id'>
          <Items />
        </Route>
      </Switch>
    </div>
  )
}
