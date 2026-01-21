import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import type { User } from '../api/usersApi'

export function UsersGrid({
  users,
  total,
  loading,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
}: {
  users: User[]
  total: number
  loading: boolean
  paginationModel: any
  onPaginationModelChange: (m: any) => void
  sortModel: any
  onSortModelChange: (m: any) => void
}) {
  const columns: GridColDef<User>[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', width: 120 },
    { field: 'active', headerName: 'Active', width: 110, type: 'boolean' },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 180,
      valueFormatter: (v) => new Date(v as string).toLocaleString(),
    },
  ]

  return (
    <DataGrid
      rows={users}
      columns={columns}
      getRowId={(r) => r.id}
      rowCount={total}
      loading={loading}
      paginationMode="server"
      sortingMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      autoHeight
      disableRowSelectionOnClick
    />
  )
}