// const readline = require('readline');

// const { Configuration, OpenAIApi } = require('openai');

require('dotenv').config();
console.log('A chave da API é:', process.env.OPENAI_API_KEY);

return;

console.log(dotenv.config().OPENAI_API_KEY);

return;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function askQuestion(question) {
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: question}]
    });
    return response.data.choices[0].message.content;
}

function main() {
    rl.setPrompt('You: ');
    rl.prompt();
    rl.on('line', async (line) => {
        if (line.toLowerCase() === 'exit') {
            rl.close();
        } else {
            const answer = await askQuestion(line);
            console.log(`ChatGPT: ${answer}`);
            rl.prompt();
        }
    }).on('close', () => {
        console.log('Have a great day!');
        process.exit(0);
    });
}

main();
