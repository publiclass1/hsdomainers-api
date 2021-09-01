import { Request, Response } from "express"
import { serialize } from "superjson"
import prismaClient from "../lib/primaClient"

export default async function getJobCategory(req: Request, res: Response) {

  const {
    parentId
  } = req.query

  try {
    const where: any = {}
    if (parentId) {
      where.parentId = parentId
    }
    const rs = await prismaClient.jobCategory.findMany({
      where
    })
    res.json(serialize(rs).json)
  } catch (e) {
    res.json([])
  }

}