import { Router } from 'express'
import prismaClient from '../lib/primaClient'
import pick from 'lodash/pick'
import { generateAccessToken, getUserId } from '../lib/jwt'
import { serialize } from 'superjson'
const router = Router()

router.post('/', async (req, res) => {
  const {

  } = req.body
  const userId = getUserId(req)
  try {
    const data = await prismaClient.job.create({
      data: {
        postedByUserId: userId,
        title,
        description,
        expiration,

      }
    })
  } catch (e) {
    console.log(e)
    res.status(422).end()
  }
})

export default router