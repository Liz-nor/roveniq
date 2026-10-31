import { Check } from "lucide-react";
import { useState, type ComponentProps, type ReactNode } from "react";
import type { ZodType } from "zod";

type Props = Omit<ComponentProps<"input">, "className"> & {
  schema: ZodType;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
};

export default function ValidatedInput({
  schema,
  icon,
  iconPosition = "left",
  onChange,
  ...props
}: Props) {
  const [valid, setValid] = useState(false);
  const iconRight = Boolean(icon) && iconPosition === "right";
  const iconLeft = Boolean(icon) && !iconRight;

  return (
    <div className="relative">
      {icon && (
        <span
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-neutral-500 ${
            iconRight ? "right-3" : "left-3"
          }`}
        >
          {icon}
        </span>
      )}
      <input
        {...props}
        onChange={(e) => {
          setValid(schema.safeParse(e.target.value).success);
          onChange?.(e);
        }}
        className={`text-text w-full rounded-lg border p-3 ${iconRight ? "pr-20" : "pr-11"} ${iconLeft ? "pl-12" : ""} placeholder:text-neutral-500 focus:outline-none focus:ring-2 ${
          valid
            ? "border-success focus:border-success focus:ring-success/30"
            : "border-neutral-300 focus:border-primary focus:ring-primary/30"
        }`}
      />
      {valid && (
        <Check
          aria-label="Valid"
          className={`text-success absolute top-1/2 -translate-y-1/2 ${
            iconRight ? "right-11" : "right-3"
          }`}
          size={20}
        />
      )}
    </div>
  );
}
