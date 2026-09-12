import { site } from "@/lib/site";

/** The bottom rule: what the console is talking to, and as whom. */
export function StatusBar({ email }: { email: string | null }) {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-2 px-6 py-5 text-[10px] uppercase tracking-[0.18em] text-ghost">
        <span>
          router <span className="text-faint normal-case tracking-normal">{site.apiBase.replace(/^https?:\/\//, "")}</span>
        </span>
        {email ? (
          <span>
            account <span className="text-faint normal-case tracking-normal">{email}</span>
          </span>
        ) : null}
        <span className="ml-auto">closed pilot</span>
      </div>
    </footer>
  );
}
