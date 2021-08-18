import fs from 'fs'
import { Router } from 'express'
import csv from 'csvtojson'
import { serialize } from 'superjson'
import { IncomingForm } from 'formidable'
import { getUserId } from '../lib/jwt'
import prismaClient from '../lib/primaClient'
import toInteger from 'lodash/toInteger'
import { Prisma } from '@prisma/client'
import { toNumbers } from '../utils/util'
import toObjectValues from 'lodash/values'
import getValue from 'lodash/get'

const router = Router()


router.get('/', async function (req, res) {
  const userId = getUserId(req)
  const {
    limit = 25,
    page = 1,
    order_by = 'id'
  } = req.query as any

  try {
    const total = await prismaClient.domain.count({
      where: {
        userId
      }
    })
    const domains = await prismaClient.domain.findMany({
      where: {
        userId
      },
      include: {
        domainAnalytics: true
      },
      take: toInteger(limit),
      skip: (toInteger(limit) * (toInteger(page) - 1)),
      orderBy: {
        id: 'asc'
      }
    })

    res.json({
      data: serialize(domains).json,
      total
    })
  } catch (e) {
    console.log(e)
    res.sendStatus(503)
  }
})


router.get('/:name', async function (req, res) {
  const { name } = req.params

  try {
    const domain = await prismaClient.domain.findUnique({
      where: {
        name
      }
    })
    if (domain) {
      res.json(serialize(domain).json)
    } else {
      res.sendStatus(404)
    }
  } catch (e) {
    console.log(e)
    res.sendStatus(503)
  }
})

router.get('/:name/pitch-videos', async function (req, res) {
  const { name } = req.params
  const {
    limit = 50,
    page = 1,
    order_by = 'id',
    order_dir = 'asc'
  } = req.query

  const domain = await prismaClient.domain.findUnique({
    where: {
      name
    }
  })
  if (!domain) {
    return res.status(404).end()
  }
  const orderBy: any = [{ [order_by as string]: order_dir }]

  const videos = await prismaClient.domainPitchVideo.findMany({
    where: {
      domainId: domain.id
    },
    orderBy,
    include: {
      upload: true,
      user: true
    }
  })

  res.json(serialize(videos).json)
})

router.post('/:name/pitch-videos', async function (req, res) {
  const { name } = req.params
  const userId = getUserId(req)
  const { uploadId, description } = req.body
  if (!uploadId) {
    return res.status(422).json({
      error: {
        uploadId: 'Upload is required.'
      }
    })
  }

  try {
    const domain = await prismaClient.domain.findUnique({
      where: {
        name
      }
    })
    if (!domain) {
      return res.status(404).end()
    }
    const rs = await prismaClient.domainPitchVideo.create({
      data: {
        userId,
        uploadId: BigInt(uploadId),
        domainId: domain.id,
        description
      }
    })
    res.json(serialize(rs).json)
  } catch (e) {
    console.log(e)
    res.status(503).end()
  }
})

/**
 * Import domains via csv file
 */
router.post('/import', async (req, res) => {
  const data: any = await new Promise((resolve, reject) => {
    const form = new IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })

  const filepath = data?.files?.file.path
  await readCsvFile(filepath, async (data: string[] = []) => {
    console.log(data)
    const domainName = data?.[0];
    if (!domainName) {
      return
    }
    try {
      let exists = await prismaClient.domain.findFirst({
        where: {
          name: domainName,
          userId: getUserId(req)
        }
      })
      if (!exists) {
        await prismaClient.domain.create({
          data: {
            name: domainName,
            nameLength: domainName.length,
            hasHypen: domainName.includes('-'),
            hasNumber: /^\d+$/.test(domainName),
            extension: domainName.split('.')?.pop() || '',
            userId: getUserId(req),
            dnsStatus: 'PENDING',
            leasePrice: 0,
            buynowPrice: 0,
            monthlyPrice: 0,
            minimumOfferPrice: 0,
          }
        })
      }
    } catch (e) {
      console.log(e.message)
    }
  })
  res.json({
    status: 'uploaded'
  })
})

router.post('/', async function (req, res) {
  const { name, ...restData } = req.body as any
  const parseData = toNumbers(restData)
  try {
    const count = await prismaClient.domain.count({
      where: {
        name,
        userId: getUserId(req)
      }
    })
    if (count) {
      return res.json({
        errors: {
          name: 'Already exists'
        }
      })
    }

    const domain = await prismaClient.domain.create({
      data: {
        name,
        ...parseData,
        dnsStatus: 'PENDING',
        nameLength: name.length,
        hasHypen: name.includes('-'),
        hasNumber: /^\d+$/.test(name),
        extension: name.split('.')?.pop() || '',
        userId: getUserId(req),
      }
    })

    res.json(serialize(domain).json)
  } catch (e) {
    console.log(e)
    res.sendStatus(503)
  }
})


router.patch('/:id', async (req, res) => {
  const id = BigInt(req.params.id)
  const data = req.body as Prisma.DomainCreateInput
  const parseData = toNumbers(data)
  console.log({ data, parseData })
  try {
    const domain = await prismaClient.domain.findFirst({
      where: {
        id,
        userId: getUserId(req)
      }
    })
    if (!domain) {
      return res.sendStatus(404)
    }

    await prismaClient.domain.update({
      where: { id: domain.id },
      data: {
        ...parseData
      }
    })
    res.json(serialize(domain).json)
  } catch (error) {
    console.log(error)
    res.sendStatus(422)
  }


})


router.delete('/:id', async (req, res) => {
  const id = BigInt(req.params.id)
  const data = req.body as Prisma.DomainCreateInput

  try {
    const domain = await prismaClient.domain.findFirst({
      where: {
        id,
        userId: getUserId(req)
      }
    })
    if (!domain) {
      return res.sendStatus(404)
    }

    await prismaClient.domain.delete({
      where: { id: domain.id },
    })
    res.sendStatus(204)
  } catch (error) {
    console.log(error)
    res.sendStatus(422)
  }

})

export default router


async function readCsvFile(filepath: string, cb: Function) {
  const stream = fs.createReadStream(filepath)
  return await new Promise((resolve) => {
    stream.pipe(csv({
      alwaysSplitAtEOL: true,
      checkColumn: false,
      noheader: true,
      flatKeys: true,
    }))
      .on('data', async function (row) {
        let domain = JSON.parse(row)
        if (!domain) {
          return null
        }
        const objArray = toObjectValues(domain)
        await cb(objArray)
      })
      .on('end', function () {
        console.log('Data loaded')
        stream.destroy()
        resolve(null)
      })
  })
}