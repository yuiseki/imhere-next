import useSWR from 'swr'
import fetcher from '~/lib/fetcher'
import { UserWithCategories } from '~/types/UserWithCategories'
import { AddCategoryForm } from '../Category/AddCategoryForm'
import { AddGenreForm } from '../Genre/AddGenreForm'

export const AdminView: React.VFC<{
  csrfToken: string
}> = ({ csrfToken }) => {
  const { data: me } = useSWR<UserWithCategories>('/api/users/me', fetcher)
  return (
    <>
      {me?.isAdmin && (
        <div style={{ border: '1px solid black' }}>
          <AddGenreForm csrfToken={csrfToken} />
          <AddCategoryForm csrfToken={csrfToken} />
        </div>
      )}
    </>
  )
}
