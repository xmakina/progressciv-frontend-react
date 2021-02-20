import { ReactElement } from 'react'

const emoji: {[index: string]: string} = {
  wheat: '🌽',
  worker: '💪',
  wood: '🌳',
  farm: '🌾🌾',
  forest: '🌲🌲🌲',
  'large-red-circle': '🔴',
  'large-green-circle': '🟢',
  'allow production': '⚙️',
  'allow demand to be met': '📦',
  time: '⌛',
  quantity: '⬆️',
  'shopping-cart': '🛒',
  production: '⚙️',
  'building-site': '🏗️'
}

export function HasEmoji (label: string): boolean {
  return emoji[label] !== undefined
}

export default function ToEmoji (label: string): ReactElement {
  return (<span title={label}>{emoji[label] === undefined ? label : emoji[label]}</span>)
}
