/* Site realizado 100% por Nicolas Arantes https://www.linkedin.com/in/nicolasarantes*/

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./EntryPage.css";


export function EntryPage() {
  const targetDate = new Date("September 1, 2025 00:00:00").getTime();
  
  // CORREÇÃO AQUI: Definimos o estado inicial com o tempo restante real.
  const [timeRemaining, setTimeRemaining] = useState(targetDate - new Date().getTime());

  useEffect(() => {
    // A cada 1 segundo, recalcula o tempo restante
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeRemaining(0);
      } else {
        setTimeRemaining(difference);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  const formatTime = (value) => value.toString().padStart(2, '0');

  return (
    <main className="entry-page-container">
      <div className="entry-content-centered">
        <h1 className="entry-title">Carlton</h1>
        <div className="entry-buttons">
          {timeRemaining <= 0 ? (
            <Link to="/home#inicio" className="entry-link">
              AudioNoiseSkateVisual
            </Link>
          ) : (
            <div className="countdown-timer">
              <div className="timer-item">
                <span className="timer-value">{formatTime(days)}</span>
                <span className="timer-label">Dias</span>
              </div>
              <div className="timer-item">
                <span className="timer-value">{formatTime(hours)}</span>
                <span className="timer-label">Horas</span>
              </div>
              <div className="timer-item">
                <span className="timer-value">{formatTime(minutes)}</span>
                <span className="timer-label">Minutos</span>
              </div>
              <div className="timer-item">
                <span className="timer-value">{formatTime(seconds)}</span>
                <span className="timer-label">Segundos</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}