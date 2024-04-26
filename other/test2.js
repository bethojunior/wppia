

// import dotenv from 'dotenv';
// import OpenAI from "openai";

// dotenv.config();
// const openai = new OpenAI();

// async function main() {
//     const myAssistantFile = await openai.beta.assistants.files.create(
//       "asst_7V0RVlNUbprrzuZ0TGZbI3yg",
//     {
//       file_id: "file-7aeCqxi1GQDc4VfS6QZBkHdx"
//     }
//   );
//   console.log(myAssistantFile);
// }

// main();

// import OpenAI from "openai";
// const openai = new OpenAI({
//   organization: 'org-aO85lmrJrV1GiVeqoOc8eKQZ',
// });
// const openai = new OpenAI();

// async function main() {
//   const myAssistants = await openai.beta.assistants.list({
//     order: "desc",
//     limit: "20",
//   });

//   console.log(myAssistants.data);
// }

// main();

import dotenv from 'dotenv';
import OpenAI from "openai";


dotenv.config();
const assistant_Id = "asst_7V0RVlNUbprrzuZ0TGZbI3yg";  // Su

const openai = new OpenAI({
    organization: 'org-aO85lmrJrV1GiVeqoOc8eKQZ',
  });

const run = await openai.beta.threads.runs.create(
    assistant_Id,
    {
      assistant_id: assistant_Id,
      model: "gpt-4-turbo-preview",
      instructions: "New instructions that override the Assistant instructions",
      tools: [{"type": "code_interpreter"}, {"type": "retrieval"}]
    }
  );