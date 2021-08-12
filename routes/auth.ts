import { Router } from 'express'
import { serialize } from 'superjson'
import { compareSync, hashSync } from 'bcrypt'
import prismaClient from '../lib/primaClient'
import { generateAccessToken } from '../lib/jwt'
import { Prisma } from '@prisma/client'
const router = Router()


router.post('/login', async function (req, res) {
  const {
    email,
    password
  } = req.body as any
  console.log(email, password)
  try {
    const user: any = await prismaClient.user.findUnique({
      where: {
        email: email,
      }
    })
    console.log(user)
    if (user && compareSync(password, user.password || '')) {
      delete user.password
      const serialedUser = serialize(user).json
      res.json({
        token: generateAccessToken(serialedUser),
        user: serialedUser
      })
    } else {
      return res.sendStatus(401)
    }
  } catch (e) {
    console.log(e)
    res.sendStatus(503)
  }
})

router.post('/register', async function (req, res) {
  const {
    email,
    password
  } = req.body as any
  const existEmail = await prismaClient.user.findUnique({
    where: { email }
  })
  if (existEmail) {
    return res.json({
      errors: {
        email: 'Already exists!'
      }
    })
  }
  const hash = hashSync(password, 10)
  try {
    const user: any = await prismaClient.user.create({
      data: {
        password: hash,
        email
      }
    })
    if (user) {
      delete user.password
    }
    const token = generateAccessToken(user)
    res.json({ token })
  } catch (e) {
    console.log(e)
    res.sendStatus(422)
  }
})

export default router