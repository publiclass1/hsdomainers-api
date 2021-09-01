import { Request, Response } from "express"
import { serialize } from "superjson"
import prismaClient from "../lib/primaClient"

export default async function authCreateAccount(req: Request, res: Response) {

  const {
    compoundId,
    userId,
    providerType,
    providerId,
    providerAccountId,
    refreshToken,
    accessToken,
    accessTokenExpires,
  } = req.body

  try {
    const data = await prismaClient.account.create({
      data: {
        compoundId,
        userId,
        providerType,
        providerId,
        providerAccountId,
        refreshToken,
        accessToken,
        accessTokenExpires,
      }
    })

    res.json(serialize(data).json)
  } catch (e) {
    res.status(422).send('Unprocessable Entity!')
  }
}