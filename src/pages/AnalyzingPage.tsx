import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { cloudFunctionService } from '../services/cloudFunctionService';

export default function AnalyzingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const analyzeUserSituation = async () => {
      try {
        // Get user situation from localStorage
        const situation = localStorage.getItem('userSituation') || '';
        
        // Call Cloud Function service to get program recommendations
        const results = await cloudFunctionService.analyzeUserSituation(situation);
        
        // Store results in localStorage for ResultsPage to use
        localStorage.setItem('aiResults', JSON.stringify(results));
        
        // Navigate to program explorer page where user can select programs
        navigate('/program-explorer');
      } catch (error) {
        console.error('Error analyzing user situation:', error);
        // Navigate to program explorer page anyway, it will handle the error
        navigate('/program-explorer');
      }
    };

    // Start analysis with a small delay to show the loading animation
    const timer = setTimeout(() => {
      analyzeUserSituation();
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box 
      sx={{ 
        maxWidth: 800, 
        width: '100%',
        mx: 'auto', 
        px: 3, 
        py: 4,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center' 
      }}
    >
      <Box sx={{ mb: 6 }}>
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
          Analyzing your situation...
        </Typography>
        
        <Typography 
          sx={{ 
            color: '#5f6368',
            fontSize: '1.125rem',
            lineHeight: 1.5,
            mb: 6
          }}
        >
          We're finding the best programs and benefits that match your needs.
        </Typography>

        <CircularProgress 
          size={48}
          sx={{ 
            color: '#1a73e8'
          }} 
        />
      </Box>
    </Box>
  );
}
