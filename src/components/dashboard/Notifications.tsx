import { useState, useEffect } from "react";
import { Notification } from "@/types/types";
import { API_BASE_URL } from "@/utils/config";
import { getValidToken } from "@/utils/auth";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = getValidToken();
        if (!token) {
          setNotifications([]);
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Errore nel recupero delle notifiche");
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Errore nel caricamento delle notifiche:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const token = getValidToken();
      if (!token) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Errore nella marcatura della notifica come letta");
      }

      setNotifications(
        notifications.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Errore nella marcatura della notifica:", error);
    }
  };

  const handleTrainerRequest = async (
    notificationId: string,
    accepted: boolean,
    clientId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/trainer/handle-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            notificationId,
            accepted,
            clientId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Errore nella gestione della richiesta");
      }

      // Rimuovi la notifica dalla lista
      setNotifications(notifications.filter((n) => n.id !== notificationId));

      // Mostra un messaggio di conferma
      alert(
        accepted ? "Richiesta accettata con successo" : "Richiesta rifiutata"
      );
    } catch (error) {
      console.error("Errore nella gestione della richiesta:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Notifiche</h2>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500">Non ci sono notifiche</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${
                !notification.read ? "border-l-4 border-blue-500" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {notification.content}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {/* Mostra i pulsanti per le notifiche di tipo TRAINER_REQUEST indipendentemente dallo stato di lettura */}
                  {notification.type === "TRAINER_REQUEST" &&
                    notification.data?.clientId && (
                      <>
                        <button
                          onClick={() =>
                            handleTrainerRequest(
                              notification.id,
                              true,
                              notification.data.clientId
                            )
                          }
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          Accetta
                        </button>
                        <button
                          onClick={() =>
                            handleTrainerRequest(
                              notification.id,
                              false,
                              notification.data.clientId
                            )
                          }
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Rifiuta
                        </button>
                      </>
                    )}
                  {/* Il pulsante "Segna come letto" rimane condizionato */}
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      Segna come letto
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
