import { ChatMessage, ChatResponse } from '../types';

export interface AIProvider {
    chat(systemPrompt: string, history: ChatMessage[], userMessage: string): Promise<ChatResponse>;
}
