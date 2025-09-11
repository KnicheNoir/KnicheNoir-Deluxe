export interface ChatMessagePart {
    text: string;
    [key: string]: any; 
}

export interface ScryingPayload {
    title: string;
    image: string; // base64 data URL
    interpretation: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model' | 'system';
    type: 'chat' | 'scrying' | 'suggestion' | 'error';
    parts: ChatMessagePart[];
    payload?: ScryingPayload;
    isBookmarked?: boolean;
    timestamp?: number;
}

export type AIMessage = ChatMessage;

export interface LetterformAnalysis {
    letter: string;
    name: string;
    spelling: string;
    gematria: number;
    shape: 'open' | 'closed' | 'vertical';
    revealedArchetype: string;
    constituentAnalysis: Array<{
        letter: string;
        functionalRole: string;
    }>;
    archetypalWords: Record<string, string>;
    networkCentrality: number;
    semanticField: string[];
}
