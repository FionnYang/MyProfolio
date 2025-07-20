import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import auth from '../lib/auth-helper';

export default function Layout() {
    const navigate = useNavigate();
    
    const handleSignout = () => {
        auth.clearJWT(() => {
            navigate('/');
        });
    };

    const isAuthenticated = auth.isAuthenticated();

    return (
        <>
            <div className="header">
                <img className="logo" src="/images/logo.png" alt="Logo"/>
                <h1>My Personal Portfolio</h1>
            </div>
            <nav className="navbar">
                {/*"link to" implement page conversion but not trigger page reload*/}
                <Link to="/" className="nav-link">Home</Link>{/*link to root page*/}
                <Link to="/about" className="nav-link">About Me</Link>
                <Link to="/project" className="nav-link">Project</Link>
                <Link to="/services" className="nav-link">
                    {isAuthenticated ? "Education" : "Services"}
                </Link>
                <Link to="/contact" className="nav-link">Contact Me</Link>
                
                {/*  */}
                {!isAuthenticated ? (
                    <>
                        <Link to="/signin" className="nav-link">Sign In</Link>
                        <Link to="/signup" className="nav-link">Sign Up</Link>
                    </>
                ) : (
                    <>
                        <Link to="/users" className="nav-link">Users</Link>
                        <Link to={`/profile/${isAuthenticated.user._id}`} className="nav-link">Profile</Link>
                        <button 
                            onClick={handleSignout} 
                            className="nav-link"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                font: 'inherit',
                                fontSize: 'inherit',
                                fontFamily: 'inherit',
                                fontWeight: '700'
                            }}
                        >
                            Sign Out
                        </button>
                    </>
                )}
            </nav>
            <br/>
            <hr />
        </>
    );
}