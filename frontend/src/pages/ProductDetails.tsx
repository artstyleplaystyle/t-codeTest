import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProductById, deleteProduct } from "../Api/api";
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  CircularProgress, 
  Container,
  Paper,
  Divider
} from "@mui/material";
import { globalStyles } from '../styles/global.styles';
import { productDetailsStyles } from '../styles/ProductDetails.styles';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!id) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          Неверный идентификатор продукта
        </Typography>
      </Container>
    );
  }

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/");
    },
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error instanceof Error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          Ошибка загрузки: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={productDetailsStyles.container}>
      <Paper elevation={3} sx={productDetailsStyles.paper}>
        <Card sx={productDetailsStyles.card}>
          <CardMedia
            component="img"
            image={
              product.photo
                ? `http://localhost:3000/uploads/${product.photo}`
                : 'https://ybis.ru/wp-content/uploads/2023/09/solntse-kartinka-1.webp'
            }
            alt={product.name}
            sx={productDetailsStyles.cardMedia}
          />
          <CardContent sx={productDetailsStyles.content}>
            <Typography variant="h4" gutterBottom sx={productDetailsStyles.title}>
              {product.name}
            </Typography>
            
            <Typography paragraph sx={productDetailsStyles.description}>
              {product.description}
            </Typography>
            
            <Box sx={productDetailsStyles.priceContainer}>
              <Typography variant="h6" sx={productDetailsStyles.price}>
                Цена: {product.price} ₽
              </Typography>
              {product.discountPrice && (
                <Typography variant="body2" sx={productDetailsStyles.discount}>
                  Скидка: {product.discountPrice}%
                </Typography>
              )}
            </Box>

            <Divider sx={productDetailsStyles.divider} />

            <Box 
              display="flex" 
              justifyContent="space-between" 
              gap={2}
              flexWrap="wrap"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/edit/${id}`)}
                sx={{
                  flex: 1,
                  py: 1,
                  fontWeight: 'bold',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 2
                  }
                }}
              >
                Редактировать
              </Button>
              
              <Button
                variant="contained"
                color="error"
                onClick={() => deleteMutation.mutate()}
                sx={{
                  flex: 1,
                  py: 1,
                  fontWeight: 'bold',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 2
                  }
                }}
              >
                Удалить
              </Button>
            </Box>

            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              fullWidth
              sx={{ 
                mt: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: 'grey.100'
                }
              }}
            >
              Назад к списку
            </Button>
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
};

export default ProductDetail;