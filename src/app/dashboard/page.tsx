"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TrainerDashboard from "@/components/dashboard/TrainerDashboard";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import { API_BASE_URL } from "@/utils/config";

export default function Dashboard() {
  const [userRole, setUserRole] = useState<"TRAINER" | "CLIENT" | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Ruolo ricevuto:", data.role); // Per debug
          if (data.role === "TRAINER" || data.role === "CLIENT") {
            setUserRole(data.role);
          } else {
            console.error("Ruolo non valido ricevuto:", data.role);
            throw new Error("Ruolo utente non valido");
          }
        } else {
          throw new Error(data.message || "Errore nel recupero dei dati utente");
        }
      } catch (error) {
        console.error("Errore completo:", error);
        localStorage.removeItem("token"); // Rimuovi il token non valido
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {userRole === "TRAINER" ? (
        <TrainerDashboard />
      ) : userRole === "CLIENT" ? (
        <ClientDashboard />
      ) : (
        <div>Errore: Ruolo utente non valido</div>
      )}
    </div>
  );
}