import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ArtigosPage.css';

import imgPost1 from '../assets/capa audio noise.png';
import imgPost2 from '../assets/midiamateria2.jpg';
import imgpost3 from '../assets/capamateria3.jpg';


const articles = [
  { id: 1, title: 'Videoparts que você deveria manter no “repeat”', subtitle: 'Por Lais Miranda', date: '13 DE JULHO, 2025', image: imgPost2, variant: 'large' },
  { id: 2, title: 'O som que dá vida ao skate”', subtitle: 'Por Paulo de Andrade', date: '20 DE AGOSTO, 2025', image: imgPost1, variant: 'large' },
   { id: 3, title: 'Afinal, onde é que está a verdadeira verve política da arte?”', subtitle: 'Por Felipe Blanco', date: '19 DE SETEMBRO, 2025', image: imgpost3, variant: 'large' },
 
 
];


export function ArtigosPage() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      const onWheel = (e) => {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      };
      container.addEventListener('wheel', onWheel, { passive: false });
      return () => container.removeEventListener('wheel', onWheel);
    }
  }, []);

  return (
    <main className="horizontal-scroll-page">
      <div className="scroll-container" ref={scrollRef}>
        <div className="scroll-inner">
          {articles.map((article, index) => (
            // A 'key' agora fica no Link, que é o elemento pai da lista
            <Link to={`/feed/${article.id}`} key={article.id} className="article-card-link">
              <motion.div
                className={`scroll-item variant-${article.variant}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="scroll-image-wrapper">
                  <img src={article.image} alt={article.title} className="scroll-image" />
                </div>
                <div className="scroll-text">
                  <p className="scroll-date">{article.date}</p>
                  <h2 className="scroll-article-title">{article.title}</h2>
                  <p className="scroll-subtitle">{article.subtitle}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}