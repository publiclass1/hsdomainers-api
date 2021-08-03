import { Router } from 'express'
import prismaClient from '../lib/primaClient'
import DNSServerAPIService from '../lib/dns.service.'
const router = Router()

router.get('/', async (req, res) => {
  const domains = await prismaClient.domain.findMany({
    take: 255,
    where: {
      dnsStatus: 'PENDING'
    },
    orderBy: [{ updatedAt: 'asc' }]
  })

  const domainNames = domains.map(e => e.name)
  console.log({ domainNames })
  const rs = await DNSServerAPIService.createRecord(domainNames)

  if (rs && rs.domains) {
    const domainSuccess: string[] = []
    const domainFails: string[] = [];
    for (let domain in rs.domains) {
      if (rs.domains[domain]) {
        domainSuccess.push(domain)
      } else {
        domainFails.push(domain)
      }
    }
    console.log({
      domainSuccess,
      domainFails
    })
    const transactionRs = await prismaClient.$transaction([
      prismaClient.domain.updateMany({
        where: {
          name: {
            in: domainSuccess
          }
        },
        data: {
          dnsStatus: 'ACTIVE'
        }
      }),
      prismaClient.domain.updateMany({
        where: {
          name: {
            in: domainFails
          }
        },
        data: {
          dnsStatus: 'DNS_ERROR'
        }
      })
    ])
    console.log({ transactionRs })
  }
  console.log('create domains records', rs)
  res.sendStatus(200)
})

export default router