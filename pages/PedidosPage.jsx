/* Site realizado 100% por Nicolas Arantes https://www.linkedin.com/in/nicolasarantes*/

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './PedidosPage.css';

export function PedidosPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    // Pega o status da URL (ex: ?status=approved) que o Mercado Pago envia
    const paymentStatus = searchParams.get('status');
    setStatus(paymentStatus);

    // Pega o último carrinho que salvamos
    const savedCart = localStorage.getItem('ultimoCarrinho');
    if (savedCart) {
      setLastOrder(JSON.parse(savedCart));
    }
  }, [searchParams]);

  // Função para gerar a mensagem de status
  const renderStatusMessage = () => {
    if (!status) return null; // Não mostra nada se não veio do Mercado Pago

    switch (status) {
      case 'approved':
        return {
          title: 'Pagamento Aprovado!',
          message: 'Seu pedido foi recebido e já estamos preparando tudo para o envio. Obrigado!',
          className: 'status-approved'
        };
      case 'pending':
        return {
          title: 'Pagamento Pendente',
          message: 'Aguardando a confirmação do pagamento. Assim que for aprovado, iniciaremos o envio.',
          className: 'status-pending'
        };
      case 'failure':
        return {
          title: 'Falha no Pagamento',
          message: 'Não foi possível processar seu pagamento. Por favor, tente novamente.',
          className: 'status-failure'
        };
      default:
        return null;
    }
  };

  const statusInfo = renderStatusMessage();
  const total = lastOrder ? lastOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;

  if (!lastOrder) {
    return (
      <main className="container pedidos-empty">
        <h2>Nenhum Pedido Recente</h2>
        <p>Parece que você ainda não finalizou uma compra conosco.</p>
        <Link to="/home">Ver Produtos</Link>
      </main>
    );
  }

  return (
    <div className="pedidos-page-background">
      <main className="container">
        {/* A mensagem de status só aparece se existir */}
        {statusInfo && (
          <div className={`status-box ${statusInfo.className}`}>
            <h1 className="status-title">{statusInfo.title}</h1>
            <p className="status-message">{statusInfo.message}</p>
          </div>
        )}

        <div className="order-details-box">
          <h2>{status ? "Detalhes do Pedido" : "Seu Último Pedido"}</h2>
          <div className="order-items-list">
            {lastOrder.map(item => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.title} />
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
      </main>
    </div>
  );
}