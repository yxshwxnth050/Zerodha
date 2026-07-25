import React from "react";

function Hero() {
  return (
    <section className="container-fluid" id="supportHero">

      {/* Header */}
      <div className="container py-4 d-flex justify-content-between align-items-center">

        <h4 className="mb-0">
          Support Portal
        </h4>

        <a
          href="/support"
          className="text-decoration-none"
        >
          Track Tickets
        </a>

      </div>



      {/* Main Section */}
      <div className="container py-5">

        <div className="row">


          {/* Search Area */}
          <div className="col-lg-7">

            <h1 className="fs-3 mb-4">
              Search for an answer or browse help topics
              to create a ticket
            </h1>


            <input
              type="text"
              className="form-control form-control-lg mb-4"
              placeholder="Eg. How do I activate F&O?"
            />


            <div className="d-flex flex-wrap gap-4">

              <a href="/support" className="text-decoration-none">
                Track account opening
              </a>

              <a href="/support" className="text-decoration-none">
                Track segment activation
              </a>

              <a href="/support" className="text-decoration-none">
                Intraday margins
              </a>

              <a href="/support" className="text-decoration-none">
                Kite user manual
              </a>

            </div>


          </div>




          {/* Featured Section */}
          <div className="col-lg-5 mt-5 mt-lg-0">

            <h1 className="fs-3 mb-4">
              Featured
            </h1>


            <ol className="ps-3">

              <li className="mb-3">

                <a
                  href="/support"
                  className="text-decoration-none"
                >
                  Current Takeovers and Delisting -
                  January 2024
                </a>

              </li>


              <li className="mb-3">

                <a
                  href="/support"
                  className="text-decoration-none"
                >
                  Latest Intraday leverages -
                  MIS & CO
                </a>

              </li>


            </ol>


          </div>


        </div>

      </div>

    </section>
  );
}

export default Hero;
