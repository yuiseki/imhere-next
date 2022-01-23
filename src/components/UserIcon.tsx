import { User } from '@prisma/client'

export const UserIcon: React.VFC<{
  user: User
}> = ({ user }) => {
  return (
    <a href={`https://twitter.com/${user.screenName}`} target="_blank">
      <img alt={user.name} title={user.name} src={user.image} height={'30px'} />
    </a>
  )
}
