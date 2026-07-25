import React from "react";

function Hero() {
  return (
    <section className="container py-5 border-bottom">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center">
          <h1 className="text-muted  mb-3">Zerodha Products</h1>

          <p className="fs-5 text-muted mb-4">
            Sleek, modern, and intuitive trading platforms designed for every
            type of investor.
          </p>

          <p className="mb-0 fs-6">
            Check out our{" "}
<a href="/signup" className="text-decoration-none text-primary fw-medium">
              investment offerings
              <i className="fa-solid fa-arrow-right-long ms-2"></i>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
