import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { expressjwt } from "express-jwt";
import config from './../../config/config.js'
const signin = async (req, res) => {
    try {
        let user = await User.findOne({ "email": req.body.email })
        if (!user)
            return res.status(401).json({ error: "User not found" })
        if (!user.authenticate(req.body.password)) {
            return res.status(401).send({ error: "Email and password don't match." })
        }
        const token = jwt.sign({ _id: user._id }, config.jwtSecret)
        res.cookie('t', token, { expire: new Date() + 9999 })
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (err) {
        return res.status(401).json({ error: "Could not sign in" })
    }
}
const signout = (req, res) => {
    res.clearCookie("t")
    return res.status(200).json({message: "signed out"})
}
const requireSignin = expressjwt({
    secret: config.jwtSecret,
    algorithms: ["HS256"],
    userProperty: 'auth'
})
const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth
        && req.profile._id == req.auth._id
    if (!(authorized)) {
        return res.status(403).json({
            error: "User is not authorized"
        })
    }
    next()
}

const requireAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.auth._id)
        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                error: "Admin access required"
            })
        }
        next()
    } catch (err) {
        return res.status(400).json({
            error: "Could not verify admin status"
        })
    }
}

const hasAuthorizationOrAdmin = async (req, res, next) => {
    try {
        // Check if user is editing their own profile
        const authorized = req.profile && req.auth && req.profile._id == req.auth._id
        
        if (authorized) {
            return next()
        }
        
        // If not authorized to edit own profile, check if user is admin
        const user = await User.findById(req.auth._id)
        if (user && user.role === 'admin') {
            return next()
        }
        
        return res.status(403).json({
            error: "User is not authorized"
        })
    } catch (err) {
        return res.status(400).json({
            error: "Could not verify authorization"
        })
    }
}

const canToggleRole = async (req, res, next) => {
    try {
        // Check if user is toggling their own role
        const isSelfToggle = req.profile && req.auth && req.profile._id == req.auth._id
        
        if (isSelfToggle) {
            return next()
        }
        
        // If not toggling own role, check if user is admin
        const user = await User.findById(req.auth._id)
        if (user && user.role === 'admin') {
            return next()
        }
        
        return res.status(403).json({
            error: "Only admins can toggle other users' roles"
        })
    } catch (err) {
        return res.status(400).json({
            error: "Could not verify role toggle authorization"
        })
    }
}

export default { signin, signout, requireSignin, hasAuthorization, requireAdmin, hasAuthorizationOrAdmin, canToggleRole }