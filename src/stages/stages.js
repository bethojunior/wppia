import { initialStage } from "../stages/index.js";
import { storage } from "../config/storage.js";

export const stages = [
  {
    descricao: "Welcome",
    stage: initialStage,
  },
];

export function getStage({ from }) {
  if (storage[from]) {
    return storage[from].stage;
  }

  storage[from] = {
    stage: 0,
    itens: [],
    address: "",
  };

  return storage[from].stage;
}
