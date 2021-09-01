import { Router } from 'express'
import prismaClient from '../lib/primaClient'
import { getUserId } from '../lib/jwt'
import { serialize } from 'superjson'
const router = Router()

router.get('/', async (req, res) => {
  const userId = getUserId(req)
  try {
    const rs = await prismaClient.domainBookmark.findMany({
      where: {
        userId
      }
    })
    res.json(serialize(rs).json)
  } catch (e) {
    console.log(e)
    res.status(404).send('Not Found!')
  }
})
router.get('/:id', async (req, res) => {
  const userId = getUserId(req)
  const { id } = req.params
  try {
    const rs = await prismaClient.domainBookmark.findFirst({
      where: {
        id: BigInt(id),
        userId
      }
    })
    res.json(serialize(rs).json)
  } catch (e) {
    console.log(e)
    res.status(404).send('Not Found!')
  }

})
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const userId = getUserId(req)
  try {
    const exists = await prismaClient.domainBookmark.findFirst({
      where: {
        id: BigInt(id),
        userId
      }
    })

    if (!exists) {
      res.status(404).send('Not Found!')
      return
    }
    await prismaClient.domainBookmark.delete({
      where: {
        id: exists.id
      }
    })
    res.status(204).end()
  } catch (e) {
    console.log(e)
    res.status(404).send('Not Found!')
  }
})

export default router