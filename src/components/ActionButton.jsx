import { useLanding } from './useLanding'
import { useNavigate } from 'react-router-dom'

export function ActionButton({ to, children, className = 'btn btn-primary', ariaLabel }) {
  const { setIsLandingVisible, setPendingPath, setLandingMode } = useLanding()
  const navigate = useNavigate()

  const handleClick = () => {
    setLandingMode('routeBack')
    setPendingPath(to)
    setIsLandingVisible(true)
    setTimeout(() => {
      navigate(to)
      setPendingPath(null)
      setIsLandingVisible(false)
    }, 520)
  }

  return (
    <button type="button" className={className} onClick={handleClick} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
