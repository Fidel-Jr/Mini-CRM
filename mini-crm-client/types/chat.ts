export type MessageRole = "user" | "assistant";

export interface Message {
    id: string;
    role: MessageRole;
    content: string;
    createdAt: string;
    sources?: string[];
}

export interface ChatSession{

    id:string;

    title:string;

    createdAt:string;

    messages:Message[];

}