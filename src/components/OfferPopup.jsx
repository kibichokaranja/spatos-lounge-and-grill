export function OfferPopup({ onClose }) {
  return (
    <div className="offer-popup" role="dialog" aria-modal="true" aria-label="Special offer">
      <div className="offer-card">
        <p className="eyebrow">Limited Offer</p>
        <h3>Grand Opening Benefit</h3>
        <p>Book today and enjoy 15% off selected stays plus a complimentary welcome mocktail.</p>
        <button type="button" className="btn btn-primary" onClick={onClose}>
          Claim Offer
        </button>
      </div>
    </div>
  )
}
