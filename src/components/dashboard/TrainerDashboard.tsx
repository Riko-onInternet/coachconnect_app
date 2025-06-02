import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClientList from "@/components/dashboard/ClientList";
import WorkoutPlans from "@/components/dashboard/WorkoutPlans";
import Messages from "@/components/dashboard/Messages";
import Notifications from "@/components/dashboard/Notifications";
import Exercises from "@/components/dashboard/Exercises";
import { io } from "socket.io-client";
import { getUserId } from "@/utils/auth";

export default function TrainerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("clients");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Nel component TrainerDashboard, modifica gli useEffect
  useEffect(() => {
    const checkInitialUnreadMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3000/api/messages/unread-count",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const { count } = await response.json();
          if (count > 0) {
            // Aggiunta questa condizione
            setUnreadMessages(count);
          }
        }
      } catch (error) {
        console.error("Errore nel recupero dei messaggi non letti:", error);
      }
    };

    // Esegui il controllo iniziale
    checkInitialUnreadMessages();

    // Rimuoviamo il setInterval dato che ora useremo solo il socket
    return () => {};
  }, []); // Solo al mount

  // Modifica l'useEffect esistente per il socket
  useEffect(() => {
    const socket = io("http://localhost:3000", {
      auth: { token: localStorage.getItem("token") },
    });

    socket.on("connect", () => {
      const userId = getUserId();
      if (userId) {
        socket.emit("join", userId);
      }
    });

    socket.on("newMessage", (message) => {
      const currentUserId = getUserId();
      if (message.receiverId === currentUserId && activeTab !== "messages") {
        setUnreadMessages((prev) => prev + 1);
      }
    });

    socket.on("unreadCount", ({ count }) => {
      if (activeTab !== "messages" && count > 0) {
        // Modifica qui
        setUnreadMessages(count);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("unreadCount");
      socket.disconnect();
    };
  }, [activeTab]); // Aggiungi activeTab come dipendenza

  // Modifica handleMessageTabClick
  const handleMessageTabClick = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3000/api/messages/mark-all-read`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUnreadMessages(0);
    } catch (error) {
      console.error("Errore nel reset dei messaggi non letti:", error);
    }
    setActiveTab("messages");
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-800 p-4 flex items-center justify-between shadow-lg">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 dark:text-gray-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span className="font-semibold">Dashboard Trainer</span>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out z-30 md:min-h-screen flex flex-col justify-between`}
      >
        <nav className="mt-8 space-y-2 px-4">
          <button
            onClick={() => {
              setActiveTab("clients");
              setIsSidebarOpen(false);
            }}
            className={`w-full px-4 py-2 text-left rounded-lg ${
              activeTab === "clients"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            👥 I miei clienti
          </button>
          <button
            onClick={() => {
              setActiveTab("workouts");
              setIsSidebarOpen(false);
            }}
            className={`w-full px-4 py-2 text-left rounded-lg ${
              activeTab === "workouts"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            💪 Schede Allenamento
          </button>
          <button
            onClick={() => {
              setActiveTab("exercises");
              setIsSidebarOpen(false);
            }}
            className={`w-full px-4 py-2 text-left rounded-lg ${
              activeTab === "exercises"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            🥊 Esercizi
          </button>
          <button
            onClick={handleMessageTabClick}
            className={`w-full px-4 py-2 text-left rounded-lg relative ${
              activeTab === "messages"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>💬 Messaggi</span>
              {unreadMessages > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                  {unreadMessages}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab("notifications");
              setIsSidebarOpen(false);
            }}
            className={`w-full px-4 py-2 text-left rounded-lg ${
              activeTab === "notifications"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            🔔 Notifiche
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay per mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Content Area */}
      <main className="flex-1 p-4 md:p-8 mt-0 md:mt-0 md:ml-64">
        {activeTab === "clients" && <ClientList />}
        {activeTab === "workouts" && <WorkoutPlans />}
        {activeTab === "exercises" && <Exercises />}
        {activeTab === "messages" && <Messages />}
        {activeTab === "notifications" && <Notifications />}
      </main>
    </div>
  );
}
