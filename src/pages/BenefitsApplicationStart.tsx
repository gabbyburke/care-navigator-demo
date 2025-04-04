import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Chip,
  CircularProgress,
  Paper
} from '@mui/material';
import { mockAIService } from '../services/mockAI';

interface Program {
  id: number;
  name: string;
  description: string;
  eligibility: string;
}

export default function BenefitsApplicationStart() {
  const [selectedPrograms, setSelectedPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPrograms = () => {
      try {
        // Load selected programs from localStorage (set by ResultsPage)
        const savedPrograms = localStorage.getItem('selectedPrograms');
        if (savedPrograms) {
          setSelectedPrograms(JSON.parse(savedPrograms));
          setIsLoading(false);
        } else {
          // Fallback to loading all programs if no selection was made
          const loadAllPrograms = async () => {
            try {
              const situation = localStorage.getItem('userSituation') || '';
              const { programs } = await mockAIService.analyzeUserSituation(situation);
              setSelectedPrograms(programs);
            } catch (error) {
              console.error('Error loading programs:', error);
            } finally {
              setIsLoading(false);
            }
          };
          loadAllPrograms();
        }
      } catch (error) {
        console.error('Error loading selected programs:', error);
        setIsLoading(false);
      }
    };

    loadPrograms();
  }, []);

  const handleContinue = () => {
    // Store selected programs for next steps
    localStorage.setItem('selectedPrograms', JSON.stringify(selectedPrograms));
    navigate('/personal-info');
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 3, mt: 8 }}>
      {/* Selected Programs Chips */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#5f6368',
            mb: 2,
            fontWeight: 500 
          }}
        >
          Selected Programs
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedPrograms.map((program) => (
            <Chip
              key={program.id}
              label={program.name}
              sx={{
                bgcolor: '#e8f0fe',
                color: '#1a73e8',
                '& .MuiChip-label': {
                  px: 2,
                  py: 0.75
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Main Content */}
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
          Let's get started with your applications
        </Typography>

        <Typography 
          sx={{ 
            color: '#5f6368',
            fontSize: '1.125rem',
            lineHeight: 1.5,
            mb: 4
          }}
        >
          We'll help you apply for these programs step by step. First, we'll gather some basic information that most programs require.
        </Typography>

        {/* Program Cards */}
        {selectedPrograms.map((program) => (
          <Paper
            key={program.id}
            elevation={0}
            sx={{
              p: 3,
              mb: 2,
              border: '1px solid #dadce0',
              borderRadius: '8px'
            }}
          >
            <Typography 
              sx={{ 
                color: '#3c4043',
                fontSize: '1.125rem',
                fontWeight: 500,
                mb: 1
              }}
            >
              {program.name}
            </Typography>
            <Typography 
              sx={{ 
                color: '#5f6368',
                mb: 2
              }}
            >
              {program.description}
            </Typography>
            <Typography 
              sx={{ 
                color: '#3c4043',
                fontSize: '0.875rem'
              }}
            >
              <strong>Eligibility:</strong> {program.eligibility}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Continue Button */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        borderTop: '1px solid #dadce0',
        pt: 3,
        mt: 4
      }}>
        <Button
          onClick={handleContinue}
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
            '&:hover': {
              bgcolor: '#1557b0',
              boxShadow: 'none'
            }
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}
