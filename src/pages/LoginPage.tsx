import React from 'react'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../app/providers/AuthProvider'
import { useTranslation } from 'react-i18next'

export function LoginPage() {
  const { t } = useTranslation()
  const [name, setName] = React.useState('')
  const { login, user } = React.useContext(AuthContext)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', backgroundImage: "url(https://picsum.photos/1920/1080)"}}>
      <Paper sx={{ p: 3, width: 360 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>{t('auth.login')}</Typography>
        <TextField
          fullWidth
          label="Name (try: admin)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={() => login(name.trim() || 'viewer')}
        >
          {t('auth.login')}
        </Button>
      </Paper>
    </Box>
  )
}