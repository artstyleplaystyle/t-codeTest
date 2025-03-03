import { useState } from 'react';
import { 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Box, 
  Paper,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../Api/api';
import { styles } from '../styles/NewProduct.styles';

const CreateProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    photo: null as File | null,
    discount: '',
    sku: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductData({ ...productData, photo: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('discount', productData.discount || '0');
    formData.append('sku', productData.sku || `SKU-${Date.now()}`);
    if (productData.photo) {
      formData.append('photo', productData.photo);
    }

    try {
      await createProduct(formData);
      navigate('/');
    } catch (error) {
      console.error('Ошибка при создании товара:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={styles.container}>
      <Paper elevation={3} sx={styles.paper}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={styles.title}
        >
          Создать новый товар
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
          <TextField
            label="Название товара"
            name="name"
            value={productData.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          
          <TextField
            label="Описание"
            name="description"
            value={productData.description}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            multiline
            rows={4}
          />
          
          <TextField
            label="Цена"
            name="price"
            value={productData.price}
            onChange={handleChange}
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
            name="discount"
            value={productData.discount}
            onChange={handleChange}
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
            <Box sx={styles.fileInput}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            sx={styles.submitButton}
          >
            Создать товар
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateProduct;

