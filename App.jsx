/* Site realizado 100% por Nicolas Arantes
   https://www.linkedin.com/in/nicolasarantes */

import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';

// Componentes
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MiniCart } from './components/MiniCart';
import { ScrollToTop } from './components/ScrollToTop';

// Páginas
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { MidiaPage } from './pages/MidiaPage';
import { PedidosPage } from './pages/PedidosPage';
import { ArtigosPage } from './pages/ArtigosPage';
import { ArtigoDetailPage } from './pages/ArtigoDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderStatusPage } from './pages/OrderStatusPage';

// Logo do checkout
import logoIcone from '../public/icone.png';

// Header exclusivo do Checkout
const CheckoutHeader = () => (
  <header className="checkout-header">
    <div className="header-content">
      <Link to="/">
        <img src={logoIcone} alt="Logo da Loja" className="logo" />
      </Link>
      <h1 className="header-title">Checkout</h1>
    </div>
  </header>
);

export default function App() {
  const location = useLocation();
  const isCheckoutPage = location.pathname === '/checkout';

  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error('Erro ao ler o carrinho:', error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Erro ao salvar o carrinho:', error);
    }
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product, size, quantity) => {
    if (!size) {
      alert('Por favor, selecione um tamanho!');
      return;
    }

    const itemId = `${product.id}_${size}`;
    const existingItem = cartItems.find(item => item.id === itemId);

    if (existingItem) {
      updateQuantity(itemId, existingItem.quantity + quantity);
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          id: itemId,
          size,
          quantity,
          imageUrl: product.images[0],
        },
      ]);
    }

    openCart();
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(
        cartItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const totalItemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <>
      <ScrollToTop />

      {isCheckoutPage && <CheckoutHeader />}
      {!isCheckoutPage && (
        <Navbar
          cartItemCount={totalItemCount}
          openCart={openCart}
        />
      )}

      <MiniCart
        cartItems={cartItems}
        isCartOpen={isCartOpen}
        closeCart={closeCart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />

      <Routes>
        {/* HOME AGORA É A RAIZ */}
        <Route path="/" element={<HomePage />} />

        {/* ROTAS DO SITE */}
        <Route
          path="/produto/:productId"
          element={<ProductDetailPage addToCart={addToCart} />}
        />
        <Route path="/feed" element={<ArtigosPage />} />
        <Route path="/feed/:articleId" element={<ArtigoDetailPage />} />
        <Route path="/midia" element={<MidiaPage />} />
        <Route path="/meus-pedidos" element={<OrderStatusPage />} />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cartItems={cartItems}
              shippingInfo={shippingInfo}
              setShippingInfo={setShippingInfo}
            />
          }
        />
      </Routes>

      {!isCheckoutPage && <Footer />}
    </>
  );
}
