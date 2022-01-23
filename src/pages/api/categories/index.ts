import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const results = await prisma.category.findMany({
    take: 100,
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      genre: {
        select: {
          name: true,
        },
      },
      users: {
        where: {
          isPublic: true,
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              screenName: true,
            },
          },
        },
      },
    },
  })
  res.status(200).json(results)
}

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await prisma.category.create({
    data: {
      genre: { connect: { id: req.body.genreId } },
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
