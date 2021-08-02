import { Router } from 'express'
import prismaClient from '../lib/primaClient'
import { generateAccessToken } from '../lib/jwt'
const router = Router()

router.get('/me', async function (req: any, res) {
    console.log(req.user)
    res.json(req.user)
})

export default router