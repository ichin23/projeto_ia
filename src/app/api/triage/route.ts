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
      Você é um agente especialista em triagem de chamados corporativos. 
      Sua tarefa é classificar a solicitação do usuário em APENAS UM dos seguintes setores: 'TI', 'RH', 'Financeiro', 'Marketing', 'Comercial', 'Operacoes', 'Juridico' ou 'Desconhecido'.
      
      Diretrizes de Classificação:
      - 'TI': Problemas técnicos em equipamentos (computadores, impressoras), falhas em sistemas/softwares internos, problemas de rede/internet, ou solicitação de acessos.
      - 'Marketing': Campanhas publicitárias, redes sociais (Instagram, Facebook), criação de conteúdo, eventos externos, branding e comunicação externa.
      - 'RH': Folha de pagamento, férias, benefícios, recrutamento, treinamentos corporativos.
      - 'Financeiro': Pagamentos, reembolsos, faturamento, notas fiscais, orçamentos.
      - 'Comercial': Propostas para clientes, negociação de contratos, metas de vendas, pipeline, CRM e dúvidas sobre atendimento comercial.
      - 'Operacoes': Logística interna, processos operacionais, produção, estoque, compras operacionais e execução do dia a dia.
      - 'Juridico': Contratos, compliance, LGPD, análise de riscos legais, notificações e pareceres jurídicos.
      
      Não explique o motivo, responda APENAS com o nome exato do setor.

      Contexto da solicitação:
      ${context || 'Nenhum contexto adicional'}

      Solicitação do usuário:
      ${text}

      Setor:
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const validSectors = ['TI', 'RH', 'Financeiro', 'Marketing', 'Comercial', 'Operacoes', 'Juridico'];
    let finalSector = 'Desconhecido';

    if (validSectors.includes(responseText)) {
      finalSector = responseText;
    }

    return NextResponse.json({ sector: finalSector });

  } catch (error) {
    console.error('Error generating triage result:', error);
    return NextResponse.json({ sector: 'Desconhecido' });
  }
}
