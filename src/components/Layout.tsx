import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

export default function Layout() {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        height: '100vh',
        width: '100vw',
        bgcolor: '#f8f9fe',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          height: '64px',
          borderBottom: '1px solid #dadce0',
          display: 'flex',
          alignItems: 'center',
          px: 3,
          bgcolor: 'white',
          flexShrink: 0
        }}
      >
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '1.25rem',
            fontWeight: 400,
            color: '#3c4043'
          }}
        >
          <span>care</span>
          <span style={{ color: '#1a73e8' }}>navigator</span>
        </Box>
      </Box>

      {/* Main Content */}
      <Box 
        sx={{ 
          position: 'relative',
          flexGrow: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
