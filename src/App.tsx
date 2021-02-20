import React, { ReactElement, useMemo, useRef } from 'react'
import { ProgressCivAPI } from 'progressciv'
import { ItemRenderSystem } from './component/Items/Items'
import BaseItems from './conf/BaseItems.json'
import './App.css'
import Home from './component/Home/Home'
import { StorageRenderSystem } from './component/Storage/Storage'
import { HashRouter } from 'react-router-dom'
import logo from './logo.png'

let isRunning: boolean = false
const Update = (progressCivAPI: ProgressCivAPI): void => {
  if (!isRunning) {
    isRunning = true
  } else {
    console.log('killed')
    return
  }

  window.setTimeout(() => {
    progressCivAPI.Update()
    isRunning = false
    Update(progressCivAPI)
  }, 25)
}

function App (): ReactElement {
  const save = useRef<() => string>()

  useMemo(() => {
    const progressCivAPI = new ProgressCivAPI(BaseItems)
    const itemRenderSystem = new ItemRenderSystem()
    const storageRenderSystem = new StorageRenderSystem()

    progressCivAPI.Instance.systems.push(itemRenderSystem)
    progressCivAPI.Instance.systems.push(storageRenderSystem)

    save.current = () => progressCivAPI.Save()
    Update(progressCivAPI)
    isRunning = true
  }, [])

  return (
    <div>
      <div className='App-header'>
        <div className='App-logo'>
          <img src={logo} alt='progress civ' />
        </div>
      </div>
      <div className='App'>
        <HashRouter>
          <Home />
        </HashRouter>
      </div>
    </div>
  )
}

export default App
