import { CircleUserRound, Newspaper, SquarePen } from 'lucide-react';
import { useState } from 'react';

interface ProfileDetailsProps {
    name: string;
    email: string;
    onEdit?: () => void;
}

type NewsChannel = 'email' | 'text' | 'mail';

const newsChannels: { key: NewsChannel; label: string }[] = [
    { key: 'email', label: 'By Email' },
    { key: 'text', label: 'By Text' },
    { key: 'mail', label: 'By Mail' },
];

function ReadOnlyField({
    id,
    label,
    value,
    type = 'text',
}: {
    id: string;
    label: string;
    value: string;
    type?: string;
}) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm text-neutral-900">
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                readOnly
                className="w-full max-w-md rounded-md bg-neutral-200 px-2 py-1.5 text-xs text-neutral-900"
            />
        </div>
    );
}

function Toggle({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between border-b border-neutral-900 px-4 py-2">
            <span className="text-sm text-neutral-900">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={label}
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-10 rounded-full transition-colors ${
                    checked ? 'bg-sage-700' : 'bg-neutral-400'
                }`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-neutral-50 transition-transform ${
                        checked ? 'translate-x-4' : ''
                    }`}
                />
            </button>
        </div>
    );
}

export function ProfileDetails({ name, email, onEdit }: ProfileDetailsProps) {
    const [news, setNews] = useState<Record<NewsChannel, boolean>>({
        email: true,
        text: true,
        mail: true,
    });

    return (
        <div className="flex flex-col gap-5">
            <section className="rounded-md bg-muted-background">
                <h3 className="flex items-center gap-1 px-2 pt-3 text-lg text-neutral-900">
                    <CircleUserRound className="size-5" aria-hidden="true" />
                    General information
                </h3>
                <div className="border-b border-neutral-900 px-3 pt-2 pb-3">
                    <ReadOnlyField id="profile-name" label="Name" value={name} />
                </div>
                <div className="border-b border-neutral-900 px-3 py-3">
                    <ReadOnlyField id="profile-email" label="Email" value={email} type="email" />
                </div>
                <div className="flex items-end justify-between gap-4 px-3 pt-5 pb-3">
                    <div className="flex-1">
                        <ReadOnlyField
                            id="profile-password"
                            label="Password"
                            value="**************"
                            type="password"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={onEdit}
                        disabled={!onEdit}
                        className="flex items-center gap-2 rounded-md border border-sage-500 bg-sage-100 px-2 py-0.5 text-xs text-neutral-900 transition-colors hover:bg-sage-200"
                    >
                        <SquarePen className="size-4" aria-hidden="true" />
                        Edit
                    </button>
                </div>
            </section>

            <section className="rounded-md bg-muted-background pb-6">
                <div className="px-2 pt-5 pb-3">
                    <h3 className="flex items-center gap-1 text-base text-neutral-900">
                        <Newspaper className="size-5" aria-hidden="true" />
                        News
                    </h3>
                    <p className="pl-6 font-playfair text-xs text-neutral-900">
                        Choose how you want to receive messages
                    </p>
                </div>
                {newsChannels.map((channel) => (
                    <Toggle
                        key={channel.key}
                        label={channel.label}
                        checked={news[channel.key]}
                        onChange={(checked) =>
                            setNews((prev) => ({ ...prev, [channel.key]: checked }))
                        }
                    />
                ))}
            </section>
        </div>
    );
}
