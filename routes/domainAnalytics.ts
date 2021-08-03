import { Router } from 'express'
import prismaClient from '../lib/primaClient'
import merge from 'lodash/merge'

const router = Router()

router.get('/', async function (req, res) {
  const {
    data,
    domain,
    type,
    ip = req.socket.remoteAddress,
    agent = req.headers['user-agent']
  } = merge(req.body, req.query)

  const domainData = await prismaClient.domain.findUnique({
    where: { name: domain }
  })

  if (!domainData) {
    res.status(404).send('Not Found')
    return
  }

  let log = await prismaClient.domainViewLog.findFirst({
    where: {
      domainId: domainData.id,
      eventType: type,
      ip,
    }
  })

  try {
    if (!log) {
      const analytic = await getAnalytics(domainData.id)
      await prismaClient.domainAnalytic.update({
        where: { id: analytic.id },
        data: {
          clicks: type === 'CLICK' ? analytic.clicks + 1 : analytic.clicks,
          views: type === 'VIEW' ? analytic.views + 1 : analytic.views,
        }
      })
    }
  } catch (e) {
    console.log(e)
  }

  try {
    await prismaClient.domainViewLog.create({
      data: {
        domainId: domainData.id,
        eventType: type,
        browser: agent,
        ip,
        data: data
      }
    })
  } catch (e) {
    console.log(e)
  }

  res.status(200).send('OK')
})

export default router


async function getAnalytics(domainId: bigint) {

  let analytic = await prismaClient.domainAnalytic.findFirst({
    where: {
      domainId: domainId
    }
  })

  if (!analytic) {
    analytic = await prismaClient.domainAnalytic.create({
      data: {
        domainId,
        views: 0,
        clicks: 0,
      }
    })
  }

  return analytic
}
