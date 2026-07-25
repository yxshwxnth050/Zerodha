import React from 'react';

function Stats() {
    return (  
        <div className='container py-5'>
            <div className='row align-items-center'>

                <div className='col-lg-6 mb-5 mb-lg-0'>
                    <h2 className='fw mb-4'>
                        Trust With Confidence
                    </h2>

                    <h5 className='fw-semibold'>
                        Customer-first always
                    </h5>

                    <p className='text-muted mb-4'>
                        That's why 1.6+ crore customers trust Zerodha with ~ ₹6 lakh crores
                        of equity investments, making us India’s largest broker; contributing
                        to 15% of daily retail exchange volumes in India.
                    </p>


                    <h5 className='fw-semibold'>
                        No spam or gimmicks
                    </h5>

                    <p className='text-muted mb-4'>
                        No gimmicks, spam, "gamification", or annoying push notifications.
                        High quality apps that you use at your pace, the way you like.
                        Our philosophies.
                    </p>


                    <h5 className='fw-semibold'>
                        The Zerodha universe
                    </h5>

                    <p className='text-muted mb-4'>
                        Not just an app, but a whole ecosystem. Our investments in 30+
                        fintech startups offer you tailored services specific to your needs.
                    </p>


                    <h5 className='fw-semibold'>
                        Do better with money
                    </h5>

                    <p className='text-muted'>
                        With initiatives like Nudge and Kill Switch, we don't just facilitate
                        transactions, but actively help you do better with your money.
                    </p>

                </div>


                <div className='col-lg-6 text-center'>
                    <img
                        src='/Media/images/ecosystem.png'
                        alt='Zerodha ecosystem'
                        className='img-fluid'
                        style={{width:"80%"}}
                    />

                    <div className='mt-4'>
<a href='/products' className='mx-4 text-decoration-none'>
                            Explore our products <i className="fa fa-arrow-right"></i>
                        </a>

<a href='/pricing' className='text-decoration-none'>
                            Try Kite
                        </a>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Stats;
