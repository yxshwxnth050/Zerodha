import React from "react";
import "./Footer.css";

function Footer() {
    return (
        <footer style={{backgroundColor:"rgb(250, 250, 250)"}}>

            <div className="container border-top mt-5">

                <div className="row mt-5">

                    <div className="col-lg-3 col-md-6 mb-4">
                        <img
                            src="/Media/images/logo.svg"
                            alt="Zerodha"
                            style={{width:"50%"}}
                        />

                        <p className="mt-3 text-muted">
                            &copy; 2010 - 2026, Zerodha Broking Ltd.
                            All rights reserved.
                        </p>

                        <div className="mt-4">
                            <i className="fa fa-twitter mx-2"></i>
                            <i className="fa fa-facebook mx-2"></i>
                            <i className="fa fa-instagram mx-2"></i>
                            <i className="fa fa-linkedin mx-2"></i>
                        </div>
                    </div>


                    <div className="col-lg-3 col-md-6 mb-4">
                        <h6>
                            Company
                        </h6>

                        <a href="/about">About</a>
                        <a href="/products">Products</a>
                        <a href="/pricing">Pricing</a>
                        <a href="/signup">Referral programme</a>
                        <a href="/about">Careers</a>
                        <a href="/products">Zerodha.tech</a>
                        <a href="/about">Press & media</a>
                        <a href="/about">Zerodha cares (CSR)</a>
                    </div>


                    <div className="col-lg-3 col-md-6 mb-4">
                        <h6>
                            Support
                        </h6>

                        <a href="/support">Contact</a>
                        <a href="/support">Support portal</a>
                        <a href="/support">Z-Connect blog</a>
                        <a href="/pricing">List of charges</a>
                        <a href="/support">Downloads & resources</a>
                    </div>


                    <div className="col-lg-3 col-md-6 mb-4">
                        <h6>
                            Account
                        </h6>

                        <a href="/signup">Open an account</a>
                        <a href="/signup">Fund transfer</a>
                        <a href="/signup">60 day challenge</a>
                    </div>

                </div>


                <div className="mt-5 text-muted footer-text">

                    <p>
                        Zerodha Broking Ltd.: Member of NSE & BSE – SEBI Registration
                        no.: INZ000031633. CDSL: Depository services through Zerodha
                        Securities Pvt. Ltd. Registered Address: Zerodha Broking Ltd.,
                        #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School,
                        J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India.
                    </p>


                    <p>
                        Procedure to file a complaint on SEBI SCORES: Register on
                        SCORES portal. Mandatory details for filing complaints:
                        Name, PAN, Address, Mobile Number, E-mail ID.
                    </p>


                    <p>
                        Investments in securities market are subject to market risks;
                        read all the related documents carefully before investing.
                    </p>


                    <p>
                        Prevent unauthorised transactions in your account. Update your
                        mobile numbers/email IDs with your stock brokers. Receive
                        transaction information directly from Exchange on your
                        mobile/email.
                    </p>

                </div>

            </div>

        </footer>
    );
}

export default Footer;
