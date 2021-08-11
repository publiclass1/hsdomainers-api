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
  if(!fileName){
    return res.status(422).end();
  }
  const s3FilenameKey = `${userId}-${Date.now()}-${md5(fileName)}`
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    signatureVersion: 'v4',
  });

  const s3 = new aws.S3();
  const post = await s3.createPresignedPost({
    Bucket: process.env.AWS_BUCKET_NAME,
    Fields: {
      key: req.query.file,
    },
    Expires: 60 * 5, // seconds
    Conditions: [
      ['content-length-range', 0, 1048576], // up to 1 MB
    ],
  });

  await prismaClient.upload.create({
    data:{
      userId,
      fileName,
      s3FileName: s3FilenameKey,
      s3Link: post.url+'/'+ s3FilenameKey,
      extension: fileName?.split('.')?.pop() || ''
    }
  })

  res.status(200).json(post);

})

router.get('/', async function (req, res) {
  const {
    limit = 25,
    page = 1,
  } = req.query as any
  const userId = getUserId(req)
  const total = await prismaClient.upload.count({
    where:{
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


export default router