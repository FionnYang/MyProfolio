import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import About from './src/about'
import Contact from './src/contact'
import Project from './src/project'
import Layout from './components/Layout'
import Services from './src/services'
import Signin from './lib/Signin'
import Signup from './user/Signup'
import Users from './user/Users'
import Profile from './user/Profile'
import EditProfile from './user/EditProfile'
const MainRouter = () => {
    return (
        <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 20px',
            minHeight: '100vh'
        }}>
            <Layout/>{/*use Layout component*/}
            <Routes>{/*use Routes to define the path and component*/}
                <Route exact path="/" element={<Home />} />{/*use exact to match the path exactly*/}
                <Route exact path="/about" element={<About />} />
                <Route exact path="/services" element={<Services />} />
                <Route exact path="/project" element={<Project />} />
                <Route exact path="/contact" element={<Contact />} />
                <Route exact path="/signin" element={<Signin />} />
                <Route exact path="/signup" element={<Signup />} />
                <Route exact path="/users" element={<Users />} />
                <Route exact path="/profile/:userId" element={<Profile />} />
                <Route exact path="/user/edit/:userId" element={<EditProfile />} />
            </Routes>
        </div>
    )
}
export default MainRouter