import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();
// const openai = new OpenAI();


const openai = new OpenAI({
  organization: 'org-aO85lmrJrV1GiVeqoOc8eKQZ',
});

// ID do Assistente configurado diretamente
const assistant_Id = "asst_7V0RVlNUbprrzuZ0TGZbI3yg";  // Substitua com o ID real do seu assistente

async function interactWithAssistant(assistantId) {
    try {
      // Supondo que exista um método para iniciar uma sessão de conversa com um assistente específico
      const thread = await openai.chat.completions.create({
        model: "gpt-4-0125-preview",
          // Passar o assistantId como parte do objeto de configuração
        messages: [
          {
            
            role: "user",
            content: "crie 3 nome para dogs",
          }
        ]
      });
  
      console.log("Resposta do Assistente:", thread.choices[0].message.content);
    } catch (error) {
      console.error("Erro ao interagir com o assistente:", error);
    }
  }
  

  
async function main() {
  await interactWithAssistant(assistant_Id);
}

main();
