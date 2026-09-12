"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { nav } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-10 px-6">
        <Link
          href="/apps"
          className="flex shrink-0 items-center gap-2.5 text-[13px] tracking-tight transition-opacity hover:opacity-80"
        >
          <span aria-hidden className="block h-2.5 w-2.5 bg-text" />
          smolclouds
        </Link>

        <nav aria-label="Console" className="flex items-center">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative px-4 py-2 text-[12px] transition-colors ${
                  active ? "text-text" : "text-faint hover:text-dim"
                }`}
              >
                {item.label}
                {active ? (
                  <span aria-hidden className="absolute inset-x-3 -bottom-px h-px bg-text" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-5">
          <span className="hidden border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-faint sm:block">
            pilot
          </span>
          <UserButton
            appearance={{ elements: { avatarBox: { width: 26, height: 26, borderRadius: 0 } } }}
          />
        </div>
      </div>
    </header>
  );
}
