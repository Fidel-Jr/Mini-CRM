'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '../../../../../../contexts/chat-context';

import ChatInput from './chat-input';
import ChatMessage from './chat-message';

export default function ChatWindow() {
    const {
        messages,
        loading
    } = useChat();

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [messages]);

    return (
        <div className="border rounded-xl bg-card flex flex-col h-[600px] lg:h-[calc(100vh-190px)] overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map(message => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                    />
                ))}

                {loading && (
                    <div className="text-sm text-muted-foreground">
                        Thinking...
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            <ChatInput />
        </div>
    );
}