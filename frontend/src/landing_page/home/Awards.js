import React from 'react';

function Awards() {
  return (
    <div className="container py-5">
      <div className="row align-items-center">

        <div className="col-lg-6 text-center">
          <img
            src="/Media/images/largestBroker.svg"
            alt="Largest Broker"
            className="img-fluid"
            style={{ maxWidth: "85%" }}
          />
        </div>

        <div className="col-lg-6 mt-5 mt-lg-0">
          <h2 className="fw mb-4">
            Largest stock broker in India
          </h2>

          <p className="text-muted mb-4">
            2+ million Zerodha clients contribute to over 15% of all retail
            order volumes in India daily by trading and investing in:
          </p>

          <div className="row">
            <div className="col-6">
              <ul className="lh-lg">
                <li>Futures and Options</li>
                <li>Commodity derivatives</li>
                <li>Currency derivatives</li>
              </ul>
            </div>

            <div className="col-6">
              <ul className="lh-lg">
                <li>Stocks and IPOs</li>
                <li>Direct Mutual Funds</li>
                <li>Bonds and Government Securities</li>
              </ul>
            </div>
          </div>

          <img
            src="/Media/images/pressLogos.png"
            alt="Press Logos"
            className="img-fluid mt-4"
            style={{ maxWidth: "90%" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Awards;
