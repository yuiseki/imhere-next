import { Category, CategoryOnUser, Genre, User } from '@prisma/client'

export type CategoryWithUsers = Category & {
  users: (CategoryOnUser & {
    user: User
  })[]
  genre: Genre
  _count: {
    users: number
  }
}
