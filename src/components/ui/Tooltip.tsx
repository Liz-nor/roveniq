import type { ReactNode } from 'react';

type TooltipProps = {
    text: string;
    children: ReactNode;
};

export function Tooltip({ text, children }: TooltipProps) {
    return (
    <span className="group relative inline-flex">
        {children}

        <span
        role="tooltip"
        className="
            pointer-events-none absolute bottom-full left-1/2
            z-50 mb-2 -translate-x-1/2
            rounded-md bg-neutral-900 px-3 py-2
            text-xs whitespace-nowrap text-white
            opacity-0 transition-opacity
            group-hover:opacity-100
            group-focus-within:opacity-100
        "
        >
        {text}
        </span>
    </span>
    );
}