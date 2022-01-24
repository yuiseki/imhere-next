import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '~/lib/prisma'

const put = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const data = {
    category: { connect: { id: req.body.categoryId } },
    user: { connect: { id: session.user.id } },
    status: req.body.status,
  }
  if (req.body.isPublic !== null) {
    const result = await prisma.categoryOnUser.upsert({
      where: {
        userId_categoryId: {
          userId: session.user.id,
          categoryId: req.body.categoryId,
        },
      },
      create: data,
      update: data,
    })
    res.status(200).json(result)
  } else {
    await prisma.categoryOnUser.delete({
      where: {
        userId_categoryId: {
          userId: session.user.id,
          categoryId: req.body.categoryId,
        },
      },
    })
  }
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  switch (req.method) {
    case 'PUT':
      await put(req, res)
      break
    default:
      res.status(405)
      break
  }
}

export default handler
