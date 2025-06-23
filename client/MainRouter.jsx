import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import About from './src/about'
import Contact from './src/contact'
import Education from './src/services'
import Project from './src/project'
import Layout from './components/Layout'
import Services from './src/services'
const MainRouter = () => {
    return (
        <div>
            <Layout/>{/*use Layout component*/}
            <Routes>{/*use Routes to define the path and component*/}
                <Route exact path="/" element={<Home />} />{/*use exact to match the path exactly*/}
                <Route exact path="/about" element={<About />} />
                <Route exact path="/services" element={<Services />} />
                <Route exact path="/project" element={<Project />} />
                <Route exact path="/contact" element={<Contact />} />
            </Routes>
        </div>
    )
}
export default MainRouter