import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import MyWorkouts from "@/components/dashboard/MyWorkouts";
import Progress from "@/components/dashboard/Progress";
import Messages from "@/components/dashboard/Messages";
import Notifications from "@/components/dashboard/Notifications";
import SelectTrainerModal from "@/components/dashboard/SelectTrainerModal";
import { API_BASE_URL } from "@/utils/config";

export default function ClientDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("workouts");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [hasTrainer, setHasTrainer] = useState<boolean>(false);
  const [showTrainerModal, setShowTrainerModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Chiudi le notifiche quando si clicca fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkTrainerStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/api/client/trainer-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        // Mostra il modale solo se non c'è un trainer, non ci sono richieste pendenti 
        // e non c'è un collegamento attivo
        if (!data.trainerId && !data.hasPendingRequest && !data.hasActiveConnection) {
          setShowTrainerModal(true);
        }
      } catch (error) {
        console.error("Errore nel controllo dello stato del trainer:", error);
      } finally {
        setLoading(false);
      }
    };

    checkTrainerStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Overlay per la sidebar mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 lg:hidden bg-white dark:bg-gray-800 p-4 flex items-center justify-between shadow-lg z-10">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 dark:text-gray-200"
            aria-label="Toggle sidebar"
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
          <span className="font-semibold">Dashboard Cliente</span>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-gray-600 dark:text-gray-200 relative"
              aria-label="Notifiche"
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside
          className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 fixed lg:static top-0 left-0 h-full w-64 
          bg-white dark:bg-gray-800 shadow-lg transition-transform 
          duration-300 ease-in-out z-30 lg:min-h-screen flex flex-col justify-between`}
        >
          <div>
            {/* Logo o titolo */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 lg:block">
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">CoachConnect</h1>
            </div>
            
            <nav className="mt-8 space-y-2 px-4">
              <button
                onClick={() => {
                  setActiveTab("workouts");
                  setIsSidebarOpen(false);
                }}
                className={`w-full px-4 py-2 text-left rounded-lg flex items-center ${
                  activeTab === "workouts"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="mr-2">💪</span> I miei allenamenti
              </button>
              <button
                onClick={() => {
                  setActiveTab("progress");
                  setIsSidebarOpen(false);
                }}
                className={`w-full px-4 py-2 text-left rounded-lg flex items-center ${
                  activeTab === "progress"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="mr-2">📈</span> Progressi
              </button>
              <button
                onClick={() => {
                  setActiveTab("messages");
                  setIsSidebarOpen(false);
                }}
                className={`w-full px-4 py-2 text-left rounded-lg flex items-center ${
                  activeTab === "messages"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="mr-2">💬</span> Messaggi
              </button>
            </nav>
          </div>

          {/* Logout Button */}
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

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div 
            ref={notificationsRef}
            className="fixed top-16 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 max-h-[80vh] overflow-auto"
          >
            <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-medium">Notifiche</h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Notifications />
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1">
          {activeTab === "workouts" && <MyWorkouts />}
          {activeTab === "progress" && <Progress />}
          {activeTab === "messages" && <Messages />}
        </main>
      </div>

      {/* Modal per la selezione del trainer */}
      {showTrainerModal && (
        <SelectTrainerModal
          onClose={() => setShowTrainerModal(false)}
          onSelect={async (trainerId) => {
            try {
              const token = localStorage.getItem("token");
              const response = await fetch(
                `${API_BASE_URL}/api/client/request-trainer`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ trainerId }),
                }
              );

              if (response.ok) {
                setShowTrainerModal(false);
                // Mostra un messaggio di successo
                alert("Richiesta inviata con successo al trainer");
              }
            } catch (error) {
              console.error("Errore nell'invio della richiesta:", error);
            }
          }}
        />
      )}
    </div>
  );
}
