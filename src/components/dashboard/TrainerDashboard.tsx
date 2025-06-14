import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClientList from "@/components/dashboard/ClientList";
import WorkoutPlans from "@/components/dashboard/WorkoutPlans";
import Messages from "@/components/dashboard/Messages";
import Notifications from "@/components/dashboard/Notifications";
import Exercises from "@/components/dashboard/Exercises";
import { io } from "socket.io-client";
import { getUserId } from "@/utils/auth";
import { API_BASE_URL, SOCKET_URL } from "@/utils/config";
import { Menu, X, LogOut } from "lucide-react";

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
          `${API_BASE_URL}/api/messages/unread-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Verifica che count esista prima di usarlo
          if (data && typeof data.count !== "undefined") {
            // Salva il conteggio in localStorage
            localStorage.setItem("unreadMessagesCount", data.count.toString());
            if (data.count > 0) {
              setUnreadMessages(data.count);
            }
          }
        }
      } catch (error) {
        console.error("Errore nel recupero dei messaggi non letti:", error);
      }
    };

    // Recupera il conteggio salvato in localStorage all'avvio
    const savedCount = localStorage.getItem("unreadMessagesCount");
    if (savedCount && parseInt(savedCount) > 0) {
      setUnreadMessages(parseInt(savedCount));
    }

    // Esegui il controllo iniziale
    checkInitialUnreadMessages();

    return () => {};
  }, []); // Solo al mount

  // Modifica l'useEffect esistente per il socket
  useEffect(() => {
    const socket = io(SOCKET_URL, {
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
        const newCount = unreadMessages + 1;
        setUnreadMessages(newCount);
        // Aggiorna il conteggio in localStorage
        localStorage.setItem("unreadMessagesCount", newCount.toString());
      }
    });

    socket.on("unreadCount", ({ count }) => {
      if (activeTab !== "messages" && count > 0) {
        setUnreadMessages(count);
        // Aggiorna il conteggio in localStorage
        localStorage.setItem("unreadMessagesCount", count.toString());
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("unreadCount");
      socket.disconnect();
    };
  }, [activeTab, unreadMessages]); // Aggiungi unreadMessages come dipendenza

  // Modifica handleMessageTabClick
  const handleMessageTabClick = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/api/messages/mark-all-read`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUnreadMessages(0);
      // Resetta il conteggio in localStorage
      localStorage.setItem("unreadMessagesCount", "0");
    } catch (error) {
      console.error("Errore nel reset dei messaggi non letti:", error);
    }
    setActiveTab("messages");
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header - sticky per rimanere sempre visibile */}
      <div className="lg:hidden bg-white dark:bg-gray-800 p-4 flex items-center justify-between sticky top-0 z-10 border-b">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 dark:text-gray-200"
        >
          <Menu size={24} />
        </button>
        <span className="font-semibold">Dashboard Trainer</span>
      </div>

      {/* Sidebar - con h-screen e sticky */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out z-50 overflow-y-auto flex flex-col justify-between border-r`}
      >
        <div>
          {/* Mobile header dentro la sidebar */}
          <div className="select-none hidden lg:block border-b p-4">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              CoachConnect
            </h1>
          </div>
          <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="select-none">
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                CoachConnect
              </h1>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-gray-600 dark:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="mt-4 space-y-2 px-4">
            <button
              onClick={() => {
                setActiveTab("clients");
                setIsSidebarOpen(false);
              }}
              className={`w-full px-4 py-3 text-left rounded-lg flex items-center gap-3 transition-colors ${
                activeTab === "clients"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="text-xl">👥</span> I miei clienti
            </button>
            <button
              onClick={() => {
                setActiveTab("workouts");
                setIsSidebarOpen(false);
              }}
              className={`w-full px-4 py-3 text-left rounded-lg flex items-center gap-3 transition-colors ${
                activeTab === "workouts"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              💪 Schede Allenamento
            </button>
            <button
              onClick={() => {
                setActiveTab("exercises");
                setIsSidebarOpen(false);
              }}
              className={`w-full px-4 py-3 text-left rounded-lg flex items-center gap-3 transition-colors ${
                activeTab === "exercises"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              🥊 Esercizi
            </button>
            <button
              onClick={handleMessageTabClick}
              className={`w-full px-4 py-3 text-left rounded-lg flex items-center gap-3 transition-colors ${
                activeTab === "messages"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
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
              className={`w-full px-4 py-3 text-left rounded-lg flex items-center gap-3 transition-colors ${
                activeTab === "notifications"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              🔔 Notifiche
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay per mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Content Area */}
      <main className="flex-1">
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
          {activeTab === "clients" && <ClientList />}
          {activeTab === "workouts" && <WorkoutPlans />}
          {activeTab === "exercises" && <Exercises />}
          {activeTab === "messages" && <Messages />}
          {activeTab === "notifications" && <Notifications />}
        </div>
      </main>
    </div>
  );
}
