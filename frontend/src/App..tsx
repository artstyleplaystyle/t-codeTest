import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductDetail from './pages/ProductDetails';
import ProductList from './pages/ProductList';
import EditProduct from './pages/EditProduct';
import CreateProduct from './pages/NewProduct';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/edit/:id" element={<EditProduct />} />
        <Route path="/create" element={<CreateProduct />} />
      </Routes>
    </Router>
  );
};

export default App;
