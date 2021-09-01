import { Router } from 'express'
import prismaClient from '../lib/primaClient'
import pick from 'lodash/pick'
import { generateAccessToken, getUserId } from '../lib/jwt'
import { serialize } from 'superjson'
const router = Router()

router.get('/', async (req, res) => {
  const userId = getUserId(req)
  const { rate, jobSkillId } = req.body
  try {
    let data = await prismaClient.userJobSkill.findMany({
      where: {
        userId,
      }
    })
    res.json(serialize(data).json)
  } catch (e) {
    console.log(e)
    res.status(422).end()
  }
})

router.put('/', async (req, res) => {
  const userId = getUserId(req)
  const { rate, jobSkillId } = req.body
  try {
    let exists = await prismaClient.userJobSkill.findFirst({
      where: {
        userId,
        jobSkillId: BigInt(jobSkillId)
      }
    })
    if (exists) {
      exists = await prismaClient.userJobSkill.update({
        where: {
          id: exists.id,
        },
        data: {
          rate
        },
      })
    } else {
      exists = await prismaClient.userJobSkill.create({
        data: {
          rate,
          jobSkillId: BigInt(jobSkillId),
          userId
        },
      })
    }

    res.json(serialize(exists).json)
  } catch (e) {
    console.log(e)
    res.status(422).end()
  }

})
router.delete('/:id', async (req, res) => {
  const userId = getUserId(req)
  const { id } = req.params
  try {
    const rs = await prismaClient.userJobSkill.delete({
      where: {
        id: BigInt(id)
      }
    })
    res.status(204).end()
  } catch (e) {
    console.log(e)
    res.status(422).end()
  }
})

export default router