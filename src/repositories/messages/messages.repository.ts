import { ICreateMessage } from "./../../@types/messages/message.types";
import prismaClient from "../../providers/prisma/prisma.provider";
import { Messages } from "@prisma/client";

export default class MessagesRepositoy {

  async create(params: ICreateMessage): Promise<Messages | Error> {
    try {
      return await prismaClient.messages.create({
        data: {
          author: params.author,
          to: params.to,
          message: params.message,
        },
      });
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Error at Message repository");
    }
  }

  async findAllByUser(userId: string): Promise<Messages[] | Error> {
    try {
      const messages = await prismaClient.messages.findMany({
        where: {
          to: userId,
        },
        orderBy: {
          created_at: "asc",
        },
      });
      return messages;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Error at Message repository");
    }
  }

  async findByContextForUser(
    userId: string,
    amount: number = 10,
  ): Promise<Messages[] | Error> {
    try {
      return await prismaClient.messages.findMany({
        where: {
          to: userId,
        },
        orderBy: {
          created_at: "asc",
        },
        take: amount,
      });
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Error at Message repository");
    }
  }
}
