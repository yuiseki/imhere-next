import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '~/lib/prisma'

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const results = await prisma.category.findMany({
    take: 100,
    orderBy: {
      updatedAt: 'asc',
    },
    where: {
      genreId: req.query.id as string,
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          users: true,
        },
      },
      genre: {
        select: {
          id: true,
          name: true,
        },
      },
      users: {
        where: {
          status: 'public',
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

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  switch (req.method) {
    case 'GET':
      await get(req, res)
      break
    default:
      res.status(405)
      break
  }
}

export default handler
