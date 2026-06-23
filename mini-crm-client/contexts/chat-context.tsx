'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';

import { ChatSession, Message } from '../types/chat';

interface ChatContextType {
    sessions: ChatSession[];
    currentSession: ChatSession | null;
    currentSessionId: string | null;
    loading: boolean;
    createChat: () => void;
    selectChat: (id: string) => void;
    deleteChat: (id: string) => void;
    sendMessage: (message: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

const STORAGE_KEY = 'salespilot_chats';
const ACTIVE_KEY = 'salespilot_active_chat';

export function ChatProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const currentSession =
        sessions.find(x => x.id === currentSessionId) ?? null;

    /*
    ----------------------------------
    Load LocalStorage
    ----------------------------------
    */

    useEffect(() => {
        const chats = localStorage.getItem(STORAGE_KEY);
        const active = localStorage.getItem(ACTIVE_KEY);

        if (chats) {
            const parsed: ChatSession[] = JSON.parse(chats);

            setSessions(parsed);

            if (active) {
                setCurrentSessionId(active);
            } else if (parsed.length > 0) {
                setCurrentSessionId(parsed[0].id);
            }
        } else {
            createChat();
        }

        setLoaded(true);
    }, []);

    /*
    ----------------------------------
    Persist chats
    ----------------------------------
    */
    useEffect(() => {
        if (!loaded) return;

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(sessions)
        );
    }, [sessions, loaded]);

    /*
    ----------------------------------
    Persist active chat
    ----------------------------------
    */
    useEffect(() => {
        if (!currentSessionId) return;

        localStorage.setItem(
            ACTIVE_KEY,
            currentSessionId
        );
    }, [currentSessionId]);

    function createChat() {
        const session: ChatSession = {
            id: crypto.randomUUID(),
            title: 'New Chat',
            createdAt: new Date().toISOString(),
            messages: []
        };

        setSessions(prev => [
            session,
            ...prev
        ]);

        setCurrentSessionId(session.id);
    }

    function selectChat(id: string) {
        setCurrentSessionId(id);
    }

    function deleteChat(id: string) {
        const remaining = sessions.filter(
            session => session.id !== id
        );

        // Last chat removed
        if (remaining.length === 0) {
            const newChat: ChatSession = {
                id: crypto.randomUUID(),
                title: 'New Chat',
                createdAt: new Date().toISOString(),
                messages: []
            };

            setSessions([newChat]);
            setCurrentSessionId(newChat.id);

            return;
        }

        setSessions(remaining);

        // Deleted active chat
        if (currentSessionId === id) {
            setCurrentSessionId(remaining[0].id);
        }
    }

    async function sendMessage(content: string) {
        if (!content.trim()) return;
        if (!currentSessionId) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content,
            createdAt: new Date().toISOString()
        };

        /*
        Add User Message
        */
        setSessions(prev =>
            prev.map(chat => {
                if (chat.id !== currentSessionId) {
                    return chat;
                }

                return {
                    ...chat,
                    title:
                        chat.messages.length === 0
                            ? content.slice(0, 30)
                            : chat.title,
                    messages: [
                        ...chat.messages,
                        userMessage
                    ]
                };
            })
        );

        setLoading(true);

        try {
            const response = await fetch(
                '/api/documents/chat/stream',
                {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        message:content
                    })
                }
            );

            const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                let assistantText = '';
                const assistantId = crypto.randomUUID();

                /* 1. Create empty assistant message first */
                setSessions(prev =>
                    prev.map(chat => {
                        if (chat.id !== currentSessionId) return chat;

                        return {
                            ...chat,
                            messages: [
                                ...chat.messages,
                                {
                                    id: assistantId,
                                    role: 'assistant',
                                    content: '',
                                    createdAt: new Date().toISOString()
                                }
                            ]
                        };
                    })
                );

                /* 2. Read stream chunk by chunk */
                while (true) {
                    const { value, done } = await reader!.read();
                    if (done) break;

                    assistantText += decoder.decode(value, { stream: true });

                    setSessions(prev =>
                        prev.map(chat => {
                            if (chat.id !== currentSessionId) return chat;

                            return {
                                ...chat,
                                messages: chat.messages.map(m =>
                                    m.id === assistantId
                                        ? { ...m, content: assistantText }
                                        : m
                                )
                            };
                        })
                    );
                }
            } catch {
            const errorMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: 'Sorry, something went wrong.',
                createdAt: new Date().toISOString()
            };

            setSessions(prev =>
                prev.map(chat => {
                    if (chat.id !== currentSessionId) {
                        return chat;
                    }

                    return {
                        ...chat,
                        messages: [
                            ...chat.messages,
                            errorMessage
                        ]
                    };
                })
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <ChatContext.Provider
            value={{
                sessions,
                currentSession,
                currentSessionId,
                loading,
                createChat,
                selectChat,
                deleteChat,
                sendMessage
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);

    if (!context) {
        throw new Error('ChatProvider missing');
    }

    return context;
}