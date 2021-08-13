import { Router } from 'express'
import prismaClient from '../lib/primaClient'
import pick from 'lodash/pick'
import { generateAccessToken, getUserId } from '../lib/jwt'
import { serialize } from 'superjson'
const router = Router()

router.get('/me', async function (req: any, res) {
  res.json(req.user)
})

router.patch('/me', async function (req, res) {
  const userId = getUserId(req)
  const userObj = await prismaClient.user.findUnique({
    where: {
      id: userId
    }
  })
  if (!userObj) {
    return res.status(404).end();
  }

  const userFields = pick(req.body, ['about', 'email', 'name', 'image'])
  console.log({
    userFields
  })
  const updatedUser: any = await prismaClient.user.update({
    where: {
      id: userId
    },
    data: userFields
  })

  if (updatedUser?.password) {
    delete updatedUser?.password
  }
  updatedUser.token = generateAccessToken(updatedUser)
  const data = serialize(updatedUser).json
  res.json(data)
})


export default router