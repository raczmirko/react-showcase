import { http, HttpResponse } from 'msw'
import { db } from './data'
import type { User } from './data'

function parseIntOr(v: string | null, fallback: number) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function parseBoolOrUndefined(v: string | null): boolean | undefined {
  if (v == null) return undefined
  const normalized = v.trim().toLowerCase()
  if (normalized === 'true') return true
  if (normalized === 'false') return false
  return undefined
}

type SortDir = 'asc' | 'desc'
function parseSort(v: string | null): { field: keyof User; dir: SortDir } | undefined {
  if (!v) return undefined
  // expected format: "field,asc" or "field,desc"
  const [fieldRaw, dirRaw] = v.split(',').map((s) => s.trim())
  const dir: SortDir = dirRaw?.toLowerCase() === 'desc' ? 'desc' : 'asc'

  // allow only safe sortable fields
  const allowedFields: Array<keyof User> = ['name', 'email', 'role', 'active', 'createdAt']
  const field = allowedFields.find((f) => f === fieldRaw) as keyof User | undefined

  if (!field) return undefined
  return { field, dir }
}

function compareValues(a: unknown, b: unknown): number {
  // boolean
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b)

  // string (incl ISO dates)
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b)
  }

  // fallback
  return String(a ?? '').localeCompare(String(b ?? ''))
}

export const handlers = [
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)

    const page = parseIntOr(url.searchParams.get('page'), 0)
    const size = parseIntOr(url.searchParams.get('size'), 10)

    const q = (url.searchParams.get('q') ?? '').trim().toLowerCase()
    const role = (url.searchParams.get('role') ?? '').trim().toUpperCase()
    const active = parseBoolOrUndefined(url.searchParams.get('active'))
    const sort = parseSort(url.searchParams.get('sort'))

    let items: User[] = db.users

    // ---- filtering ----
    if (q) {
      items = items.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      )
    }

    if (role === 'ADMIN' || role === 'VIEWER') {
      items = items.filter((u) => u.role === role)
    }

    if (typeof active === 'boolean') {
      items = items.filter((u) => u.active === active)
    }

    // ---- sorting (before paging) ----
    // stable sort: use id as tie-breaker so ordering doesn't jump around
    const sorted = [...items].sort((a, b) => {
      if (!sort) return a.id.localeCompare(b.id)

      const av = a[sort.field]
      const bv = b[sort.field]
      const cmp = compareValues(av, bv)

      if (cmp !== 0) return sort.dir === 'asc' ? cmp : -cmp
      return a.id.localeCompare(b.id)
    })

    // ---- pagination ----
    const total = sorted.length
    const start = page * size
    const paged = sorted.slice(start, start + size)

    return HttpResponse.json({
      items: paged,
      page,
      size,
      total,
    })
  }),
]
