import { signIn, signOut, useSession } from 'next-auth/react'

export const SignInStatus: React.VFC = () => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  return (
    <div style={{ padding: '5px', position: 'absolute', top: 0, right: 0 }}>
      {loading && <>Loading...</>}
      {session && (
        <>
          Signed in as{' '}
          <img
            alt={session.user.name}
            title={session.user.name}
            src={session.user.image}
            height={'20px'}
          />{' '}
          <button
            onClick={() => {
              signOut()
            }}
          >
            Sign out
          </button>
        </>
      )}
      {!session && !loading && (
        <>
          Not signed in{' '}
          <button
            onClick={() => {
              signIn()
            }}
          >
            Sign in
          </button>
        </>
      )}
    </div>
  )
}
