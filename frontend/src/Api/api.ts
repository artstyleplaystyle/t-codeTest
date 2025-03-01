import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

interface FetchProductsParams {
  page: number;
  limit: number;
  sort: string;
  order: 'ASC' | 'DESC';
  filters?: Record<string, string | number>;
}

export const api = axios.create({
  baseURL: 'http://localhost:3000/products',
});

export const fetchProducts = async ({
  page,
  limit,
  sort,
  order,
  filters = {},
}: FetchProductsParams): Promise<Product[]> => {
  try {
    const params = { page, limit, sort, order, ...filters };
    const { data } = await api.get<Product[]>('', { params });
    return data;
  } catch (error: any) {
    console.error('Error fetching products:', error.response?.data || error.message);
    throw new Error('Failed to fetch products');
  }
};

export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const { data } = await api.get<Product>(`/${id}`);
    return data;
  } catch (error: any) {
    console.error(`Error fetching product with ID ${id}:`, error.response?.data || error.message);
    throw new Error('Failed to fetch product');
  }
};

export const createProduct = async (product: FormData): Promise<Product> => {
  try {
    const { data } = await api.post<Product>('', product, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (error: any) {
    console.error('Error creating product:', error.response?.data || error.message);
    throw new Error('Failed to create product');
  }
};

export const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
  try {
    const { data } = await api.put<Product>(`/${id}`, productData);
    return data;
  } catch (error: any) {
    console.error(`Error updating product with ID ${id}:`, error.response?.data || error.message);
    throw new Error('Failed to update product');
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/${id}`);
  } catch (error: any) {
    console.error(`Error deleting product with ID ${id}:`, error.response?.data || error.message);
    throw new Error('Failed to delete product');
  }
};
