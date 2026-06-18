import { Button } from '@/components/ui/button';

export default function ChatSidebar() {
    return (
        <div className="border rounded-xl p-4">
            <Button className="w-full mb-4">
                ✨ New Chat
            </Button>

            <h3 className="font-semibold mb-4">
                Recent Chats
            </h3>

            <p className="text-sm text-muted-foreground">
                No conversations yet
            </p>
        </div>
    );
}