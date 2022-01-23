import type { NextPageContext } from 'next'
import { getCsrfToken } from 'next-auth/react'
import Head from 'next/head'
import { AdminView } from '~/components/Admin/AdminView'
import { ListCategoryByGenre } from '~/components/Category/ListCategory'
import { Footer } from '~/components/Footer'
import { SignInStatus } from '~/components/SignInStatus'

const Home: React.VFC = ({ csrfToken }: { csrfToken: string }) => {
  const title = 'imhere - マイノリティが自分はここにいると伝えるための場所'
  return (
    <div
      className="container"
      style={{
        fontFamily:
          'apple color emoji, segoe ui emoji, noto color emoji, android emoji, emojisymbols, emojione mozilla, twemoji mozilla, segoe ui symbol',
      }}
    >
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 style={{ marginTop: '1.5em' }}>{title}</h1>
        <SignInStatus />
        <div>
          <AdminView csrfToken={csrfToken} />
          <ListCategoryByGenre />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home

export async function getServerSideProps(
  context: NextPageContext
): Promise<{ props: { csrfToken: string } }> {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}
