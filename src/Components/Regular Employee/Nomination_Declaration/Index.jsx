import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { nominationSubmit } from '../../../Services/Auth';

const NominationDeclarationModal = () => {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const isNominationSubmitted = sessionStorage.getItem(
      'isNominationSubmitted',
    );
    if (isNominationSubmitted === 'false') {
      setOpen(true);
    }
  }, []);

  const handleSubmit = async () => {
    if (!checked) {
      setError('कृपया सहमति देने के लिए चेकबॉक्स पर क्लिक करें।');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await nominationSubmit();

      if (response.data.code === '200') {
        sessionStorage.setItem('isNominationSubmitted', 'true');
        setSubmitted(true);
        setTimeout(() => setOpen(false), 2000);
      } else {
        setError('घोषणा सबमिट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      }
    } catch (err) {
      console.error('Error submitting declaration:', err);
      setError('नेटवर्क त्रुटि — कृपया अपना कनेक्शन जांचें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          background: 'linear-gradient(145deg, #f9f9f9, #eaeaea)',
          backdropFilter: 'blur(8px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '1.5rem',
          color: '#1a237e',
          fontFamily: 'Merriweather, serif',
          background: 'linear-gradient(90deg, #e8eaf6 0%, #f3f4f8 100%)',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          py: 2,
        }}
      >
        📜 घोषणा-पत्र (स्‍वप्रमाणन)
      </DialogTitle>

      <DialogContent
        sx={{
          p: 4,
          fontFamily: "'Noto Sans Devanagari', serif",
          backgroundColor: '#fcfcfc',
        }}
      >
        {!submitted ? (
          <Box
            sx={{
              fontSize: '1.1rem',
              lineHeight: 2,
              textAlign: 'justify',
              color: '#2f2f2f',
              p: 4,
            }}
          >
            <Typography paragraph>
              मैं घोषणा करता/करती हूँ कि मेरे द्वारा नामांकन प्रपत्र (Nomination
              Form) पूर्ण कर अपने नियंत्रणकर्ता कार्यालय में प्रस्‍तुत कर दिया
              गया है। जो कि मेरी जानकारी अनुसार पूर्णत: सही है।
            </Typography>
            <Typography paragraph>
              नामांकन प्रपत्र प्रस्‍तुत न करने की स्थिति में, मैं स्‍वयं
              उत्‍तरदायी रहूँगा/रहूँगी।
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  sx={{
                    color: '#3949ab',
                    '&.Mui-checked': { color: '#283593' },
                    transform: 'scale(1.3)',
                  }}
                />
              }
              label={
                <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  मैं उपरोक्त कथनों से सहमत हूँ।
                </Typography>
              }
            />

            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: 2,
                  fontSize: '0.9rem',
                  borderRadius: 2,
                  backgroundColor: '#ffebee',
                }}
              >
                {error}
              </Alert>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              color: '#2e7d32',
            }}
          >
            <CheckCircle sx={{ fontSize: 80, color: '#43a047' }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontFamily: 'Merriweather, serif',
                fontWeight: 600,
                color: '#1b5e20',
              }}
            >
              घोषणा सफलतापूर्वक सबमिट हो गई है!
            </Typography>
          </Box>
        )}
      </DialogContent>

      {!submitted && (
        <DialogActions
          sx={{
            px: 4,
            pb: 3,
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              px: 5,
              py: 1.3,
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              fontFamily: 'Merriweather, serif',
              background: checked
                ? 'linear-gradient(90deg, #2e7d32 0%, #43a047 100%)'
                : 'linear-gradient(90deg, #c8e6c9 0%, #dcedc8 100%)',
              color: checked ? '#fff' : '#4a4a4a',
              boxShadow: checked ? '0 4px 10px rgba(46,125,50,0.4)' : 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: checked
                  ? 'linear-gradient(90deg, #1b5e20 0%, #388e3c 100%)'
                  : 'linear-gradient(90deg, #c8e6c9 0%, #dcedc8 100%)',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={26} sx={{ color: 'white' }} />
            ) : (
              'Submit Declaration'
            )}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default NominationDeclarationModal;
