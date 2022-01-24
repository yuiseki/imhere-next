import { useSession } from 'next-auth/react'
import React, { useCallback } from 'react'
import { useSWRConfig } from 'swr'
import { useCategoryState as useCategoryStatus } from '~/hooks/useCategoryState'
import { CategoryWithUsers } from '~/types/CategoryWithUsers'
import { UserIcon } from '../UserIcon'

const CategoryItemStateSelector: React.VFC<{
  category: CategoryWithUsers
}> = ({ category }) => {
  const { data: session } = useSession()
  const { mutate } = useSWRConfig()

  const [status, setStatus] = useCategoryStatus(category)

  const onChange = useCallback(
    async (event: React.FormEvent<HTMLInputElement>) => {
      setStatus(event.currentTarget.value)
      const body: any = {
        categoryId: category.id,
        status: event.currentTarget.value,
      }

      const headers = {
        'Content-Type': 'application/json',
      }

      await fetch('/api/categories/' + category.id, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body),
      })

      await mutate('/api/users/me')
      await mutate('/api/genres/' + category.genreId)
    },
    []
  )

  if (!session) return null
  return (
    <div>
      <span title="該当する（公開）">
        <label htmlFor={category.id + '-public'}>
          <input
            type="radio"
            id={category.id + '-public'}
            name={category.id + '-select'}
            value="public"
            checked={status === 'public'}
            onChange={(e) => {
              onChange(e)
            }}
          />
          &#127759;
        </label>
      </span>
      <span title="該当する（非公開）">
        <label htmlFor={category.id + '-private'}>
          <input
            type="radio"
            id={category.id + '-private'}
            name={category.id + '-select'}
            value="private"
            checked={status === 'private'}
            onChange={(e) => {
              onChange(e)
            }}
          />
          &#128274;
        </label>
      </span>
      <span title="該当しない">
        <label htmlFor={category.id + '-null'}>
          <input
            type="radio"
            id={category.id + '-null'}
            name={category.id + '-select'}
            value="none"
            checked={status === 'none'}
            onChange={(e) => {
              onChange(e)
            }}
          />
          &#127514;
        </label>
      </span>
    </div>
  )
}

export const CategoryItemView: React.VFC<{
  category: CategoryWithUsers
}> = ({ category }) => {
  return (
    <div
      key={category.id}
      style={{
        margin: '5px',
        padding: '5px',
        border: '1px solid black',
        maxWidth: '15vw',
      }}
    >
      <div>
        <b>
          [{category.genre.name}] {category.name} ({category.users.length})
        </b>
      </div>
      <CategoryItemStateSelector category={category} />
      <div style={{ minHeight: '30px' }}>
        {category.users.map((user) => {
          return <UserIcon key={user.user.id} user={user.user} />
        })}
      </div>
    </div>
  )
}
