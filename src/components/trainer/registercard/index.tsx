"use client";

import { authService } from "@/services/auth";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrainerRegisterCard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Le password non coincidono");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await authService.registerTrainer({
        name,
        surname,
        email,
        password,
      });

      // Salva il token JWT e i dati del trainer
      localStorage.setItem("token", response.token);
      localStorage.setItem("trainer", JSON.stringify(response.trainer));

      // Reindirizza alla dashboard del trainer
      router.push("/trainer/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Errore durante la registrazione");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Registrazione Trainer
        </h2>
        <div className="mt-4 flex justify-center">
          <div className="w-12 h-1 rounded-full bg-[rgb(var(--primary))]"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex-1">
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
              Cognome
            </label>
            <div className="mt-1">
              <input
                id="surname"
                name="surname"
                type="text"
                required
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
            Conferma Password
          </label>
          <div className="mt-1">
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[rgb(var(--primary))] hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Registrazione in corso..." : "Registrati"}
        </button>

        <div className="text-center text-sm mt-4">
          <span className="text-gray-600">Hai già un account? </span>
          <Link
            href="/trainer/login"
            className="font-medium text-[rgb(var(--primary))] hover:opacity-70"
          >
            Accedi
          </Link>
        </div>
      </form>
    </div>
  );
}
