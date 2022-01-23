import { Genre } from '@prisma/client'
import { useRef } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import fetcher from '~/lib/fetcher'

export const AddGenreForm: React.VFC<{
  csrfToken: string
}> = ({ csrfToken }) => {
  const { data: genres } = useSWR<Genre[]>('/api/genres', fetcher)
  const form = useRef<HTMLFormElement>()
  const { mutate } = useSWRConfig()

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const body: any = {}
    formData.forEach((value, key) => (body[key] = value))

    const headers = {
      'Content-Type': 'application/json',
    }

    await fetch('/api/genres', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    })

    await mutate('/api/genres')
    try {
      form.current.reset()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <h4>Add new genre</h4>
      <form onSubmit={onSubmit} ref={form}>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <input name="name" type="text" />
        <input type="submit" value="add" />
      </form>
      <ul style={{ padding: 0 }}>
        {genres &&
          genres.map((genre) => {
            return (
              <li style={{ display: 'inline', padding: '5px' }} key={genre.id}>
                {genre.name}
              </li>
            )
          })}
      </ul>
    </>
  )
}
