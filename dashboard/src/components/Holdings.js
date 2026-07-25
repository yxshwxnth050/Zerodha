import React, { useState, useEffect } from "react";
import axios from "axios";

const fmt = (n) => (Number.isFinite(n) ? n.toFixed(2) : "—");

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3002/allHoldings").then((res) => {
      setAllHoldings(res.data);
    });
  }, []);

  const totalInvestment = allHoldings.reduce(
    (sum, s) => sum + (s.avg || 0) * (s.qty || 0),
    0
  );
  const totalCurrent = allHoldings.reduce(
    (sum, s) => sum + (s.price || 0) * (s.qty || 0),
    0
  );
  const totalPL = totalCurrent - totalInvestment;
  const totalPLPercent = totalInvestment ? (totalPL / totalInvestment) * 100 : 0;

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&amp;L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = (stock.price || 0) * (stock.qty || 0);
              const profitLoss = curValue - (stock.avg || 0) * (stock.qty || 0);
              const profClass = profitLoss >= 0 ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{fmt(stock.avg)}</td>
                  <td>{fmt(stock.price)}</td>
                  <td>{fmt(curValue)}</td>
                  <td className={profClass}>{fmt(profitLoss)}</td>
                  <td className={profClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>{fmt(totalInvestment)}</h5>
          <p>Total investment</p>
        </div>

        <div className="col">
          <h5>{fmt(totalCurrent)}</h5>
          <p>Current value</p>
        </div>

        <div className="col">
          <h5 className={totalPL >= 0 ? "profit" : "loss"}>
            {fmt(totalPL)} ({totalPLPercent >= 0 ? "+" : ""}
            {totalPLPercent.toFixed(2)}%)
          </h5>
          <p>P&amp;L</p>
        </div>
      </div>
    </>
  );
};

export default Holdings;