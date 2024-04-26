// import venom from "venom-bot";
// import express from "express";

// const app = express();
// app.use(express.json());

// const randomSession = "heghbertho";

// let chatbotSessions = {};

// const startVenomSession = (sessionId) => {
//   venom
//     .create(
//       sessionId,
//       (base64Qr, asciiQR) => {
//         console.log('QRCode recebido, escaneie por favor...');
//         if (!chatbotSessions[sessionId]) chatbotSessions[sessionId] = {};
//         chatbotSessions[sessionId].qrCode = base64Qr;
//       },
//       (statusSession, session) => {
//         console.log('Status da sessão:', statusSession);
//       },
//       {
//         browserArgs: ['--no-sandbox'],
//         refreshQR: 15000,
//         autoClose: 60000,
//         disableSpins: true
//       }
//     )
//     .then((client) => {
//       chatbotSessions[sessionId].client = client;
//       console.log(client);
//       setupClient(client);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

// const setupClient = (client) => {
//   client.onMessage((message) => {
//     console.log("mensagem:", message);
//     if (message.body === 'Hi' && message.isGroupMsg === false) {
//       client.sendText(message.from, 'Welcome Venom 🕷');
//     }
//   });
// };

// app.get('/', (req, res) => {
//   res.send({ "qrCode": chatbotSessions });
// });

// app.get('/qrcode', (req, res) => {
//   if (chatbotSessions[randomSession] && chatbotSessions[randomSession].qrCode) {
//     res.send({ "qrCode": chatbotSessions[randomSession].qrCode });
//   } else {
//     res.status(404).send("QR code not found");
//   }
// });

// const PORT = process.env.PORT || 1907;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// startVenomSession(randomSession);


// import express from "express";
// import { VenomBot } from "./bootstrap/venom/venom.js";
// import { stages, getStage } from "./stages/stages.js";



// const app = express();
// app.use(express.json());

// let chatbotSessions = {};

// const main = async () => {
//   try {
//     let firstPass = `
//  _____________________________________________________________________________
// |                                                                             |
// |                                                                             |
// |                        🚀  VENOM STARTED 🚀                                 |
// |                                                                             |
// |                                                                             |
// |_____________________________________________________________________________|
// \n
// `;

//     console.log(firstPass);

//     const venombot = await VenomBot.getInstance().init({
//       session: "heghbertho",
//       headless: false,
//       useChrome: false,
//       disableWelcome: true,
//       browserArgs:[ "/usr/bin/google-chrome-stable"],
//       browserPathExecutable: '/usr/bin/chromium-browser',
//       headless: true,
//       devtools: false,
//       useChrome: false,
//       debug: false,
//       logQR: true,
//       browserArgs: ['--no-sandbox'],
//       refreshQR: 15000
//     });

//     let secondPass = `
//  _____________________________________________________________________________
// |                                                                             |
// |                                                                             |
// |                        ⚡️⚡️ VENOM INITIALIZED ⚡️⚡️                              |
// |                                                                             |
// |                                                                             |
// |_____________________________________________________________________________|
// \n
// `;

//     console.log(secondPass);

//     venombot.onMessage(async (message) => {
//       let thirdPass = `
//  _____________________________________________________________________________
// |                                                                             |
// |                                                                             |
// |                   👀 LISTENING ALL MESSAGES 👀                              |
// |                                                                             |
// |                                                                             |
// |_____________________________________________________________________________|
// \n
// `;

//       console.log(thirdPass);

//       const currentStage = getStage({ from: message.from });

//       await stages[currentStage].stage.exec({
//         from: message.from,
//         message: message.body,
//       });

//       let lastPass = `
//  __________________________________________________________________________________
// |                                                                                  |
// |                                                                                  |
// |          Message: "${message.body}"\n                                            |
// |          sent from: "${message.from}"                                            |
// |                                                                                  |
// |                                                                                  |
// |__________________________________________________________________________________|
// `;

//       console.log(lastPass);
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };


// const PORT = process.env.PORT || 1907;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// app.get('/', (req, res) => {
//   res.send({ "qrCode": chatbotSessions });
// });

// main(randomSession);


import express from "express";
import { VenomBot } from "./bootstrap/venom/venom.js";
import { stages, getStage } from "./stages/stages.js";

const app = express();
app.use(express.json());

let chatbotSessions = {};

const startVenomSession = async (sessionId) => {
  try {
    const venombot = await VenomBot.getInstance().init({
      session: sessionId,
      headless: true,
      useChrome: false,
      disableWelcome: true,
      browserArgs: ['--no-sandbox'],
      refreshQR: 15000
    });

    venombot.onStateChange((state) => {
      if (state === "qrRead") {
        const qrCode = venombot.base64Qr;
        if (!chatbotSessions[sessionId]) chatbotSessions[sessionId] = {};
        chatbotSessions[sessionId].qrCode = qrCode;
      }
    });

    venombot.onMessage(async (message) => {
      const currentStage = getStage({ from: message.from });
      await stages[currentStage].stage.exec({
        from: message.from,
        message: message.body,
      });
    });

    console.log("Venom session started:", sessionId);
  } catch (error) {
    console.error("Error starting Venom session:", error);
  }
};

const main = async () => {
  try {
    const randomSession = "heghbertho";
    await startVenomSession(randomSession);
  } catch (error) {
    console.error(error);
  }
};

const PORT = process.env.PORT || 1907;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send({ "qrCode": chatbotSessions });
});

app.get('/qrcode', (req, res) => {
  const sessionId = req.query.sessionId;
  if (chatbotSessions[sessionId] && chatbotSessions[sessionId].qrCode) {
    res.send({ "qrCode": chatbotSessions[sessionId].qrCode });
  } else {
    res.status(404).send("QR code not found");
  }
});

main();
