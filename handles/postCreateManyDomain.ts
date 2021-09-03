import { Request, Response } from "express"
import { getUserId } from "../lib/jwt"
import { createDomain } from "../services/domains"

export default async function postCreateManyDomain(req: Request, res: Response) {
  const { payload } = req.body as any
  const data = payload.split('\n')
  const userId = getUserId(req)
  for (let d of data) {
    const [name, buyPrice] = d.split(',')
    console.log({ name, buyPrice })
    await createDomain(userId, name, buyPrice)
  }

  res.sendStatus(200)
}