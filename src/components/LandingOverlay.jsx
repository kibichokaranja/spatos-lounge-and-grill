export function LandingOverlay({ mode }) {
  return (
    <div
      className={`landing-overlay ${mode === 'routeBack' ? 'is-route-back' : 'is-initial-drop'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome screen"
    >
      <div className="landing-card">
        <div className="logo-glow" aria-hidden="true">
          S
        </div>
        <h1>Welcome to Spatos Lounge&Grill</h1>
      </div>
    </div>
  )
}
