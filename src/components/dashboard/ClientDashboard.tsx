import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MyWorkouts from "@/components/dashboard/MyWorkouts";
import Progress from "@/components/dashboard/Progress";
import Messages from "@/components/dashboard/Messages";
import Notifications from "@/components/dashboard/Notifications";
import SelectTrainerModal from "@/components/dashboard/SelectTrainerModal";

export default function ClientDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("workouts");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [hasTrainer, setHasTrainer] = useState<boolean>(false);
  const [showTrainerModal, setShowTrainerModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkTrainerStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3000/api/client/trainer-status",
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
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
          <span className="font-semibold">Dashboard Cliente</span>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-gray-600 dark:text-gray-200 relative"
            >
              🔔
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
          ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:static top left-0 h-full w-64 bg-white dark:bg-gray-800shadow-lg transition-transform duration-300 ease-in-out z-30 md:min-h-screen flex flex-col justify-between `}
        >
          <nav className="mt-8 space-y-2 px-4">
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
              💪 I miei allenamenti
            </button>
            <button
              onClick={() => {
                setActiveTab("progress");
                setIsSidebarOpen(false);
              }}
              className={`w-full px-4 py-2 text-left rounded-lg ${
                activeTab === "progress"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              📈 Progressi
            </button>
            <button
              onClick={() => {
                setActiveTab("messages");
                setIsSidebarOpen(false);
              }}
              className={`w-full px-4 py-2 text-left rounded-lg ${
                activeTab === "messages"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              💬 Messaggi
            </button>
          </nav>

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
          <div className="absolute top-16 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
            <Notifications />
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0">
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
                "http://localhost:3000/api/client/request-trainer",
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
    </>
  );
}
