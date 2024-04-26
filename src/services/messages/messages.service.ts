
import { ICreateMessage } from "../../@types/messages/message.types";
import MessagesRepositoy from "../../repositories/messages/messages.repository";
import { Messages } from "@prisma/client";

export default class MessagesService {

  constructor(private readonly repository: MessagesRepositoy) {}

  async create(createMessage: ICreateMessage): Promise<Messages | Error> {
    try {
      return await this.repository.create(createMessage);
    } catch (error) {
      if (error instanceof Error) throw error;

      throw new Error("Error at Message Service");
    }
  }
}