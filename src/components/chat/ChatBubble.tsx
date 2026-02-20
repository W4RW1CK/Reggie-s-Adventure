import { RegenmonType, ChatMessage } from '@/lib/types';
import classNames from 'classnames';

interface ChatBubbleProps {
    message: ChatMessage;
    regenmonType?: RegenmonType; // Requerido si el mensaje es del asistente
}

export function ChatBubble({ message, regenmonType }: ChatBubbleProps) {
    const isUser = message.role === 'user';

    // Type-specific subtle borders (as per FRONTEND_GUIDELINES.md)
    const typeBorderColors: Record<string, string> = {
        'rayo': '#f7dc6f',
        'flama': '#e74c3c',
        'hielo': '#85c1e9',
    };

    const borderColorValue = !isUser && regenmonType ? typeBorderColors[regenmonType] : undefined;

    return (
        <div
            className={classNames(
                'chat-bubble font-["Press_Start_2P"] p-2 my-1 max-w-[80%] image-pixelated border-2',
                isUser ? 'ml-auto text-right' : 'mr-auto text-left',
            )}
            style={{
                imageRendering: 'pixelated',
                backgroundColor: isUser ? 'var(--theme-surface)' : 'var(--theme-overlay)',
                color: 'var(--theme-text)',
                borderColor: borderColorValue || 'var(--theme-border)',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
            }}
        >
            {message.content}
        </div>
    );
}
