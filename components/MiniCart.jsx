

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MiniCart.css';

export function MiniCart({ cartItems, isCartOpen, closeCart, updateQuantity, removeFromCart }) {
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleGoToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      <div className={`minicart-overlay ${isCartOpen ? 'active' : ''}`} onClick={closeCart}></div>
      <div className={`minicart-panel ${isCartOpen ? 'active' : ''}`}>
        <div className="minicart-header">
          <h3>Carrinho</h3>
          <button onClick={closeCart} className="minicart-close-btn">&times;</button>
        </div>

   {cartItems.length === 0 ? (
  <div className="minicart-empty">
    <h3>Seu carrinho está vazio</h3>
    <p>Adicione produtos para começar a comprar.</p>
    <button 
      onClick={() => { 
        closeCart(); 
        navigate('/home#colecao'); // coloque aqui a rota real da sua página de produtos
      }} 
      className="continue-shopping-btn"
    >
      Ver Produtos
    </button>
  </div>
) : (
          <>
            <div className="minicart-items">
              {cartItems.map(item => (
                <div key={item.id} className="minicart-item">
                  <img src={item.imageUrl} alt={item.title} className="item-image" /> {/* Também corrigi o 'alt' da imagem por consistência */}
                  <div className="item-details">
                    {/* ===== CORREÇÃO APLICADA AQUI ===== */}
                    <h4 className="item-title">{item.title} ({item.size})</h4>
                    <div className="quantity-selector">
  <button 
    onClick={() => {
      if (item.quantity > 1) {
        updateQuantity(item.id, item.quantity - 1);
      }
    }}
  >
    -
  </button>
  <span>{item.quantity}</span>
  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
</div>

                  </div>
                  <div className="item-actions">
                    <p className="item-price">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeFromCart(item.id)} className="item-remove-btn">Remover</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="minicart-footer">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <p className="shipping-notice">O frete e as opções de pagamento serão calculados na próxima etapa.</p>
              
              <div className="minicart-buttons">
                <button onClick={handleGoToCheckout} className="checkout-btn">
                  Finalizar Compra
                </button>
                <button onClick={closeCart} className="continue-shopping-btn">
                  Continuar Comprando
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}