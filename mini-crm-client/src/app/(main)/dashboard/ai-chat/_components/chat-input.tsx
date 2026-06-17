import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatInput() {
  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Ask anything..."
          className="flex-1 h-10 min-w-0"
        />

        <Button size="icon" className="h-10 w-10 shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}