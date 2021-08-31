import { Router } from 'express'
import { serialize } from 'superjson'
import prismaClient from '../lib/primaClient'
const router = Router()

router.get('/:name', async function (req, res) {
  const { name } = req.params
  const domain = await prismaClient.domain.findFirst({
    where: {
      name: name,
      // status: {
      //   notIn: ['INACTIVE', 'PRIVATE']
      // }
    },
    include: {
      user: true,
    }
  })
  // console.log(name, domain)
  if (domain) {
    res.json(serialize(domain).json)
  } else {
    res.sendStatus(404)
  }
})

router.get('/', async function (req, res) {
  const {
    limit = 25,
    page = 1,
    search,
    extension
  } = req.query as any

  const total = await prismaClient.domain.count({
    where: {
      name: {
        contains: search
      }
    },
  })
  const domains = await prismaClient.domain.findMany({
    where: {
      name: {
        contains: search
      }
    },
    include: {
      domainAnalytics: true,
      user: true,
    },
    take: limit,
    skip: (limit * (page - 1)),
    orderBy: {
      id: 'asc'
    }
  })

  res.json({
    data: serialize(domains).json,
    total
  })
})

router.get('/:name', async (req, res) => {


})

export default router