import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress,
  Chip,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';

interface Program {
  id: number;
  name: string;
}

export default function IncomeInfo() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<Program[]>(() => {
    const stored = localStorage.getItem('selectedPrograms');
    return stored ? JSON.parse(stored) : [];
  });

  const [formData, setFormData] = useState({
    employmentStatus: '',
    monthlyIncome: '',
    householdSize: '',
    otherIncome: '',
    otherIncomeSource: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    
    // Store income info for next steps
    localStorage.setItem('incomeInfo', JSON.stringify(formData));
    
    // Navigate to next step
    setTimeout(() => {
      navigate('/documents-upload');
    }, 1000);
  };

  const isFormValid = () => {
    return (
      formData.employmentStatus.trim() !== '' &&
      formData.monthlyIncome.trim() !== '' &&
      formData.householdSize.trim() !== ''
    );
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
          Tell us about your income
        </Typography>

        <Typography 
          sx={{ 
            color: '#5f6368',
            fontSize: '1.125rem',
            lineHeight: 1.5,
            mb: 4
          }}
        >
          This helps us determine your eligibility for the selected programs.
        </Typography>

        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Employment Status</InputLabel>
            <Select
              name="employmentStatus"
              value={formData.employmentStatus}
              onChange={handleSelectChange}
              disabled={isProcessing}
              label="Employment Status"
            >
              <MenuItem value="employed-full">Employed (Full-time)</MenuItem>
              <MenuItem value="employed-part">Employed (Part-time)</MenuItem>
              <MenuItem value="self-employed">Self-employed</MenuItem>
              <MenuItem value="unemployed">Unemployed</MenuItem>
              <MenuItem value="retired">Retired</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <TextField
              fullWidth
              label="Monthly Income"
              name="monthlyIncome"
              type="number"
              value={formData.monthlyIncome}
              onChange={handleInputChange}
              disabled={isProcessing}
              InputProps={{
                startAdornment: <Typography sx={{ color: '#5f6368', mr: 1 }}>$</Typography>
              }}
            />
            <TextField
              sx={{ width: '40%' }}
              label="Household Size"
              name="householdSize"
              type="number"
              value={formData.householdSize}
              onChange={handleInputChange}
              disabled={isProcessing}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <TextField
              fullWidth
              label="Other Monthly Income (Optional)"
              name="otherIncome"
              type="number"
              value={formData.otherIncome}
              onChange={handleInputChange}
              disabled={isProcessing}
              InputProps={{
                startAdornment: <Typography sx={{ color: '#5f6368', mr: 1 }}>$</Typography>
              }}
            />
            <TextField
              fullWidth
              label="Source of Other Income"
              name="otherIncomeSource"
              value={formData.otherIncomeSource}
              onChange={handleInputChange}
              disabled={isProcessing}
              placeholder="e.g., Child Support, Social Security"
            />
          </Box>
        </Stack>
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
          onClick={handleSubmit}
          disabled={!isFormValid() || isProcessing}
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
