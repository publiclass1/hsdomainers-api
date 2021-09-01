import { Request, Response } from "express"
import { serialize } from "superjson"
import prismaClient from "../lib/primaClient"

export default async function getTalentDetails(req: Request, res: Response) {

  const { id } = req.params
  try {
    const profile = await prismaClient.userJobProfile.findFirst({
      where: {
        userId: BigInt(id)
      },
      include: {
        user: true
      }
    }) as any
    if (!profile) {
      res.status(404).send('Not Found!')
      return
    }
    const skills = await prismaClient.jobSkill.findMany({
      where: {
        userJobSkills: {
          every: {
            userId: BigInt(id)
          }
        }
      }
    })
    if (profile?.user) {
      delete profile.user.password
    }
    res.json(serialize({
      profile,
      skills
    }).json)
  } catch (e) {
    console.log(e)
    res.status(404).send('Not Found!')
  }

}