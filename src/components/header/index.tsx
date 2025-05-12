"use client";

import "./style.css";

import { Dumbbell } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 w-full max-w-[1000px] my-2 min-h-14 h-14">
      <div className="mx-2 h-full backdrop-blur-xl bg-neutral-200/30 rounded-full border-2 border-[rgb(var(--primary))] flex items-center justify-between px-2">
        {/* logo */}
        <Link href="/" className="flex items-center justify-start gap-2">
          <div className="bg-[rgb(var(--primary))] text-white p-1.5 rounded-full">
            <Dumbbell />
          </div>
          <h1>Hello World</h1>
        </Link>

        {/* Menu */}
        <div></div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Link href={"/login"} className="btn-riko btn-riko-ghost">Log in</Link>
          <Link href={"/register"} className="btn-riko btn-riko-solid">Sing Up</Link>
        </div>

        {/* Profile */}
        <div className="hidden"></div>
      </div>
    </div>
  );
}
