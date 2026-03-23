"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeQuestion, addQuestion, Question } from '../lib/store';
import QuestionCard from '../components/QuestionCard';
import './home.css';

export default function Home() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [context, setContext] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assignedQuestion, setAssignedQuestion] = useState<Question | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate AI thinking
    const sector = await analyzeQuestion(text, context);
    
    // Create new question
    const newQ = addQuestion({ text, context, assignedSector: sector });
    
    setAssignedQuestion(newQ);
    setIsAnalyzing(false);
    
    // After 2.5 seconds, redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 2500);
  };

  return (
    <div className="home-container animate-fade-in">
      <div className="hero-section text-center">
        <h1 className="hero-title">
          Olá! <br /> Como a <span>IA</span> pode ajudar você hoje?
        </h1>
        <p className="hero-subtitle">
          Descreva sua dúvida detalhadamente. Nosso agente irá analisar o contexto
          e direcionar automaticamente para o setor correto (TI, RH, Marketing, Financeiro, Comercial, Operacoes ou Juridico).
        </p>
      </div>

      <div className="content-grid">
        <div className="glass form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="text">Resumo do Problema / Dúvida</label>
              <input
                id="text"
                type="text"
                className="input-field"
                placeholder="Ex: Como configuro a impressora no meu computador?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isAnalyzing || !!assignedQuestion}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="context">Contexto Adicional (Opcional)</label>
              <textarea
                id="context"
                className="input-field textarea-field"
                placeholder="Detalhe o contexto para ajudar a IA na triagem (Ex: Estou no 2º andar e a impressora não pisca).."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                disabled={isAnalyzing || !!assignedQuestion}
                rows={4}
              />
            </div>

            <button 
              type="submit" 
              className={`btn-primary submit-btn ${isAnalyzing ? 'analyzing' : ''}`}
              disabled={isAnalyzing || !!assignedQuestion || !text.trim()}
            >
              {isAnalyzing ? (
                <>
                  <span className="spinner"></span>
                  Analisando Contexto via IA...
                </>
              ) : assignedQuestion ? (
                'Enviado com Sucesso! ✓'
              ) : (
                'Enviar para Triagem Inteligente'
              )}
            </button>
          </form>
        </div>

        {assignedQuestion && (
          <div className="result-container animate-fade-in">
            <div className="success-message">
              <span className="success-icon">✨</span>
              <h3>Triagem Concluída!</h3>
              <p>Sua análise foi processada usando as keywords predefinidas.</p>
            </div>
            <div className="preview-card">
              <QuestionCard question={assignedQuestion} />
            </div>
            <p className="redirect-text">Redirecionando para as mesas das equipes...</p>
          </div>
        )}
      </div>
    </div>
  );
}
