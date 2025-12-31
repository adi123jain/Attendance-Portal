import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Chip,
  Badge,
  Fab,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { Link, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';

const settings = ['Profile', 'Logout'];

function Navbar({ children }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const fullName = sessionStorage.getItem('fullName') || 'User';

  // Generate initials (e.g., "Test User" → "TU")
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const initials = getInitials(fullName);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleUserMenuClick = (setting) => {
    if (setting === 'Logout') {
      sessionStorage.clear();
      window.location.reload();
      navigate('/login');
    }
    handleCloseUserMenu();
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '10px',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              color: '#424242',
              fontWeight: 'bold',
              textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
            }}
          >
            <ElectricBoltIcon
              fontSize="large"
              sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
            />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: 'flex',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: '#424242',
                textDecoration: 'none',
                textShadow: '2px 2px 4px #000000',
              }}
            >
              e-Attendance
            </Typography>

            {/* Mobile menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
              >
                <MenuItem onClick={() => navigate('/')}>Home</MenuItem>
              </Menu>
            </Box>

            {/* Desktop menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button color="inherit" component={Link} to="/">
                <HomeIcon />
              </Button>
            </Box>

            {/* User info + avatar */}
            <Chip
              label={fullName}
              avatar={
                <Avatar
                  sx={{
                    //bgcolor: "#673ab7",
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {initials}
                </Avatar>
              }
              onClick={handleOpenUserMenu}
              sx={{
                backgroundColor: '#ede7f6',
                color: '#4527a0',
                fontWeight: 'bold',
                border: '1px solid #b39ddb',
                '& .MuiChip-label': { fontWeight: '600' },
              }}
            />

            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={() => handleUserMenuClick('Profile')}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => handleUserMenuClick('Logout')}>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 3, pb: 8 }}>
        {children}
        <Tooltip title="Go to Dashboard" arrow placement="top">
          <Fab
            color="secondary"
            aria-label="dashboard"
            onClick={() => navigate('/')}
            sx={{
              position: 'fixed',
              bottom: 60,
              right: 10,
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                '40%': { transform: 'translateY(-10px)' },
                '60%': { transform: 'translateY(-5px)' },
              },
            }}
          >
            <DashboardIcon />
          </Fab>
        </Tooltip>

        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '15px',
            textAlign: 'center',
            fontFamily: 'sans-serif',
            background: 'linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          © 2024, All Rights Reserved By MPMKVVCL.
        </Box>
      </Box>
    </>
  );
}

export default Navbar;
