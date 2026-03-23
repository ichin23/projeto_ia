"use client";

import React, { useEffect, useState } from 'react';
import { getQuestions, Question, Sector } from '../../lib/store';
import SectorBoard from '../../components/SectorBoard';
import './dashboard.css';

export default function Dashboard() {
  const [questions, setQuestions] = useState<Question[]>(() => getQuestions());

  useEffect(() => {
    // Optional: add interval to poll if multiple tabs are open
    const interval = setInterval(() => {
      setQuestions(getQuestions());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const sectors: Sector[] = [
    'TI',
    'RH',
    'Financeiro',
    'Marketing',
    'Comercial',
    'Operacoes',
    'Juridico',
  ];

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <h2>Dashboard de Setores</h2>
        <p>Acompanhamento das triagens realizadas pelo Agente de IA</p>
      </div>
      
      <div className="board-grid">
        {sectors.map(sector => (
          <SectorBoard 
            key={sector} 
            sector={sector} 
            questions={questions.filter(q => q.assignedSector === sector)} 
          />
        ))}
      </div>
    </div>
  );
}
