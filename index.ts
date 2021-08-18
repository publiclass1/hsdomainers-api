require('dotenv').config()
import express, { Request, Response } from 'express'
import cors from 'cors'
import { json, urlencoded, raw } from 'body-parser'
import { jwtMiddleware } from './lib/jwt'
import domainRoutes from './routes/domains'
import searchDomains from './routes/searchDomains'
import domainAnalytics from './routes/domainAnalytics'
import domainDNSRegistration from './routes/domainDNSRegistration'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import uploadRoutes from './routes/uploads'
import getUploadUrl from './handles/getUploadUrl'

const app = express()
const started = Date.now()
const port = process.env.PORT || 3000

app.use(urlencoded({ extended: true }))
app.use(json())

app.use(cors())
app.use('/auth', authRoutes)
app.use('/domains/dns-registers', domainDNSRegistration)
app.use('/domains/analytics', domainAnalytics)
app.use('/domains/search', searchDomains)
app.get('/uploads/url', getUploadUrl)

// protected routes
app.use('/domains', jwtMiddleware, domainRoutes)
app.use('/users', jwtMiddleware, userRoutes)
app.use('/uploads', jwtMiddleware, uploadRoutes)
app.get('/', (req: Request, res: Response) => {
  res.json({
    upTime: new Date(Date.now() - started)
  })
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
