import { VenomBot } from "../../bootstrap/venom/venom.js";
import { stages, getStage } from "../../stages/stages.js";

const main = async () => {
  try {
    let firstPass = `
 _____________________________________________________________________________
|                                                                             |
|                                                                             |
|                        🚀  VENOM STARTED 🚀                                 |
|                                                                             |
|                                                                             |
|_____________________________________________________________________________|
\n
`;

    console.log(firstPass);

    const venombot = await VenomBot.getInstance().init({
      session: "firstsession",
      headless: false,
      useChrome: false,
      disableWelcome: true,
      browserArgs:[ "/usr/bin/google-chrome-stable"],
      browserPathExecutable: '/usr/bin/chromium-browser',
      headless: true,
      devtools: false,
      useChrome: false,
      debug: false,
      logQR: true,
      browserArgs: ['--no-sandbox'],
      refreshQR: 15000
    });

    let secondPass = `
 _____________________________________________________________________________
|                                                                             |
|                                                                             |
|                        ⚡️⚡️ VENOM INITIALIZED ⚡️⚡️                              |
|                                                                             |
|                                                                             |
|_____________________________________________________________________________|
\n
`;

    console.log(secondPass);

    venombot.onMessage(async (message) => {
      let thirdPass = `
 _____________________________________________________________________________
|                                                                             |
|                                                                             |
|                   👀 LISTENING ALL MESSAGES 👀                              |
|                                                                             |
|                                                                             |
|_____________________________________________________________________________|
\n
`;

      console.log(thirdPass);

      const currentStage = getStage({ from: message.from });

      await stages[currentStage].stage.exec({
        from: message.from,
        message: message.body,
      });

      let lastPass = `
 __________________________________________________________________________________
|                                                                                  |
|                                                                                  |
|          Message: "${message.body}"\n                                            |
|          sent from: "${message.from}"                                            |
|                                                                                  |
|                                                                                  |
|__________________________________________________________________________________|
`;

      console.log(lastPass);
    });
  } catch (error) {
    console.error(error);
  }
};

main();