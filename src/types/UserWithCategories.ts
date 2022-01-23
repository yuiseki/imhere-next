import { CategoryOnUser, User } from '@prisma/client'

export type UserWithCategories = User & {
  categories: CategoryOnUser[]
}
