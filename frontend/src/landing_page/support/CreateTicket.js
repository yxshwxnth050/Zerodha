import React from "react";

function CreateTicket() {

  const topics = [
    {
      icon: "fa-solid fa-user-plus",
      title: "Account Opening",
      links: [
        "Online Account Opening",
        "Offline Account Opening",
        "Company, Partnership and HUF Account",
        "NRI Account Opening",
        "Charges at Zerodha",
        "Zerodha IDFC FIRST Bank 3-in-1 Account",
        "Getting Started",
      ],
    },

    {
      icon: "fa-solid fa-chart-line",
      title: "Trading & Investing",
      links: [
        "Kite Trading Platform",
        "Orders and Positions",
        "Intraday Trading",
        "Equity Trading",
        "Mutual Funds",
        "Futures and Options",
      ],
    },

    {
      icon: "fa-solid fa-wallet",
      title: "Funds",
      links: [
        "Add Funds",
        "Withdraw Funds",
        "Bank Account Issues",
        "Payment Problems",
        "Fund Transfer",
      ],
    },

    {
      icon: "fa-solid fa-file-lines",
      title: "Console",
      links: [
        "Reports",
        "Tax P&L",
        "Account Statements",
        "Portfolio Reports",
      ],
    },

    {
      icon: "fa-solid fa-coins",
      title: "Coin",
      links: [
        "Mutual Fund Investments",
        "SIP Related Queries",
        "Redemption Issues",
      ],
    },

    {
      icon: "fa-solid fa-headset",
      title: "Other Queries",
      links: [
        "General Support",
        "Account Related Issues",
        "Technical Issues",
      ],
    },
  ];


  return (
    <section className="container py-5">


      <h1 className="fs-3 mb-5">
        To create a ticket, select a relevant topic
      </h1>


      <div className="row">

        {
          topics.map((topic, index) => (

            <div
              className="col-lg-4 col-md-6 mb-5"
              key={index}
            >

              <h4 className="mb-4">

                <i
                  className={`${topic.icon} me-3 text-secondary`}
                ></i>

                {topic.title}

              </h4>


              <ul className="list-unstyled">

                {
                  topic.links.map((link, i) => (

                    <li
                      key={i}
                      className="mb-3"
                    >

                      <a
                        href="/support"
                        className="text-decoration-none text-primary" 
                        
                      >
                        {link}
                      </a>

                    </li>

                  ))
                }

              </ul>

            </div>

          ))
        }

      </div>

    </section>
  );
}

export default CreateTicket;
