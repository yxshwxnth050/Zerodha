import React from 'react';

function Pricing() {
    return (  
        <div className='container py-5'>
            <div className='row align-items-center'>
                <div className='col-lg-5'>
                    <h2 className='mb-3'>Unbeatable pricing</h2>

                    <p className='text-muted'>
                        We pioneered the concept of discount broking and price transparency in India.
                        Flat fees and no hidden charges.
                    </p>

<a href="/pricing" className='text-decoration-none'>
                        See pricing <i className="fa fa-arrow-right"></i>
                    </a>
                </div>

                <div className='col-lg-1'></div>

                <div className='col-lg-6'>
                    <div className='row text-center'>
                        <div className='col p-4 border rounded shadow-sm'>
                            <h1 className='mb-3'>₹0</h1>
                            <p className='text-muted'>
                                Free equity delivery <br></br>
                                Direct mutual funds
                            </p>
                        </div>

                        <div className='col p-4 border rounded shadow-sm'>
                            <h1 className='mb-3'>₹20</h1>
                            <p className='text-muted'>
                                Intraday and F&O
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pricing;
