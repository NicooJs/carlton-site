import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";
import novinhaImg from "../assets/novinha.png";

/* Hook para detectar clique fora */
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

export function Navbar({ cartItemCount, openCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const onHomePage =
    location.pathname === "/" || location.pathname === "/home";

  /* Scroll shrink */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Fecha menu ao clicar fora */
  useClickOutside(menuRef, hamburgerRef, () => setIsOpen(false));

  const shouldBeSmall = isScrolled;

  const scrollToIdWithOffset = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const header = document.querySelector(".main-header");
    const headerHeight = header
      ? header.getBoundingClientRect().height
      : 0;

    const y =
      el.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      10;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleLinkClick = (path) => {
    setIsOpen(false);

    if (!path.includes("#")) {
      navigate(path);
      return;
    }

    const [base, hash] = path.split("#");

    if (!onHomePage) {
      navigate(base || "/");
      requestAnimationFrame(() => {
        setTimeout(() => scrollToIdWithOffset(hash), 60);
      });
      return;
    }

    scrollToIdWithOffset(hash);
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
    <header className={`main-header ${shouldBeSmall ? "scrolled" : ""}`}>
      <div className="container">
        <nav className="navbar">
          {/* Hamburger */}
          <button
            ref={hamburgerRef}
            className={`hamburger ${isOpen ? "active" : ""}`}
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            type="button"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="nav-logo-center"
            onClick={() => setIsOpen(false)}
          >
            <img src={logo} alt="Logo Carlton" />
          </Link>

          {/* Carrinho (ÚNICO lugar onde existe) */}
          <button
            className="nav-link cart-link"
            onClick={openCart}
            aria-label={`Carrinho com ${cartItemCount} itens`}
            type="button"
          >
            <i className="fas fa-shopping-bag"></i>
            {cartItemCount > 0 && (
              <span className="cart-count-badge">
                {cartItemCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Menu lateral */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={`mobile-nav-menu ${isOpen ? "active" : ""}`}
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

        <img
          src={novinhaImg}
          alt="Detalhe decorativo"
          className="menu-footer-image"
        />
      </div>
    </header>
  );
}
