import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articlesData } from '../data/articlesData.js';
import './ArtigoDetailPage.css';

    
const formatText = (text, articleId) => {
  if (!text) return null;

  const articleSpecificLinks = {
    '1': {
      "Keoneschauffert": "https://www.instagram.com/keoneschauffert/",
      "Será que vai ser sempre assim": "https://www.youtube.com/watch?v=wiMTgb1EB_k",
      "Sem juízo": "https://www.youtube.com/watch?v=h0MRpR_y2TI",
      "It's Time Bronze 56K": "https://youtu.be/gjhtVF5a-34?si=rgpYSp1sC1qgF_dx",
      "Samantha": "https://www.youtube.com/watch?v=BW6ZUzv7Ie4",
      "Blue": "https://www.youtube.com/watch?v=bbCqyWAXCBs&t=550s",
      "Skate Vídeo Site": "https://www.skatevideosite.com/",
      "Larissa Nunes": "https://www.instagram.com/larissssaaaaaaaaaaaaa?igsh=MTJ6bmRqY2t2NDR5bw==",
      "VEREDAS": "https://youtu.be/pkhJ5UXDH8g",
      "COISAS DA VIDA": "https://www.youtube.com/watch?v=4feLj5gi-Xw",
      "CONTENTS": "https://youtu.be/cawbXRUAph8",
      "DUOTONE": "https://youtu.be/vJu4nwoJUz4?si=SWnzqQK46lHEJTb1",
      "DANNY RENAUD “MOSAIC”": "https://youtu.be/DgcOBlReFyU?si=uKpPvycSnPrxSEux",
    },
    '2': {
      "YouTube": "https://www.youtube.com/watch?v=GRS4o0xpf8c",
      "Spotify": "https://open.spotify.com/intl-pt/track/1jvbJ0VnD6bJCRbwu74yiX?si=bab48117849a4988/",
      "Discoderiva": "https://www.instagram.com/discoderiva",
      "Giovanna": "https://www.instagram.com/gggiovvvana",
      "Enzo": "https://www.instagram.com/ezcaramori",
      "Rafael Lúcio": "https://www.instagram.com/lucyusrafa",
      "Monocroma": "https://www.instagram.com/losmonocroma",
      "Henri": "https://www.instagram.com/hheeeennrrii",
      "Gabriel Rau": "https://www.instagram.com/filmecomlegenda",
      "Felipe Blanco": "https://www.instagram.com/elfelipeblanco",
    }
  };

  const activeLinks = articleSpecificLinks[articleId] || {};
    const linkKeys = Object.keys(activeLinks);
    
    // Regex para encontrar negrito (**), itálico (*) ou uma das palavras-chave de link
    // A condição 'linkKeys.length > 0' evita um erro se não houver links
    const regexPattern = `(\\*\\*.*?\\*\\*|\\*.*?\\*${linkKeys.length > 0 ? `|${linkKeys.join("|")}` : ''})`;
    const regex = new RegExp(regexPattern, "g");

    const parts = text.split(regex);

    return parts.map((part, index) => {
        if (!part) return null;

        // É um link?
        if (linkKeys.includes(part)) {
            return (
                <a key={index} href={activeLinks[part]} target="_blank" rel="noopener noreferrer">
                    {part}
                </a>
            );
        }
        // É negrito?
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        // É itálico?
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={index}>{part.slice(1, -1)}</em>;
        }
        // É texto normal
        return part;
    });
};


// ==================================================================
// COMPONENTE PARA RENDERIZAR O ARTIGO DE FORMA ESTRUTURADA
// ==================================================================
const RenderArticleContent = ({ text, articleId }) => {
    // AQUI ESTÁ A CORREÇÃO: O regex agora permite espaços antes e depois do título
    // Ex: "### Agradecimentos ###" vai funcionar, assim como "###Agradecimentos###"
    const sections = text.split(/###\s*(.*?)\s*###\n?/);

    const content = [];
    
    // O primeiro item do array é sempre o corpo principal do artigo
    const mainBody = sections.shift(); 
    if (mainBody) {
        content.push(
            <div className="article-main-body" key="main-body">
                {mainBody.split('\n\n').map((paragraph, index) => (
                    <p key={`p-${index}`} className="article-body-text">
                        {formatText(paragraph, articleId)}
                    </p>
                ))}
            </div>
        );
    }
    
    // Processa as seções restantes (Agradecimentos, Referências, etc.)
    for (let i = 0; i < sections.length; i += 2) {
        const title = sections[i];
        const body = sections[i+1];

        if (title && body) {
            const className = title.toLowerCase().replace(/\s/g, '-');
            
            content.push(
                <div key={title} className={`article-section ${className}`}>
                    <h2 className="section-title">{title}</h2>
                    {body.trim().split('\n').map((line, index) => (
                         <p key={`line-${index}`} className="section-line">
                           {formatText(line, articleId)}
                         </p>
                    ))}
                </div>
            )
        }
    }

    return <>{content}</>;
};


// ==================================================================
// COMPONENTE PRINCIPAL DA PÁGINA
// ==================================================================
export function ArtigoDetailPage() {
    const { articleId } = useParams();
    const article = articlesData[articleId];
    const BORDER_HEIGHT = 30;

    const [currentSlide, setCurrentSlide] = useState(0);
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);
    const carouselRef = useRef(null);

    // Hook para scroll do carrossel no mobile
    useEffect(() => {
        const mobileContainer = carouselRef.current;
        const handleMobileScroll = () => {
            if (mobileContainer) {
                const scrollLeft = mobileContainer.scrollLeft;
                const width = mobileContainer.clientWidth;
                if (width > 0) {
                    const slideIndex = Math.round(scrollLeft / width);
                    setCurrentSlide(slideIndex);
                }
            }
        };
        if (mobileContainer) {
            mobileContainer.addEventListener("scroll", handleMobileScroll, { passive: true });
        }
        return () => {
            if (mobileContainer) {
                mobileContainer.removeEventListener("scroll", handleMobileScroll);
            }
        };
    }, [article]);

    // Hook para mostrar/esconder a seta de scroll
    useEffect(() => {
        const handlePageScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const atBeginning = scrollTop < 50;
            const hasReachedEnd = scrollHeight - scrollTop <= clientHeight + 50;
            setShowScrollIndicator(atBeginning && !hasReachedEnd);
        };
        window.addEventListener('scroll', handlePageScroll);
        handlePageScroll();
        return () => {
            window.removeEventListener('scroll', handlePageScroll);
        };
    }, [articleId]);

    if (!article) {
        return (
            <main className="container article-not-found">
                <h1>Artigo não encontrado!</h1>
                <Link to="/feed" className="back-to-feed-link">
                    Voltar para o Feed
                </Link>
            </main>
        );
    }

    return (
        <main className="article-detail-page">
            <Link to="/feed" className="back-button" aria-label="Voltar para o feed">
                ×
            </Link>

            <div className="article-text-column">
                <div className="article-sticky-content">
                    <p className="article-meta">
                        {article.date} • {article.author}
                    </p>
                    <h1 className="article-detail-title">
                        {article.title.split('\n\n').map((line, i) => <span key={i}>{line}</span>)}
                    </h1>
                    
                    {/* Renderiza o conteúdo do artigo usando o novo componente */}
                    <RenderArticleContent text={article.text} articleId={articleId} />

                    <Link to="/feed" className="back-to-feed-link">
                        Voltar ao Feed
                    </Link>
                </div>
            </div>
            
            <div className="article-image-column">
                <div className="mobile-indicator">
                    {(article.images || []).map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${index === currentSlide ? "active" : ""}`}
                        />
                    ))}
                </div>
                <div className="image-carousel-container" ref={carouselRef}>
                    {(article.images || []).map((src, index) => (
                        <div
                            key={index}
                            className="image-stack-item"
                            style={{ top: `${index * BORDER_HEIGHT}px` }}
                        >
                            <img src={src} alt={`Imagem ${index + 1}`} />
                        </div>
                    ))}
                </div>
                {showScrollIndicator && (
                    <div className="scroll-down-indicator">
                        <span>↓</span>
                    </div>
                )}
            </div>
        </main>
    );
}