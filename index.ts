require('dotenv').config()
import express, { Request, Response } from 'express'
import cors from 'cors'
import { json, urlencoded } from 'body-parser'
import { jwtMiddleware } from './lib/jwt'
import domainRoutes from './routes/domains'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'

const app = express()
const started = Date.now()
const port = process.env.PORT || 3000

app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(json())

app.use('/auth', authRoutes)
app.use('/domains', jwtMiddleware, domainRoutes)
app.use('/users', jwtMiddleware, userRoutes)
app.get('/', (req: Request, res: Response) => {
    res.json({
        upTime: new Date(Date.now() - started)
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
