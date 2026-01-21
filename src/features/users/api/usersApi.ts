import { getJson } from '../../../shared/api/http'

export type User = {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'VIEWER'
  active: boolean
  createdAt: string
}

export type UsersResponse = {
  items: User[]
  page: number
  size: number
  total: number
}

export type UsersQuery = {
  page: number
  size: number
  q?: string
  role?: 'ADMIN' | 'VIEWER'
  active?: boolean
  sort?: { field: string; dir: 'asc' | 'desc' }
}

export function fetchUsers(params: UsersQuery) {
  const sp = new URLSearchParams()
  sp.set('page', String(params.page))
  sp.set('size', String(params.size))

  if (params.q) sp.set('q', params.q)
  if (params.role) sp.set('role', params.role)
  if (typeof params.active === 'boolean') sp.set('active', String(params.active))

  // common REST style: sort=field,dir
  if (params.sort) sp.set('sort', `${params.sort.field},${params.sort.dir}`)

  return getJson<UsersResponse>(`/api/users?${sp.toString()}`)
}