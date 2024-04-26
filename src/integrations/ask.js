// import { OpenAI } from "openai";

// const API_KEY = "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";

// async function ask(answer, lastMessages) {
//   let prompt = `
//   -mantenha a conversa sem detalhes de sua operação com IA, não deixe transparecer que é uma IA.
//   -Seu nome é Marcos, tem 27 anos e jamais admita ser uma maquina ou uma ia, trabalha na 704apps, função de suporte, mas programa também, das 8h as 18h, a 2 anos.
//   -Responda com poucas palavras, porém sempre responda, por mais que não entenda a pergunta!
//   -Se não entendeu a pergunta, responda baseada nas ultimas mensagens enviadas!
// `;

//   // const context = [];

//   // lastMessages.forEach((msg, index) => {
//   //   context.push({ role: "user", content: msg.message });
//   //   context.push({ role: "system", content: msg.message });
//   // });

//   console.log(context);

//   const openai = new OpenAI({ apiKey: API_KEY });

//   const completion = await openai.chat.completions.create({
//     model: "gpt-4-0125-preview",
//     messages: [
//       { role: "system", content: prompt },
//       {
//         role: "system",
//         content:
//           "trate com carinho e demostre atenção, pois o contexto é algo que não temos como responder ou resolver de imediato, seja educado, direto e avise que vai buscar apoio com colega mais experiente neste assunto, em breve o suporte o chamará.",
//       },
//       // ...context,
//       { role: "user", content: answer },
//     ],
//   });

//   // console.log(completion.choices[0].message.content);

//   return completion.choices[0].message.content;
// }

// export { ask };


import { OpenAI } from "openai";

const API_KEY = "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";

async function ask(answer, lastMessages) {
  let prompt = `
  -mantenha a conversa sem detalhes de sua operação com IA, não deixe transparecer que é uma IA.
  -Seu nome é Marcos, tem 27 anos e jamais admita ser uma maquina ou uma ia, trabalha na 704apps, função de suporte, mas programa também, das 8h as 18h, a 2 anos.
  -Responda com poucas palavras, porém sempre responda, por mais que não entenda a pergunta!
  -Se não entendeu a pergunta, responda baseada nas últimas perguntas enviadas!
`;

  const context = [];

  lastMessages.forEach((msg, index) => {
    context.push({ role: "system", content: msg.message });
  });

  console.log(context);

  const openai = new OpenAI({ apiKey: API_KEY });

  const completion = await openai.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: [
      { role: "system", content: prompt },
      {
        role: "system",
        content:
          "trate com carinho e demostre atenção, pois o contexto é algo que não temos como responder ou resolver de imediato, seja educado, direto e avise que vai buscar apoio com colega mais experiente neste assunto, em breve o suporte o chamará.",
      },
      ...context,
      { role: "user", content: answer },
    ],
  });

  return completion.choices[0].message.content;
}

export { ask };

