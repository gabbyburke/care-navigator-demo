import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress,
  Chip,
  Stack,
  Paper,
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Program {
  id: number;
  name: string;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface IncomeInfo {
  employmentStatus: string;
  monthlyIncome: string;
  householdSize: string;
  otherIncome: string;
  otherIncomeSource: string;
}

export default function Review() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<Program[]>(() => {
    const stored = localStorage.getItem('selectedPrograms');
    return stored ? JSON.parse(stored) : [];
  });

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(() => {
    const stored = localStorage.getItem('personalInfo');
    return stored ? JSON.parse(stored) : {};
  });

  const [incomeInfo, setIncomeInfo] = useState<IncomeInfo>(() => {
    const stored = localStorage.getItem('incomeInfo');
    return stored ? JSON.parse(stored) : {};
  });

  const navigate = useNavigate();

  const handleSubmit = () => {
    setIsProcessing(true);
    
    // In a real app, we would submit all the data here
    // For now, we'll just simulate the submission
    setTimeout(() => {
      navigate('/submission-confirmation');
    }, 2000);
  };

  const formatEmploymentStatus = (status: string) => {
    switch (status) {
      case 'employed-full':
        return 'Employed (Full-time)';
      case 'employed-part':
        return 'Employed (Part-time)';
      case 'self-employed':
        return 'Self-employed';
      case 'unemployed':
        return 'Unemployed';
      case 'retired':
        return 'Retired';
      case 'student':
        return 'Student';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Number(amount));
  };

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
          Review your application
        </Typography>

        <Typography 
          sx={{ 
            color: '#5f6368',
            fontSize: '1.125rem',
            lineHeight: 1.5,
            mb: 4
          }}
        >
          Please review all information before submitting your application.
        </Typography>

        <Stack spacing={3}>
          {/* Personal Information */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid #dadce0',
              borderRadius: '8px'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography 
                sx={{ 
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  color: '#3c4043'
                }}
              >
                Personal Information
              </Typography>
              <Button
                onClick={() => navigate('/personal-info')}
                sx={{ 
                  color: '#1a73e8',
                  '&:hover': {
                    bgcolor: 'rgba(26, 115, 232, 0.04)'
                  }
                }}
              >
                Edit
              </Button>
            </Box>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography sx={{ color: '#5f6368', width: 200 }}>Name:</Typography>
                <Typography sx={{ color: '#3c4043' }}>
                  {personalInfo.firstName} {personalInfo.lastName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography sx={{ color: '#5f6368', width: 200 }}>Date of Birth:</Typography>
                <Typography sx={{ color: '#3c4043' }}>{personalInfo.dateOfBirth}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography sx={{ color: '#5f6368', width: 200 }}>Email:</Typography>
                <Typography sx={{ color: '#3c4043' }}>{personalInfo.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography sx={{ color: '#5f6368', width: 200 }}>Phone:</Typography>
                <Typography sx={{ color: '#3c4043' }}>{personalInfo.phone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography sx={{ color: '#5f6368', width: 200 }}>Address:</Typography>
                <Typography sx={{ color: '#3c4043' }}>
                  {personalInfo.address}<br />
                  {personalInfo.city}, {personalInfo.state} {personalInfo.zipCode}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Income Information */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid #dadce0',
              borderRadius: '8px'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography 
                sx={{ 
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  color: '#3c4043'
                }}
              >
                Income Information
              </Typography>
              <Button
                onClick={() => navigate('/income-info')}
                sx={{ 
                  color: '#1a73e8',
                  '&:hover': {
                    bgcolor: 'rgba(26, 115, 232, 0.04)'
                  }
                }}
              >
                Edit
              </Button>
            </Box>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography sx={{ color: '#5f6368', width: 200 }}>Employment Status:</Typography>
                <Typography sx={{ color: '#3c4043' }}>
                  {formatEmploymentStatus(incomeInfo.employmentStatus)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography sx={{ color: '#5f6368', width: 200 }}>Monthly Income:</Typography>
                <Typography sx={{ color: '#3c4043' }}>
                  {formatCurrency(incomeInfo.monthlyIncome)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography sx={{ color: '#5f6368', width: 200 }}>Household Size:</Typography>
                <Typography sx={{ color: '#3c4043' }}>{incomeInfo.householdSize}</Typography>
              </Box>
              {incomeInfo.otherIncome && (
                <>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography sx={{ color: '#5f6368', width: 200 }}>Other Income:</Typography>
                    <Typography sx={{ color: '#3c4043' }}>
                      {formatCurrency(incomeInfo.otherIncome)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography sx={{ color: '#5f6368', width: 200 }}>Source:</Typography>
                    <Typography sx={{ color: '#3c4043' }}>{incomeInfo.otherIncomeSource}</Typography>
                  </Box>
                </>
              )}
            </Stack>
          </Paper>

          {/* Documents */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid #dadce0',
              borderRadius: '8px'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography 
                sx={{ 
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  color: '#3c4043'
                }}
              >
                Documents
              </Typography>
              <Button
                onClick={() => navigate('/documents-upload')}
                sx={{ 
                  color: '#1a73e8',
                  '&:hover': {
                    bgcolor: 'rgba(26, 115, 232, 0.04)'
                  }
                }}
              >
                Edit
              </Button>
            </Box>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <CheckCircleIcon sx={{ color: '#34a853' }} />
                <Typography sx={{ color: '#3c4043' }}>Photo ID uploaded</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <CheckCircleIcon sx={{ color: '#34a853' }} />
                <Typography sx={{ color: '#3c4043' }}>Proof of Income uploaded</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <CheckCircleIcon sx={{ color: '#34a853' }} />
                <Typography sx={{ color: '#3c4043' }}>Proof of Residence uploaded</Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Box>

      {/* Submit Button */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        borderTop: '1px solid #dadce0',
        pt: 3,
        mt: 4
      }}>
        <Button
          onClick={handleSubmit}
          disabled={isProcessing}
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
              <Box sx={{ opacity: 0 }}>Submit Application</Box>
            </>
          ) : (
            'Submit Application'
          )}
        </Button>
      </Box>
    </Box>
  );
}
