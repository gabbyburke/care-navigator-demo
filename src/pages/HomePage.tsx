import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const handleStart = () => {
    console.log('Starting experience flow...');
    navigate('/experience');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8f9fe',
        px: 3,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 600 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem' },
            fontWeight: 400,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ color: '#3c4043' }}>care</span>
          <span style={{ color: '#1a73e8' }}>navigator</span>
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem' },
            fontWeight: 400,
            color: '#3c4043',
            mb: 6
          }}
        >
          Find what works for you with AI
        </Typography>

        <Button
          onClick={handleStart}
          variant="contained"
          size="large"
          sx={{
            bgcolor: '#1a73e8',
            color: 'white',
            px: 6,
            py: 1.5,
            fontSize: '1.125rem',
            fontWeight: 500,
            textTransform: 'none',
            borderRadius: '8px',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#1557b0',
              boxShadow: 'none'
            }
          }}
        >
          Start
        </Button>
      </Box>
    </Box>
  );
}
