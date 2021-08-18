import aws from 'aws-sdk'
import { Router } from 'express'
import { serialize } from 'superjson'
import { getUserId } from '../lib/jwt'
import prismaClient from '../lib/primaClient'
import md5 from 'md5'

const router = Router()

router.get('/', async function (req, res) {
  const {
    limit = 25,
    page = 1,
  } = req.query as any
  const userId = getUserId(req)
  const total = await prismaClient.upload.count({
    where: {
      userId
    }
  })
  const files = await prismaClient.upload.findMany({
    where: {
      userId
    },
    take: limit,
    skip: (limit * (page - 1)),
    orderBy: {
      id: 'asc'
    }
  })

  res.json({
    data: serialize(files).json,
    total
  })
})


router.get('/:id', async function (req, res) {
  const userId = getUserId(req)
  const { id } = req.params
  const upload = await prismaClient.upload.findFirst({
    where: {
      id: BigInt(id),
      userId
    },
  })
  // console.log(name, upload)
  if (upload) {
    res.json(serialize(upload).json)
  } else {
    res.sendStatus(404)
  }
})

router.patch('/:id', async function (req, res) {
  const userId = getUserId(req)
  const { id } = req.params
  const { status } = req.body

  const upload = await prismaClient.upload.findFirst({
    where: {
      id: BigInt(id),
      userId
    },
  })

  // console.log(name, upload)
  if (upload) {
    const updated = await prismaClient.upload.update({
      where: {
        id: BigInt(id)
      },
      data: {
        status
      }
    })
    res.json(serialize(updated).json)
  } else {
    res.sendStatus(404)
  }
})

export default router