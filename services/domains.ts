import prismaClient from "../lib/primaClient"

export async function createDomain(userId: bigint, name: string, price: number = 0) {
  try {
    let exists = await prismaClient.domain.findFirst({
      where: {
        name,
        userId,
        buynowPrice: price
      }
    })
    if (!exists) {
      exists = await prismaClient.domain.create({
        data: {
          name: name,
          nameLength: name.length,
          hasHypen: name.includes('-'),
          hasNumber: /^\d+$/.test(name),
          extension: name.split('.')?.pop() || '',
          userId,
          dnsStatus: 'PENDING',
          leasePrice: 0,
          buynowPrice: 0,
          monthlyPrice: 0,
          minimumOfferPrice: 0,
        }
      })
    }
    return exists
  } catch (e: any) {
    console.log(e.message)
  }
  return null
}
