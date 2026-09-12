"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { nav } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-8 px-6">
        <Link href="/apps" className="flex items-center gap-2.5 text-sm tracking-tight">
          <span aria-hidden className="block h-2.5 w-2.5 bg-text" />
          smolclouds
        </Link>

        <nav className="flex items-center gap-1 text-xs">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`border-b px-3 py-1.5 transition-colors ${
                  active
                    ? "border-text text-text"
                    : "border-transparent text-muted hover:text-dim"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center">
          <UserButton
            appearance={{ elements: { avatarBox: { width: 24, height: 24, borderRadius: 0 } } }}
          />
        </div>
      </div>
    </header>
  );
}
