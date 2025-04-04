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
  Tabs,
  Tab,
  Paper,
  LinearProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { cloudFunctionService } from '../services/cloudFunctionService';
// import geminiLogo from '../assets/gemini.svg';

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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: 3, py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Your Personalized Benefits
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="program explorer tabs">
          <Tab label="Explore Programs" {...a11yProps(0)} />
          <Tab label="Apply" {...a11yProps(1)} />
          <Tab label="Application Status" {...a11yProps(2)} />
        </Tabs>

        {/* Explore Programs Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography sx={{ mb: 3 }}>
            Based on your situation, we've identified these programs that might help you. 
            Select the ones you're interested in applying for.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Programs */}
            <Box sx={{ flex: '1 1 60%' }}>
              {programs.map(program => (
                <Card key={program.id} sx={{ mb: 2, border: selectedPrograms.includes(program.id) ? '2px solid #1a73e8' : '1px solid #dadce0' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6">{program.name}</Typography>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={selectedPrograms.includes(program.id)}
                            onChange={() => handleProgramToggle(program.id)}
                            color="primary"
                          />
                        }
                        label="Apply"
                      />
                    </Box>
                    <Typography>{program.description}</Typography>
                  </CardContent>
                </Card>
              ))}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  disabled={selectedPrograms.length === 0}
                  onClick={() => setTabValue(1)}
                  endIcon={<ArrowForwardIcon />}
                >
                  Continue to Apply
                </Button>
              </Box>
            </Box>

            {/* Chat */}
            <Box sx={{ flex: '1 1 40%' }}>
              <Paper sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Benefits Assistant</Typography>
                
                <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
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
                          maxWidth: '75%',
                          p: 2,
                          bgcolor: msg.type === 'user' ? '#1a73e8' : '#f1f3f4',
                          color: msg.type === 'user' ? 'white' : 'inherit',
                          borderRadius: 2
                        }}
                      >
                        <Typography>{msg.message}</Typography>
                      </Box>
                    </Box>
                  ))}
                  {isTyping && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
                      <CircularProgress size={16} />
                      <Typography variant="body2">Thinking...</Typography>
                    </Box>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Ask me about these programs..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    variant="outlined"
                    size="small"
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim() || isTyping}
                  >
                    <SendIcon fontSize="small" />
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Box>
        </TabPanel>

        {/* Apply Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography sx={{ mb: 3 }}>
            You've selected the following programs to apply for. Review your selection and click "Start Application" when you're ready.
          </Typography>

          {selectedPrograms.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ mb: 2 }}>
                You haven't selected any programs yet.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setTabValue(0)}
              >
                Go back to explore programs
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 3 }}>
                {programs
                  .filter(program => selectedPrograms.includes(program.id))
                  .map(program => (
                    <Paper key={program.id} sx={{ p: 3, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h6" sx={{ mb: 1 }}>{program.name}</Typography>
                          <Typography>{program.description}</Typography>
                        </Box>
                        <Button
                          size="small"
                          onClick={() => handleProgramToggle(program.id)}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Paper>
                  ))}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="text"
                  onClick={() => setTabValue(0)}
                >
                  Back to explore
                </Button>
                <Button
                  variant="contained"
                  onClick={handleContinueToApplication}
                  endIcon={<ArrowForwardIcon />}
                >
                  Start Application
                </Button>
              </Box>
            </>
          )}
        </TabPanel>

        {/* Application Status Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography sx={{ mb: 3 }}>
            Track the status of your benefit applications. You can see where each application is in the process and what steps are coming next.
          </Typography>

          {selectedPrograms.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ mb: 2 }}>
                You haven't selected any programs to apply for yet.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setTabValue(0)}
              >
                Go back to explore programs
              </Button>
            </Box>
          ) : (
            <Box>
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
                    <Paper key={program.id} sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>{program.name}</Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        {stageInfo.icon}
                        <Typography sx={{ color: stageInfo.color, fontWeight: 500 }}>
                          {stageInfo.label}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={stageInfo.progress} 
                          sx={{ height: 8, borderRadius: 4, mb: 1 }}
                        />
                        <Typography variant="body2">
                          {status.nextSteps || 'No next steps available'}
                        </Typography>
                      </Box>
                      
                      {status.stage !== 'enrollment_complete' as ApplicationStage && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">
                            {status.estimatedCompletionDate ? 
                              `Estimated completion: ${status.estimatedCompletionDate}` : 
                              'No estimated completion date available'}
                          </Typography>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => advanceApplicationStatus(program.id)}
                            disabled={status.stage === 'enrollment_complete' as ApplicationStage}
                          >
                            Advance Status (Demo)
                          </Button>
                        </Box>
                      )}
                    </Paper>
                  );
                })}
            </Box>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
}
