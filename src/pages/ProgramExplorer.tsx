import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  FormControlLabel, 
  Switch, 
  TextField, 
  Button, 
  CircularProgress, 
  Divider,
  Tabs,
  Tab,
  Paper,
  Chip,
  Grid,
  LinearProgress,
  Stack
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { cloudFunctionService } from '../services/cloudFunctionService';
import geminiLogo from '../assets/gemini.svg';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`program-tabpanel-${index}`}
      aria-labelledby={`program-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `program-tab-${index}`,
    'aria-controls': `program-tabpanel-${index}`,
  };
}

interface Program {
  id: number;
  name: string;
  description: string;
  eligibility: string;
}

// Application status types
type ApplicationStage = 
  | 'not_started'
  | 'application_started'
  | 'information_submitted'
  | 'under_review'
  | 'approved'
  | 'enrollment_complete';

interface ApplicationStatus {
  programId: number;
  stage: ApplicationStage;
  lastUpdated: string;
  nextSteps?: string;
  estimatedCompletionDate?: string;
}

export default function ProgramExplorer() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<number[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationStatuses, setApplicationStatuses] = useState<ApplicationStatus[]>([]);

  useEffect(() => {
    // Load AI results from localStorage
    const aiResults = localStorage.getItem('aiResults');
    if (aiResults) {
      const { programs } = JSON.parse(aiResults);
      setPrograms(programs);
      setIsLoading(false);
    }

    // Add initial AI message
    setChatHistory([{
      type: 'ai',
      message: 'Based on your situation, I\'ve identified some programs that might help. You can ask me questions about any of these programs.'
    }]);

    // Load application statuses from localStorage or create mock data
    const savedStatuses = localStorage.getItem('applicationStatuses');
    if (savedStatuses) {
      setApplicationStatuses(JSON.parse(savedStatuses));
    }
  }, []);

  // Update application statuses when selected programs change
  useEffect(() => {
    if (selectedPrograms.length > 0) {
      // Create or update application statuses for selected programs
      const updatedStatuses = [...applicationStatuses];
      
      selectedPrograms.forEach(programId => {
        const existingStatusIndex = updatedStatuses.findIndex(
          status => status.programId === programId
        );
        
        if (existingStatusIndex === -1) {
          // Create a new status for this program
          updatedStatuses.push({
            programId,
            stage: 'application_started',
            lastUpdated: new Date().toISOString(),
            nextSteps: 'Complete and submit your application',
            estimatedCompletionDate: getRandomFutureDate(14, 30)
          });
        }
      });
      
      // Remove statuses for programs that are no longer selected
      const filteredStatuses = updatedStatuses.filter(
        status => selectedPrograms.includes(status.programId)
      );
      
      setApplicationStatuses(filteredStatuses);
      localStorage.setItem('applicationStatuses', JSON.stringify(filteredStatuses));
    }
  }, [selectedPrograms]);

  // Helper function to get a random future date
  const getRandomFutureDate = (minDays: number, maxDays: number) => {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + randomDays);
    return futureDate.toISOString().split('T')[0];
  };

  // Helper function to get stage information
  const getStageInfo = (stage: ApplicationStage) => {
    switch (stage) {
      case 'not_started':
        return {
          label: 'Not Started',
          color: '#9aa0a6',
          progress: 0,
          icon: <ScheduleIcon sx={{ color: '#9aa0a6' }} />
        };
      case 'application_started':
        return {
          label: 'Application Started',
          color: '#1a73e8',
          progress: 20,
          icon: <PendingIcon sx={{ color: '#1a73e8' }} />
        };
      case 'information_submitted':
        return {
          label: 'Information Submitted',
          color: '#1a73e8',
          progress: 40,
          icon: <HourglassTopIcon sx={{ color: '#1a73e8' }} />
        };
      case 'under_review':
        return {
          label: 'Under Review',
          color: '#fbbc04',
          progress: 60,
          icon: <HourglassTopIcon sx={{ color: '#fbbc04' }} />
        };
      case 'approved':
        return {
          label: 'Approved',
          color: '#34a853',
          progress: 80,
          icon: <CheckCircleIcon sx={{ color: '#34a853' }} />
        };
      case 'enrollment_complete':
        return {
          label: 'Enrollment Complete',
          color: '#34a853',
          progress: 100,
          icon: <CheckCircleIcon sx={{ color: '#34a853' }} />
        };
      default:
        return {
          label: 'Unknown',
          color: '#9aa0a6',
          progress: 0,
          icon: <ScheduleIcon sx={{ color: '#9aa0a6' }} />
        };
    }
  };

  // Function to advance application status (for demo purposes)
  const advanceApplicationStatus = (programId: number) => {
    setApplicationStatuses(prevStatuses => {
      const newStatuses = [...prevStatuses];
      const statusIndex = newStatuses.findIndex(status => status.programId === programId);
      
      if (statusIndex !== -1) {
        const currentStatus = newStatuses[statusIndex];
        let newStage: ApplicationStage = currentStatus.stage;
        let newNextSteps = currentStatus.nextSteps;
        
        // Advance to next stage
        switch (currentStatus.stage) {
          case 'application_started':
            newStage = 'information_submitted';
            newNextSteps = 'Your application is being processed';
            break;
          case 'information_submitted':
            newStage = 'under_review';
            newNextSteps = 'Your application is under review';
            break;
          case 'under_review':
            newStage = 'approved';
            newNextSteps = 'Complete enrollment process';
            break;
          case 'approved':
            newStage = 'enrollment_complete';
            newNextSteps = 'No further action needed';
            break;
          default:
            break;
        }
        
        newStatuses[statusIndex] = {
          ...currentStatus,
          stage: newStage,
          lastUpdated: new Date().toISOString(),
          nextSteps: newNextSteps
        };
        
        // Save to localStorage
        localStorage.setItem('applicationStatuses', JSON.stringify(newStatuses));
      }
      
      return newStatuses;
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
    const newUserMessage = { type: 'user' as const, message: chatMessage };
    setChatHistory(prev => [...prev, newUserMessage]);
    const userMessage = chatMessage;
    const currentChatHistory = [...chatHistory, newUserMessage];
    setChatMessage('');
    setIsTyping(true);

    try {
      // Get AI response - pass selected programs for context and chat history
      const selectedProgramsData = programs.filter(program => 
        selectedPrograms.includes(program.id)
      );
      const response = await cloudFunctionService.generateResponse(
        userMessage, 
        selectedProgramsData,
        currentChatHistory
      );
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

  const handleContinueToApplication = () => {
    // Save selected programs to localStorage
    const selectedProgramsData = programs.filter(program => 
      selectedPrograms.includes(program.id)
    );
    localStorage.setItem('selectedPrograms', JSON.stringify(selectedProgramsData));
    
    // Navigate to the application flow
    navigate('/application-flow');
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
    <Box sx={{ 
      maxWidth: 1200, 
      width: '100%', 
      mx: 'auto', 
      px: 3, 
      py: 4,
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography 
        component="h1" 
        sx={{ 
          color: '#3c4043',
          fontWeight: 400,
          fontSize: '2rem',
          lineHeight: 1.4,
          mb: 4
        }}
      >
        Your Personalized Benefits
      </Typography>

      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #dadce0'
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="program explorer tabs"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#1a73e8',
                height: 3
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                minHeight: 64,
                '&.Mui-selected': {
                  color: '#1a73e8'
                }
              }
            }}
          >
            <Tab 
              label="Explore Programs" 
              {...a11yProps(0)} 
              sx={{ px: 4 }}
            />
            <Tab 
              label="Apply" 
              {...a11yProps(1)} 
              sx={{ px: 4 }}
            />
            <Tab 
              label="Application Status" 
              {...a11yProps(2)} 
              sx={{ px: 4 }}
            />
          </Tabs>
        </Box>

        {/* Explore Programs Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ px: 3 }}>
            <Typography 
              sx={{ 
                color: '#5f6368',
                fontSize: '1.125rem',
                lineHeight: 1.5,
                mb: 4
              }}
            >
              Based on your situation, we've identified these programs that might help you. 
              Select the ones you're interested in applying for.
            </Typography>

            {/* Two-column layout */}
            <Box sx={{ display: 'flex', gap: 4 }}>
              {/* Left column: Programs */}
              <Box sx={{ flex: '1 1 60%' }}>
                <Box sx={{ display: 'grid', gap: 3 }}>
                  {programs.map(program => (
                    <Card 
                      key={program.id}
                      sx={{ 
                        borderRadius: 2,
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                        border: selectedPrograms.includes(program.id) ? '2px solid #1a73e8' : '1px solid #dadce0',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          transform: 'translateY(-2px)'
                        }
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
                        <Typography sx={{ color: '#3c4043' }}>
                          {program.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    variant="contained"
                    disabled={selectedPrograms.length === 0}
                    onClick={() => setTabValue(1)}
                    endIcon={<ArrowForwardIcon />}
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
                    Continue to Apply
                  </Button>
                </Box>
              </Box>

              {/* Right column: Chat - Google Gemini style */}
              <Box sx={{ flex: '1 1 40%' }}>
                <Paper
                  elevation={4}
                  sx={{
                    borderRadius: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    bgcolor: '#f0f4fd',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                >
                  <Box sx={{ 
                    p: 2.5, 
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    bgcolor: '#e8f0fe',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                  }}>
                    <img src={geminiLogo} alt="Gemini" width="28" height="28" />
                    <Typography variant="h6" sx={{ color: '#1a73e8', fontWeight: 500 }}>
                      Benefits Assistant
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 3,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '400px',
                    bgcolor: '#f8faff'
                  }}>
                    <Box sx={{ 
                      flexGrow: 1, 
                      overflowY: 'auto',
                      mb: 2,
                      display: 'flex',
                      flexDirection: 'column-reverse',
                      px: 1
                    }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {chatHistory.map((msg, index) => (
                          <Box
                            key={index}
                            sx={{
                              mb: 2,
                              display: 'flex',
                              flexDirection: msg.type === 'user' ? 'row-reverse' : 'row',
                            }}
                          >
                            {msg.type === 'ai' && (
                              <Box sx={{ mr: 1.5, mt: 1 }}>
                                <img src={geminiLogo} alt="Gemini" width="24" height="24" />
                              </Box>
                            )}
                            <Box
                              sx={{
                                maxWidth: '75%',
                                p: 2,
                                bgcolor: msg.type === 'user' ? '#1a73e8' : 'white',
                                color: msg.type === 'user' ? 'white' : '#3c4043',
                                borderRadius: 3,
                                boxShadow: msg.type === 'user' 
                                  ? '0 2px 5px rgba(0, 0, 0, 0.1)' 
                                  : '0 2px 10px rgba(0, 0, 0, 0.08)'
                              }}
                            >
                              <Typography>{msg.message}</Typography>
                            </Box>
                            {msg.type === 'user' && (
                              <Box 
                                sx={{ 
                                  width: 28, 
                                  height: 28, 
                                  borderRadius: '50%', 
                                  bgcolor: '#1a73e8',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '14px',
                                  ml: 1.5,
                                  mt: 1
                                }}
                              >
                                U
                              </Box>
                            )}
                          </Box>
                        ))}
                        {isTyping && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#5f6368', p: 2 }}>
                            <Box sx={{ mr: 1.5 }}>
                              <img src={geminiLogo} alt="Gemini" width="24" height="24" />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CircularProgress size={16} sx={{ color: '#8ab4f8' }} />
                              <Typography variant="body2">Thinking...</Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      p: 2, 
                      bgcolor: 'white', 
                      borderRadius: 4,
                      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.08)'
                    }}>
                      <TextField
                        fullWidth
                        placeholder="Ask me about these programs..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        variant="standard"
                        sx={{
                          '& .MuiInput-root': {
                            fontSize: '0.95rem',
                            padding: '4px 8px',
                            '&:before, &:after': {
                              display: 'none'
                            }
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        disabled={!chatMessage.trim() || isTyping}
                        sx={{
                          minWidth: '44px',
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          p: 0,
                          bgcolor: '#1a73e8',
                          '&:hover': {
                            bgcolor: '#1557b0'
                          }
                        }}
                      >
                        <SendIcon fontSize="small" />
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        </TabPanel>

        {/* Apply Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: 3 }}>
            <Typography 
              sx={{ 
                color: '#5f6368',
                fontSize: '1.125rem',
                lineHeight: 1.5,
                mb: 4
              }}
            >
              You've selected the following programs to apply for. Review your selection and click "Start Application" when you're ready.
            </Typography>

            {selectedPrograms.length === 0 ? (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 6, 
                  bgcolor: '#f8f9fe',
                  borderRadius: 2,
                  mb: 4
                }}
              >
                <Typography 
                  sx={{ 
                    color: '#5f6368',
                    fontSize: '1.125rem',
                    mb: 3
                  }}
                >
                  You haven't selected any programs yet.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setTabValue(0)}
                  sx={{
                    color: '#1a73e8',
                    borderColor: '#1a73e8',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#1557b0',
                      bgcolor: 'rgba(26, 115, 232, 0.04)'
                    }
                  }}
                >
                  Go back to explore programs
                </Button>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                  {programs
                    .filter(program => selectedPrograms.includes(program.id))
                    .map(program => (
                      <Box key={program.id}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            border: '1px solid #dadce0',
                            borderRadius: '8px'
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography 
                                sx={{ 
                                  color: '#1a73e8',
                                  fontSize: '1.25rem',
                                  fontWeight: 500,
                                  mb: 1
                                }}
                              >
                                {program.name}
                              </Typography>
                              <Typography 
                                sx={{ 
                                  color: '#3c4043'
                                }}
                              >
                                {program.description}
                              </Typography>
                            </Box>
                            <Button
                              size="small"
                              onClick={() => handleProgramToggle(program.id)}
                              sx={{
                                color: '#5f6368',
                                textTransform: 'none',
                                '&:hover': {
                                  bgcolor: 'rgba(95, 99, 104, 0.04)'
                                }
                              }}
                            >
                              Remove
                            </Button>
                          </Box>
                        </Paper>
                      </Box>
                    ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    variant="text"
                    onClick={() => setTabValue(0)}
                    sx={{
                      color: '#5f6368',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: 'rgba(95, 99, 104, 0.04)'
                      }
                    }}
                  >
                    Back to explore
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleContinueToApplication}
                    endIcon={<ArrowForwardIcon />}
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
                      }
                    }}
                  >
                    Start Application
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </TabPanel>

        {/* Application Status Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ px: 3 }}>
            <Typography 
              sx={{ 
                color: '#5f6368',
                fontSize: '1.125rem',
                lineHeight: 1.5,
                mb: 4
              }}
            >
              Track the status of your benefit applications. You can see where each application is in the process and what steps are coming next.
            </Typography>

            {selectedPrograms.length === 0 ? (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 6, 
                  bgcolor: '#f8f9fe',
                  borderRadius: 2,
                  mb: 4
                }}
              >
                <Typography 
                  sx={{ 
                    color: '#5f6368',
                    fontSize: '1.125rem',
                    mb: 3
                  }}
                >
                  You haven't selected any programs to apply for yet.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setTabValue(0)}
                  sx={{
                    color: '#1a73e8',
                    borderColor: '#1a73e8',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#1557b0',
                      bgcolor: 'rgba(26, 115, 232, 0.04)'
                    }
                  }}
                >
                  Go back to explore programs
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {programs
                  .filter(program => selectedPrograms.includes(program.id))
                  .map(program => {
                    const status = applicationStatuses.find(s => s.programId === program.id) || {
                      programId: program.id,
                      stage: 'not_started',
                      lastUpdated: new Date().toISOString()
                    };
                    const stageInfo = getStageInfo(status.stage);
                    
                    return (
                      <Paper
                        key={program.id}
                        elevation={0}
                        sx={{
                          p: 3,
                          border: '1px solid #dadce0',
                          borderRadius: '8px'
                        }}
                      >
                        <Box sx={{ mb: 3 }}>
                          <Typography 
                            sx={{ 
                              color: '#1a73e8',
                              fontSize: '1.25rem',
                              fontWeight: 500,
                              mb: 1
                            }}
                          >
                            {program.name}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            {stageInfo.icon}
                            <Typography 
                              sx={{ 
                                color: stageInfo.color,
                                fontWeight: 500
                              }}
                            >
                              {stageInfo.label}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={stageInfo.progress} 
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: '#e8eaed',
                                mb: 1,
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: stageInfo.color
                                }
                              }}
                            />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="caption" sx={{ color: '#5f6368' }}>
                                Application Started
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#5f6368' }}>
                                Enrollment Complete
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Stack spacing={1} sx={{ mt: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ color: '#5f6368', fontWeight: 500 }}>
                                Last Updated:
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#3c4043' }}>
                                {new Date(status.lastUpdated).toLocaleDateString()}
                              </Typography>
                            </Box>
                            
                            {status.nextSteps && (
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ color: '#5f6368', fontWeight: 500 }}>
                                  Next Steps:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#3c4043' }}>
                                  {status.nextSteps}
                                </Typography>
                              </Box>
                            )}
                            
                            {status.estimatedCompletionDate && (
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ color: '#5f6368', fontWeight: 500 }}>
                                  Estimated Completion:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#3c4043' }}>
                                  {status.estimatedCompletionDate}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        </Box>
                        
                        {/* Demo button to advance status (for testing) */}
                        {status.stage !== 'enrollment_complete' && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => advanceApplicationStatus(program.id)}
                            sx={{
                              mt: 2,
                              color: '#1a73e8',
                              borderColor: '#1a73e8',
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: '#1557b0',
                                bgcolor: 'rgba(26, 115, 232, 0.04)'
                              }
                            }}
                          >
                            Advance Status (Demo)
                          </Button>
                        )}
                      </Paper>
                    );
                  })}
              </Box>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}
