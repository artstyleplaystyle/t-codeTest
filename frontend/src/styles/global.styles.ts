import { SxProps, Theme } from '@mui/material';

export const globalStyles = {
  root: {
    maxWidth: 1400,
    width: '100%',
    padding: '2rem',
  },
  container: {
    maxWidth: 'lg',
    py: 6,
  },
  paper: {
    p: 4,
    borderRadius: 3,
    background: 'linear-gradient(135deg, #f9f9f9 0%, #f0f4f8 100%)',
    overflow: 'hidden',
  },
  title: {
    mb: 4,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'primary.main',
    letterSpacing: 0.5,
  },
  button: {
    py: 1.5,
    fontWeight: 'bold',
    borderRadius: 2,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 4,
    },
    transition: 'all 0.2s',
  },
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: 'white',
    },
    '& .MuiInputLabel-root': {
      color: 'primary.main',
    },
  },
} as Record<string, SxProps<Theme>>; 