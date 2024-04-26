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
        browserArgs: ['--no-sandbox'],
        refreshQR: 15000,
        autoClose: 60000,
        disableSpins: true
      }
    )
    .then((client) => {
      chatbotSessions[sessionId].client = client; // Changed to sessionId
      console.log(client);
      setupClient(client);
    })
    .catch((error) => {
      console.log(error);
    });
};

const setupClient = (client) => {
  client.onMessage((message) => {
    console.log("mensagem:", message);
    if (message.body === 'Hi' && message.isGroupMsg === false) {
      client.sendText(message.from, 'Welcome Venom 🕷');
    }
  });
};

app.get('/', (req, res) => {
  res.send({ "qrCode": chatbotSessions });
});

app.get('/qrcode', (req, res) => {
  if (chatbotSessions[randomSession] && chatbotSessions[randomSession].qrCode) {
    res.send({ "qrCode": chatbotSessions[randomSession].qrCode });
  } else {
    res.status(404).send("QR code not found");
  }
});

const PORT = process.env.PORT || 1907;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startVenomSession(randomSession);
