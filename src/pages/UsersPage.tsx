import * as React from 'react'
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid'

import { useUsersQuery } from '../features/users/hooks/useUserQuery'
import { UsersGrid } from '../features/users/components/UsersGrid'
import { UsersList } from '../features/users/components/UsersList'
import { UsersCards } from '../features/users/components/UsersCards'
import type { User } from '../features/users/api/usersApi'

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(id)
  }, [value, delayMs])

  return debounced
}

type RoleFilter = 'ALL' | 'ADMIN' | 'VIEWER'
type ActiveFilter = 'ALL' | 'ACTIVE' | 'INACTIVE'
type ViewMode = 'grid' | 'list' | 'cards'

export function UsersPage() {
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })

  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: 'createdAt', sort: 'desc' },
  ])

  const [view, setView] = React.useState<ViewMode>('grid')

  const [q, setQ] = React.useState('')
  const debouncedQ = useDebouncedValue(q, 300)

  const [role, setRole] = React.useState<RoleFilter>('ALL')
  const [active, setActive] = React.useState<ActiveFilter>('ALL')

  const sort =
    sortModel[0]?.sort && sortModel[0]?.field
      ? { field: sortModel[0].field, dir: sortModel[0].sort as 'asc' | 'desc' }
      : undefined

  const roleParam: User['role'] | undefined = role === 'ALL' ? undefined : role
  const activeParam: boolean | undefined =
    active === 'ALL' ? undefined : active === 'ACTIVE' ? true : false

  const query = useUsersQuery({
    page: paginationModel.page,
    size: paginationModel.pageSize,
    q: debouncedQ.trim() || undefined,
    role: roleParam,
    active: activeParam,
    sort,
  })

  const users = query.data?.items ?? []
  const total = query.data?.total ?? 0

  if (query.error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => query.refetch()}>
            Retry
          </Button>
        }
      >
        Failed to load users{query.error instanceof Error ? `: ${query.error.message}` : ''}.
      </Alert>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
        <TextField
          label="Search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setPaginationModel((m) => ({ ...m, page: 0 }))
          }}
          size="small"
          sx={{ width: { xs: '100%', md: 320 } }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="role-filter-label">Role</InputLabel>
          <Select
            labelId="role-filter-label"
            label="Role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value as RoleFilter)
              setPaginationModel((m) => ({ ...m, page: 0 }))
            }}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="VIEWER">Viewer</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="active-filter-label">Active</InputLabel>
          <Select
            labelId="active-filter-label"
            label="Active"
            value={active}
            onChange={(e) => {
              setActive(e.target.value as ActiveFilter)
              setPaginationModel((m) => ({ ...m, page: 0 }))
            }}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
          </Select>
        </FormControl>

        {/* View selector */}
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_, next) => {
            if (next) setView(next)
          }}
          aria-label="View mode"
        >
          <ToggleButton value="grid">Grid</ToggleButton>
          <ToggleButton value="list">List</ToggleButton>
          <ToggleButton value="cards">Cards</ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ flex: 1 }} />

        <Typography variant="body2" color="text.secondary">
          {query.isFetching ? 'Refreshing…' : `Total: ${total}`}
        </Typography>
      </Stack>

      {view === 'grid' && (
        <UsersGrid
          users={users}
          total={total}
          loading={query.isLoading || query.isFetching}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
        />
      )}

      {view === 'list' && (
        <UsersList
          users={users}
        />
      )}

      {view === 'cards' && (
        <UsersCards
          users={users}
        />
      )}
    </Box>
  )
}