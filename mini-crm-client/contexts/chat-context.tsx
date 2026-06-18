    'use client'

    import {
        createContext,
        useContext,
        useState
    } from 'react';

    import { Message } from '../types/chat';



    type ContextType = {

        messages: Message[];

        sendMessage:(message:string)=>Promise<void>;

        loading:boolean;

    };


    const ChatContext = createContext<ContextType | null>(null);


    export function ChatProvider({
        children
    }:{
        children:React.ReactNode
    }){

        const [messages,setMessages] = useState<Message[]>([]);

        const [loading,setLoading] = useState(false);


        async function sendMessage(content: string) {
            if (!content.trim()) return;

            const userMessage: Message = {
                id: crypto.randomUUID(),
                role: "user",
                content,
                createdAt: new Date().toISOString()
            };

            setMessages(prev => [...prev, userMessage]);

            setLoading(true);

            try {
                const response = await fetch(
                    "https://localhost:7187/api/Documents/chat/stream",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            message: content
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to get AI response");
                }

                if (!response.body) {
                    throw new Error("No response body");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                let aiContent = "";

                // Add placeholder assistant message
                const aiId = crypto.randomUUID();

                setMessages(prev => [
                    ...prev,
                    {
                        id: aiId,
                        role: "assistant",
                        content: "",
                        createdAt: new Date().toISOString()
                    }
                ]);

                while (true) {

                    const { done, value } = await reader.read();

                    if (done) break;

                    const chunk = decoder.decode(value, {
                        stream: true
                    });

                    aiContent += chunk;

                    setMessages(prev =>
                        prev.map(m =>
                            m.id === aiId
                                ? {
                                    ...m,
                                    content: aiContent
                                }
                                : m
                        )
                    );
                }

            }
            catch (err) {

                console.error(err);

                setMessages(prev => [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        role: "assistant",
                        content: "Sorry, something went wrong.",
                        createdAt: new Date().toISOString()
                    }
                ]);
            }
            finally {

                setLoading(false);

            }
        }



        return(

            <ChatContext.Provider
                value={

                    {
                        messages,
                        sendMessage,
                        loading
                    }

                }
            >

                {children}

            </ChatContext.Provider>

        )


    }


    export function useChat(){

        const context = useContext(ChatContext);

        if(!context)
            throw Error("ChatProvider missing");


        return context;

    }