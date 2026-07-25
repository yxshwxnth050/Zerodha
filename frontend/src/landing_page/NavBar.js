import React, { useEffect, useState } from 'react';
import "./NavBar.css";
import { Link } from "react-router-dom";

function Navbar() {
    const [token, setToken] = useState(() => localStorage.getItem("kite_token"));
    useEffect(() => { const sync = () => setToken(localStorage.getItem("kite_token")); window.addEventListener("kite-auth", sync); window.addEventListener("storage", sync); return () => { window.removeEventListener("kite-auth", sync); window.removeEventListener("storage", sync); }; }, []);
    const openDashboard = () => { window.location.assign(`${process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001"}/?token=${encodeURIComponent(token)}`); };
    const logout = () => { localStorage.removeItem("kite_token"); window.dispatchEvent(new Event("kite-auth")); };
    return (
        <nav
            className='navbar navbar-expand-lg border-bottom'
            style={{backgroundColor:"#FFF"}}
        >

            <div className='container p-2'>

                <Link className='navbar-brand' to='/'>
                    <img
                        src='/Media/images/logo.svg'
                        style={{width:"130px"}}
                        alt='Logo'
                    />
                </Link>


                <button
                    className='navbar-toggler'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#navbarSupportedContent'
                    aria-controls='navbarSupportedContent'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>


                <div
                    className='collapse navbar-collapse'
                    id='navbarSupportedContent'
                >

                    <ul className='navbar-nav ms-auto mb-lg-0'>

                        {!token ? <><li className='nav-item'><Link className='nav-link' to='/login'>Login</Link></li><li className='nav-item'><Link className='nav-link active' to='/signup'>Register</Link></li></> : <><li className='nav-item'><button type='button' className='btn btn-primary btn-sm me-2' onClick={openDashboard}>Open Kite Dashboard</button></li><li className='nav-item'><button type='button' className='btn btn-link nav-link' onClick={logout}>Logout</button></li></>}

                        <li className='nav-item'>
                            <Link className='nav-link' to='/about'>
                                About
                            </Link>
                        </li>

                        <li className='nav-item'>
                            <Link className='nav-link' to='/products'>
                                Products
                            </Link>
                        </li>

                        <li className='nav-item'>
                            <Link className='nav-link' to='/pricing'>
                                Pricing
                            </Link>
                        </li>

                        <li className='nav-item'>
                            <Link className='nav-link' to='/support'>
                                Support
                            </Link>
                        </li>

                    </ul>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;
