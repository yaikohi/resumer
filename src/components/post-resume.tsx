import { component$ } from "@builder.io/qwik";
import {
  type PropFunction,
  type QwikChangeEvent,
  type QwikFocusEvent,
} from "@builder.io/qwik";
import { cn } from "~/lib/utils";

type PostResumeTextAreaProps = {
  name: string;
  label?: string;
  placeholder?: string;
  value: string | undefined;
  error: string;
  required?: boolean;
  ref: PropFunction<(element: Element) => void>;
  onInput$: PropFunction<(event: Event, element: HTMLTextAreaElement) => void>;
  onChange$: PropFunction<
    (
      event: QwikChangeEvent<HTMLTextAreaElement>,
      element: HTMLTextAreaElement
    ) => void
  >;
  onBlur$: PropFunction<
    (
      event: QwikFocusEvent<HTMLTextAreaElement>,
      element: HTMLTextAreaElement
    ) => void
  >;
};

export const PostResumeTextArea = component$<PostResumeTextAreaProps>(
  ({ label, error, ...props }) => {
    return (
      <div class={cn("relative", "w-full")}>
        {label && (
          <label for={props.name}>
            {label} {props.required && <span>{"*"}</span>}
          </label>
        )}
        <textarea
          {...props}
          placeholder="What did you think about today?"
          id={props.name}
          aria-invalid={!!error}
          aria-errormessage={`${props.name}-error`}
          name={props.name}
          class={cn(
            "flex min-h-[80px] w-full",
            "px-3 py-2 rounded-md",
            "text-sm",
            "resize-none",
            "bg-transparent ring-offset-background",
            "border border-input",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
        {error && (
          <p
            id={`${props.name}-error`}
            class={cn("text-sm text-destructive", "absolute")}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
