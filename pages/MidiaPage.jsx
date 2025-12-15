import React from 'react';
import './MidiaPage.css';

// Coloque sua imagem de cabeçalho na pasta 'src/assets/'
import midiaHeaderImage from '../assets/logofascists.png';

// Coloque aqui os IDs e informações dos seus vídeos
const videos = [
  {
    id: '0g7zTIrDrhg',
    title: 'Flerte',
    description: 'Por Gustavo Fernando, Carlton, São Paulo 2025.'
  },
  {
    id: 'fcJ-4Vf7_s0',
    title: 'PARA NÃO DIZER QUE NÃO FALEI DAS FLORES',
    description: 'Editado por Paulo de Andrade, filmado por Gabriel Venancio, Gustavo Fernando, Vinicius Pinheiro, Paulo de Andrade, animação 3d por Gabriel Venâncio.'
  },
  // Adicione mais vídeos aqui...
   {
    id: 'td3JKBpOg5Y',
    title: 'Cornucópia',
    description: 'Filmado e editado por Paulo de Andrade.'
  },
    // Adicione mais vídeos aqui...
   {
    id: 'GRS4o0xpf8c',
    title: 'AUDIO NOISE SKATE VISUAL',
    description: 'Por Lucyus, Monocroma e Carlton. Musica feita inteiramente a partir de um video de skate.'
  },
];


export function MidiaPage() {
  return (
    <main className="midia-page-container">
      <div className="container">

        <img src={midiaHeaderImage} alt="Mídia" className="midia-page-header-image" />

        <div className="video-grid">
          {videos.map(video => (
            <div key={video.id} className="video-card">
              <div className="video-embed-container">
               <iframe
  src={`https://www.youtube.com/embed/${video.id}`}
  title={video.title}
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>
              </div>
              <div className="video-info">
                <h2 className="video-title">{video.title}</h2>
                <p className="video-description">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}