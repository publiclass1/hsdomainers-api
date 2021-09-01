import { Request, Response } from "express"
import { serialize } from "superjson"
import { getUserId } from "../lib/jwt"
import prismaClient from "../lib/primaClient"

export default async function putUserProfile(req: Request, res: Response) {
  const userId = getUserId(req)
  const {
    about,
    expectedSalary,
    experienceYear,
    skillSummary,
  } = req.body
  try {
    let prof = await prismaClient.userJobProfile.findFirst({
      where: {
        userId
      }
    })
    if (!prof) {
      prof = await prismaClient.userJobProfile.create({
        data: {
          userId,
          about,
          expectedSalary,
          experienceYear,
          skillSummary,
        }
      })
    } else {
      prof = await prismaClient.userJobProfile.update({
        where: {
          id: prof.id
        },
        data: {
          about,
          expectedSalary,
          experienceYear,
          skillSummary,
        }
      })
    }
    res.json(serialize(prof).json)
  } catch (e) {
    console.log(e)
    res.status(422).send('Unprocessable Entity!')
  }

}