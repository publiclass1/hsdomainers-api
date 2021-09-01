import { Router } from 'express'
import prismaClient from '../lib/primaClient'
import pick from 'lodash/pick'
import { generateAccessToken, getUserId } from '../lib/jwt'
import { serialize } from 'superjson'
const router = Router()



export default router