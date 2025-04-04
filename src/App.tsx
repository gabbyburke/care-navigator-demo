import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ExperienceInput from './pages/ExperienceInput';
import AnalyzingPage from './pages/AnalyzingPage';
import ResultsPage from './pages/ResultsPage';
import BenefitsApplicationStart from './pages/BenefitsApplicationStart';
import PersonalInfo from './pages/PersonalInfo';
import IncomeInfo from './pages/IncomeInfo';
import DocumentsUpload from './pages/DocumentsUpload';
import Review from './pages/Review';
import SubmissionConfirmation from './pages/SubmissionConfirmation';
import ApplicationFlow from './pages/ApplicationFlow';
import ProgramExplorer from './pages/ProgramExplorer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
    },
    background: {
      default: '#f8f9fe',
    },
    text: {
      primary: '#3c4043',
      secondary: '#5f6368',
    },
  },
  typography: {
    fontFamily: "'Google Sans', 'Roboto', 'Arial', sans-serif",
    h1: {
      fontSize: '2rem',
      fontWeight: 400,
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Home page is outside Layout */}
          <Route path="/" element={<HomePage />} />
          
          {/* All other pages use Layout */}
          <Route element={<Layout />}>
            <Route path="/experience" element={<ExperienceInput />} />
            <Route path="/analyzing" element={<AnalyzingPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/program-explorer" element={<ProgramExplorer />} />
            <Route path="/start-application" element={<BenefitsApplicationStart />} />
            
            {/* New unified application flow */}
            <Route path="/application-flow" element={<ApplicationFlow />} />
            
            {/* Original separate pages (kept for reference) */}
            <Route path="/personal-info" element={<PersonalInfo />} />
            <Route path="/income-info" element={<IncomeInfo />} />
            <Route path="/documents-upload" element={<DocumentsUpload />} />
            <Route path="/review" element={<Review />} />
            <Route path="/submission-confirmation" element={<SubmissionConfirmation />} />
          </Route>

          {/* Catch all unknown routes and redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
