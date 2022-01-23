import { Genre } from '@prisma/client'
import useSWR from 'swr'
import fetcher from '~/lib/fetcher'
import { CategoryWithUsers } from '~/types/CategoryWithUsers'
import { CategoryItemView } from './CategoryItemView'

export const ListCategoryByGenre: React.VFC = () => {
  const { data: genres } = useSWR<Genre[]>('/api/genre', fetcher)
  return (
    <div>
      {genres &&
        genres.map((genre) => {
          return <ListCategoryOfGenre key={genre.id} genre={genre} />
        })}
    </div>
  )
}

const ListCategoryOfGenre: React.VFC<{ genre: Genre }> = ({ genre }) => {
  const { data: categories } = useSWR<CategoryWithUsers[]>(
    '/api/genre/' + genre.id,
    fetcher
  )

  return (
    <>
      {categories && categories.length > 0 && (
        <>
          <h2>{genre.name}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {categories &&
              categories.map((category) => {
                return (
                  <CategoryItemView key={category.id} category={category} />
                )
              })}
          </div>
        </>
      )}
    </>
  )
}