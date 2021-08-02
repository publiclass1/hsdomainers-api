require('dotenv').config()
import express, { Request, Response } from 'express'
import cors from 'cors'
import { json, urlencoded, raw } from 'body-parser'
import { jwtMiddleware } from './lib/jwt'
import domainRoutes from './routes/domains'
import searchDomains from './routes/searchDomains'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'

const app = express()
const started = Date.now()
const port = process.env.PORT || 3000

app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(raw({}))

app.use('/auth', authRoutes)
app.use('/domains/search', searchDomains)
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
