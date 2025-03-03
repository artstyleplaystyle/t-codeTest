import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/products`,
});

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  photo?: string;
  discount: number;
  sku: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  photo?: File;
  discount?: number;
  sku?: string;
}

export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  name?: string;
  [key: string]: string | number | undefined;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export const fetchProducts = async (
  page: number,
  limit: number,
  sort: string,
  order: 'ASC' | 'DESC',
  filters: ProductFilters
): Promise<ProductsResponse> => {
  try {
    const { data } = await api.get<ProductsResponse>('', {
      params: { page, limit, sort, order, ...filters },
    });
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    const { data } = await api.get<Product>(`/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (product: FormData): Promise<Product> => {
  try {
    const { data } = await api.post<Product>('', product, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: Partial<ProductFormData>): Promise<Product> => {
  try {
    const { data } = await api.put<Product>(`/${id}`, productData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/${id}`);
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};
