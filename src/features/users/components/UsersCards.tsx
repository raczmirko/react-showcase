import { Box, Card, CardContent, Typography, Chip, Stack } from '@mui/material'
import type { User } from '../api/usersApi'

export function UsersCards({ users }: { users: User[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 2,
      }}
    >
      {users.map((u) => (
        <Card key={u.id} variant="outlined">
          <CardContent>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6">{u.name}</Typography>
              <Chip size="small" label={u.role} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {u.email}
            </Typography>
            <Chip
              sx={{ mt: 1 }}
              size="small"
              label={u.active ? 'Active' : 'Inactive'}
            />
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}