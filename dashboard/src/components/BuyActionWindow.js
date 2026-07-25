import React, { useState, useContext } from "react";
import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const generalContext = useContext(GeneralContext);

  const handleBuyClick = async () => {
    const qty = Number(stockQuantity);
    const price = Number(stockPrice);

    if (!Number.isFinite(qty) || qty <= 0) {
      setError("Enter a quantity greater than 0");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid price");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await axios.post("http://localhost:3002/newOrder", {
        name: uid,
        qty,
        price,
        mode: "BUY",
      });
      console.log(res.data);
      generalContext.closeBuyWindow();
    } catch (err) {
      console.error("Unable to place order", err);
      setError("Order failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="header">
        <h3>
          BUY {uid} <span>NSE</span>
        </h3>
      </div>

      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min="0"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>

        {error && <p className="form-error">{error}</p>}
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>

        <div>
          <button
            type="button"
            className="btn btn-blue"
            onClick={handleBuyClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing..." : "Buy"}
          </button>

          <button
            type="button"
            className="btn btn-grey"
            onClick={handleCancelClick}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;