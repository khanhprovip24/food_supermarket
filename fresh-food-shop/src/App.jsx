import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetail";
import Wishlist from "./pages/Wishlist";
import ChatWidget from "./components/chat/ChatWidget";
import { N8N_WEBHOOK_URL } from "./utils/constants";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
      </Routes>

      {/* Chat AI nổi toàn trang */}
      <ChatWidget n8nWebhookUrl={N8N_WEBHOOK_URL} />
    </>
  );
}

export default App;

