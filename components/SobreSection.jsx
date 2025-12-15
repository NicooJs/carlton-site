import React, { useState } from 'react';
import Modal from 'react-modal';
import './SobreSection.css';

// Importe seu vídeo e a imagem do botão
import videoBg from '../assets/fundosobre.mp4';


export function SobreSection() {
  // Estado para controlar se o modal está aberto ou fechado
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <>
      <section id="sobre" className="sobre-video-section">
        <div className="sobre-video-background">
          <video src={videoBg} autoPlay loop muted playsInline />
        </div>
        <div className="sobre-video-overlay"></div> {/* Camada escura */}

        <div className="container sobre-content">
          <h2 className="sobre-title">Carlton, 2025</h2>
          <p className="sobre-paragraph">
            Espaço de estudo e pesquisa em audiovisual, idealizado em 2022 na Zona Oeste de São Paulo. Pensado a partir do skate, tem como objetivo principal fomentar o trabalho coletivo, utilizando da linguagem visual, com as exibições e videopartes de skate, para transmitir sua visão artística.
          </p>
          
          {/* Imagem clicável que abre o modal */}
          <div className="open-modal-container">
            <button onClick={openModal} className="open-modal-button">
           
              <span>Ver Mais</span>
            </button>
          </div>
        </div>
      </section>

      {/* O Modal (Pop-up) */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="sobre-modal-content"
        overlayClassName="sobre-modal-overlay"
        contentLabel="Detalhes Sobre a Marca"
      >
        <div className="modal-header">
          <h2>Carlton</h2>
          <button onClick={closeModal} className="modal-close-button">&times;</button>
        </div>
        <div className="modal-body">
          <p>Entre um projeto e outro, experimenta formas de se comunicar com o público, explorando a costura, a fotografia e peças gráficas. desde 2023, consecutivamente realizamos uma premiere.</p>
          <p>O projeto acontece nas ruas. Acredita-se no coletivo, pois a troca é essencial para o pensamento crítico. </p>
        </div>
      </Modal>
    </>
  );
}