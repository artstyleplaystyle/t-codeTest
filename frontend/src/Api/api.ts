import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/products`,
});

interface Filters {
  [key: string]: string | number | boolean;
}

export const fetchProducts = async (
  page: number,
  limit: number,
  sort: string,
  order: 'ASC' | 'DESC',
  filters: Filters
) => {
  try {
    const { data } = await api.get('', {
      params: { page, limit, sort, order, ...filters },
    });
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const { data } = await api.get(`/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (product: FormData) => {
  try {
    const { data } = await api.post('', product, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: Record<string, any>) => {
  try {
    const { data } = await api.put(`/${id}`, productData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const { data } = await api.delete(`/${id}`);
    return data;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};
