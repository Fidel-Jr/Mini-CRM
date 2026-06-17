import ChatInput from "./chat-input";
import ChatMessage from "./chat-message";

export default function ChatWindow() {
  return (
    <div className="border rounded-xl bg-card flex flex-col h-[600px] lg:h-[calc(100vh-220px)] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-end mb-6">
          <div
            className="
                bg-primary/10
                text-sm
                px-4
                py-3
                rounded-2xl
                max-w-[85%]
                sm:max-w-[70%]
                break-words
            "
            >
            Which plans include priority support?
          </div>
        </div>

        <ChatMessage />
      </div>

      <ChatInput />
    </div>
  );
}