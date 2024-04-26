import venom from "venom-bot";
import express from "express";


const app = express();
app.use(express.json());

const randomSession = "heghbertho";

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
        browserPathExecutable: '/usr/bin/chromium-browser',
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



app.get('/', (req, res) => {
  res.send({ "qrCode": chatbotSessions });
});

app.get('/qrcode', (req, res) => {
  res.send({ "qrCode": chatbotSessions[randomSession].qrCode });
});

const PORT = process.env.PORT || 1907;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startVenomSession(randomSession);
