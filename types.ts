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
    // FIX: Added 'system' to the type union to allow for system-generated informational messages, resolving a type error in `engine.ts`.
    type: 'chat' | 'scrying' | 'suggestion' | 'error' | 'system';
    parts: ChatMessagePart[];
    payload?: ScryingPayload;
    isBookmarked?: boolean;
    timestamp?: number;
    image?: string; // For user-sent images (base64 data URL)
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

export interface AestheticPayload {
    id: string; // e.g., "saturn-aesthetic"
    colors: {
        background: number;
        fog: number;
        primary: number;
        emissive: number;
    };
    geometry: {
        archetype: 'crystalline' | 'gaseous' | 'liquidic';
    };
}