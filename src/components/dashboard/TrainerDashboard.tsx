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
import { Menu, X, LogOut, Users, Dumbbell, MessageCircle, Bell, Activity } from "lucide-react";

export default function TrainerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("clients");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

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

  const menuItems = [
    { id: 'clients', label: 'I miei clienti', icon: Users },
    { id: 'workouts', label: 'Schede Allenamento', icon: Dumbbell },
    { id: 'exercises', label: 'Esercizi', icon: Activity },
    { id: 'messages', label: 'Messaggi', icon: MessageCircle, badge: unreadMessages },
    { id: 'notifications', label: 'Notifiche', icon: Bell },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-center h-16 bg-blue-600">
          <h1 className="text-xl font-bold text-white">CoachConnect</h1>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'messages') {
                    handleMessageTabClick();
                  } else {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center justify-between px-6 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeTab === item.id
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "clients" && <ClientList />}
          {activeTab === "workouts" && <WorkoutPlans />}
          {activeTab === "exercises" && <Exercises />}
          {activeTab === "messages" && <Messages />}
          {activeTab === "notifications" && <Notifications />}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
