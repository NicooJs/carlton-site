import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

export function ProductCard({ product, index, featured = false, wide = false }) {
  // depois você pode trocar por lógica de estoque real
  const showUltimas = index === 3;

  return (
    <Link
      to={`/produto/${product.id}`}
      className={[
        'pcard',
        featured ? 'pcard--featured' : '',
        wide ? 'pcard--wide' : '',
      ].join(' ')}
      aria-label={`Ver produto: ${product.title}`}
    >
      {/* o Link é o container clicável */}
      <article className="pcard__inner">
        <div className="pcard__media">
          {showUltimas && (
            <span className="pcard__badge">Últimas unidades</span>
          )}

          <img
            src={product.image}
            alt={product.title}
            className="pcard__img"
            loading="lazy"
            decoding="async"
            draggable="false"
          />

          {/* overlay editorial */}
          <div className="pcard__overlay" aria-hidden="true" />

          {/* legenda editorial */}
          <div className="pcard__caption">
            <h3 className="pcard__title">{product.title}</h3>
            <span className="pcard__price">
              R$ {Number(product.price).toFixed(2)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
