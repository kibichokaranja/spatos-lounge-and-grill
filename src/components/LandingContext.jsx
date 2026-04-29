import { useMemo, useState } from 'react'
import { LandingContext } from './landingStore'

export function LandingProvider({ children }) {
  const [isLandingVisible, setIsLandingVisible] = useState(true)
  const [pendingPath, setPendingPath] = useState(null)
  const [landingMode, setLandingMode] = useState('initialDrop')
  const value = useMemo(
    () => ({ isLandingVisible, setIsLandingVisible, pendingPath, setPendingPath, landingMode, setLandingMode }),
    [isLandingVisible, pendingPath, landingMode],
  )
  return <LandingContext.Provider value={value}>{children}</LandingContext.Provider>
}
