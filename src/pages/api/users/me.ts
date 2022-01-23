import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const session = await getSession({ req })
  if (!session) {
    res.status(403).json(undefined)
    return
  }
  const result = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      categories: {
        select: {
          categoryId: true,
          isPublic: true,
        },
      },
    },
  })
  res.status(200).json(result)
}

export default handler
