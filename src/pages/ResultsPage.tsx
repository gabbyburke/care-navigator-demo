import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, FormControlLabel, Switch, TextField, Button, CircularProgress, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { mockAIService } from '../services/mockAI';

interface Program {
  id: number;
  name: string;
  description: string;
  eligibility: string;
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<number[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Load AI results from localStorage
    const aiResults = localStorage.getItem('aiResults');
    if (aiResults) {
      const { programs } = JSON.parse(aiResults);
      setPrograms(programs);
    }

    // Add initial AI message
    setChatHistory([{
      type: 'ai',
      message: 'Based on your situation, I\'ve identified some programs that might help. You can ask me questions about any of these programs.'
    }]);
  }, []);

  const handleProgramToggle = (programId: number) => {
    setSelectedPrograms(prev => 
      prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isTyping) return;

    // Add user message to chat
    setChatHistory(prev => [...prev, { type: 'user', message: chatMessage }]);
    const userMessage = chatMessage;
    setChatMessage('');
    setIsTyping(true);

    try {
      // Get AI response
      const response = await mockAIService.generateResponse(userMessage);
      setChatHistory(prev => [...prev, { type: 'ai', message: response }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        message: 'I apologize, but I\'m having trouble processing your question. Could you try asking in a different way?' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 3, color: '#3c4043' }}>
          Recommended Programs
        </Typography>
        <Box sx={{ display: 'grid', gap: 3 }}>
          {programs.map(program => (
            <Card 
              key={program.id}
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#1a73e8', fontWeight: 500 }}>
                    {program.name}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={selectedPrograms.includes(program.id)}
                        onChange={() => handleProgramToggle(program.id)}
                        color="primary"
                      />
                    }
                    label="Apply"
                    sx={{ 
                      '& .MuiFormControlLabel-label': { 
                        fontSize: '0.875rem',
                        color: '#5f6368'
                      }
                    }}
                  />
                </Box>
                <Typography sx={{ color: '#3c4043', mb: 1 }}>
                  {program.description}
                </Typography>
                <Typography variant="body2" sx={{ color: '#5f6368' }}>
                  <strong>Eligibility:</strong> {program.eligibility}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, color: '#3c4043' }}>
          Questions? Ask me anything about these programs
        </Typography>
        <Box sx={{ bgcolor: '#f8f9fe', borderRadius: 2, p: 3 }}>
          <Box sx={{ mb: 3, maxHeight: 400, overflowY: 'auto' }}>
            {chatHistory.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  display: 'flex',
                  flexDirection: msg.type === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '80%',
                    p: 2,
                    bgcolor: msg.type === 'user' ? '#1a73e8' : 'white',
                    color: msg.type === 'user' ? 'white' : '#3c4043',
                    borderRadius: 2,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Typography>{msg.message}</Typography>
                </Box>
              </Box>
            ))}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#5f6368' }}>
                <CircularProgress size={16} />
                <Typography variant="body2">AI is typing...</Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Type your question here..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white'
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!chatMessage.trim() || isTyping}
              sx={{
                px: 3,
                bgcolor: '#1a73e8',
                '&:hover': {
                  bgcolor: '#1557b0'
                }
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          disabled={selectedPrograms.length === 0}
          onClick={() => {
            // Save selected programs to localStorage
            const selectedProgramsData = programs.filter(program => 
              selectedPrograms.includes(program.id)
            );
            localStorage.setItem('selectedPrograms', JSON.stringify(selectedProgramsData));
            // Navigate to the new unified application flow instead of the separate pages
            navigate('/application-flow');
          }}
          sx={{
            bgcolor: '#1a73e8',
            color: 'white',
            px: 4,
            py: 1.5,
            fontSize: '0.875rem',
            fontWeight: 500,
            textTransform: 'none',
            borderRadius: '6px',
            '&:hover': {
              bgcolor: '#1557b0'
            },
            '&.Mui-disabled': {
              bgcolor: '#dadce0',
              color: '#5f6368'
            }
          }}
        >
          Continue with selected programs
        </Button>
      </Box>
    </Box>
  );
}
