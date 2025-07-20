import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { expressjwt } from "express-jwt";
import config from './../../config/config.js'
const signin = async (req, res) => {
    try {
        let user = await User.findOne({ "email": req.body.email })
        if (!user)
            return res.status('401').json({ error: "User not found" })
        if (!user.authenticate(req.body.password)) {
            return res.status('401').send({ error: "Email and password don't match." })
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
        return res.status('401').json({ error: "Could not sign in" })
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
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

const hasAdminAuthorization = async (req, res, next) => {
    try {
        // Get the current user from the database to check their role
        const currentUser = await User.findById(req.auth._id)
        if (!currentUser || currentUser.role !== 'admin') {
            return res.status('403').json({
                error: "Admin authorization required"
            })
        }
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not verify admin authorization"
        })
    }
}

const hasUserOrAdminAuthorization = async (req, res, next) => {
    try {
        // Check if user is trying to access their own profile
        const isOwnProfile = req.profile && req.auth && req.profile._id == req.auth._id
        
        if (isOwnProfile) {
            // User can access their own profile
            return next()
        }
        
        // If not own profile, check if user is admin
        const currentUser = await User.findById(req.auth._id)
        if (!currentUser || currentUser.role !== 'admin') {
            return res.status('403').json({
                error: "User can only access own profile or admin authorization required"
            })
        }
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not verify authorization"
        })
    }
}

export default { signin, signout, requireSignin, hasAuthorization, hasAdminAuthorization, hasUserOrAdminAuthorization }