import { Router } from 'express'
import { serialize } from 'superjson'
import prismaClient from '../lib/primaClient'
const router = Router()


router.get('/', async function (req, res) {
    const {
        limit = 25,
        page = 1,
        name
    } = req.query as any

    const total = await prismaClient.domain.count()
    const domains = await prismaClient.domain.findMany({
        where: {
            name
        },
        take: limit,
        skip: (limit * (page - 1)),
        orderBy: {
            id: 'asc'
        }
    })

    res.json({
        data: serialize(domains).json,
        total
    })
})

router.get('/:name', async (req, res) => {


})

export default router