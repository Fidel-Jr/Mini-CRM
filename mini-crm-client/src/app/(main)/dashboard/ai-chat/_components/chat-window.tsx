'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '../../../../../../contexts/chat-context';

import ChatInput from './chat-input';
import ChatMessage from './chat-message';

export default function ChatWindow() {
    const {
        currentSession,
        loading
    } = useChat();

    const bottomRef = useRef<HTMLDivElement>(null);

    const messages = currentSession?.messages ?? [];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [messages]);

    return (
        <div className="border rounded-xl bg-card flex flex-col h-[600px] lg:h-[calc(100vh-190px)] overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[96%] text-center">
                        <div className="mb-6">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                                ✨
                            </div>
                        </div>

                        <h2 className="text-2xl font-semibold">
                            Ask Anything...
                        </h2>

                        <p className="mt-2 text-muted-foreground max-w-sm">
                            I can answer questions based on your uploaded
                            documents and help you find information quickly.
                        </p>
                    </div>
                ) : (
                    messages.map(message => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                        />
                    ))
                )}

                {loading && (
                    <div className="text-sm text-muted-foreground">
                        Finding...
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            <ChatInput />
        </div>
    );
}