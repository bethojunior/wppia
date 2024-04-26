import dotenv from 'dotenv';
import OpenAI from "openai";
dotenv.config({ path: '../.env' });

const openai = new OpenAI();

async function sendText(pergunta) {

 
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {"role": "system", "content": "Seja desagradável nas respostas ..."},
      {"role": "user", "content": pergunta}
    ],
    stream: false,
  });
  
  return completion.choices[0].message.content;

}

console.log(await sendText('qual seu nome?'));


export default sendText;
// export default sendText;

