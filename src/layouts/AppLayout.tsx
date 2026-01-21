import React from 'react'
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useTranslation } from 'react-i18next'
import { ThemeModeContext } from '../app/providers/ThemeProvider'
import { AuthContext } from '../app/providers/AuthProvider'

const drawerWidth = 240

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { t, i18n } = useTranslation()
  const { toggle } = React.useContext(ThemeModeContext)
  const { user, logout } = React.useContext(AuthContext)
  const location = useLocation()

  const navItems = [
    { to: '/dashboard', label: t('nav.dashboard') },
    { to: '/users', label: t('nav.users') },
    { to: '/entities', label: t('nav.entities') },
    { to: '/settings', label: t('nav.settings') },
  ]

  const drawer = (
    <Box>
      <Toolbar />
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={RouterLink}
            to={item.to}
            selected={location.pathname === item.to}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen((p) => !p)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            React Showcase
          </Typography>

          <Button color="inherit" onClick={toggle}>Theme</Button>
          <Button color="inherit" onClick={() => i18n.changeLanguage('en')}>EN</Button>
          <Button color="inherit" onClick={() => i18n.changeLanguage('hu')}>HU</Button>
          <Button color="inherit" onClick={() => i18n.changeLanguage('de')}>DE</Button>

          <Typography sx={{ mx: 2 }}>{user?.name} ({user?.role})</Typography>
          <Button color="inherit" onClick={logout}>{t('auth.logout')}</Button>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}