import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProductById, updateProduct } from '../Api/api';
import { 
  Typography, 
  Button, 
  TextField, 
  CircularProgress, 
  Container, 
  Paper, 
  Box,
  InputAdornment
} from '@mui/material';
import { Product } from '../index';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!id) {
    return <Typography color="error">Product ID not provided</Typography>;
  }

  const [productData, setProductData] = useState<Product | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number | string>('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
  });

  useEffect(() => {
    if (data) {
      setProductData(data);
      setDiscount(data.discountPrice || '');
      if (data.photo) {
        setImagePreview(data.photo);
      }
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (updatedProduct: Product) => updateProduct(id, updatedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/');
    },
  });

  useEffect(() => {
    if (newImage) {
      const objectUrl = URL.createObjectURL(newImage);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [newImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDiscount(value === '' ? '' : Number(value));
  };

  const handleSubmit = () => {
    if (!productData) return;

    const updatedProduct: Product = {
      ...productData,
      photo: newImage ? newImage.name : productData.photo,
      discountPrice: discount !== '' ? String(discount) : productData.discountPrice,
    };
    updateMutation.mutate(updatedProduct);
  };

  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error instanceof Error) return (
    <Typography color="error" align="center" sx={{ mt: 4 }}>
      Произошла ошибка: {error.message}
    </Typography>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {data && productData ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography 
              variant="h4" 
              align="center" 
              gutterBottom
              sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}
            >
              Редактировать товар
            </Typography>

            <TextField
              label="Название"
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              fullWidth
              variant="outlined"
              required
            />
            
            <TextField
              label="Описание"
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              fullWidth
              variant="outlined"
              multiline
              rows={4}
            />
            
            <TextField
              label="Цена"
              value={productData.price}
              onChange={(e) => {
                const price = Number(e.target.value);
                setProductData({ ...productData, price });
              }}
              fullWidth
              variant="outlined"
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">₽</InputAdornment>,
                inputProps: { min: 0, step: "0.01" }
              }}
              required
            />
            
            <TextField
              label="Скидка"
              value={discount}
              onChange={handleDiscountChange}
              fullWidth
              variant="outlined"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputProps: { min: 0, max: 100 }
              }}
            />
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Фотография товара
              </Typography>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  backgroundColor: '#fff'
                }}
              />
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px', 
                      objectFit: 'contain',
                      borderRadius: '4px'
                    }}
                  />
                </Box>
              )}
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              size="large"
              sx={{ 
                mt: 2,
                py: 1.5,
                fontWeight: 'bold',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: 4
                }
              }}
            >
              Сохранить изменения
            </Button>
          </Box>
        ) : (
          <Typography align="center">Товар не найден</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default EditProduct;