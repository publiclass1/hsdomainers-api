import { Router } from 'express'
import prismaClient from '../lib/primaClient'
import pick from 'lodash/pick'
import { generateAccessToken, getUserId } from '../lib/jwt'
import { serialize } from 'superjson'
const router = Router()

router.get('/', async (req, res) => {
  const userId = getUserId(req)
  try {
    let data = await prismaClient.userJob.findMany({
      where: {
        userId,
      }
    })
    res.json(serialize(data).json)
  } catch (e) {
    console.log(e)
    res.status(422).send('Unprocessable Entity!')
  }
})

router.post('/', async (req, res) => {
  const userId = getUserId(req)
  const { jobId } = req.body
  try {
    let exists = await prismaClient.userJob.findFirst({
      where: {
        userId,
        jobId: BigInt(jobId)
      }
    })
    if (exists) {
      res.status(422).send('Unprocessable Entity!')
      return
    } else {
      exists = await prismaClient.userJob.create({
        data: {
          jobId: BigInt(jobId),
          userId,
          appliedDate: new Date(),
          status: 'APPLIED'
        },
      })
    }

    res.json(serialize(exists).json)
  } catch (e) {
    console.log(e)
    res.status(422).send('Unprocessable Entity!')
  }

})

router.patch('/:id', async (req, res) => {

  const userId = getUserId(req)// the employer or creator of the job
  const { id } = req.params
  const { status } = req.body
  try {
    const exists = await prismaClient.userJob.findUnique({
      where: {
        id: BigInt(id),
      },
      include: {
        job: true
      }
    })
    if (!exists) {
      res.status(404).send('Not Found!')
      return
    }
    if (exists.job.postedByUserId !== userId) {
      //this current user is not an owner of the job
      console.log('Not a owner')
      res.json(403).end()
      return
    }

    const rs = await prismaClient.userJob.update({
      where: {
        id: exists.id
      },
      data: {
        status
      }
    })
    res.json(serialize(rs).json)
  } catch (e) {
    console.log(e)
    res.status(422).send('Unprocessable Entity!')
  }
})

router.delete('/:id', async (req, res) => {
  const userId = getUserId(req)
  const { id } = req.params
  try {
    const exists = await prismaClient.userJob.findFirst({
      where: {
        id: BigInt(id),
        userId
      }
    })
    if (!exists) {
      res.status(404).send('Not Found!')
      return
    }
    const rs = await prismaClient.userJob.delete({
      where: {
        id: exists.id
      }
    })
    res.status(204).end()
  } catch (e) {
    console.log(e)
    res.status(422).send('Unprocessable Entity!')
  }
})

export default router