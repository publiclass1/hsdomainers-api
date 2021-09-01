import { Request, Response } from "express"
import md5 from "md5"
import aws from 'aws-sdk'
import { getUserId } from "../lib/jwt"
import prismaClient from "../lib/primaClient"
import { serialize } from "superjson"

export default async function getUploadUrl(req: Request, res: Response) {

  const userId = getUserId(req)
  const fileName = req.query.fileName as string
  const fileSize = req.query.fileSize as string
  const fileType = req.query.fileType as string
  const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
  const AWS_REGION = process.env.AWS_REGION
  if (!fileName) {
    return res.status(422).send('Unprocessable Entity!');
  }
  const s3FilenameKey = `${userId || md5(`${Date.now()}+${req.ip}`)}-${Date.now()}-${md5(fileName)}`
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
      size: +fileSize || 0,
      type: fileType,
      s3FileName: s3FilenameKey,
      s3Link: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${s3FileName}`,
    }
  })

  res.status(200).json({ url, data: serialize(data).json });

}