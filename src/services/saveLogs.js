// #Scrip para salvar logs de mensagens, perguntas não respondidas e erros
import fs from 'fs';
import { exit, resourceUsage } from 'process';

const filePath = './src/logs/messages.json';
const filePathNoResponse = './src/logs/noResponse.json';
const filePathMsgError = './src/logs/errors.json';
let messages = [];

async function saveMessage(message) {

    // Adicionar timestamp à mensagem
    const timestamp = new Date().toISOString();  // ISO format: YYYY-MM-DDTHH:mm:ss.sssZ
    const messageWithTimestamp = { ...message, timestamp };
  
    // Ler o arquivo atual se existir e adicionar a nova mensagem
    if (fs.existsSync(filePath)) {
      messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  
  
    messages.push(messageWithTimestamp);
  
    // Manter apenas as últimas 5 mensagens
    if (messages.length > 20) {
      messages = messages.slice(-20);
    }
  
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
    return
  }

  async  function sendTaskNoResponse(respostaErrada) {

    // Adicionar timestamp à mensagem
    const timestamp = new Date().toISOString();  // Formato ISO: YYYY-MM-DDTHH:mm:ss.sssZ
    const mensagemCorrigida = { "Pergunta não respondida :": respostaErrada, timestamp };
  
    // Ler o arquivo atual se existir e adicionar a nova mensagem
    let respostaAnterior = [];
    if (fs.existsSync(filePathNoResponse)) {
      respostaAnterior = JSON.parse(fs.readFileSync(filePathNoResponse, 'utf8'));
    }
  
    respostaAnterior.push(mensagemCorrigida);
  
    fs.writeFileSync(filePathNoResponse, JSON.stringify(respostaAnterior, null, 2));
  }

  async  function __Melhoria_Andamento__sendTaskNoResponse(respostaErrada) {

    const timestamp = new Date().toISOString();  // Formato ISO: YYYY-MM-DDTHH:mm:ss.sssZ

    // Ler o arquivo atual se existir
    let respostaAnterior = [];
    if (fs.existsSync(filePathNoResponse)) {
      respostaAnterior = JSON.parse(fs.readFileSync(filePathNoResponse, 'utf8'));
    }
  
    // Verificar se a pergunta já existe no arquivo
    let encontrou = false;
    respostaAnterior.forEach(item => {
      if (item.pergunta === respostaErrada) {
        encontrou = true;
        item.quantidade += 1;  // Incrementar o contador de ocorrências
        item.ultimo_timestamp = timestamp;  // Atualizar o timestamp
      }
    });
  
    // Se a pergunta não foi encontrada, adicioná-la como nova entrada
    if (!encontrou) {
      respostaAnterior.push({
        pergunta: respostaErrada,
        quantidade: 1,
        primeiro_timestamp: timestamp,
        ultimo_timestamp: timestamp
      });
    }
  
    // Escrever os dados atualizados de volta ao arquivo
    fs.writeFileSync(filePathNoResponse, JSON.stringify(respostaAnterior, null, 2));
  
}


async function saveMsgError(txt_erros) {

    let txt_existente = [];
    
    // Adicionar timestamp ao erro
    const novoErro = {
        mensagem: txt_erros
    };

    // Verificar se o arquivo existe e ler os erros existentes, se houver
    if (fs.existsSync(filePathMsgError)) {
        txt_existente = JSON.parse(fs.readFileSync(filePathMsgError, 'utf8'));
        txt_existente.push(novoErro);
    }



    // Adicionar o novo erro ao array de erros existentes
    

    // Escrever todos os erros de volta no arquivo, incluindo o novo erro
    fs.writeFileSync(filePathMsgError, JSON.stringify(txt_existente, null, 2));

    return;
  }
  
  function ShowMessage() {
  
    // Ler o arquivo atual se existir e adicionar a nova mensagem
    if (fs.existsSync(filePath)) {
      messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } 
    return JSON.stringify(messages);
  }
  
export { saveMessage, sendTaskNoResponse, __Melhoria_Andamento__sendTaskNoResponse, saveMsgError, ShowMessage };