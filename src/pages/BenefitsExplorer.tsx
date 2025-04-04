import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Button,
  CardActions,
  Paper,
} from '@mui/material';
import HealthcareIcon from '@mui/icons-material/LocalHospital';
import FinancialIcon from '@mui/icons-material/AttachMoney';
import HousingIcon from '@mui/icons-material/Home';
import FoodIcon from '@mui/icons-material/Restaurant';
import EducationIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

const benefitCategories = [
  {
    title: 'Healthcare',
    description: 'Access medical care, prescriptions, dental, and vision coverage through Medicaid and other programs.',
    icon: HealthcareIcon,
    color: '#4CAF50'
  },
  {
    title: 'Financial Assistance',
    description: 'Get help with bills, emergency expenses, and income support through various programs.',
    icon: FinancialIcon,
    color: '#2196F3'
  },
  {
    title: 'Housing Support',
    description: 'Find affordable housing, rental assistance, and utility payment help.',
    icon: HousingIcon,
    color: '#9C27B0'
  },
  {
    title: 'Food Security',
    description: 'Access SNAP benefits, food banks, and nutrition assistance programs.',
    icon: FoodIcon,
    color: '#FF9800'
  },
  {
    title: 'Education & Training',
    description: 'Discover opportunities for education, job training, and skill development.',
    icon: EducationIcon,
    color: '#E91E63'
  },
  {
    title: 'Employment Services',
    description: 'Get help finding work, career counseling, and job placement assistance.',
    icon: WorkIcon,
    color: '#3F51B5'
  }
];

export default function BenefitsExplorer() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          p: 6, 
          mb: 6, 
          borderRadius: 4,
          textAlign: 'center'
        }}
      >
        <Typography variant="h1" gutterBottom sx={{ fontSize: '2.5rem', fontWeight: 500 }}>
          Discover Your Benefits
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 800, mx: 'auto', opacity: 0.9 }}>
          Explore the benefits and support programs available to help you and your family thrive. 
          Our AI-powered system will guide you through available options and help you find the right programs for your needs.
        </Typography>
      </Paper>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 4
      }}>
        {benefitCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card 
              key={category.title}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  color: category.color
                }}>
                  <Icon sx={{ fontSize: 40, mr: 1 }} />
                  <Typography variant="h5" component="h2">
                    {category.title}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {category.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="large" 
                  sx={{ 
                    ml: 1,
                    mb: 1,
                    color: category.color,
                    '&:hover': {
                      bgcolor: `${category.color}10`
                    }
                  }}
                >
                  Learn More
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" gutterBottom color="text.secondary">
          Ready to find out what benefits you might qualify for?
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          sx={{ 
            mt: 2,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontSize: '1.1rem'
          }}
        >
          Start Personalized Assessment
        </Button>
      </Box>
    </Container>
  );
}
