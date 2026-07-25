import React from "react";

function RightSection({
  imageURL,
  productName,
  productDescription,
  learnMore,
}) {
  return (
    <section className="container py-5">
      <div className="row align-items-center">
        
        {/* Content Section */}
        <div className="col-lg-6">
          <h2 className="fw-bold mb-3">{productName}</h2>

          <p className="text-muted fs-5 mb-4">
            {productDescription}
          </p>

          <a
            href={learnMore}
            className="btn btn-outline-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More →
          </a>
        </div>
        {/* Image Section */}
        <div className="col-lg-6 text-center mt-4 mt-lg-0">
        <img
            src={imageURL}
            alt={productName}
            className="img-fluid"
            style={{  width: "100%" }}
        />
        </div>
        </div>
    </section>
  );
}

export default RightSection;