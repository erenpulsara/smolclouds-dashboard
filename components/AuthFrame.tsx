import type { ReactNode } from "react";

/** The signed-out frame: one centred column on the deck's grid field. */
export function AuthFrame({
  title,
  caption,
  children,
  footer,
  wide = false,
}: {
  title: string;
  caption: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20">
      <div aria-hidden className="grid-field pointer-events-none absolute inset-0" />

      <div className={`relative w-full animate-boot ${wide ? "max-w-xl" : "max-w-sm"}`}>
        <div className="mb-12">
          <div className="flex items-center gap-2.5 text-[13px]">
            <span aria-hidden className="block h-2.5 w-2.5 bg-text" />
            smolclouds
          </div>
          <h1 className="caret mt-9 text-2xl font-light tracking-tight">{title}</h1>
          <p className="mt-3 max-w-prose text-[11px] leading-relaxed text-muted">{caption}</p>
        </div>

        {children}

        {footer ? <div className="mt-10 text-[11px] text-faint">{footer}</div> : null}
      </div>
    </div>
  );
}
