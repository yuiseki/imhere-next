import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import fetcher from '~/lib/fetcher'
import { CategoryWithUsers } from '~/types/CategoryWithUsers'
import { UserWithCategories } from '~/types/UserWithCategories'
import { UserIcon } from '../UserIcon'

export const CategoryItemView: React.VFC<{
  category: CategoryWithUsers
}> = ({ category }) => {
  const { data: session } = useSession()
  const { data: me } = useSWR<UserWithCategories>('/api/users/me', fetcher)
  const [checked, setChecked] = useState('none')
  const { mutate } = useSWRConfig()

  useEffect(() => {
    me?.categories
      .filter((c) => {
        return c.categoryId === category.id
      })
      .map((c) => {
        switch (c.isPublic) {
          case true:
            setChecked('public')
            break
          case false:
            setChecked('private')
            break
          default:
            setChecked('none')
            break
        }
      })
  }, [me])

  const onChange = useCallback(
    async (event: React.FormEvent<HTMLInputElement>) => {
      setChecked(event.currentTarget.value)
      let applicableValue = null
      switch (event.currentTarget.value) {
        case 'public':
          applicableValue = true
          break
        case 'private':
          applicableValue = false
          break
        default:
          break
      }
      const body: any = {
        categoryId: category.id,
        isPublic: applicableValue,
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
      await mutate('/api/categories' + category.id)
    },
    []
  )

  return (
    <div
      key={category.id}
      style={{
        margin: '10px',
        padding: '5px',
        border: '1px solid black',
        width: '45vw',
      }}
    >
      <h3>
        [{category.genre.name}] {category.name} ({category.users.length})
      </h3>
      <div style={{ minHeight: '30px' }}>
        {checked === 'private' && (
          <div style={{ opacity: 0.5 }}>
            <UserIcon user={me} />
          </div>
        )}
        {category.users.map((user) => {
          return <UserIcon key={user.user.id} user={user.user} />
        })}
      </div>
      {session && (
        <div>
          <div>
            <label htmlFor={category.id + '-public'}>
              <input
                type="radio"
                id={category.id + '-public'}
                name={category.id + '-select'}
                value="public"
                checked={checked === 'public'}
                onChange={(e) => {
                  onChange(e)
                }}
              />
              &#127759;該当する（公開）
            </label>
          </div>
          <div>
            <label htmlFor={category.id + '-private'}>
              <input
                type="radio"
                id={category.id + '-private'}
                name={category.id + '-select'}
                value="private"
                checked={checked === 'private'}
                onChange={(e) => {
                  onChange(e)
                }}
              />
              &#128274;該当する（非公開）
            </label>
          </div>
          <div>
            <label htmlFor={category.id + '-null'}>
              <input
                type="radio"
                id={category.id + '-null'}
                name={category.id + '-select'}
                value="none"
                checked={checked === 'none'}
                onChange={(e) => {
                  onChange(e)
                }}
              />
              &#127514;該当しない
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
