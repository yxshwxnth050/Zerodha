import React from "react";

function Universe() {
  return (
    <section className="container py-5">
      {/* Technology Blog */}
      <div className="text-center mb-5">
        <h5 className="fw-normal">
          Want to know more about our technology stack?{" "}
<a href="/signup" className="text-decoration-none">
            Check out the Zerodha.tech blog →
          </a>
        </h5>
      </div>

      {/* Heading */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">The Zerodha Universe</h2>
        <p className="text-muted fs-5">
          Extend your trading and investment experience even further with our
          partner platforms.
        </p>
      </div>

      {/* Partners */}
      <div className="row text-center g-5">

        <div className="col-md-4">
          <img
              src="/Media/images/smallcaseLogo.png"
            alt="Smallcase"
            className="img-fluid mb-3"
            style={{ maxHeight: "40px" }}
          />
          <p className="text-muted">
            Thematic investing platform that helps you invest in diversified
            baskets of stocks and ETFs.
          </p>
        </div>

        <div className="col-md-4">
          <img
              src="/Media/images/streakLogo.png"
            alt="Streak"
            className="img-fluid mb-3"
            style={{ maxHeight: "40px" }}
          />
          <p className="text-muted">
            Systematic trading platform that lets you create and backtest
            trading strategies without coding.
          </p>
        </div>

        <div className="col-md-4">
          <img
              src="/Media/images/sensibullLogo.svg"
            alt="Sensibull"
            className="img-fluid mb-3"
            style={{ maxHeight: "40px" }}
          />
          <p className="text-muted">
            Options trading platform with advanced analytics and strategy
            building tools.
          </p>
        </div>

        <div className="col-md-4">
          <img
              src="/Media/images/goldenpiLogo.png"
            alt="GoldenPi"
            className="img-fluid mb-3"
            style={{ maxHeight: "40px" }}
          />
          <p className="text-muted">
            Invest in high-quality fixed-income bonds with ease.
          </p>
        </div>

        <div className="col-md-4">
          <img
              src="/Media/images/dittoLogo.png"
            alt="Ditto"
            className="img-fluid mb-3"
            style={{ maxHeight: "40px" }}
          />
          <p className="text-muted">
            Get expert advice on health and life insurance without spam.
          </p>
        </div>

        <div className="col-md-4">
          <img
              src="/Media/images/zerodhaFundhouse.png"
            alt="Zerodha Fund House"
            className="img-fluid mb-3"
            style={{ maxHeight: "40px" }}
          />
          <p className="text-muted">
            Simple, low-cost index mutual funds for long-term investing.
          </p>
        </div>

      </div>

      {/* CTA */}
      <div className="text-center mt-5">
        <button className="btn btn-primary px-4 py-2">
          Sign up for free
        </button>
      </div>
    </section>
  );
}

export default Universe;
