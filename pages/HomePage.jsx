/* Site realizado 100% por Nicolas Arantes https://www.linkedin.com/in/nicolasarantes*/
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import { ProductCard } from '../components/ProductCard.jsx';
import { Carousel } from '../components/Carousel.jsx';
import { SobreSection } from '../components/SobreSection.jsx';
import './HomePage.css';

// Camisetas //
import camisetaFlerte from '../assets/camiseta flerte.png';
import camisetaFlerteHover from '../assets/camisetaMHover.png';
import camisetaFlertef from '../assets/camisetaflertef.png';
import fotopatch1 from '../assets/foto patch card.png';
import fotobandeira from '../assets/bandeira foto do card.png';
import camisetaaudionoise from '../assets/camiseta site.png';
import camisetacigarro from '../assets/camisetacigarro.png';
import camisetapredio1 from '../assets/camisetapredio.png';

// Lista de produtos
const products = [
  {
    id: 1,
    title: 'Camiseta "São Vito"',
    price: 90.00,
    image: camisetapredio1,
    hoverImage: camisetaFlerteHover,
    description: 'Peça com tecido premium...'
  },
  {
    id: 2,
    title: 'Patch "Carlton"',
    price: 29.99,
    image: fotopatch1,
    hoverImage: camisetaFlerteHover,
    description: 'Peça com tecido premium...'
  },
  {
    id: 3,
    title: 'Camiseta "Cigarette"',
    price: 90.00,
    image: camisetacigarro,
    description: 'Serigrafia em algodão cru feito a mão'
  },
  {
    id: 4,
    title: 'Bandeira "mão do povo"',
    price: 39.99,
    image: fotobandeira,
    description: 'Serigrafia em algodão cru feito a mão'
  },
  {
    id: 5,
    title: 'Camiseta "Flerte"',
    price: 90.00,
    image: camisetaFlerte,
    hoverImage: camisetaFlerteHover,
    description: 'Camiseta 100% algodão...'
  },
  {
    id: 6,
    title: 'Camiseta "Flerte" Babylook',
    price: 80.00,
    image: camisetaFlertef,
    hoverImage: camisetaFlerteHover,
    description: 'Peça com tecido premium...'
  },
];

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const sectionId = hash.replace('#', '');
      setTimeout(() => {
        scroller.scrollTo(sectionId, {
          duration: 800,
          delay: 0,
          smooth: 'easeInOutQuart',
          offset: -80
        });
      }, 100);
    }
  }, [location]);

  return (
    <>
      <div id="inicio" className="homepage">
        <Carousel />
      </div>
      <main id="colecao" className="collection-section homepage">
        <div className="container">
          <div className="product-grid">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index} //  agora cada ProductCard sabe qual é o 3º item
              />
            ))}
          </div>
        </div>
      </main>
      <SobreSection />
    </>
  );
}

