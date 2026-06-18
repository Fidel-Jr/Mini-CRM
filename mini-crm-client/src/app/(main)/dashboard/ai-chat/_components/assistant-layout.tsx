import ChatSidebar from "./chat-sidebar";
import ChatWindow from "./chat-window";

export default function AssistantLayout() {
  return (
    <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[280px_1fr] mt-5">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
}