import React, { useState } from 'react';
import './OrderStatusPage.css';
// Importando os ícones que vamos usar
import { CreditCard, Home, Package, Search, Truck, CheckCircle2 } from 'lucide-react';

// --- COMPONENTES INTERNOS PARA ORGANIZAÇÃO ---

// Card reutilizável para seções de informação
const InfoCard = ({ title, icon, children }) => (
  <div className="info-card">
    <div className="info-card-header">
      {icon}
      <h3>{title}</h3>
    </div>
    <div className="info-card-content">
      {children}
    </div>
  </div>
);

// Item individual na lista de produtos
const OrderItem = ({ item }) => (
  <div className="order-item">
    {/* ALTERAÇÃO AQUI: Trocamos 'item.imagemUrl' por 'item.imagem'. 
      Se no seu console o nome for diferente (ex: 'foto'), ajuste aqui.
    */}
    <img src={item.imagem || 'https://via.placeholder.com/80'} alt={item.nome} className="order-item-image" />
    <div className="order-item-details">
      <p className="item-name">{item.nome}</p>
      <p className="item-quantity">Quantidade: {item.quantidade}</p>
    </div>
    <p className="order-item-price">R$ {item.preco.toFixed(2).replace('.', ',')}</p>
  </div>
);

// Linha do tempo vertical e detalhada
const StatusTimeline = ({ orderData }) => {
  const statusTimeline = ['PAGO', 'EM_PRODUCAO', 'ENVIADO', 'ENTREGUE'];
  const currentStatusIndex = statusTimeline.indexOf(orderData.status);

  const getStatusInfo = (status) => {
    const statusMap = {
      'PAGO': { label: 'Pagamento Aprovado', icon: <CreditCard size={20} />, date: orderData.data_pagamento },
      'EM_PRODUCAO': { label: 'Em Produção', icon: <Package size={20} />, date: orderData.data_producao },
      'ENVIADO': { label: 'Pedido Enviado', icon: <Truck size={20} />, date: orderData.data_envio },
      'ENTREGUE': { label: 'Entregue', icon: <Home size={20} />, date: orderData.data_entrega }
    };
    return statusMap[status];
  };

  return (
    <div className="timeline-wrapper">
      {statusTimeline.map((status, index) => {
        const info = getStatusInfo(status);
        const isCompleted = index <= currentStatusIndex;
        const isActive = index === currentStatusIndex;

        return (
          <div key={status} className={`timeline-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
            <div className="timeline-icon-wrapper">{info.icon}</div>
            <div className="timeline-content">
              <p className="timeline-title">{info.label}</p>
              {isCompleted && info.date && (
                <p className="timeline-date">{new Date(info.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ===================================================================
// VERSÃO CORRIGIDA E SEGURA DO COMPONENTE OrderDetails
// ===================================================================
const OrderDetails = ({ orderData }) => {
  // Verificação de segurança: Se não houver orderData, não renderiza nada.
  if (!orderData) {
    return null;
  }

  // Definição segura das variáveis, com valores padrão caso não existam
  const itensDoPedido = orderData.itens || [];
  const endereco = orderData.endereco_entrega || {};
  const cliente = orderData.cliente || {};
  const pagamento = orderData.pagamento || {};
  const frete = orderData.frete || 0;

  const subtotal = itensDoPedido.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const total = subtotal + frete;

  return (
    <div className="order-details-container">
      <div className="order-header">
        <h1>Pedido #{orderData.id}</h1>
        <p>Olá, {cliente.nome || 'Cliente'}! Acompanhe abaixo os detalhes do seu pedido.</p>
      </div>

      <div className="details-grid">
        <div className="main-details">
          {/* O resumo do pedido só aparece se houver itens */}
          {itensDoPedido.length > 0 && (
            <InfoCard title="Resumo do Pedido" icon={<Package size={20} />}>
              {itensDoPedido.map(item => <OrderItem key={item.id} item={item} />)}
              <div className="order-totals">
                <div className="total-row"><span>Subtotal</span><span>R$ {subtotal.toFixed(2).replace('.', ',')}</span></div>
                <div className="total-row"><span>Frete</span><span>R$ {frete.toFixed(2).replace('.', ',')}</span></div>
                <div className="total-row total"><span>Total</span><span>R$ {total.toFixed(2).replace('.', ',')}</span></div>
              </div>
            </InfoCard>
          )}

          <div className="cards-row">
            <InfoCard title="Endereço de Entrega" icon={<Home size={20} />}>
              <p>{endereco.rua || 'Endereço não informado'}</p>
              <p>{endereco.bairro}, {endereco.cidade} - {endereco.estado}</p>
              <p>CEP: {endereco.cep}</p>
            </InfoCard>
            <InfoCard title="Pagamento" icon={<CreditCard size={20} />}>
              <p>Método: {pagamento.metodo || 'Não informado'}</p>
              {pagamento.final_cartao && <p>Final do cartão: {pagamento.final_cartao}</p>}
            </InfoCard>
          </div>
        </div>

        <aside className="sidebar-details">
          <InfoCard title="Status do Pedido" icon={<CheckCircle2 size={20} />}>
            <StatusTimeline orderData={orderData} />
            {orderData.codigo_rastreio && (
              <div className="tracking-code-section">
                <h4>Código de Rastreio:</h4>
                <div className="tracking-code-box">{orderData.codigo_rastreio}</div>
              </div>
            )}
            {orderData.data_prevista_entrega && (
              <div className="delivery-estimate">
                <p><strong>Entrega prevista para:</strong></p>
                <span>{new Date(orderData.data_prevista_entrega).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</span>
              </div>
            )}
          </InfoCard>
        </aside>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---

export function OrderStatusPage() {
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setOrderData(null);
    
    // Simulação de chamada de API para teste - pode remover se quiser
    /*
    const mockOrderData = {
        id: '112358', status: 'ENVIADO', codigo_rastreio: 'PX123456789BR', data_pagamento: '2025-08-28T11:00:00Z', data_envio: '2025-08-30T16:45:00Z', data_prevista_entrega: '2025-09-08',
        cliente: { nome: 'Ana Silva' },
        endereco_entrega: { rua: 'Rua das Flores, 123', bairro: 'Jardim Primavera', cidade: 'São Paulo', estado: 'SP', cep: '01234-567' },
        itens: [
            { id: 1, nome: 'Produto Exemplo Elegante', quantidade: 1, preco: 129.90, imagem: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' },
            { id: 2, nome: 'Item Incrível de Design', quantidade: 2, preco: 89.90, imagem: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' }
        ],
        pagamento: { metodo: 'Cartão de Crédito', final_cartao: '**** **** **** 1234' }
    };
    setTimeout(() => { setOrderData(mockOrderData); setIsLoading(false); }, 1000);
    */
    
    // CÓDIGO REAL (descomente para usar sua API)
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/rastrear-pedido`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível buscar o pedido.');
      
      // IMPORTANTE: Veja no console do navegador a estrutura real dos seus dados
      console.log('Dados recebidos da API:', data); 
      
      setOrderData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      {!orderData ? (
        <div className="search-card">
          <h1>Rastreie seu Pedido</h1>
          <p className="subtitle">Insira seu CPF e e-mail para ver todos os detalhes.</p>
          <form onSubmit={handleSearch} className="status-form">
            <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="Seu CPF" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu e-mail de compra" required />
            <button type="submit" className="search-button" disabled={isLoading}>
              {isLoading ? 'Buscando...' : <><Search size={16} /> Buscar</>}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      ) : (
        <OrderDetails orderData={orderData} />
      )}
    </div>
  );
}