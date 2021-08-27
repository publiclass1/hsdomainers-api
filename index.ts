require('dotenv').config()
import express, { Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { json, urlencoded, raw } from 'body-parser'
import { jwtMiddleware } from './lib/jwt'
import domainRoutes from './routes/domains'
import searchDomains from './routes/searchDomains'
import domainAnalytics from './routes/domainAnalytics'
import domainDNSRegistration from './routes/domainDNSRegistration'
import domainFavourites from './routes/domainFavourites'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import uploadRoutes from './routes/uploads'
import getUploadUrl from './handles/getUploadUrl'

const app = express()
const started = Date.now()
const port = process.env.PORT || 3000
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://testnames.link:3000',
  ]
}))
app.use(morgan('combined'))

app.use('/auth', authRoutes)
app.use('/domains/dns-registers', domainDNSRegistration)
app.use('/domains/analytics', domainAnalytics)
app.use('/domains/search', searchDomains)

// protected routes
app.use('/domains/favourites', jwtMiddleware, domainFavourites)
app.use('/domains', jwtMiddleware, domainRoutes)
app.use('/users', jwtMiddleware, userRoutes)
app.get('/uploads/url', jwtMiddleware, getUploadUrl)
app.use('/uploads', jwtMiddleware, uploadRoutes)
app.get('/', (req: Request, res: Response) => {
  res.json({
    upTime: new Date(Date.now() - started)
  })
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
