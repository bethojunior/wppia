

//Como Usar 
//#script para testar a chave que esta vindo do .env, pode chamar o script direto ou após o comando no terminal incluir uma pergunta. 


import dotenv from 'dotenv';
import OpenAI from "openai";
dotenv.config({ path: '../.env' });

const openai = new OpenAI();
// let msg = 'ha problemas de chave ou créditos nesta chave openai?';
let msg = process.argv[2] || 'ha problemas de chave ou créditos nesta chave openai?,';


async function sendText(pergunta) {

 
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {"role": "system", "content": "seja hostil nas respostas, use palavreado chucro, use resposta curtas entre 3 e 10 palavras e objetivas !"},
      {"role": "user", "content": pergunta}
    ],
    stream: false,
  });
  
  return completion.choices[0].message.content;

}

console.log(await sendText(msg));



