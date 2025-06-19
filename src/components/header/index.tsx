import Link from "next/link";

import { Dumbbell } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={"/"}>
          <div className="flex items-center gap-2">
            <Dumbbell />
            <span className="text-xl font-bold">CoachConnect</span>
          </div>
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/features"
            className="hover:text-blue-600 transition-colors"
          >
            Funzionalità
          </Link>
          <Link
            href="/pricing"
            className="hover:text-blue-600 transition-colors"
          >
            Prezzi
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">
            Chi Siamo
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Accedi
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Registrati
          </Link>
        </div>
      </nav>
    </header>
  );
}
