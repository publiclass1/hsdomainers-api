import aws from 'aws-sdk'
import { Router } from 'express'
import { serialize } from 'superjson'
import { getUserId } from '../lib/jwt'
import prismaClient from '../lib/primaClient'
import md5 from 'md5'

const router = Router()

router.get('/url', async (req, res) => {
  const userId = getUserId(req)
  const fileName = req.query.fileName as string
  const fileSize = req.query.fileSize as string
  const fileType = req.query.fileType as string
  const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
  const AWS_REGION = process.env.AWS_REGION
  if (!fileName) {
    return res.status(422).end();
  }
  const s3FilenameKey = `${userId}-${Date.now()}-${md5(fileName)}`
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: AWS_REGION,
    signatureVersion: 'v4',
  });

  const extension: string = fileName?.split('.')?.pop() || '.mp4'
  const s3FileName = `${s3FilenameKey}.${extension}`
  const s3 = new aws.S3();
  const url = await s3.getSignedUrlPromise('putObject', {
    Bucket: AWS_BUCKET_NAME,
    Key: s3FileName,
    ContentType: fileType,
    Expires: 60,
    ACL: 'public-read',
  });
  const data = await prismaClient.upload.create({
    data: {
      userId,
      fileName,
      extension,
      size: +fileSize,
      type: fileType,
      s3FileName: s3FilenameKey,
      s3Link: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${s3FileName}`,
    }
  })

  res.status(200).json({ url, data: serialize(data).json });

})

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
    res.json(serialize(upload).json)
  } else {
    res.sendStatus(404)
  }
})

export default router