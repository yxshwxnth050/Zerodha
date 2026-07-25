import React from 'react';

function Education() {
    return (  
        <div className='container py-5'>
            <div className='row align-items-center'>

                <div className='col-lg-6 text-center mb-4 mb-lg-0'>
                    <img
                        src='/Media/images/education.svg'
                        alt='Education'
                        className='img-fluid'
                        style={{width:"70%"}}
                    />
                </div>


                <div className='col-lg-6'>
                    <h3 className='fw mb-4'>
                        Free and open market education
                    </h3>

                    <p className='text-muted'>
                        Varsity, the largest online stock market education book in the
                        world covering everything from the basics to advanced trading.
                    </p>

<a href='/products' className='text-decoration-none mb-4 d-inline-block'>
                        Varsity <i className="fa fa-arrow-right"></i>
                    </a>


                    <p className='text-muted'>
                        TradingQ&A, the most active trading and investment community in
                        India for all your market related queries.
                    </p>

<a href='/products' className='text-decoration-none'>
                        TradingQ&A <i className="fa fa-arrow-right"></i>
                    </a>

                </div>

            </div>
        </div>
    );
}

export default Education;
