import { Genre } from '@prisma/client'
import { useRef } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import fetcher from '~/lib/fetcher'

export const AddCategoryForm: React.VFC<{
  csrfToken: string
}> = ({ csrfToken }) => {
  const form = useRef<HTMLFormElement>()
  const { data: genres } = useSWR<Genre[]>('/api/genre', fetcher)
  const { mutate } = useSWRConfig()

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const body: any = {}
    formData.forEach((value, key) => (body[key] = value))

    const headers = {
      'Content-Type': 'application/json',
    }

    await fetch('/api/categories', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    })

    mutate('/api/categories')
    mutate('/api/genre')
    mutate('/api/genre/' + formData['genreId'])
    try {
      form.current.reset()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <h4>Add new category</h4>
      <form onSubmit={onSubmit} ref={form}>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <select name="genreId">
          {genres &&
            genres.map((genre) => {
              return (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              )
            })}
        </select>
        <input name="name" type="text" />
        <input type="submit" value="add" />
      </form>
    </>
  )
}
