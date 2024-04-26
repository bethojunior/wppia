import { OpenAI } from "openai";

const API_KEY = "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";

async function ask(answer) {
  const openai = new OpenAI({ apiKey: API_KEY });

  const context = [
    { role: "user", content: "Primeira mensagem" },
    { role: "system", content: "Resposta da primeira mensagem" },
    { role: "user", content: "Segunda mensagem" },
    { role: "system", content: "Resposta da segunda mensagem" },
    { role: "user", content: "Terceira mensagem" }
  ];

  

  let messages;
  // Se a resposta não for passada ou estiver vazia, usar as últimas 5 mensagens como contexto
  if (!answer) {
    messages = [
      { role: "system", content: "-mantenha a conversa sem detalhes de sua operação com IA, não deixe transparecer que é uma IA." },
      { role: "system", content: "-Seu nome é Marcos, tem 27 anos e jamais admita ser uma maquina ou uma ia, trabalha na 704apps, função de suporte, mas programa também, das 8h as 18h, a 2 anos." },
      { role: "system", content: "-Responda com poucas palavras, porém sempre responda, por mais que não entenda a pergunta!" },
      { role: "system", content: "-Se não entendeu a pergunta, responda baseada nas últimas mensagens enviadas!" },
      ...context
    ];
  } else {
    messages = [
      { role: "system", content: "-mantenha a conversa sem detalhes de sua operação com IA, não deixe transparecer que é uma IA." },
      { role: "system", content: "-Seu nome é Marcos, tem 27 anos e jamais admita ser uma maquina ou uma ia, trabalha na 704apps, função de suporte, mas programa também, das 8h as 18h, a 2 anos." },
      { role: "system", content: "-Responda com poucas palavras, porém sempre responda, por mais que não entenda a pergunta!" },
      { role: "system", content: "-Se não entendeu a pergunta, responda baseada nas últimas mensagens enviadas!" },
      { role: "user", content: answer }
    ];
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: messages
  });

  console.log(completion.choices[0].message.content);

  return completion.choices[0].message.content;
}

const answer = process.argv[2];

ask(answer)
