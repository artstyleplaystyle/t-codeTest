import { useState } from 'react';
import { 
  Button, 
  TextField, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  FormControl, 
  Select, 
  MenuItem, 
  InputLabel, 
  Container,
  Pagination,
  Divider
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../Api/api';
import { Product } from '../index';

const ProductsCatalog = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [filters, setFilters] = useState<any>({
    name: '',
    minPrice: '',
    maxPrice: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page, limit, sort, order, filters],
    queryFn: () => fetchProducts(page, limit, sort, order, filters),
  });

  const totalPages = Math.ceil((data?.total || 0) / limit);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1); 
  };

  const handleSortChange = (event: any) => {
    setSort(event.target.value as string);
    setPage(1);
  };

  const handleOrderChange = (event: any) => {
    setOrder(event.target.value as 'ASC' | 'DESC');
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper 
        elevation={6} 
        sx={{ 
          p: 4, 
          borderRadius: 3, 
          background: 'linear-gradient(135deg, #f9f9f9 0%, #f0f4f8 100%)',
          overflow: 'hidden'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            textAlign: 'center', 
            fontWeight: 'bold', 
            color: 'primary.main',
            letterSpacing: 0.5
          }}
        >
          Каталог товаров
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              label="Название"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white'
                },
                '& .MuiInputLabel-root': {
                  color: 'primary.main'
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              label="Мин. цена"
              name="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={handleFilterChange}
              fullWidth
              variant="outlined"
              InputProps={{ inputProps: { min: 0 } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white'
                },
                '& .MuiInputLabel-root': {
                  color: 'primary.main'
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              label="Макс. цена"
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              fullWidth
              variant="outlined"
              InputProps={{ inputProps: { min: 0 } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white'
                },
                '& .MuiInputLabel-root': {
                  color: 'primary.main'
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={12} md={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPage(1)}
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                },
                transition: 'all 0.2s'
              }}
            >
              Применить фильтры
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Сортировка</InputLabel>
              <Select 
                value={sort} 
                onChange={handleSortChange}
                label="Сортировка"
                sx={{ borderRadius: 2, backgroundColor: 'white' }}
              >
                <MenuItem value="name">По названию</MenuItem>
                <MenuItem value="price">По цене</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Порядок</InputLabel>
              <Select 
                value={order} 
                onChange={handleOrderChange}
                label="Порядок"
                sx={{ borderRadius: 2, backgroundColor: 'white' }}
              >
                <MenuItem value="ASC">По возрастанию</MenuItem>
                <MenuItem value="DESC">По убыванию</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        {isLoading ? (
          <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 4 }}>
            Загрузка...
          </Typography>
        ) : error ? (
          <Typography color="error" align="center" sx={{ py: 4 }}>
            Произошла ошибка: {(error as Error).message}
          </Typography>
        ) : (
          <>
            <Grid container spacing={3}>
              {data?.data.map((product: Product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: 'text.primary',
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography 
                      sx={{ 
                        mb: 2, 
                        color: 'text.secondary',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: 'primary.main',
                        fontSize: '1.2rem'
                      }}
                    >
                      {product.price} ₽
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      '&:hover': {
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s'
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ProductsCatalog;