import React from 'react';
import { Sector, Question } from '../lib/store';
import QuestionCard from './QuestionCard';
import './components.css';

interface Props {
  sector: Sector;
  questions: Question[];
}

export default function SectorBoard({ sector, questions }: Props) {
  const sectorClass = `sector-board-${sector.toLowerCase()}`;
  
  return (
    <div className={`glass sector-board ${sectorClass} animate-fade-in`}>
      <div className="sector-header">
        <h2 className={`sector-title title-${sector.toLowerCase()}`}>{sector}</h2>
        <span className="sector-count">{questions.length}</span>
      </div>
      <div className="sector-content">
        {questions.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma pergunta no momento</p>
          </div>
        ) : (
          questions.map(q => (
            <QuestionCard key={q.id} question={q} />
          ))
        )}
      </div>
    </div>
  );
}
