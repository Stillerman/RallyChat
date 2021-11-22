import getRandomEmoji from "get-random-emoji";

export type User = {
  id: string;
  emoji: string;
  mode: string;
  metadata?: any;
};

export function createUser(id: string): User {
  return {
    id,
    emoji: getRandomEmoji(),
    mode: "lobby",
  };
}
