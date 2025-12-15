import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Importações de imagens (ajuste o caminho se necessário)
import flerteImg2 from '../assets/camiseta flerte modelo.png';
import flerteImg3 from '../assets/camiseta flerte.png';
import flerteImg4 from '../assets/camiseta flerte modelo2.png';
import FlerteFImg1 from '../assets/camisetaflerteF.png';
import FlertemodeloF from '../assets/flertemodelof.png';
import FlertemodeloF2 from '../assets/flertemodelof2.png';
import specsImage from '../assets/tabela de medidas.png';
import fotoziplock1 from '../assets/foto ziploc 1.png'
import fotoziplock2 from '../assets/foto ziploc 2.png'
import fotoziplock3 from '../assets/foto zoom patch 2.png'
import fotoziplock4 from '../assets/foto zoom patch 3.png'
import fotoziplock5 from '../assets/foto zoom patch 4.png'
import bandeira1 from '../assets/bandeira 1.png'
import bandeira2 from '../assets/bandeira 2.png'
import bandeira3 from '../assets/bandeira 3.png'
import camisetacigarro from '../assets/camisetacigarro2.png'
import camisetacigarro2 from '../assets/camisetacigarro3.png'
import camisetacigarro3 from '../assets/camisetacigarro.png'
import camisetapredio1 from '../assets/camisetapredio.png'
import camisetapredio2 from '../assets/camisetapredio2.jpg'
import camisetapredio3 from '../assets/camisetapredio3.jpg'



// Importação do arquivo CSS correspondente
import './ProductDetailPage.css';

const allProducts = [
    { 
    id: 1, 
    title: 'Camiseta "São Vito"', 
    price: 90.00, 
    images: [camisetapredio1,camisetapredio2,camisetapredio3], 
    description: 'Colaboração Antiamericanismo x Carlton 100% Algodão estampa em serigrafia feito a mão. Lavar separadamente ou com peças de cores similares. Usar sabão neutro. Não utilizar alvejantes. Evitar secadora. Secar à sombra. Passar com ferro a até 110 °C. Não realizar lavagem a seco.' 
  },
  { 
    id: 2, 
    title: 'Pack de patch "Carlton"', 
    price: 29.99, 
    images: [fotoziplock1,fotoziplock2,fotoziplock3,fotoziplock4,fotoziplock5], 
    description: 'Feito a mão. Serigrafia em tecido Brim pesado. Pack com 10 unidades, sortidos (tamanhos e cores variados)' 
  },
    { 
    id: 3, 
    title: 'Camiseta "Cigarette"', 
    price: 90.00, 
    images: [camisetacigarro,camisetacigarro2,camisetacigarro3], 
    description: 'Lavar separadamente ou com peças de cores similares. Usar sabão neutro. Não utilizar alvejantes. Evitar secadora. Secar à sombra. Passar com ferro a até 110 °C. Não realizar lavagem a seco.' 
  },
   { 
    id: 4, 
    title: 'Bandeira "mão do povo"', 
    price: 39.99, 
    images: [bandeira1,bandeira2,bandeira3],
    description: 'Serigrafia em algodão cru feito a mão 70x50.'
  },
  { 
    id: 5, 
    title: 'Camiseta "Flerte"', 
    price: 90.00, 
    images: [flerteImg2, flerteImg4, flerteImg3], 
    description: 'Lavar separadamente ou com peças de cores similares.\n\nUsar sabão neutro. Não utilizar alvejantes.\n\nEvitar secadora. Secar à sombra.\n\nPassar com ferro a até 110 °C.\n\nNão realizar lavagem a seco.' 
  },
  { 
    id: 6, 
    title: 'Babylook "Flerte"', 
    price: 80.00, 
    images: [FlertemodeloF, FlertemodeloF2, FlerteFImg1],
    description: 'Peça com tecido premium. Edição limitada.'
  },
 
];

// Produtos que não têm variação de tamanho (tamanho único)
const SIZELESS_PRODUCTS = [2,4]; 

export function ProductDetailPage({ addToCart }) {
  const { productId } = useParams();
  const product = allProducts.find(p => p.id === parseInt(productId));
  const relatedProducts = allProducts.filter(p => p.id !== parseInt(productId));

  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [descriptionOpen, setDescriptionOpen] = useState(true);
  const [fadeKey, setFadeKey] = useState(0);
  const availableSizes = ['P', 'M', 'G', 'GG'];

  useEffect(() => {
    if (product?.images.length > 0) {
      setMainImage(product.images[0]);
      setFadeKey(fk => fk + 1);
      // Resetar o tamanho selecionado ao mudar de produto
      setSelectedSize('');
    }
  }, [product]);

  const handleImageChange = (img) => {
    setMainImage(img);
    setFadeKey(fk => fk + 1);
  };

  if (!product) {
    return (
      <main className="container product-not-found">
        <h1 className="section-title">Produto não encontrado!</h1>
        <Link to="/home" className="back-to-shop-link">Voltar para a loja</Link>
      </main>
    );
  }
  
  const handleAddToCart = () => {
    // Se for produto sem tamanho → adiciona com "Tamanho Único"
    if (SIZELESS_PRODUCTS.includes(product.id)) {
      addToCart(product, 'Tamanho Único', 1);
    } else {
      addToCart(product, selectedSize, 1);
    }
  };

  return (
    <main className="product-page-container">
      <div className="detail-grid-layout">
        {/* Galeria de Imagens */}
        <div className="image-gallery-container">
          <div className="thumbnail-wrapper">
            {product.images.map((imgSrc, index) => (
              <button 
                key={index} 
                className={`thumbnail-button ${mainImage === imgSrc ? 'active' : ''}`}
                onClick={() => handleImageChange(imgSrc)}
              >
                <img src={imgSrc} alt={`Thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
          <div className="main-image-wrapper">
            {mainImage && (
              <img
                key={fadeKey} 
                src={mainImage} 
                alt={product.title} 
                className="fade-image"
              />
            )}
          </div>
        </div>

        {/* Informações do Produto */}
        <div className="info-column">
          <h1 className="detail-title">{product.title}</h1>
          <p className="detail-price">R$ {product.price.toFixed(2).replace('.', ',')}</p>

          {/* Só mostra tamanhos se não for produto de tamanho único */}
          {!SIZELESS_PRODUCTS.includes(product.id) && (
            <div className="selector-group">
              <label>Tamanho</label>
              <div className="size-buttons">
                {availableSizes.map(size => (
                  <button 
                    key={size} 
                    className={`size-button ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botão Adicionar ao Carrinho */}
          <button 
            className="add-to-cart-button" 
            onClick={handleAddToCart}
            disabled={!SIZELESS_PRODUCTS.includes(product.id) && !selectedSize}
          >
            {SIZELESS_PRODUCTS.includes(product.id) 
              ? 'Adicionar ao Carrinho' 
              : (selectedSize ? 'Adicionar ao Carrinho' : 'Selecione um tamanho')}
          </button>

          <div className="description-accordion">
            <button className="accordion-header" onClick={() => setDescriptionOpen(!descriptionOpen)}>
              <span>Descrição</span>
              <span className={`accordion-icon ${descriptionOpen ? 'open' : ''}`}>+</span>
            </button>
            {descriptionOpen && (
              <div className="accordion-content">
                <p>{product.description}</p>
                {/* Só mostra tabela de medidas se NÃO for produto de tamanho único */}
                {!SIZELESS_PRODUCTS.includes(product.id) && (
                  <img 
                    src={specsImage} 
                    alt="Tabela de medidas" 
                    className="specs-image" 
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Produtos Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2>Produtos Relacionados</h2>
          <div className="related-products-list">
            {relatedProducts.map((p) => (
              <Link key={p.id} to={`/produto/${p.id}`} className="related-card">
                <img src={p.images[0]} alt={p.title} />
                <h3>{p.title}</h3>
                <p>R$ {p.price.toFixed(2).replace('.', ',')}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
