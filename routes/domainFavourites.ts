import { Router } from 'express'
import { serialize } from 'superjson'
import { getUserId } from '../lib/jwt'
import prismaClient from '../lib/primaClient'

const router = Router()
export default router

router.get('/', async function (req, res) {
  const userId = getUserId(req)
  try {
    const data = await prismaClient.domain.findMany({
      where: {
        userId,
        domainFavourites: {
          every: {
            id: { gt: 0 }
          }
        }
      }
    })
    res.json(serialize(data).json)
  } catch (e) {
    console.log(e)
    res.status(503).end()
  }
})

/**
 * Add domains favourites
 */
router.post('/favourites', async function (req, res) {
  const userId = getUserId(req)
  const { domainId } = req.body

  try {
    const data = await prismaClient.domainFavourite.create({
      data: {
        userId,
        domainId: BigInt(domainId)
      }
    })
    res.json(serialize(data).json)
  } catch (e) {
    console.log(e)
    res.status(503).end()
  }
})

router.delete('/:id', async function (req, res) {
  const { id } = req.params

  try {
    const domain = await prismaClient.domainFavourite.delete({
      where: {
        id: BigInt(id)
      }
    })
    if (domain) {
      res.status(204).end()
    } else {
      res.sendStatus(404)
    }
  } catch (e) {
    console.log(e)
    res.sendStatus(503)
  }
})
