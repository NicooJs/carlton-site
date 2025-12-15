import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./MiniCart.css";

export function MiniCart({
  cartItems,
  isCartOpen,
  closeCart,
  updateQuantity,
  removeFromCart,
}) {
  const navigate = useNavigate();

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleGoToCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const handleGoToProducts = () => {
    closeCart();
    // Ajuste se sua home for "/" (recomendado) ou "/home"
    navigate("/#colecao");
  };

  return (
    <>
      <div
        className={`minicart-overlay ${isCartOpen ? "active" : ""}`}
        onClick={closeCart}
      />

      <aside className={`minicart-panel ${isCartOpen ? "active" : ""}`}>
        <header className="minicart-header">
          <div className="minicart-title">
            <h3>Carrinho</h3>
            <span className="minicart-count">{totalItems} item(ns)</span>
          </div>

          <button onClick={closeCart} className="minicart-close-btn" aria-label="Fechar">
            &times;
          </button>
        </header>

        {cartItems.length === 0 ? (
          <div className="minicart-empty">
            <h3>Seu carrinho está vazio</h3>
            <p>Adicione produtos para começar a comprar.</p>

            <button onClick={handleGoToProducts} className="continue-shopping-btn">
              Ver Produtos
            </button>
          </div>
        ) : (
          <>
            <section className="minicart-items">
              {cartItems.map((item) => (
                <article key={item.id} className="minicart-item">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="item-image"
                    loading="lazy"
                  />

                  <div className="item-details">
                    <h4 className="item-title">
                      {item.title} <span className="item-size">({item.size})</span>
                    </h4>

                    <div className="quantity-selector" role="group" aria-label="Quantidade">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                        aria-label="Diminuir quantidade"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>

                      <span className="qty-value">{item.quantity}</span>

                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Aumentar quantidade"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="item-remove-btn"
                    >
                      remover
                    </button>
                  </div>

                  <div className="item-actions">
                    <p className="item-price">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </article>
              ))}
            </section>

            <footer className="minicart-footer">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>

              <p className="shipping-notice">
                Frete e opções de pagamento serão calculados na próxima etapa.
              </p>

              <div className="minicart-buttons">
                <button onClick={handleGoToCheckout} className="checkout-btn">
                  Finalizar Compra
                </button>

                <button onClick={closeCart} className="continue-shopping-btn">
                  Continuar comprando
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
