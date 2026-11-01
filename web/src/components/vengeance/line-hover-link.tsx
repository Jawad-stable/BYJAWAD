import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * LineHoverLink: Vengence UI "line-hover-link" (the "double" variant). Two
 * hairlines draw in under the text from opposite sides.
 * Source: https://www.vengenceui.com/components/line-hover-link (open source)
 */
export function LineHoverLink({ className, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={cn(
        "relative inline-flex w-fit items-center whitespace-nowrap no-underline outline-none",
        "before:pointer-events-none before:absolute before:start-0 before:top-full before:h-px before:w-full before:origin-right before:scale-x-0 before:bg-current before:transition-transform before:duration-300 before:ease-[cubic-bezier(.7,0,.2,1)] before:content-['']",
        "after:pointer-events-none after:absolute after:start-0 after:top-[calc(100%+4px)] after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-[cubic-bezier(.7,0,.2,1)] after:content-['']",
        "hover:before:origin-left hover:before:scale-x-100 hover:after:origin-right hover:after:scale-x-100 hover:before:ease-[cubic-bezier(.4,1,.8,1)] hover:after:ease-[cubic-bezier(.4,1,.8,1)]",
        "focus-visible:before:scale-x-100 focus-visible:after:scale-x-100",
        className,
      )}
    >
      {children}
    </a>
  );
}
