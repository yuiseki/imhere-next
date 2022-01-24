import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '~/lib/prisma'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const session = await getSession({ req })
  if (!session) {
    res.status(403).json(undefined)
    return
  }
  const result = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
    include: {
      _count: {
        select: {
          accounts: true,
          sessions: true,
        },
      },
      categories: {
        where: {
          status: 'public',
        },
        select: {
          categoryId: true,
          status: true,
        },
      },
    },
  })
  res.status(200).json(result)
}

export default handler
