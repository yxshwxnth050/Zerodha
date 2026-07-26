import React from "react";

function Team() {
  return (
    <section className="container py-5">
      <div className="border-top pt-5">
        <div className="row justify-content-center g-5 align-items-center">
          <div className="col-lg-5 col-md-12 text-center">
            <img
                src="/Media/images/nithinKamath.jpg"
              alt="Nithin Kamath"
              className="img-fluid rounded-circle shadow-sm"
              style={{
                width: "280px",
                height: "280px",
                objectFit: "cover",
              }}
            />
          </div>

          <div className="col-lg-5 col-md-12">
          <h2 className="fs-4 fw-normal text-dark lh-base">People</h2>
            <p className="fs-6 text-secondary lh-lg">
              Nithin bootstrapped and founded Zerodha in 2010 to overcome the
              hurdles he faced during his decade long stint as a trader.
              Today, Zerodha has changed the landscape of the Indian broking
              industry. He is a member of the SEBI Secondary Market Advisory
              Committee (SMAC) and the Market Data Advisory Committee (MDAC).
              Playing basketball is his zen.
            </p>

            <h5 className="mt-4 fw-normal text-dark">
              Nithin Kamath
            </h5>
            <span className="text-muted">
              Founder & CEO, Zerodha
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Team;
