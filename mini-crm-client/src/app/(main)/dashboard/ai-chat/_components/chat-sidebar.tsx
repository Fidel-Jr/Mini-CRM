import { Button } from "@/components/ui/button";

const chats = [
  {
    title: "Priority support plans",
    date: "May 11, 2024",
  },
  {
    title: "Manufacturing products",
    date: "May 14, 2024",
  },
  {
    title: "Meeting summary",
    date: "May 13, 2024",
  },
  {
    title: "Discount policies",
    date: "May 12, 2024",
  },
];

export default function ChatSidebar() {
  return (
    <div className="border rounded-xl bg-card flex flex-col lg:h-[calc(100vh-220px)]">
      <div className="p-4 overflow-y-auto border-b">
        <Button className="w-full">✨ New Chat</Button>
      </div>

      <div className="p-4">
        <h3 className="font-medium mb-4">Recent Chats</h3>

        <div className="space-y-4">
          {chats.map((chat) => (
            <div
              key={chat.title}
              className="cursor-pointer rounded-lg p-2 hover:bg-muted"
            >
              <p className="text-sm font-medium">{chat.title}</p>
              <span className="text-xs text-muted-foreground">
                {chat.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}