/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { MenuBar, MenuItem } from "@/components/trainer/menubar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Users, Dumbbell, MessageCircle, Bell } from "lucide-react";

// Componente Card per le statistiche
const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="text-[rgb(var(--primary))]">{icon}</div>
    </div>
  </div>
);

export default function Dashboard() {
  
  const [stats, setStats] = useState({
    totalClients: 0,
    activePrograms: 0,
    unreadMessages: 0,
    notifications: 0,
  });
  
  

  return (
    <div className="w-dvw h-dvh relative flex">
      <MenuItem />

      {/* Dashboard Content */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto mt-10 sm:mt-0 md:px-10 lg:px-20 xl:px-32">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Clienti Totali"
            value={stats.totalClients}
            icon={<Users size={24} />}
          />
          <StatCard
            title="Programmi Attivi"
            value={stats.activePrograms}
            icon={<Dumbbell size={24} />}
          />
          <StatCard
            title="Messaggi non letti"
            value={stats.unreadMessages}
            icon={<MessageCircle size={24} />}
          />
          <StatCard
            title="Notifiche"
            value={stats.notifications}
            icon={<Bell size={24} />}
          />
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Programs */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Ultimi Programmi</h2>
            <div className="space-y-2">
              {stats.activePrograms === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  Non ci sono programmi attivi da visualizzare
                </p>
              ) : // Qui andrà la lista dei programmi quando implementata
              null}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Messaggi Recenti</h2>
            <div className="space-y-2">
              {stats.unreadMessages === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  Non ci sono messaggi non letti
                </p>
              ) : // Qui andrà la lista dei messaggi quando implementata
              null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
