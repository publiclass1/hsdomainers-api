import fs from 'fs'
import { Router } from 'express'
import csv from 'csvtojson'
import { serialize } from 'superjson'
import { IncomingForm } from 'formidable'
import { getUserId } from '../lib/jwt'
import prismaClient from '../lib/primaClient'
import toInteger from 'lodash/toInteger'
const router = Router()


router.get('/', async function (req, res) {
    const {
        limit = 25,
        page = 1,
        order_by = 'id'
    } = req.query as any

    try {
        const total = await prismaClient.domain.count({
            where: {
                userId: getUserId(req)
            }
        })
        const domains = await prismaClient.domain.findMany({
            where: {
                userId: getUserId(req)
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
    } catch (e) {
        console.log(e)
        res.sendStatus(503)
    }
})

router.post('/import', async (req, res) => {
    const data: any = await new Promise((resolve, reject) => {
        const form = new IncomingForm()
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })
    const filepath = data?.files?.file.path
    await readCsvFile(filepath, async (data: any) => {
        /**
            {
                name: 'goog.com',
                lease_price: 'com',
                buynow_price: '100',
                monthly_price: '10',
                minimum_offer_price: '20',
            }
        */
        console.log(data)
        try {
            const exists = await prismaClient.domain.findFirst({
                where: {
                    name: data.name,
                    userId: getUserId(req)
                }
            })
            if (!exists) {
                await prismaClient.domain.create({
                    data: {
                        name: data.name,
                        nameLength: data.name.length,
                        hasHypen: data.name.includes('-'),
                        hasNumber: /^\d+$/.test(data.name),
                        extension: data.name.split('.')?.pop() || '',
                        userId: getUserId(req),
                        dnsStatus: 'PENDING',
                        leasePrice: toInteger(data.lease_price),
                        buynowPrice: toInteger(data.buynow_price),
                        monthlyPrice: toInteger(data.monthly_price),
                        minimumOfferPrice: toInteger(data.minimum_offer_price),
                    }
                })

            }
        } catch (e) {
            console.log(e.message)
        }
    })
    res.json({
        status: 'uploaded'
    })
})

router.post('/:id', async (req, res) => {

    res.json({
        params: req.params
    })
})

export default router


async function readCsvFile(filepath: string, cb: Function) {
    const stream = fs.createReadStream(filepath)
    return await new Promise((resolve) => {
        stream.pipe(csv())
            .on('data', async function (row) {
                const domain = JSON.parse(row)
                if (!domain.name || !domain.name.includes('.')) {
                    return null;
                }
                cb(domain)
            })
            .on('end', function () {
                console.log('Data loaded')
                resolve(null)
            })
    })
}