import { storage } from  '../config/storage.js'
import { VenomBot } from '../bootstrap/venom/venom.js';
import { STAGES } from '../stages/index.js'

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { ask } from "../integrations/ask.js";

export const initialStage = {
  async exec({ from, message }) {
    try {

      console.log(from, message)

      const storeMessage = await prisma.logs.create({
        data: {
          phone: from,
          message: message
        }
      });

      const content = await prisma.logs.findMany({
        where: {
          phone: from,
        },
        orderBy: {
          id: "desc",
        },
        take: 20,
      });

      let answer = await ask(message, content);

      const venombot = await VenomBot.getInstance();

      await venombot.sendText({ to: from, message: answer });
      
    } catch (error) {
      console.error('Error in initial stage:', error);
    }
  },
};



