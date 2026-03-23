export type Sector =
  | 'TI'
  | 'RH'
  | 'Financeiro'
  | 'Marketing'
  | 'Comercial'
  | 'Operacoes'
  | 'Juridico'
  | 'Desconhecido';

export interface Question {
  id: string;
  text: string;
  context: string;
  assignedSector: Sector;
  createdAt: number;
}

export const getQuestions = (): Question[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('triage_questions');
  return stored ? JSON.parse(stored) : [];
};

export const addQuestion = (question: Omit<Question, 'id' | 'createdAt'>): Question => {
  const newQuestion: Question = {
    ...question,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  const questions = getQuestions();
  questions.unshift(newQuestion); // Add to beginning
  if (typeof window !== 'undefined') {
    localStorage.setItem('triage_questions', JSON.stringify(questions));
  }
  return newQuestion;
};

export const analyzeQuestion = async (text: string, context: string): Promise<Sector> => {
  try {
    const response = await fetch('/api/triage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, context }),
    });

    if (!response.ok) {
      console.error('Failed to analyze question with AI');
      return 'Desconhecido';
    }

    const data = await response.json();
    return (data.sector as Sector) || 'Desconhecido';
  } catch (error) {
    console.error('Error calling triage API:', error);
    return 'Desconhecido';
  }
};
