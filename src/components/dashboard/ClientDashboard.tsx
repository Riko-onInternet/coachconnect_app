import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, X, LogOut, Home as HomeIcon, Dumbbell, TrendingUp, MessageCircle } from 'lucide-react';
import Home from './Home';
import MyWorkouts from './MyWorkouts';
import Progress from './Progress';
import Messages from './Messages';
import Notifications from './Notifications';
import SelectTrainerModal from './SelectTrainerModal';
import { API_BASE_URL } from '@/utils/config';

type ActiveTab = 'home' | 'workouts' | 'progress' | 'messages';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasTrainer, setHasTrainer] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Aggiungi questo useEffect per controllare lo stato del trainer
  useEffect(() => {
    const checkTrainerStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/client/trainer-status`, { // Correggi questa riga
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setHasTrainer(data.hasTrainer || false);
        } else {
          console.error('Errore nel recupero dello stato del trainer');
          setHasTrainer(false);
        }
      } catch (error) {
        console.error('Errore nella richiesta:', error);
        setHasTrainer(false);
      } finally {
        setLoading(false); // Importante: imposta loading a false
      }
    };

    checkTrainerStatus();
  }, []);

  // Aggiungi questo useEffect per gestire il click esterno delle notifiche
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'workouts':
        return <MyWorkouts />;
      case 'progress':
        return <Progress />;
      case 'messages':
        return <Messages />;
      default:
        return <Home />;
    }
  };

  const menuItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: HomeIcon },
    { id: 'workouts' as ActiveTab, label: 'I miei allenamenti', icon: Dumbbell },
    { id: 'progress' as ActiveTab, label: 'Progressi', icon: TrendingUp },
    { id: 'messages' as ActiveTab, label: 'Messaggi', icon: MessageCircle },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeTab === item.id
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
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
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                >
                  <Bell className="h-6 w-6" />
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <Notifications />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Select Trainer Modal */}
      {hasTrainer === false && (
        <SelectTrainerModal
          onClose={() => {}}
          onSelect={(trainerId) => {
            console.log('Trainer selezionato:', trainerId);
            setHasTrainer(true);
          }}
        />
      )}
    </div>
  );
}
