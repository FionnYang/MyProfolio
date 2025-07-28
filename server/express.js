import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'

import contactRoutes from './routes/contact.routes.js'
import projectRoutes from './routes/project.routes.js'
import educationRoutes from './routes/education.routes.js'
import path from "path";

const app = express()
const CURRENT_WORKING_DIR = process.cwd();
app.use(express.static(path.join(CURRENT_WORKING_DIR, "dist/app")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/educations', educationRoutes)

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ "error": err.name + ": " + err.message })
    } else if (err) {
        res.status(400).json({ "error": err.name + ": " + err.message })
        console.log(err)
    }
})
export default app