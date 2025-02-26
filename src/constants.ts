export enum Role {
  USER = "user",
  ASSISTANT = "assistant",
}

export type Message = {
  role: Role;
  text: string;
}

