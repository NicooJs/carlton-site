import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import './CheckoutPage.css'; // Certifique-se de que o CSS está sendo importado

const brazilianStates = [
  { uf: 'AC', nome: 'Acre' }, { uf: 'AL', nome: 'Alagoas' }, { uf: 'AP', nome: 'Amapá' },
  { uf: 'AM', nome: 'Amazonas' }, { uf: 'BA', nome: 'Bahia' }, { uf: 'CE', nome: 'Ceará' },
  { uf: 'DF', nome: 'Distrito Federal' }, { uf: 'ES', nome: 'Espírito Santo' }, { uf: 'GO', nome: 'Goiás' },
  { uf: 'MA', nome: 'Maranhão' }, { uf: 'MT', nome: 'Mato Grosso' }, { uf: 'MS', nome: 'Mato Grosso do Sul' },
  { uf: 'MG', nome: 'Minas Gerais' }, { uf: 'PA', nome: 'Pará' }, { uf: 'PB', nome: 'Paraíba' },
  { uf: 'PR', nome: 'Paraná' }, { uf: 'PE', nome: 'Pernambuco' }, { uf: 'PI', nome: 'Piauí' },
  { uf: 'RJ', nome: 'Rio de Janeiro' }, { uf: 'RN', nome: 'Rio Grande do Norte' }, { uf: 'RS', nome: 'Rio Grande do Sul' },
  { uf: 'RO', nome: 'Rondônia' }, { uf: 'RR', nome: 'Roraima' }, { uf: 'SC', nome: 'Santa Catarina' },
  { uf: 'SP', nome: 'São Paulo' }, { uf: 'SE', nome: 'Sergipe' }, { uf: 'TO', nome: 'Tocantins' }
];

const OrderItem = ({ item }) => (
  <div className="order-item">
    <img src={item.imageUrl} alt={item.title} className="order-item-image" />
    <div className="order-item-details">
      <p className="order-item-name">{item.title} ({item.size})</p>
      <p className="order-item-quantity">Quantidade: {item.quantity}</p>
    </div>
    <p className="order-item-price">R$ {(item.price * item.quantity).toFixed(2)}</p>
  </div>
);

export function CheckoutPage({ cartItems, shippingInfo, setShippingInfo }) {
  const navigate = useNavigate();
  const numberInputRef = useRef(null);

  const [customerInfo, setCustomerInfo] = useState({
    email: '', firstName: '', lastName: '', cpf: '', phone: '',
    cep: '', address: '', number: '', complement: '',
    neighborhood: '', city: '', state: '',
  });
  const [shippingOptions, setShippingOptions] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efeito para carregar o estado do localStorage na inicialização do componente
  useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem('checkoutState');
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        if (savedState.customerInfo) setCustomerInfo(savedState.customerInfo);
        if (savedState.shippingOptions) setShippingOptions(savedState.shippingOptions);
        if (savedState.selectedShipping) setSelectedShipping(savedState.selectedShipping);
        if (savedState.agreed) setAgreed(savedState.agreed);
      }
    } catch (error) {
      console.error("Erro ao carregar o estado do checkout do localStorage:", error);
      localStorage.removeItem('checkoutState');
    }
  }, []); // Array vazio [] garante que rode apenas uma vez

  // Efeito para salvar o estado no localStorage sempre que um dos dados do checkout mudar
  useEffect(() => {
    const checkoutState = {
      customerInfo,
      shippingOptions,
      selectedShipping,
      agreed,
    };
    localStorage.setItem('checkoutState', JSON.stringify(checkoutState));
  }, [customerInfo, shippingOptions, selectedShipping, agreed]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (selectedShipping ? selectedShipping.price : 0);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  useEffect(() => { setShippingInfo(selectedShipping); }, [selectedShipping, setShippingInfo]);

  const handleCalculateShipping = async () => {
    if (customerInfo.cep.replace(/\D/g, '').length !== 8) {
      setErrors({ cep: 'Por favor, insira um CEP válido.' });
      return;
    }
    setIsCalculating(true);
    setErrors({});
    setShippingOptions([]);
    setSelectedShipping(null);
    try {
      const response = await fetch(`${backendUrl}/calcular-frete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cepDestino: customerInfo.cep,
          items: cartItems.map(item => ({
            id: item.id,
            unit_price: item.price,
            quantity: item.quantity
          }))
        }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível calcular o frete.');

      setShippingOptions(data.services || []);
      if(data.services && data.services.length === 0){
        setErrors({ cep: "Nenhuma opção de entrega encontrada para este CEP." });
      }

      if (data.addressInfo) {
        setCustomerInfo(prev => ({
          ...prev,
          address: data.addressInfo.logradouro,
          neighborhood: data.addressInfo.bairro,
          city: data.addressInfo.localidade,
          state: data.addressInfo.uf,
        }));
        numberInputRef.current?.focus();
      }
    } catch (err) {
      setErrors({ cep: err.message });
    } finally {
      setIsCalculating(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = {
      email: 'E-mail', firstName: 'Nome', lastName: 'Sobrenome', cpf: 'CPF', phone: 'Telefone',
      cep: 'CEP', address: 'Endereço', number: 'Número', neighborhood: 'Bairro', city: 'Cidade', state: 'Estado'
    };
    for (const field in requiredFields) {
      if (!customerInfo[field] || !customerInfo[field].trim()) {
        newErrors[field] = `${requiredFields[field]} é obrigatório.`;
      }
    }
    if (customerInfo.cpf && customerInfo.cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF inválido. Preencha os 11 dígitos.';
    }
    if (customerInfo.phone && customerInfo.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone inválido. Preencha DDD + número.';
    }
    if (!selectedShipping) {
      newErrors.shipping = 'Selecione uma opção de frete.';
    }
    if (!agreed) {
        newErrors.agreed = 'Você deve concordar com os termos para continuar.'
    }
    return newErrors;
  };

  const handleFinalizePurchase = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

  
    const purchaseData = {
  items: cartItems.map(item => ({
    id: item.id,
    title: `${item.title} - ${item.size}`,
    description: `Tamanho: ${item.size}`,
    quantity: item.quantity,
    unit_price: item.price,
    // ADICIONE ESTA LINHA:
    picture_url: item.images[0]
  })),
  customerInfo: customerInfo,
  selectedShipping: selectedShipping,
  shipmentCost: selectedShipping ? selectedShipping.price : 0 
};

    // Linha de depuração para vermos no console o que está sendo enviado
    console.log("### DADOS ENVIADOS PARA O BACKEND ###", purchaseData);
    // ===================================================================

    try {
      const response = await fetch(`${backendUrl}/criar-preferencia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchaseData)
      });
      const preference = await response.json();
      if (!response.ok) throw new Error(preference.error || "Erro interno do servidor.");
      
      if (preference.init_point) {
        localStorage.removeItem('checkoutState'); 
        window.location.href = preference.init_point;
      } else {
        throw new Error("Não foi possível gerar o link de pagamento.");
      }
    } catch (err) {
      alert(`Erro ao finalizar a compra: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-container">
        {/* NENHUMA ALTERAÇÃO VISUAL (JSX) FOI NECESSÁRIA */}
      <div className="checkout-form-section">
        <h2>Informações de Contato</h2>
        <div className="field">
          <label htmlFor="email">E-mail <span className="required-asterisk">*</span></label>
          <input id="email" type="email" name="email" value={customerInfo.email} onChange={handleInputChange} className={errors.email ? 'input-error' : ''} />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="firstName">Nome <span className="required-asterisk">*</span></label>
            <input id="firstName" type="text" name="firstName" value={customerInfo.firstName} onChange={handleInputChange} className={errors.firstName ? 'input-error' : ''} />
            {errors.firstName && <p className="error-message">{errors.firstName}</p>}
          </div>
          <div className="field">
            <label htmlFor="lastName">Sobrenome <span className="required-asterisk">*</span></label>
            <input id="lastName" type="text" name="lastName" value={customerInfo.lastName} onChange={handleInputChange} className={errors.lastName ? 'input-error' : ''} />
            {errors.lastName && <p className="error-message">{errors.lastName}</p>}
          </div>
        </div>
        <div className="field">
          <label htmlFor="phone">Telefone (com DDD) <span className="required-asterisk">*</span></label>
          <IMaskInput
            mask="(00) 00000-0000" id="phone" name="phone" value={customerInfo.phone}
            className={errors.phone ? 'input-error' : ''}
            onAccept={(value) => handleInputChange({ target: { name: 'phone', value } })} />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
        </div>
        <div className="field">
          <label htmlFor="cpf">CPF <span className="required-asterisk">*</span></label>
          <IMaskInput
            mask="000.000.000-00" id="cpf" name="cpf" value={customerInfo.cpf}
            className={errors.cpf ? 'input-error' : ''}
            onAccept={(value) => handleInputChange({ target: { name: 'cpf', value } })} />
          {errors.cpf && <p className="error-message">{errors.cpf}</p>}
        </div>

        <h2>Detalhes de Entrega</h2>
        <div className="cep-section">
          <div className="field" style={{ flexGrow: 1 }}>
            <label htmlFor="cep">CEP <span className="required-asterisk">*</span></label>
            <IMaskInput
              mask="00000-000" id="cep" name="cep" value={customerInfo.cep}
              className={errors.cep ? 'input-error' : ''}
              onAccept={(value) => handleInputChange({ target: { name: 'cep', value } })}
            />
          </div>
          <button onClick={handleCalculateShipping} disabled={isCalculating}>
            {isCalculating ? 'Calculando...' : 'Calcular Frete'}
          </button>
        </div>
        {errors.cep && <p className="error-message">{errors.cep}</p>}
        
        {shippingOptions.length > 0 && (
          <div className="field">
            <label htmlFor="shipping-select">Método de entrega <span className="required-asterisk">*</span></label>
            <select
              id="shipping-select"
              className={errors.shipping ? 'input-error' : ''}
              value={selectedShipping ? selectedShipping.code : ''}
              onChange={(e) => {
                const selectedOption = shippingOptions.find(opt => opt.code.toString() === e.target.value);
                setSelectedShipping(selectedOption);
                if (errors.shipping) { setErrors(prev => ({...prev, shipping: null})); }
              }} >
              <option value="" disabled>Selecione uma opção de frete</option>
              {shippingOptions.map(option => (
                <option key={option.code} value={option.code}>
                  {option.name} - R$ {option.price.toFixed(2)} (Prazo: {option.deliveryTime} dias)
                </option>
              ))}
            </select>
            {errors.shipping && <p className="error-message">{errors.shipping}</p>}
          </div>
        )}
        
        <div className="form-grid">
          <div className="field">
            <label htmlFor="state">Estado <span className="required-asterisk">*</span></label>
            <select id="state" name="state" value={customerInfo.state} onChange={handleInputChange} className={errors.state ? 'input-error' : ''}>
              <option value="" disabled>Selecione</option>
              {brazilianStates.map(state => (<option key={state.uf} value={state.uf}>{state.nome}</option>))}
            </select>
            {errors.state && <p className="error-message">{errors.state}</p>}
          </div>
          <div className="field">
            <label htmlFor="city">Cidade <span className="required-asterisk">*</span></label>
            <input id="city" type="text" name="city" value={customerInfo.city} onChange={handleInputChange} className={errors.city ? 'input-error' : ''} />
            {errors.city && <p className="error-message">{errors.city}</p>}
          </div>
        </div>
        
        <div className="field">
          <label htmlFor="address">Endereço (Rua, Av.) <span className="required-asterisk">*</span></label>
          <input id="address" type="text" name="address" value={customerInfo.address} onChange={handleInputChange} className={errors.address ? 'input-error' : ''} />
          {errors.address && <p className="error-message">{errors.address}</p>}
        </div>
        <div className="field">
          <label htmlFor="neighborhood">Bairro <span className="required-asterisk">*</span></label>
          <input id="neighborhood" type="text" name="neighborhood" value={customerInfo.neighborhood} onChange={handleInputChange} className={errors.neighborhood ? 'input-error' : ''} />
          {errors.neighborhood && <p className="error-message">{errors.neighborhood}</p>}
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="number">Número <span className="required-asterisk">*</span></label>
            <input id="number" type="text" name="number" ref={numberInputRef} value={customerInfo.number} onChange={handleInputChange} className={errors.number ? 'input-error' : ''} />
            {errors.number && <p className="error-message">{errors.number}</p>}
          </div>
          <div className="field">
            <label htmlFor="complement">Complemento (opcional)</label>
            <input id="complement" type="text" name="complement" value={customerInfo.complement} onChange={handleInputChange} />
          </div>
        </div>

        <div className="field checkbox-field">
          <input
            type="checkbox"
            id="agreeCheckbox"
            checked={agreed}
            onChange={() => {
              setAgreed(prev => !prev);
              if (errors.agreed) { setErrors(prev => ({...prev, agreed: null}))}
            }}
          />
          <label htmlFor="agreeCheckbox" style={{ marginLeft: '8px', fontSize: '0.95rem', color: '#333' }}>
            Prezado cliente, Informamos que o produto escolhido é produzido sob encomenda. Por esse motivo, o prazo de entrega pode variar.
          </label>
          {errors.agreed && <p className="error-message" style={{marginTop: '5px'}}>{errors.agreed}</p>}
        </div>

      </div>

      <div className="checkout-summary-section">
        <h2>Resumo do Pedido</h2>
        <div className="order-items-container">
          {cartItems.length > 0 ? cartItems.map(item => <OrderItem key={item.id} item={item} />) : <p>Seu carrinho está vazio.</p>}
        </div>
        <div className="summary-costs">
          <div className="cost-line">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="cost-line">
            <span>Frete</span>
            <span>{selectedShipping ? `R$ ${selectedShipping.price.toFixed(2)}` : 'A calcular'}</span>
          </div>
          <div className="cost-line total">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>
        <button
          className="finalize-button"
          onClick={handleFinalizePurchase}
          disabled={cartItems.length === 0 || isSubmitting}
        >
          {isSubmitting ? 'Processando...' : 'Ir para o Pagamento'}
        </button>
      </div>
    </div>
  );
}