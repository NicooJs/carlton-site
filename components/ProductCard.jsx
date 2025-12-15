import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

export function ProductCard({ product, index }) {
  // Mostra selo apenas no 3º card
  const showUltimas = index === 3;

  // se for baseado em estoque:
  // const showUltimas = product.stock && product.stock <= 5;

  return (
    <Link to={`/produto/${product.id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image-container">
          {showUltimas && <span className="badge-ultimas">Últimas unidades</span>}
          <img src={product.image} alt={product.title} className="product-image" />
        </div>

        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-price">R$ {Number(product.price).toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}
