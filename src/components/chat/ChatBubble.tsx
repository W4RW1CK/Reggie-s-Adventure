import { RegenmonType, ChatMessage } from '@/lib/types';
import classNames from 'classnames';

interface ChatBubbleProps {
    message: ChatMessage;
    regenmonType?: RegenmonType; // Requerido si el mensaje es del asistente
}

export function ChatBubble({ message, regenmonType }: ChatBubbleProps) {
    const isUser = message.role === 'user';

    // Type-specific subtle borders (as per FRONTEND_GUIDELINES.md)
    const borderColor = !isUser && regenmonType ? {
        'rayo': 'border-[#f7dc6f]',
        'flama': 'border-[#e74c3c]',
        'hielo': 'border-[#85c1e9]',
    }[regenmonType] : 'border-[#4a4a4a]'; // Default NES border

    return (
        <div
            className={classNames(
                'font-["Press_Start_2P"] text-[8px] p-2 my-1 max-w-[80%] image-pixelated border-2',
                isUser ? 'ml-auto text-right bg-[#0f3460] text-[#e8e8e8]' : 'mr-auto text-left bg-black/40 text-white',
                isUser ? 'border-[#4a4a4a]' : borderColor
            )}
            style={{ imageRendering: 'pixelated' }}
        >
            {message.content}
        </div>
    );
}
