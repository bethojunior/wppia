const MessagesRepositoy = require("../../repositories/messages/messages.repository");

class MessagesService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(createMessage) {
    try {
      return await this.repository.create(createMessage);
    } catch (error) {
      if (error instanceof Error) throw error;

      throw new Error("Error at Message Service");
    }
  }
}

module.exports = MessagesService;
