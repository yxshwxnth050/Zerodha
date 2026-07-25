import React from "react";
import { Link } from "react-router-dom";

const Orders = () => {
  return (
    <div className="orders">
      <div className="no-orders">
        <h3 className="title">No orders yet today</h3>
        <p>Orders you place will show up here once the market's open.</p>

        <Link to={"/"} className="btn btn-blue">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
};

export default Orders;