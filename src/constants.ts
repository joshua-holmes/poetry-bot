import { atom } from "jotai";

export enum Role {
  USER = "user",
  ASSISTANT = "assistant",
}

export type Message = {
  role: Role;
  content: string;
};

export const examplePrompts = [
  "Write a blissful poem about my cat, Charlie, frolicking in the field 😺",
  "Create a dark poem about frightful dragons ruling the land 🐲",
  "Draft a joyful poem about a puppy and a penguin becoming friends 🐶 ❤️ 🐧",
];

export const localStorageKey = "claraCss";

export const inputFieldAtom = atom<string>("");
export const messagesAtom = atom<Array<Message>>([]);
export const modalActiveAtom = atom<boolean>(false);
export const loadingAtom = atom<boolean>(false);
export const cssAtom = atom<string | null>(null);
export const clearBtnAtom = atom<boolean>(!!localStorage.getItem(localStorageKey));
