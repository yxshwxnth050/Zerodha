import React from 'react';

function OpenAccount() {
    return (  
        <div className='container py-5 mb-5'>
            <div className='row text-center align-items-center'>

                <h1 className='mt-4 fw'>
                    Open a Zerodha account
                </h1>

                <p className='text-muted mb-4'>
                    Modern platforms and apps, ₹0 investments, and flat ₹20
                    intraday and F&O trades.
                </p>

                <button
                    className='btn btn-primary fs-5 mb-5'
                    style={{width:"180px", margin:"0 auto"}}
                >
                    Sign up for free
                </button>

            </div>
        </div>
    );
}

export default OpenAccount;
