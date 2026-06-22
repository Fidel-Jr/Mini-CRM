import { Message } from '../../../../../../types/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div
      className={
        isUser
          ? 'flex justify-end'
          : 'flex justify-start'
      }
    >
      <div
        className={`
          max-w-[80%]
          rounded-xl
          px-4 py-2
          break-words
          ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'border'
          }
        `}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}