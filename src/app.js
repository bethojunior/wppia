import venom from "venom-bot";
import express from "express";


const app = express();
app.use(express.json());

const randomSession = generateRanomSession();

let chatbotSessions = {};

const startVenomSession = (sessionId) => {
  venom
    .create(
      sessionId,
      (base64Qr, asciiQR) => {
        console.log('QRCode recebido, escaneie por favor...');
        if (!chatbotSessions[sessionId]) chatbotSessions[sessionId] = {};
        chatbotSessions[sessionId].qrCode = base64Qr;
      },
      (statusSession, session) => {
        console.log('Status da sessão:', statusSession);
      },
      {
        browserPathExecutable: '/usr/bin/chromium-browser', // browser executable path 
        headless: true,
        devtools: false,
        useChrome: false,
        debug: false,
        logQR: true,
        browserArgs: ['--no-sandbox'],
        refreshQR: 15000,
        autoClose: 60000,
        disableSpins: true
      }
    )
    .then((client) => {
      if (!chatbotSessions[sessionId]) chatbotSessions[sessionId] = {};
      chatbotSessions[sessionId].client = client;
      console.log(client)
      setupClient(client);
    })
    .catch((erro) => {
      console.log(erro);
    });
};

const setupClient = (client) => {
  client.onMessage((message) => {
    console.log("mensagem:",message)
    if (message.body === 'Hi' && message.isGroupMsg === false) {
      client.sendText(message.from, 'Welcome Venom 🕷');
    }
  });
};


function generateRanomSession() {
  var caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var tamanho = 8;
  var newString = "";

  for (var i = 0; i < tamanho; i++) {
    var indice = Math.floor(Math.random() * caracteres.length);
    newString += caracteres.charAt(indice);
  }

  return newString;
}




function start(){
  startVenomSession(randomSession);
  return `Session ${randomSession} started.`;
}


app.get('/', (req, res) => {
  const { sessionId } = randomSession;
  res.send({ "qrCode": chatbotSessions[sessionId] });
});


const PORT = process.env.PORT || 1907;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

start(randomSession);
