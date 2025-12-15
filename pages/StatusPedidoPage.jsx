// src/pages/StatusPedidoPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './StatusPedidoPage.css';

export function StatusPedidoPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    // Pega o status da URL (ex: ?status=approved)
    const paymentStatus = searchParams.get('status');
    setStatus(paymentStatus);

    // Pega o carrinho que salvamos no localStorage
    const savedCart = localStorage.getItem('ultimoCarrinho');
    if (savedCart) {
      setOrderItems(JSON.parse(savedCart));
      // Opcional: limpa o carrinho do localStorage depois de usar
      // localStorage.removeItem('ultimoCarrinho');
    }
  }, [searchParams]);

  const renderStatusMessage = () => {
    switch (status) {
      case 'approved':
        return {
          title: 'Pagamento Aprovado!',
          message: 'Seu pedido foi recebido e já estamos preparando tudo para o envio. Obrigado pela sua compra!',
          className: 'status-approved'
        };
      case 'pending':
        return {
          title: 'Pagamento Pendente',
          message: 'Estamos aguardando a confirmação do pagamento. Assim que for aprovado, iniciaremos o processo de envio.',
          className: 'status-pending'
        };
      case 'failure':
        return {
          title: 'Falha no Pagamento',
          message: 'Não foi possível processar seu pagamento. Por favor, tente novamente ou use outro método de pagamento.',
          className: 'status-failure'
        };
      default:
        return {
          title: 'Obrigado!',
          message: 'Recebemos seu pedido.',
          className: ''
        };
    }
  };

  const statusInfo = renderStatusMessage();
  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="status-page-background">
      <main className="container">
        <div className={`status-box ${statusInfo.className}`}>
          <h1 className="status-title">{statusInfo.title}</h1>
          <p className="status-message">{statusInfo.message}</p>
        </div>

        {orderItems.length > 0 && (
          <div className="order-details">
            <h2>Detalhes do Pedido</h2>
            <div className="order-items-list">
              {orderItems.map(item => (
                <div key={item.id} className="order-item">
                  {/* ======================= ALTERAÇÃO FEITA AQUI ======================= */}
                  {/* Acessamos item.images[0] porque os dados do produto vêm do 
                      localStorage e a imagem está no primeiro índice do array 'images' */}
                  <img src={item.images[0]} alt={item.title} />
                  {/* ==================================================================== */}
                  <div className="order-item-info">
                    <span>{item.title} ({item.size})</span>
                    <span>Qtd: {item.quantity}</span>
                  </div>
                  <span className="order-item-price">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="back-to-store-link">
          <Link to="/home">Voltar para a Loja</Link>
        </div>
      </main>
    </div>
  );
}