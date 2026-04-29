import { useContext } from 'react'
import { LandingContext } from './landingStore'

export function useLanding() {
  const context = useContext(LandingContext)
  if (!context) {
    throw new Error('useLanding must be used inside LandingProvider')
  }
  return context
}
