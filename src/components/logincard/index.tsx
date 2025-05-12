"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logica di login qui
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">Accedi</h2>
        <div className="mt-4 flex justify-center">
          <div className="w-12 h-1 rounded-full bg-[rgb(var(--primary))]"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center cursor-pointer">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="pl-2 block text-sm text-gray-900 select-none cursor-pointer"
            >
              Ricordami
            </label>
          </div>

          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-[rgb(var(--primary))] hover:opacity-70 transition-opacity duration-200"
            >
              Password dimenticata?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[rgb(var(--primary))] hover:opacity-70 cursor-pointer transition-all"
        >
          Accedi
        </button>

        <div className="text-center text-sm mt-4">
          <span className="text-gray-600">Non hai un account? </span>
          <Link
            href="/register"
            className="font-medium text-[rgb(var(--primary))] hover:opacity-70"
          >
            Registrati
          </Link>
        </div>
      </form>
    </div>
  );
}
