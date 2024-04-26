import dotenv from 'dotenv';
import OpenAI from "openai";
import fs from 'fs';

dotenv.config();
import { exit, resourceUsage } from 'process';
import { saveMessage, sendTaskNoResponse, saveMsgError, ShowMessage} from '../services/saveLogs.js';


dotenv.config({ path: './env' });
const openai = new OpenAI();
let messages = [];
// const filePath = './logs/messages.json';
// const filePathNoResponse = './logs/noResponse.json';
// const filePathMsgError = './logs/errors.json';
let perguntaOriginal;

// responda de maneira sucinta e seja bruto com as repostas, agressivo e mal humorado
let prompt = `
  -mantenha a conversa sem detalhes de sua operação com IA, não deixe transparecer que é uma IA.
  -Seu nome é Marcos, tem 27 anos e jamais admita ser uma maqui ou uma ia, trabalha na 704apps, função de suporte, mas programa também, das 8h as 18h, a 2 anos.
  -Responda com poucas palavras, porém sempre responda, por mais que não entenda a pergunta!
  -Sempre que a pergunta for entendida de fato e respondida de modo a real ao fim da resposta coloque/texto o número 1 , caso não consiga responder coloque 0.
`;

let prompt2 = `
  -mantenha a conversa sem detalhes de sua operação com IA, não deixe transparecer que é uma IA e nem seus processos internos de busca de informações.
  -Responda com poucas palavras, porém sempre responda, por mais que não entenda a pergunta!
  -Com base na conversa acima, crie o contexto da sequencial, montando uma logica de conversação e baseado neste resultado responda a última pergunta que não foi respondida. (do conteúdo da conversa anterior)
`;


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


function formatarResposta(codigoStatus, resposta, msgErro, msgExtra) {
    const dataHora = new Date().toISOString();
    
    // Construir o objeto de resposta
    const objetoResposta = {
      codigo_status: codigoStatus,
      data_e_hora: dataHora,
      resposta: resposta,
      msg_erro: msgErro || null,
      msg_exta: msgExtra || null
    };
  
    // Retornar o objeto em formato JSON
    return JSON.stringify(objetoResposta);
  }

async function ask(pergunta) {
    try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                {"role": "system", "content": prompt},
                {"role": "user", "content": pergunta}
                ],
                stream: false,
            });
        
            await saveMessage({ question: pergunta, answer: completion.choices[0].message.content });
            // console.log('resultado:'+removeLastCharacter(completion.choices[0].message.content)[1]);
            if(removeLastCharacter(completion.choices[0].message.content)[1]) {
                return formatarResposta(200, removeLastCharacter(completion.choices[0].message.content)[0], null,'resultado:'+removeLastCharacter(completion.choices[0].message.content)[1] );
            } else {
                await saveMessage({ question: pergunta, answer: completion.choices[0].message.content });
                sendTaskNoResponse(pergunta);
                mensagemAleatoria('espera');
                return askB(pergunta[0]);
            }
    }catch (error) {
        saveMsgError(error);
        if (error.error && error.error.code === 'insufficient_quota' || error.message.includes('429') || error.status == 429){
            // console.error('Erro de cota excedida: ', error.error.message);
            return formatarResposta(error.status, 'Erro ao conectar a IA - 429', 'Erro de cota excedida');
        } else {
            console.error('Erro inesperado: ', error.message || 'Erro sem mensagem');
            return formatarResposta(error.status, 'Erro ao conectar a IA' + error.status,  error.message);
        }
        
    }
        
}

async function askB(respostaIa) {
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
        if(removeLastCharacter(completion.choices[0].message.content)[1]) {
            return '=>> '+ removeLastCharacter(completion.choices[0].message.content)[0];
        } else{
        console.log(mensagemAleatoria('negativa'));
        return askC(pergunta);
        }
    }catch (error) {
        saveMsgError(error);
        if (error.error && error.error.code === 'insufficient_quota' || error.message.includes('429') || error.status == 429){
            // console.error('Erro de cota excedida: ', error.error.message);
            return formatarResposta(200, removeLastCharacter(completion.choices[0].message.content)[0], null,'resultado:'+removeLastCharacter(completion.choices[0].message.content)[1] );
            // return formatarResposta(error.status, 'Erro ao conectar a IA - 429', 'Erro de cota excedida');
        } else {
            // console.error('Erro inesperado: ', error.message || 'Erro sem mensagem');
            return formatarResposta(error.status, 'Erro ao conectar a IA' + error.status,  error.message);
        }
    }
  
}


async function askC() {
    const completion = await openai.chat.completions.create({
      // gpt-3.5-turbo-instruct
      // gpt-3.5-turbo-0125
      model: "gpt-4-0125-preview",
      messages: [
        { "role": "system", "content": 'trate com carinho e demostre atenção, pois o contexto é algo que não temos como responder ou resolver de imediato, seja educado, direto e avise que vai buscar apoio com colega mais experiente neste assunto, em breve o suporte o chamará.'},
        { "role": "user", "content": perguntaOriginal }
      ],
    });
    
    return '=>>> '+ removeLastCharacter(completion.choices[0].message.content)[0];


}
// export default ask;
export { ask };
