// import venom from "venom-bot";
// import express from "express";

// const app = express();
// app.use(express.json());

// let chatbotSessions = {};

// function randomSession() {
//   var caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
//   var tamanho = 8;
//   var newString = "";

//   for (var i = 0; i < tamanho; i++) {
//     var indice = Math.floor(Math.random() * caracteres.length);
//     newString += caracteres.charAt(indice);
//   }

//   return newString;
// }

// const mainSession = randomSession();

// const main = (mainSession) => {
//   venom
//     .create(
//       mainSession,
//       (base64Qr, asciiQR) => {
//         console.log("QRCode recebido, escaneie por favor...");
//         if (!chatbotSessions[mainSession]) chatbotSessions[mainSession] = {};
//         chatbotSessions[mainSession].qrCode = base64Qr;
//         console.log('Number of attempts to read the qrcode: ', attempts);
//         console.log('Terminal qrcode: ', asciiQR);
//         console.log('base64 image string qrcode: ', base64Qrimg);
//         console.log('urlCode (data-ref): ', urlCode);
//       },
//       (statusSession, session) => {
//         console.log("Status da sessão:", statusSession);
//       },
//       {
//         browserPathExecutable: "/usr/bin/chromium-browser",
//         browserArgs: ["/usr/bin/google-chrome-stable"],
//         browserPathExecutable: "/usr/bin/chromium-browser",
//         headless: false,
//         devtools: false,
//         useChrome: false,
//         debug: false,
//         logQR: true,
//         browserArgs: ["--no-sandbox"],
//         refreshQR: 15000,
//         autoClose: 60000,
//         disableSpins: true,
//       },
//     )
//     .then((client) => {
//       if (!chatbotSessions[mainSession]) chatbotSessions[mainSession] = {};
//       chatbotSessions[mainSession].client = client;
//       console.log(client);
//       setupClient(client);
//     })
//     .catch((erro) => {
//       console.log(erro);
//     });
// };

// const setupClient = (client) => {
//   client.onMessage((message) => {
//     console.log("mensagem:", message);
//     if (message.body === "Hi" && message.isGroupMsg === false) {
//       client.sendText(message.from, "Welcome Venom 🕷");
//     }
//   });
// };

// main(mainSession);

// app.get("/get-qrcode", (req, res) => {
//   const { sessionId } = req.query;

//   if (
//     !sessionId ||
//     !chatbotSessions[sessionId] ||
//     !chatbotSessions[sessionId].qrCode
//   ) {
//     return res
//       .status(404)
//       .send(
//         "QR Code not found. Make sure the session is started and try again.",
//       );
//   }
//   res.send({ qrCode: chatbotSessions[sessionId].qrCode });
// });

// const PORT = process.env.PORT || 1907;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


import venom from "venom-bot";
import express from "express";


const app = express();
app.use(express.json());

let chatbotSessions = {};

const startVenomSession = (sessionId) => {
  venom
    .create(
      sessionId,
      (base64Qr, asciiQR) => {
        console.log('QRCode recebido, escaneie por favor...');
        // Armazenando o QR Code em base64 na sessão para acesso futuro
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

const randomSession = generateRanomSession();


function start(sessionId){
  startVenomSession(sessionId);
  res.send(`Session ${sessionId} started.`);
}




// app.post('/start-session', (req, res) => {
//   const { sessionId } = req.body;
//   if (!sessionId) return res.status(400).send('You must provide a session ID.');
  
//   if (chatbotSessions[sessionId]) {
//     return res.status(400).send('Session already started.');
//   }

//   startVenomSession(sessionId);
//   res.send(`Session ${sessionId} started.`);
// });



app.get('/', (req, res) => {
  const { sessionId } = randomSession;
  
  if (!sessionId || !chatbotSessions[sessionId] || !chatbotSessions[sessionId].qrCode) {
    return res.status(404).send('QR Code not found. Make sure the session is started and try again.');
  }

  res.send({ qrCode: chatbotSessions[sessionId].qrCode });
});



// app.post('/send-message', (req, res) => {
//   const { sessionId, number, message } = req.body;
  
//   if (!chatbotSessions[sessionId]) {
//     return res.status(404).send('Session not found.');
//   }
  
//   chatbotSessions[sessionId].sendText(`${number}@c.us`, message)
//     .then((result) => {
//       res.send(`Message sent to ${number}`);
//     })
//     .catch((erro) => {
//       res.status(500).send('Failed to send message.');
//       console.error(erro);
//     });
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

start(randomSession);
