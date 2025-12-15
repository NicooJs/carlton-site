import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';
import novinhaImg from '../assets/novinha.png';

// Hook personalizado para detectar clique fora do elemento
const useClickOutside = (ref, hamburgerRef, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (
        !ref.current ||
        ref.current.contains(event.target) ||
        !hamburgerRef.current ||
        hamburgerRef.current.contains(event.target)
      ) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, hamburgerRef, handler]);
};

export function Navbar({ cartItemCount, openCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Efeito para o scroll (encolhe ao rolar)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll(); // já seta certo ao entrar na página
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha o menu ao clicar fora
  useClickOutside(menuRef, hamburgerRef, () => setIsOpen(false));

  // ✅ Agora a navbar só fica pequena quando há scroll
  const shouldBeSmall = isScrolled;

  const handleLinkClick = (path) => {
    setIsOpen(false);

    // rota normal
    if (!path.includes('#')) {
      navigate(path);
      return;
    }

    // âncora
    const [basePath, hash] = path.split('#');
    const targetId = hash;

    // se não estiver na página base, navega pra ela
    if (location.pathname !== basePath) {
      navigate(basePath);

      // espera 1 frame pra página renderizar e então scrolla
      requestAnimationFrame(() => {
        const element = document.getElementById(targetId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      });

      return;
    }

    // se já estiver na página, só scrolla
    const element = document.getElementById(targetId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // ✅ Ajuste importante: se sua home agora é "/", deixe assim:
  // Troque "/home" por "/" no menu se for o seu caso.
  const menuItems = [
    { label: 'Início', path: '/' },
    { label: 'Loja', path: '/#colecao', isAnchor: true },
    { label: 'Mídia', path: '/midia' },
    { label: 'Artigos', path: '/feed' },
    { label: 'Pedidos', path: '/meus-pedidos' },
    { label: 'Sobre', path: '/#sobre', isAnchor: true },
  ];

  return (
    <header className={`main-header ${shouldBeSmall ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="navbar">
          <button
            ref={hamburgerRef}
            className={`hamburger ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Abrir menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          <Link to="/" className="nav-logo-center" onClick={() => setIsOpen(false)}>
            <img src={logo} alt="Logo animado da marca" />
          </Link>

          <button
            className="nav-link cart-link"
            onClick={openCart}
            aria-label={`Carrinho com ${cartItemCount} itens`}
          >
            <i className="fas fa-shopping-bag"></i>
            {cartItemCount > 0 && <span className="cart-count-badge">{cartItemCount}</span>}
          </button>
        </nav>
      </div>

      {/* Menu Mobile */}
      <div ref={menuRef} id="mobile-menu" className={`mobile-nav-menu ${isOpen ? 'active' : ''}`}>
        {menuItems.map((item, index) => (
          <Link
            key={item.label}
            to={item.path}
            className="nav-link"
            onClick={(e) => {
              // evita o Link fazer navegação duplicada quando for âncora
              if (item.isAnchor) e.preventDefault();
              handleLinkClick(item.path);
            }}
            style={{ transitionDelay: `${0.15 + index * 0.1}s` }}
          >
            {item.label}
          </Link>
        ))}

        <button
          className="nav-link"
          onClick={() => {
            openCart();
            setIsOpen(false);
          }}
          style={{ transitionDelay: `${0.15 + menuItems.length * 0.1}s` }}
        >
          Carrinho
        </button>

        <img src={novinhaImg} alt="Detalhe decorativo" className="menu-footer-image" />
      </div>
    </header>
  );
}
