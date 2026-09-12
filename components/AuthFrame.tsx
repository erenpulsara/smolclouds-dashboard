import type { ReactNode } from "react";

/** The signed-out frame: one centred column on the deck's grid field. */
export function AuthFrame({
  title,
  caption,
  children,
  footer,
}: {
  title: string;
  caption: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div aria-hidden className="grid-field pointer-events-none absolute inset-0" />

      <div className="relative w-full max-w-sm animate-boot">
        <div className="mb-10">
          <div className="flex items-center gap-2.5 text-sm">
            <span aria-hidden className="block h-2.5 w-2.5 bg-text" />
            smolclouds
          </div>
          <h1 className="caret mt-8 text-2xl font-light tracking-tight">{title}</h1>
          <p className="mt-3 text-xs leading-relaxed text-muted">{caption}</p>
        </div>

        {children}

        {footer ? <div className="mt-8 text-xs text-faint">{footer}</div> : null}
      </div>
    </div>
  );
}
