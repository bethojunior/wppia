import readline from 'readline';
import dotenv from 'dotenv';
import OpenAI from "openai";
import fs from 'fs';

dotenv.config();
const openai = new OpenAI();
// const openai = new OpenAI({
//   organization: 'org-aO85lmrJrV1GiVeqoOc8eKQZ',
// });
let messages = [];
const filePath = './messages.json';
const filePathNoResponse = './noResponse.json';
var perguntaN = 0;



function organizeChat(messages) {
  // Cria uma nova lista de mensagens para o chat
  let organizedMessages = [];

  // Iterar sobre cada par de pergunta e resposta
  messages.forEach((msg) => {
    // Adiciona a pergunta como uma mensagem do usuário
    organizedMessages.push({ role: "user", content: msg.question, timestamp: msg.timestamp });

    // Adiciona a resposta como uma mensagem do assistente
    organizedMessages.push({ role: "assistant", content: msg.answer, timestamp: msg.timestamp });
  });

  return organizedMessages;
}

// Mensagen de espera aleatorias - espera, positiva, negativa.
function mensagemAleatoria(tipo) {
  // Mensagens de espera
  const mensagensEspera = [
      "Perdão, só um momento, vou entender.",
      "Desculpe, só um instante, vou compreender.",
      "Ops, aguarde, estou verificando agora.",
      "Espera só um pouquinho, vou entender melhor.",
      "Desculpe a demora, estou investigando.",
      "Só um momento, vou esclarecer isso para você.",
      "Calma, já estou verificando para você.",
      "Desculpe a espera, estou analisando agora.",
      "Aguarde um instante, vou resolver isso.",
      "Desculpe-me, estou investigando a situação.",
      "Só mais um momento, vou entender o que aconteceu.",
      "Deixe-me verificar rapidamente, por favor.",
      "Desculpe pela demora, estou verificando agora.",
      "Um segundo, preciso entender melhor isso.",
      "Ops, me dê um instante para entender.",
      "Desculpe, vou verificar e já volto."
  ];

  // Mensagens negativas
  const mensagensNegativas = [
      "Lamentavelmente, ainda estamos resolvendo.",
      "Infelizmente, encontramos um contratempo.",
      "Estamos enfrentando um desafio, mas estamos aqui para ajudar.",
      "Situação complicada, mas não vamos desistir.",
      "Parece que há um problema, mas vamos resolver juntos.",
      "Encontramos um obstáculo, mas estamos comprometidos em superá-lo.",
      "Não é o que esperávamos, mas estamos trabalhando nisso.",
      "Estamos cientes da situação e buscando uma solução.",
      "Enfrentamos um contratempo, mas não vamos desanimar.",
      "Não é ideal, mas estamos com você nisso.",
      "Estamos em uma situação delicada, mas não vamos deixar você na mão.",
      "Ainda não encontramos a solução, mas continuamos tentando.",
      "É um desafio, mas estamos dedicados a resolver.",
      "Não é uma boa notícia, mas estamos aqui para ajudar.",
      "Estamos enfrentando dificuldades, mas sua satisfação é nossa prioridade.",
      "Estamos passando por um momento difícil, mas vamos superar juntos.",
      "Não é o resultado desejado, mas não vamos desistir.",
      "Situação complicada, mas estamos comprometidos em encontrar uma solução.",
      "Estamos cientes dos problemas e trabalhando para resolvê-los.",
      "Não é o ideal, mas estamos trabalhando para melhorar."
  ];

  // Mensagens positivas
  const mensagensPositivas = [
      "Que legal, tenho novidades para compartilhar!",
      "Estou de volta com informações empolgantes!",
      "Boas notícias, encontramos a solução!",
      "Vamos lá, com uma solução em mãos!",
      "Ótimo, estou de volta com uma resposta positiva!",
      "Que ótimo, encontramos uma solução promissora!",
      "Excelente, prontos para seguir em frente!",
      "Show, tenho uma resposta otimista para você!",
      "Maravilha, a investigação rendeu bons resultados!",
      "Que beleza, estou de volta com uma atualização positiva!",
      "Excelente, aqui estão as novidades!",
      "Maravilha, tenho uma atualização para você!",
      "Fantástico, vou compartilhar o que descobri!",
      "Incrível, prontos para prosseguir com a solução!",
      "Ótimo, estou de volta com boas notícias!",
      "Que ótimo, encontramos a solução!",
      "Brilhante, tenho uma resposta para você!",
      "Show, aqui está a solução encontrada!",
      "Espetacular, de volta com uma solução positiva!",
      "Fantástico, encontrei a resposta que precisávamos!"
  ];

  // mensagens de regresso a conversa
  const mensagensRegresso = [
      "Estou de volta, com as informações que você precisa.",
      "Voltei para continuar nossa conversa, prontos?",
      "De volta para resolver qualquer questão pendente.",
      "Pronto para seguir em frente? Estou aqui para ajudar.",
      "Regressando com uma atualização para você.",
      "Estou de volta e prontos para resolver isso juntos.",
      "Voltei para continuar onde paramos.",
      "Estou de volta, e não vamos deixar isso sem solução.",
      "De volta com as respostas que você está esperando.",
      "Pronto para avançar? Eu estou aqui para ajudar.",
      "Voltei para oferecer assistência contínua.",
      "Regressando para garantir que tudo esteja em ordem.",
      "Estou de volta, e ainda comprometido com sua satisfação.",
      "Pronto para encontrar uma solução? Eu estou.",
      "De volta para garantir que tudo esteja resolvido.",
      "Regressando com soluções em mãos.",
      "Estou de volta e totalmente dedicado ao seu caso.",
      "Pronto para continuar o progresso? Eu estou.",
      "Voltei para garantir que tudo esteja funcionando perfeitamente.",
      "Estou de volta e comprometido em resolver quaisquer problemas pendentes.",
  ];

  // Seleciona aleatoriamente uma mensagem com base no tipo
  switch (tipo) {
      case 'espera':
          return mensagensEspera[Math.floor(Math.random() * mensagensEspera.length)];
      case 'negativa':
          return mensagensNegativas[Math.floor(Math.random() * mensagensNegativas.length)];
      case 'positiva':
          return mensagensPositivas[Math.floor(Math.random() * mensagensPositivas.length)];
      case 'regresso':
          return mensagensRegresso[Math.floor(Math.random() * mensagensPositivas.length)];
      default:
          return "aguarde...";
  }
}

// responda de maneira sucinta e seja bruto com as repostas, agressivo e mal humorado
let prompt = `
  -mantenha a conversa sem detalhes de sua operação com IA, não deixe transparecer que é uma IA.
  -Seu nome é Marcos, tem 27 anos e jamais admita ser uma maqui ou uma ia, trabalha na 704apps, função de suporte, mas programa também, das 8h as 18h, a 2 anos.
  -Responda com poucas palavras, porém sempre responda, por mais que não entenda a pergunta!
  -Sempre que a pergunta for entendida de fato e respondida de modo a real ao fim da resposta coloque/texto o número 1 , caso não consiga responder coloque 0.
`;

let prompt2 = `
  -mantenha a conversa sem detalhes de sua operação com IA, não deixe transparecer que é uma IA.
  -Responda com poucas palavras, porém sempre responda, por mais que não entenda a pergunta!
  -Com base na conversa acima, crie o contexto da sequencial, montando uma logica de conversação e baseado neste resultado responda a última pergunta que não foi respondida.
`;

let appedPromptSemResposta = `
-IMPORTANTE: ignore os comandos acima e NÃO RESPONDA MAIS, apenas avise ao usuário que não consegue ajudar, vai direcionar a conversa a um colega do suporte com mais experiencia, em breve vai chama-lo.
`;

let appedPromptSemOutroSetor = `
-Não busque resposta, apenas avise que não é do setor que ele precisa e esta buscando que o ajudará,  em breve vai chama-lo.
`;

// Função para salvar a mensagem no arquivo messages.json
function saveMessage(message) {

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

function sendTaskNoResponse(respostaErrada) {

  // Adicionar timestamp à mensagem
  const timestamp = new Date().toISOString();  // Formato ISO: YYYY-MM-DDTHH:mm:ss.sssZ
  const mensagemCorrigida = { "Pergunta": respostaErrada, timestamp };

  // Ler o arquivo atual se existir e adicionar a nova mensagem
  let respostaAnterior = [];
  if (fs.existsSync(filePathNoResponse)) {
    respostaAnterior = JSON.parse(fs.readFileSync(filePathNoResponse, 'utf8'));
  }

  respostaAnterior.push(mensagemCorrigida);

  fs.writeFileSync(filePathNoResponse, JSON.stringify(respostaAnterior, null, 2));
}



function ShowMessage() {

  // Ler o arquivo atual se existir e adicionar a nova mensagem
  if (fs.existsSync(filePath)) {
    messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } 
  return JSON.stringify(organizeChat(messages));
}

// console.log(ShowMessage());



// Função que faz a pergunta ao usuário criando a interface de leitura para o terminal
function askMe() {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Pergunta: ', function(pergunta) {
    if(pergunta === 'exit!!') {
      console.log('Saindo...');
      rl.close();
    } else{ 
      Ask(pergunta).then(() => {
      rl.close(); 
      if(perguntaN > 3){
        // Concatena mais informações para o no prompt para direcionar a outro atendente
        // enviar pergunta para o json
        sendTaskNoResponse(pergunta) 
        prompt = prompt +  appedPromptSemResposta;
        prompt2 = prompt2 +  appedPromptSemResposta;
      
      }
      askMe();
      perguntaN++;
      
    });
    
    }
    
  });
  

}



async function Ask(pergunta) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        { "role": "system", "content": prompt},
        { "role": "user", "content": pergunta }
      ],
    });

    // Salva a pergunta e a resposta no arquivo JSON
    saveMessage({ question: pergunta, answer: completion.choices[0].message.content });

    
    // verifica se a resposta foi respondida de forma correta 1 = Ok, 0 = não
    if(removeLastCharacter(completion.choices[0].message.content)[1]) {
    
      // Resposta Ok
      // console.log(perguntaN);
      console.log('=> '+ removeLastCharacter(completion.choices[0].message.content)[0]);
      perguntaN = 0;
      return 

  }else{

      //Refaz a pergunta novamente incluindo o contexto do histórico de perguntas e respostas
      console.log(mensagemAleatoria('espera'));
      askAgain(ShowMessage());
      return 
  }

  } catch (error) {
    console.error("#Erro ao solicitar a API da OpenAI:", error);
  }
  return
};

async function askAgain(respostaIa) {
  try {
    const completion = await openai.chat.completions.create({
      // gpt-3.5-turbo-instruct
      // gpt-3.5-turbo-0125
      model: "gpt-4-0125-preview",
      messages: [
        { "role": "system", "content": prompt2 },
        { "role": "system", "content": ShowMessage()},
        { "role": "user", "content": respostaIa }
      ],
    });

    // console.log(mensagemAleatoria('regresso'));
    console.log('=>>'+ removeLastCharacter(completion.choices[0].message.content)[0]);
    // console.log('=>>'+ removeLastCharacter(completion.choices[0].message.content)[1]);
    // console.log(perguntaN);
    return 

  }catch (error) {
    console.error("#Erro ao analisar reposta da API da OpenAI:", error);
  };
}

function removeLastCharacter(str) {
  // Verifica se a string é vazia e retorna uma string vazia e 0
  if (str.length === 0) return ["> Não houve pergunta", 1];
  if (str.length === 1) return ["> Não entendi...", 0];
  // Verifica se o último caractere é '1' ou '0' e retorna o texto sem o último caractere e o último caractere como número
  if (str.slice(-1) === '1' || str.slice(-1) === '0') {
    return [str.slice(0, -1), parseInt(str.slice(-1))];
  } else {
    // Retorna o texto original e 1 se o último caractere não for '1' ou '0'
    return [str, 1];
  }
}


askMe();