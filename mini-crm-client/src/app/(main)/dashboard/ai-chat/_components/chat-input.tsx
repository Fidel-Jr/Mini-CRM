'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useChat } from '../../../../../../contexts/chat-context';

export default function ChatInput() {
    const [message, setMessage] = useState('');

    const {
        sendMessage,
        loading
    } = useChat();

    async function handleSend() {
        if (!message.trim()) return;

        await sendMessage(message);

        setMessage('');
    }

    return (
        <div className="border-t p-4">
            <div className="flex items-center gap-2">
                <Input
                    value={message}
                    placeholder="Ask anything..."
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSend();
                        }
                    }}
                    className="flex-1 h-10 min-w-0"
                />

                <Button
                    size="icon"
                    className="h-10 w-10 shrink-0"
                    disabled={loading}
                    onClick={handleSend}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}