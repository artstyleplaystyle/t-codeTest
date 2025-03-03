import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SelectChangeEvent } from '@mui/material';
import { fetchProducts, ProductFilters } from '../Api/api';
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
import { Product } from '../Api/api';
import { Link } from 'react-router-dom';
import { globalStyles } from '../styles/global.styles';
import { productListStyles } from '../styles/ProductList.styles';

const discountedPrice = (price: number, discount: number) => {
  return Math.round(price * (1 - discount / 100));
};

const sortOptions = {
  price: 'По цене',
  discount: 'По скидке',
  createdAt: 'По дате добавления',
} as const;

type SortField = keyof typeof sortOptions;

const ProductList = () => {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [sortBy, setSort] = useState<SortField>('createdAt');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [filters] = useState<ProductFilters>({
    minPrice: 0,
    maxPrice: 50000,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page, pageSize, sortBy, order, filters],
    queryFn: () => fetchProducts(page, pageSize, sortBy, order, filters),
  });

  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSort(event.target.value as SortField);
    setPage(1);
  };

  const handleOrderChange = (event: SelectChangeEvent<'ASC' | 'DESC'>) => {
    setOrder(event.target.value as 'ASC' | 'DESC');
    setPage(1);
  };

  return (
    <Container maxWidth="lg" sx={globalStyles.container}>
      <Paper elevation={4} sx={globalStyles.paper}>
        <Typography variant="h4" sx={globalStyles.title}>
          Список товаров
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, justifyContent: 'center' }}>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Сортировка</InputLabel>
            <Select value={sortBy} onChange={handleSortChange} label="Сортировка" sx={globalStyles.input}>
              {Object.entries(sortOptions).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Порядок</InputLabel>
            <Select value={order} onChange={handleOrderChange} label="Порядок" sx={globalStyles.input}>
              <MenuItem value="ASC">По возрастанию</MenuItem>
              <MenuItem value="DESC">По убыванию</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/create"
            sx={globalStyles.button}
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
                <Grid item xs={12} sm={6} lg={4} key={product.id}>
                  <Card sx={productListStyles.card}>
                    <CardMedia
                      component="img"
                      image={
                        product.photo
                          ? `http://localhost:3000/uploads/${product.photo}`
                          : 'https://ybis.ru/wp-content/uploads/2023/09/solntse-kartinka-1.webp'
                      }
                      alt={product.name}
                      sx={productListStyles.cardMedia}
                    />
                    <CardContent>
                      <Typography variant="h6" sx={productListStyles.productTitle}>
                        {product.name}
                      </Typography>

                      {product.discount > 0 ? (
                        <Box sx={{ mb: 2 }}>
                          <Typography sx={productListStyles.originalPrice}>
                            {product.price} ₽
                          </Typography>
                          <Typography sx={productListStyles.discountedPrice}>
                            {discountedPrice(Number(product.price), product.discount)} ₽
                          </Typography>
                        </Box>
                      ) : (
                        <Typography sx={productListStyles.price}>
                          {product.price} ₽
                        </Typography>
                      )}

                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/product/${product.id}`}
                        fullWidth
                        sx={globalStyles.button}
                      >
                        Подробнее
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box sx={productListStyles.pagination}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
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