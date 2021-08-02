import { Router } from 'express'
import { serialize } from 'superjson'
import prismaClient from '../lib/primaClient'
const router = Router()


router.get('/', async function (req, res) {
    const {
        limit = 25,
        page = 1,
        order_by = 'id'
    } = req.query as any

    const total = await prismaClient.domain.count()
    const domains = await prismaClient.domain.findMany({
        where: {

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

export default router