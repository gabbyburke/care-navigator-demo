import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function SubmissionConfirmation() {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        maxWidth: 800, 
        mx: 'auto', 
        px: 3, 
        mt: 8,
        textAlign: 'center'
      }}
    >
      <CheckCircleIcon 
        sx={{ 
          fontSize: 64,
          color: '#34a853',
          mb: 3
        }} 
      />

      <Typography 
        component="h1" 
        sx={{ 
          color: '#3c4043',
          fontWeight: 400,
          fontSize: '2rem',
          lineHeight: 1.4,
          mb: 3
        }}
      >
        Application Submitted Successfully
      </Typography>

      <Typography 
        sx={{ 
          color: '#5f6368',
          fontSize: '1.125rem',
          lineHeight: 1.5,
          mb: 6,
          maxWidth: 600,
          mx: 'auto'
        }}
      >
        Thank you for submitting your application. We'll review your information and be in touch soon with next steps. You'll receive a confirmation email shortly with a copy of your application.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          onClick={() => navigate('/')}
          variant="outlined"
          size="large"
          sx={{
            color: '#1a73e8',
            borderColor: '#1a73e8',
            px: 4,
            py: 1.5,
            fontSize: '0.875rem',
            fontWeight: 500,
            textTransform: 'none',
            borderRadius: '6px',
            '&:hover': {
              bgcolor: 'rgba(26, 115, 232, 0.04)',
              borderColor: '#1557b0'
            }
          }}
        >
          Return Home
        </Button>
        <Button
          onClick={() => window.print()}
          variant="contained"
          size="large"
          sx={{
            bgcolor: '#1a73e8',
            color: 'white',
            px: 4,
            py: 1.5,
            fontSize: '0.875rem',
            fontWeight: 500,
            textTransform: 'none',
            borderRadius: '6px',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#1557b0',
              boxShadow: 'none'
            }
          }}
        >
          Print Application
        </Button>
      </Box>

      <Typography 
        sx={{ 
          color: '#5f6368',
          fontSize: '0.875rem',
          mt: 8
        }}
      >
        Application Reference Number: {new Date().getTime().toString(36).toUpperCase()}
      </Typography>
    </Box>
  );
}
