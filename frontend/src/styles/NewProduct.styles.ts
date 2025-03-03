import { SxProps, Theme } from '@mui/material';

export const styles = {
  container: {
    mt: 4,
    mb: 4
  },
  paper: {
    p: 4,
    borderRadius: 2
  },
  title: {
    mb: 4,
    fontWeight: 'bold',
    color: 'primary.main'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3
  },
  fileInput: {
    display: 'block',
    width: '100%',
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    backgroundColor: '#fff'
  } as React.CSSProperties,
  submitButton: {
    mt: 2,
    py: 1.5,
    fontWeight: 'bold',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: 4
    }
  }
} as Record<string, SxProps<Theme>>; 