import { SxProps, Theme } from '@mui/material';

export const productListStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 3,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: 8,
    },
  },
  cardMedia: {
    height: 240,
    objectFit: 'cover',
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform 0.3s',
    },
  },
  productTitle: {
    fontWeight: 'bold',
    mb: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  price: {
    fontSize: '1.1rem',
    mb: 2,
    color: 'text.primary',
  },
  discountedPrice: {
    color: 'error.main',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  originalPrice: {
    textDecoration: 'line-through',
    color: 'grey.600',
    fontSize: '0.9rem',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    mt: 4,
    '& .MuiPaginationItem-root': {
      '&:hover': {
        transform: 'scale(1.1)',
        transition: 'transform 0.2s',
      },
    },
  },
} as Record<string, SxProps<Theme>>;