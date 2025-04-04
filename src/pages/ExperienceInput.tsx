import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Typography, Button, CircularProgress } from '@mui/material';

export default function ExperienceInput() {
  const [situation, setSituation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleContinue = useCallback(async () => {
    if (!situation.trim() || isProcessing) {
      console.log('Invalid state for continue:', { situation, isProcessing });
      return;
    }

    console.log('Starting analysis process...');
    console.log('User situation:', situation);
    setIsProcessing(true);

    try {
      // Store the situation for analysis
      localStorage.setItem('userSituation', situation);
      
      // Navigate to analyzing page
      console.log('Navigating to analyzing page...');
      navigate('/analyzing');
    } catch (error) {
      console.error('Error storing situation:', error);
      setIsProcessing(false);
    }
  }, [situation, isProcessing, navigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('Enter key pressed');
      e.preventDefault();
      handleContinue();
    }
  }, [handleContinue]);

  return (
    <Box sx={{ 
      maxWidth: 800, 
      width: '100%',
      mx: 'auto', 
      px: 3, 
      py: 4,
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
        <Typography 
          component="span" 
          sx={{ 
            fontSize: '2.75rem',
            transform: 'rotate(15deg)',
            display: 'block',
            color: '#fbbc04', // Google's yellow color
            mt: 0.5
          }}
        >
          👋
        </Typography>
        <Typography 
          component="h1" 
          sx={{ 
            color: '#3c4043',
            fontWeight: 400,
            fontSize: '2rem',
            lineHeight: 1.4,
            mt: 1
          }}
        >
          Tell us a bit about your situation and what kind of help you're looking for:
        </Typography>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={4}
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="For example: I'm a single parent with two kids, working part-time. I'm having trouble paying rent and need help with childcare so I can work more hours..."
        variant="outlined"
        disabled={isProcessing}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'white',
            fontSize: '1.25rem',
            borderRadius: '8px',
            '& fieldset': {
              borderColor: '#dadce0',
              borderWidth: '1px'
            },
            '&:hover fieldset': {
              borderColor: '#1a73e8'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1a73e8',
              borderWidth: '2px'
            },
            '& textarea': {
              padding: '16px',
              '&::placeholder': {
                color: '#bdc1c6',
                opacity: 1,
                fontSize: '1.1rem',
                lineHeight: 1.5
              }
            }
          }
        }}
      />

      <Typography 
        variant="body2" 
        sx={{ 
          color: '#5f6368',
          fontSize: '0.875rem',
          ml: 0.5,
          mb: 6
        }}
      >
        Your response will help our AI assistant find the most relevant benefits and support programs for your needs.
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        borderTop: '1px solid #dadce0',
        pt: 3,
        mt: 4
      }}>
        <Button
          onClick={() => {
            console.log('Continue button clicked');
            handleContinue();
          }}
          disabled={!situation.trim() || isProcessing}
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
            minWidth: '120px',
            boxShadow: 'none',
            position: 'relative',
            '&:hover': {
              bgcolor: '#1557b0',
              boxShadow: 'none'
            },
            '&.Mui-disabled': {
              bgcolor: isProcessing ? '#1a73e8' : '#dadce0',
              color: isProcessing ? 'white' : '#5f6368'
            }
          }}
        >
          {isProcessing ? (
            <>
              <CircularProgress 
                size={20} 
                sx={{ 
                  color: 'white',
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-10px'
                }} 
              />
              <Box sx={{ opacity: 0 }}>Continue</Box>
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </Box>
    </Box>
  );
}
