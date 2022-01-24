import { Category } from '@prisma/client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import useSWR from 'swr'
import fetcher from '~/lib/fetcher'
import { UserWithCategories } from '~/types/UserWithCategories'

export const useCategoryState = (
  category: Category
): [string, Dispatch<SetStateAction<string>>] => {
  const { data: me } = useSWR<UserWithCategories>('/api/users/me', fetcher)
  const [status, setStatus] = useState('none')

  useEffect(() => {
    me?.categories
      .filter((c) => {
        return c.categoryId === category.id
      })
      .map((c) => {
        setStatus(c.status)
      })
  }, [me])

  return [status, setStatus]
}
