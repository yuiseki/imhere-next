import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '~/lib/prisma'

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const results = await prisma.genre.findMany({
    take: 100,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          categories: true,
        },
      },
    },
  })

  res.status(200).json(results)
}

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await prisma.genre.create({
    data: {
      name: req.body.name,
    },
  })
  res.status(200).json(result)
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  switch (req.method) {
    case 'GET':
      await get(req, res)
      break
    case 'POST':
      await post(req, res)
      break
    default:
      res.status(405)
      break
  }
}

export default handler
