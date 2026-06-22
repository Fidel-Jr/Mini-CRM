'use client';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useChat } from '../../../../../../contexts/chat-context';

export default function ChatSidebar() {
    const {
        sessions,
        currentSessionId,
        createChat,
        selectChat,
        deleteChat
    } = useChat();

    

    return (
        <div className="border rounded-xl p-4 flex flex-col h-full">
            <Button
                onClick={createChat}
                className="w-full mb-4"
            >
                ✨ New Chat
            </Button>

            <h3 className="font-semibold mb-4">
                Recent Chats
            </h3>

            <div className="space-y-2 overflow-y-auto flex-1">
                {sessions.map(chat => (
                    <div
                        key={chat.id}
                        className={`
                            group
                            rounded-lg
                            transition
                            hover:bg-muted
                            ${currentSessionId === chat.id
                                ? 'bg-muted'
                                : ''}
                        `}
                    >
                        <div className="flex items-center justify-between p-3">
                            <button
                                onClick={() => selectChat(chat.id)}
                                className="
                                    flex-1
                                    text-left
                                    overflow-hidden
                                "
                            >
                                <p className="truncate text-sm font-medium">
                                    {chat.title}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    {new Date(
                                        chat.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </button>

                            {!(sessions.length === 1 && chat.messages.length === 0) && (
                                <button
                                    onClick={() => {
                                        const confirmed = window.confirm('Delete this chat?');

                                        if (confirmed) {
                                            deleteChat(chat.id);
                                        }
                                    }}
                                    className="
                                        opacity-0
                                        group-hover:opacity-100
                                        transition
                                        text-muted-foreground
                                        hover:text-red-500
                                    "
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}