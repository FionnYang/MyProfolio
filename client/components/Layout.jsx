import React from 'react';
import { Link } from 'react-router-dom';
export default function Layout() {
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
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/contact" className="nav-link">Contact Me</Link>
        </nav>
        <br/>
        <hr />
    </>
);
}