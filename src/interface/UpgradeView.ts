export interface UpgradeView {
  aspect: string
  operation: string
  amount: number
  demands: {[index: string]: number}
  requested: boolean
  requestToggle: () => void
}
