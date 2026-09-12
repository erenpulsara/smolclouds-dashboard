import { site } from "@/lib/site";

/** The bottom rule: what the console is talking to, and as whom. */
export function StatusBar({ email }: { email: string | null }) {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 text-[11px] text-faint">
        <span>router · {site.apiBase.replace(/^https?:\/\//, "")}</span>
        {email ? <span>{email}</span> : null}
        <span className="ml-auto">closed pilot</span>
      </div>
    </footer>
  );
}
