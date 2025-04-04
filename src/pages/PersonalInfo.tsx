import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress,
  Chip,
  Stack
} from '@mui/material';

interface Program {
  id: number;
  name: string;
}

export default function PersonalInfo() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<Program[]>(() => {
    const stored = localStorage.getItem('selectedPrograms');
    return stored ? JSON.parse(stored) : [];
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    
    // Store personal info for next steps
    localStorage.setItem('personalInfo', JSON.stringify(formData));
    
    // Navigate to next step (you can change this to the appropriate next page)
    setTimeout(() => {
      navigate('/income-info');
    }, 1000);
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.dateOfBirth.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.state.trim() !== '' &&
      formData.zipCode.trim() !== ''
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
          Let's start with your personal information
        </Typography>

        <Typography 
          sx={{ 
            color: '#5f6368',
            fontSize: '1.125rem',
            lineHeight: 1.5,
            mb: 4
          }}
        >
          This information will be used for all your selected program applications.
        </Typography>

        <Stack spacing={3}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={isProcessing}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={isProcessing}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              disabled={isProcessing}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isProcessing}
            />
          </Box>

          <TextField
            fullWidth
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={isProcessing}
          />

          <TextField
            fullWidth
            label="Street Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            disabled={isProcessing}
          />

          <Box sx={{ display: 'flex', gap: 3 }}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              disabled={isProcessing}
            />
            <TextField
              sx={{ width: '30%' }}
              label="State"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              disabled={isProcessing}
            />
            <TextField
              sx={{ width: '30%' }}
              label="ZIP Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              disabled={isProcessing}
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
