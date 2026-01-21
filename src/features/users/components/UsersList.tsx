import { List, ListItem, ListItemText, Chip, Stack, Typography } from '@mui/material'
import type { User } from '../api/usersApi'

export function UsersList({ users }: { users: User[] }) {
  return (
    <List dense>
      {users.map((u) => (
        <ListItem key={u.id} divider>
          <ListItemText
            primary={
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography fontWeight={600}>{u.name}</Typography>
                <Chip size="small" label={u.role} />
                <Chip size="small" label={u.active ? 'Active' : 'Inactive'} />
              </Stack>
            }
            secondary={u.email}
          />
        </ListItem>
      ))}
    </List>
  )
}