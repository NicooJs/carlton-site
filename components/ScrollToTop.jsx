// src/components/ScrollToTop.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // AQUI ESTÁ A MUDANÇA:
    // Só rola para o topo se NÃO houver um #hash na URL.
    if (hash === '') {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]); // Roda o efeito se o caminho ou o hash mudarem

  return null;
}