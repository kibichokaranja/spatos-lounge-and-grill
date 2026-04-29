import { useLanding } from './useLanding'

export function ActionButton({ to, children, className = 'btn btn-primary', ariaLabel }) {
  const { setIsLandingVisible, setPendingPath } = useLanding()

  const handleClick = () => {
    setPendingPath(to)
    setIsLandingVisible(true)
  }

  return (
    <button type="button" className={className} onClick={handleClick} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
