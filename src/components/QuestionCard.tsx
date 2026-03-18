import React from 'react';
import { Question } from '../lib/store';
import './components.css';

interface Props {
  question: Question;
}

export default function QuestionCard({ question }: Props) {
  const date = new Date(question.createdAt).toLocaleDateString('pt-BR', {
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
  });
  
  // Assign a specific color class based on the sector for a subtle border or glow
  const sectorClass = `card-sector-${question.assignedSector.toLowerCase()}`;

  return (
    <div className={`glass glass-interactive question-card animate-fade-in ${sectorClass}`}>
      <div className="card-header">
        <span className="card-id">#{question.id.substring(0, 5)}</span>
        <span className="card-time">{date}</span>
      </div>
      <h3 className="card-text">{question.text}</h3>
      {question.context && (
        <p className="card-context">{question.context}</p>
      )}
      <div className="card-footer">
        <span className={`sector-badge sector-${question.assignedSector.toLowerCase()}`}>
          {question.assignedSector}
        </span>
      </div>
    </div>
  );
}
