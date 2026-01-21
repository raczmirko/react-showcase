import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '../api/usersApi'
import type { UsersQuery  } from '../api/usersApi'

export function useUsersQuery(params: UsersQuery) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  })
}