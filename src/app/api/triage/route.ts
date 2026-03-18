import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  if (!genAI) {
    console.warn('GOOGLE_API_KEY is not configured in the environment variables.');
    // Keep it running without crashing, return a fallback.
    return NextResponse.json({ sector: 'Desconhecido', error: 'API Key missing' });
  }

  try {
    const body = await req.json();
    const { text, context } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `
Você é um agente especialista em triagem de chamados. Sua tarefa é classificar a solicitação do usuário em APENAS UM dos seguintes setores: 'TI', 'RH', 'Financeiro', 'Marketing' ou 'Desconhecido'.
Não explique o motivo, responda APENAS com o nome exato do setor.

Contexto da solicitação:
${context || 'Nenhum contexto adicional'}

Solicitação do usuário:
${text}

Setor:
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    const validSectors = ['TI', 'RH', 'Financeiro', 'Marketing'];
    let finalSector = 'Desconhecido';
    
    for (const sector of validSectors) {
      if (responseText.toUpperCase().includes(sector.toUpperCase())) {
        finalSector = sector;
        break;
      }
    }

    return NextResponse.json({ sector: finalSector });

  } catch (error) {
    console.error('Error generating triage result:', error);
    return NextResponse.json({ sector: 'Desconhecido' });
  }
}
