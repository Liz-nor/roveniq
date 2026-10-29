import { Check } from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import type { ZodType } from 'zod';

type Props = Omit<ComponentProps<'input'>, 'className'> & {
  schema: ZodType;
};

export default function ValidatedInput({ schema, onChange, ...props }: Props) {
  const [valid, setValid] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        onChange={(e) => {
          setValid(schema.safeParse(e.target.value).success);
          onChange?.(e);
        }}
        className={`text-text w-full rounded border p-3 pr-11 placeholder:text-neutral-500 focus:outline-none focus:ring-2 ${
          valid
            ? 'border-success focus:border-success focus:ring-success/30'
            : 'border-neutral-300 focus:border-primary focus:ring-primary/30'
        }`}
      />
      {valid && (
        <Check
          aria-label="Valid"
          className="text-success absolute top-1/2 right-3 -translate-y-1/2"
          size={20}
        />
      )}
    </div>
  );
}
