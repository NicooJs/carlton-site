import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";
import novinhaImg from "../assets/novinha.png";

const useClickOutside = (ref, triggerRef, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (
        !ref.current ||
        ref.current.contains(event.target) ||
        !triggerRef.current ||
        triggerRef.current.contains(event.target)
      ) {
        return;
      }
      handler();
    };

    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, triggerRef, handler]);
};

export function Navbar({ cartItemCount, toggleCart, closeCart, isCartOpen }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const isProductPage = location.pathname.startsWith("/produto");
  const onHomePage = location.pathname === "/" || location.pathname === "/home";

  // Sempre controlar o "header-scrolled" no HTML
  useEffect(() => {
    const root = document.documentElement;

    const shouldBeSmall =
      isProductPage || isMenuOpen || isCartOpen || window.scrollY > 10;

    setIsScrolled(shouldBeSmall);
    root.classList.toggle("header-scrolled", shouldBeSmall);
  }, [location.pathname, isMenuOpen, isCartOpen, isProductPage]);

  // Scroll só importa fora do ProductDetail
  useEffect(() => {
    if (isProductPage) return;

    const handleScroll = () => {
      const shouldBeSmall = window.scrollY > 10 || isMenuOpen || isCartOpen;
      setIsScrolled(shouldBeSmall);
      document.documentElement.classList.toggle("header-scrolled", shouldBeSmall);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isProductPage, isMenuOpen, isCartOpen]);

  useClickOutside(menuRef, hamburgerRef, () => setIsMenuOpen(false));

  const handleLinkClick = (path) => {
    setIsMenuOpen(false);
    closeCart?.();

    if (!path.includes("#")) {
      navigate(path);
      return;
    }

    // âncora na home
    const [base, hash] = path.split("#");
    if (!onHomePage) {
      navigate(base || "/");
      requestAnimationFrame(() => {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 60);
      });
      return;
    }

    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const menuItems = [
    { label: "Início", path: "/" },
    { label: "Loja", path: "/#colecao", isAnchor: true },
    { label: "Mídia", path: "/midia" },
    { label: "Artigos", path: "/feed" },
    { label: "Pedidos", path: "/meus-pedidos" },
    { label: "Sobre", path: "/#sobre", isAnchor: true },
  ];

  return (
    <header className={`main-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container">
        <nav className="navbar">
          <button
            ref={hamburgerRef}
            className={`hamburger ${isMenuOpen ? "active" : ""}`}
            onClick={() => {
              closeCart?.();
              setIsMenuOpen((v) => !v);
            }}
            type="button"
            aria-label="Abrir menu"
            aria-expanded={isMenuOpen}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          <Link
            to="/"
            className="nav-logo-center"
            onClick={() => {
              setIsMenuOpen(false);
              closeCart?.();
            }}
          >
            <img src={logo} alt="Logo Carlton" />
          </Link>

          <button
            className="nav-link cart-link"
            onClick={() => {
              setIsMenuOpen(false);
              toggleCart();
            }}
            type="button"
            aria-label={`Carrinho com ${cartItemCount} itens`}
          >
            <i className="fas fa-shopping-bag"></i>
            {cartItemCount > 0 && (
              <span className="cart-count-badge">{cartItemCount}</span>
            )}
          </button>
        </nav>
      </div>

      <div
        ref={menuRef}
        id="mobile-menu"
        className={`mobile-nav-menu ${isMenuOpen ? "active" : ""}`}
      >
        {menuItems.map((item, index) => (
          <Link
            key={item.label}
            to={item.path}
            className="nav-link"
            onClick={(e) => {
              if (item.isAnchor) e.preventDefault();
              handleLinkClick(item.path);
            }}
            style={{ transitionDelay: `${0.12 + index * 0.08}s` }}
          >
            {item.label}
          </Link>
        ))}

        <img src={novinhaImg} alt="Detalhe decorativo" className="menu-footer-image" />
      </div>
    </header>
  );
}
