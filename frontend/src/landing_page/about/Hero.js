import React from "react";

function Hero() {
  return (
    <section className="container py-5">
      <div className="row justify-content-center text-center py-4">
        <div className="col-lg-8">
          <h2 className="fs-4 fw-normal text-dark lh-base">
            We pioneered the discount broking model in India.
            <br />
            Now, we are breaking ground with our technology.
          </h2>
        </div>
      </div>

      <div className="border-top pt-5">
        <div className="row justify-content-center g-5">
          <div className="col-lg-5 col-md-12">
            <p className="fs-6 text-secondary lh-lg">
              We kick-started operations on the 15th of August, 2010 with the
              goal of breaking all barriers that traders and investors face in
              India in terms of cost, support, and technology. We named the
              company Zerodha, a combination of Zero and "Rodha", the Sanskrit
              word for barrier.
            </p>

            <p className="fs-6 text-secondary lh-lg">
              Today, our disruptive pricing models and in-house technology have
              made us the biggest stock broker in India.
            </p>

            <p className="fs-6 text-secondary lh-lg">
              Over 1.6+ crore clients place billions of orders every year through
              our powerful ecosystem of investment platforms, contributing over
              15% of all Indian retail trading volumes.
            </p>
          </div>

          <div className="col-lg-5 col-md-12">
            <p className="fs-6 text-secondary lh-lg">
              In addition, we run a number of popular open online educational and
              community initiatives to empower retail traders and investors.
            </p>

            <p className="fs-6 text-secondary lh-lg">
              Rainmatter, our fintech fund and incubator, has invested in several
              fintech startups with the goal of growing the Indian capital
              markets.
            </p>

            <p className="fs-6 text-secondary lh-lg">
              And yet, we are always up to something new every day. Catch up on
              the latest updates on our blog or see what the media is saying
              about us or learn more about our business and product philosophies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;