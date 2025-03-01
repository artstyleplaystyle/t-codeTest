import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SelectChangeEvent } from '@mui/material';
import { fetchProducts } from '../Api/api';
import {
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Pagination,
  Container,
  Paper,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Product } from '../index';
import { Link } from 'react-router-dom';

const discountedPrice = (price: number, discount: number) => {
  return Math.round(price * (1 - discount / 100));
};

const ProductList = () => {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [sort, setSort] = useState('price');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [filters] = useState<any>({
    minPrice: 0,
    maxPrice: 50000,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page, sort, order, filters],
    queryFn: () => fetchProducts(page, pageSize, sort, order, filters),
  });

  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSort(event.target.value);
    setPage(1);
  };

  const handleOrderChange = (event: SelectChangeEvent<'ASC' | 'DESC'>) => {
    setOrder(event.target.value as 'ASC' | 'DESC');
    setPage(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper 
        elevation={4} 
        sx={{ 
          p: 4, 
          borderRadius: 3, 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            fontWeight: 'bold', 
            color: 'primary.main', 
            textAlign: 'center'
          }}
        >
          Список товаров
        </Typography>

        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2, 
            mb: 4, 
            justifyContent: 'center' 
          }}
        >
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Сортировка</InputLabel>
            <Select value={sort} onChange={handleSortChange} label="Сортировка">
              <MenuItem value="price">По цене</MenuItem>
              <MenuItem value="discount">По скидке</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Порядок</InputLabel>
            <Select value={order} onChange={handleOrderChange} label="Порядок">
              <MenuItem value="ASC">По возрастанию</MenuItem>
              <MenuItem value="DESC">По убыванию</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/create"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: 8,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              },
              transition: 'all 0.2s'
            }}
          >
            Создать товар
          </Button>
        </Box>

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
                  <Card 
                    sx={{ 
                      maxWidth: 300, 
                      m: 'auto',
                      borderRadius: 3,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: 8
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        product.photo
                          ? `http://localhost:3000/uploads/${product.photo}`
                          : 'https://ybis.ru/wp-content/uploads/2023/09/solntse-kartinka-1.webp'
                      }
                      alt={product.name}
                      sx={{
                        objectFit: 'cover',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          transition: 'transform 0.3s'
                        }
                      }}
                    />
                    <CardContent sx={{ p: 2 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold',
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {product.name}
                      </Typography>
                      
                      {product.discount > 0 ? (
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="body2"
                            sx={{ 
                              textDecoration: 'line-through', 
                              color: 'grey.600',
                              fontSize: '0.9rem'
                            }}
                          >
                            {product.price} ₽
                          </Typography>
                          <Typography 
                            sx={{ 
                              color: 'error.main', 
                              fontWeight: 'bold',
                              fontSize: '1.1rem'
                            }}
                          >
                            {discountedPrice(Number(product.price), product.discount)} ₽
                          </Typography>
                        </Box>
                      ) : (
                        <Typography 
                          sx={{ 
                            fontSize: '1.1rem',
                            mb: 2,
                            color: 'text.primary'
                          }}
                        >
                          {product.price} ₽
                        </Typography>
                      )}

                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/product/${product.id}`}
                        fullWidth
                        sx={{
                          py: 1,
                          fontWeight: 'medium',
                          '&:hover': {
                            backgroundColor: 'primary.dark'
                          }
                        }}
                      >
                        Подробнее
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
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

export default ProductList;