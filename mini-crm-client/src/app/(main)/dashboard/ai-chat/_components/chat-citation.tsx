import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Citation } from "@/lib/parse-citations";

export function ChatCitation({ file, quote }: Citation) {
  return (
    <Card className="flex items-start gap-2 p-3 text-sm">
      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <div className="font-medium">{file}</div>
        {quote && (
          <div className="text-muted-foreground">&ldquo;{quote}&rdquo;</div>
        )}
      </div>
    </Card>
  );
}
