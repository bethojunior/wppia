import { perguntaAleatória, ask}  from "./chat_interação.js";

async function main() {
    let pergunta = perguntaAleatória();
    let txt = await ask(pergunta);
    console.log('Pergunta:' + pergunta+ ' \nResposta: '+txt);
}
for (let i = 0; i < 10; i++) {
    main();
}
main();
