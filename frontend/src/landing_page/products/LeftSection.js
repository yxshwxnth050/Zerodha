import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <section className="container py-5">
      <div className="row align-items-center">
        {/* Left Image */}
        <div className="col-lg-6 text-center mb-4 mb-lg-0">
          <img
            src={imageURL}
            alt={productName}
            className="img-fluid"
            style={{ maxWidth: "90%" }}
          />
        </div>

        {/* Right Content */}
        <div className="col-lg-6">
          <h2 className="fw-bold mb-4">{productName}</h2>

          <p className="text-muted fs-5 mb-4">{productDescription}</p>

          {/* Links */}
          <div className="d-flex flex-wrap gap-4 mb-4">
            <a
              href={tryDemo}
              className="text-decoration-none fw-semibold text-primary"
            >
              Try Demo
              <i className="fa-solid fa-arrow-right-long ms-2"></i>
            </a>

            <a
              href={learnMore}
              className="text-decoration-none fw-semibold text-primary"
            >
              Learn More
              <i className="fa-solid fa-arrow-right-long ms-2"></i>
            </a>
          </div>

          {/* Store Buttons */}
          <div className="d-flex gap-3 flex-wrap">
            <a href={googlePlay}>
              <img
              src="/Media/images/googlePlayBadge.svg"
                alt="Google Play"
                className="img-fluid"
                style={{ height: "50px" }}
              />
            </a>

            <a href={appStore}>
              <img
              src="/Media/images/appstoreBadge.svg"
                alt="App Store"
                className="img-fluid"
                style={{ height: "50px" }}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LeftSection;
