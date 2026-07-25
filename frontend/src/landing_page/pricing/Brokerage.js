import React from "react";

function Brokerage() {
  return (
    <section className="container py-5">
      {/* Pricing Section */}
      <div className="row text-center justify-content-center">
        {/* Equity Delivery */}
        <div className="col-lg-4 col-md-6 mb-5">
          <img
            src="media/images/pricingEquity.svg"
            alt="Equity Delivery"
            className="img-fluid mb-4"
            style={{ height: "150px" }}
          />

          <h4>Equity delivery</h4>

          <p className="text-muted">
            Buy stocks and hold them for long term. Zero brokerage charges.
          </p>
        </div>

        {/* Mutual Funds */}
        <div className="col-lg-4 col-md-6 mb-5">
          <img
            src="media/images/pricingMF.svg"
            alt="Direct Mutual Funds"
            className="img-fluid mb-4"
            style={{ height: "150px" }}
          />

          <h4>Direct mutual funds</h4>

          <p className="text-muted">
            Invest in direct mutual funds with zero commission.
          </p>
        </div>

        {/* Intraday */}
        <div className="col-lg-4 col-md-6 mb-5">
          <img
            src="media/images/intradayTrades.svg"
            alt="Intraday Trading"
            className="img-fluid mb-4"
            style={{ height: "150px" }}
          />

          <h4>Intraday & F&O</h4>

          <p className="text-muted">Flat brokerage per executed order.</p>
        </div>
      </div>

      {/* Charges Heading */}
      <div className="row mt-5 mb-5">
        <div className="col text-center">
          <h2>Charges</h2>
        </div>
      </div>

      {/* Charges Details */}
      <div className="row mt-5 ">
        {/* Brokerage Calculator */}
        <div className="col-lg-8 text-left">
          <h5 className="mb-4">Brokerage calculator</h5>

          <ul className="text-muted text-start">
            <li className="mb-3">
              Call & Trade and RMS auto-squareoff: Additional charges of ₹50 +
              GST per order.
            </li>

            <li className="mb-3">
              Digital contract notes will be sent via email.
            </li>

            <li className="mb-3">
              Physical copies of contract notes, if required, will be charged
              ₹20 per contract note. Courier charges apply.
            </li>

            <li className="mb-3">
              For NRI account (Non-PIS), 0.5% or ₹100 per executed order for
              equity (whichever is lower).
            </li>

            <li className="mb-3">
              For NRI account (PIS), 0.5% or ₹200 per executed order of equity
              (whichever is lower).
            </li>

            <li className="mb-3">
              If the account is in debit balance, any order placed will be
              charged ₹40 per executed order instead of ₹20 per executed order.
            </li>
          </ul>
        </div>

        {/* List of Charges */}
        <div className="col-lg-4">
          <h5 className="mb-4">List of charges</h5>
          <ul
            className="list-unstyled text-muted"
            style={{ textAlign: "left" }}
          >
            <li className="mb-3">Equity delivery charges</li>

            <li className="mb-3">Intraday trading charges</li>

            <li className="mb-3">Futures & Options charges</li>

            <li className="mb-3">NRI account charges</li>

            <li className="mb-3">DP transaction charges</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Brokerage;
