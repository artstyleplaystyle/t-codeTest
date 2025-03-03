import { SxProps, Theme } from '@mui/material';

export const productDetailsStyles = {
  container: {
    mt: 4,
    mb: 4,
  },
  paper: {
    borderRadius: 2,
    overflow: 'hidden',
  },
  card: {
    maxWidth: 500,
    m: 'auto',
  },
  cardMedia: {
    height: 300,
    objectFit: 'cover',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  content: {
    p: 3,
  },
  title: {
    fontWeight: 'bold',
    color: 'primary.main',
  },
  description: {
    lineHeight: 1.6,
    color: 'text.secondary',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 3,
  },
  price: {
    fontWeight: 'medium',
  },
  discount: {
    color: 'success.main',
    fontWeight: 'medium',
  },
  divider: {
    mb: 3,
  },
} as Record<string, SxProps<Theme>>; 