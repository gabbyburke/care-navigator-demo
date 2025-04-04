import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress,
  Chip,
  Stack,
  Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Program {
  id: number;
  name: string;
}

interface Document {
  id: string;
  name: string;
  description: string;
  required: boolean;
  file?: File;
}

export default function DocumentsUpload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<Program[]>(() => {
    const stored = localStorage.getItem('selectedPrograms');
    return stored ? JSON.parse(stored) : [];
  });

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'id-proof',
      name: 'Photo ID',
      description: 'Government-issued photo identification (e.g., driver\'s license, passport)',
      required: true
    },
    {
      id: 'income-proof',
      name: 'Proof of Income',
      description: 'Recent pay stubs, W-2, or tax returns from the last year',
      required: true
    },
    {
      id: 'residence-proof',
      name: 'Proof of Residence',
      description: 'Utility bill, lease agreement, or mortgage statement',
      required: true
    },
    {
      id: 'other-income',
      name: 'Other Income Documentation',
      description: 'Documentation for additional income sources (if applicable)',
      required: false
    }
  ]);

  const navigate = useNavigate();

  const handleFileUpload = (documentId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId ? { ...doc, file } : doc
      ));
    }
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    
    // In a real app, we would upload the files here
    // For now, we'll just simulate the upload
    setTimeout(() => {
      navigate('/review');
    }, 1500);
  };

  const isFormValid = () => {
    return documents
      .filter(doc => doc.required)
      .every(doc => doc.file);
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
          Upload your documents
        </Typography>

        <Typography 
          sx={{ 
            color: '#5f6368',
            fontSize: '1.125rem',
            lineHeight: 1.5,
            mb: 4
          }}
        >
          Please provide the following documents to verify your information.
        </Typography>

        <Stack spacing={2}>
          {documents.map((doc) => (
            <Paper
              key={doc.id}
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid #dadce0',
                borderRadius: '8px',
                bgcolor: doc.file ? '#f8f9fe' : 'white'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                <Box>
                  <Typography 
                    sx={{ 
                      fontSize: '1.125rem',
                      fontWeight: 500,
                      color: '#3c4043',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    {doc.name}
                    {doc.required && (
                      <Typography 
                        component="span" 
                        sx={{ 
                          color: '#5f6368',
                          fontSize: '0.875rem',
                          fontWeight: 400
                        }}
                      >
                        (Required)
                      </Typography>
                    )}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#5f6368',
                      fontSize: '0.875rem',
                      mt: 0.5
                    }}
                  >
                    {doc.description}
                  </Typography>
                </Box>
                {doc.file && (
                  <CheckCircleIcon sx={{ color: '#34a853', fontSize: 24 }} />
                )}
              </Box>

              <Button
                component="label"
                variant={doc.file ? "outlined" : "contained"}
                startIcon={<CloudUploadIcon />}
                sx={{
                  mt: 2,
                  bgcolor: doc.file ? 'transparent' : '#1a73e8',
                  color: doc.file ? '#1a73e8' : 'white',
                  border: doc.file ? '1px solid #1a73e8' : 'none',
                  '&:hover': {
                    bgcolor: doc.file ? 'rgba(26, 115, 232, 0.04)' : '#1557b0',
                  }
                }}
              >
                {doc.file ? 'Replace file' : 'Upload file'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload(doc.id)}
                />
              </Button>
              {doc.file && (
                <Typography 
                  sx={{ 
                    color: '#5f6368',
                    fontSize: '0.875rem',
                    mt: 1
                  }}
                >
                  {doc.file.name}
                </Typography>
              )}
            </Paper>
          ))}
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
