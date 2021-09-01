import { Router } from 'express'
import prismaClient from '../lib/primaClient'
import { serialize } from 'superjson'
const router = Router()

router.get('/', async function (req, res) {
  const {
    search = '',
    page = 1,
    limit = 25
  } = req.query as any

  const data = await prismaClient.jobCategory.findMany({
    where: {
      name: {
        contains: search
      }
    },
    skip: (parseInt(page) - 1 * parseInt(limit)),
    take: parseInt(limit, 10)
  })

  res.json(serialize(data).json)
})


router.post('/', async function (req, res) {
  const {
    name,
    parentId
  } = req.body
  let jobCategory = await prismaClient.jobCategory.findFirst({
    where: {
      name: name.toLowerCase()
    }
  });
  if (!jobCategory) {
    jobCategory = await prismaClient.jobCategory.create({
      data: {
        name,
        parentId
      }
    })
  }
  res.json(serialize(jobCategory).json)
})


export default router