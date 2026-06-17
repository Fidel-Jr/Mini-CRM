import { Sparkles } from "lucide-react";

export default function ChatMessage() {
  return (
    <div className="flex gap-4">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>

      <div
        className="
            flex-1
            min-w-0
            border
            rounded-xl
            p-5
            max-w-full
            sm:max-w-lg
            lg:max-w-2xl
        "
        >
        <p className="font-medium mb-3">
          Priority support is included in the following plans:
        </p>

        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li>Enterprise Plan</li>
          <li>Premium Plan</li>
        </ul>

        <p className="text-sm text-muted-foreground mb-4">
          These plans include 24/7 support, dedicated account managers,
          and priority response times.
        </p>

        <div className="text-sm font-medium">
          Source: Support Policy.pdf
        </div>

        <div className="flex gap-3 mt-4">
          <button className="text-muted-foreground hover:text-foreground">
            👍
          </button>

          <button className="text-muted-foreground hover:text-foreground">
            👎
          </button>

          <button className="text-muted-foreground hover:text-foreground">
            📋
          </button>
        </div>
      </div>
    </div>
  );
}