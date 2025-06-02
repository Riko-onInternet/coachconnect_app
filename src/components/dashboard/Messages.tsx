import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { getUserId } from "@/utils/auth"; // Aggiungi questa importazione

interface Chat {
  id: string;
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  hasMessages: boolean;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export default function Messages() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/messages/chats", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        });

        // Verifica se la risposta è JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("La risposta del server non è in formato JSON");
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Errore nel caricamento delle chat");
        }

        setChats(data);
      } catch (error) {
        console.error("Errore nel caricamento delle chat:", error);
        setChats([]); // Imposta un array vuoto in caso di errore
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:3000/api/messages/${activeChat}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error("Errore nel caricamento dei messaggi:", error);
        }
      };

      fetchMessages();
    }
  }, [activeChat]);

  // Inizializza il socket una volta sola
  useEffect(() => {
    const token = localStorage.getItem("token");
    const newSocket = io("http://localhost:3000", {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket");
      newSocket.emit("join", getUserId());
    });

    newSocket.on("connect_error", (error: any) => {
      console.error("Errore di connessione socket:", error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []); // Esegui solo all'mount

  // Gestione messaggi e aggiornamenti chat
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message: Message) => {
      if (
        activeChat === message.senderId || 
        activeChat === message.receiverId
      ) {
        setMessages(prev => [...prev, message]);

        // Aggiorna la lista delle chat con l'ultimo messaggio
        setChats(prevChats =>
          prevChats.map(chat => {
            if (chat.userId === message.senderId || chat.userId === message.receiverId) {
              return {
                ...chat,
                lastMessage: message.content,
                lastMessageTime: message.timestamp,
                hasMessages: true,
                unreadCount: activeChat === message.senderId ? 0 : chat.unreadCount + 1
              };
            }
            return chat;
          })
        );
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, activeChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !socket) return;

    const currentUserId = getUserId();
    const messageData: Message = {
      id: `temp-${Date.now()}`, // Aggiungiamo un ID temporaneo
      senderId: currentUserId || "", // Assicuriamoci che non sia null
      receiverId: activeChat,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    socket.emit("message", messageData);

    // Aggiungi immediatamente il messaggio alla lista locale
    setMessages(prev => [...prev, messageData]);
    setNewMessage("");

    // Aggiorna la chat con l'ultimo messaggio
    setChats(prevChats =>
      prevChats.map(chat => {
        if (chat.userId === activeChat) {
          return {
            ...chat,
            lastMessage: messageData.content,
            lastMessageTime: messageData.timestamp,
            hasMessages: true
          };
        }
        return chat;
      })
    );
  };

  useEffect(() => {
    if (activeChat) {
      const markMessagesAsRead = async () => {
        try {
          const token = localStorage.getItem("token");
          await fetch(`http://localhost:3000/api/messages/${activeChat}/read`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error("Errore nella marcatura dei messaggi come letti:", error);
        }
      };

      markMessagesAsRead();
    }
  }, [activeChat]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] md:h-[calc(100vh-theme(spacing.8))]">
      {/* Lista chat */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Chat</h2>
          <div className="space-y-2">
            {chats.map((chat) => (
              <button
                key={chat.userId}
                onClick={() => setActiveChat(chat.userId)}
                className={`w-full p-3 flex items-center gap-3 rounded-lg transition-colors ${
                  activeChat === chat.userId
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium">{chat.userName}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage || "Nessun messaggio"}
                  </p>
                </div>
                {chat.lastMessageTime && (
                  <div className="text-xs text-gray-500">
                    {new Date(chat.lastMessageTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
                {chat.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Area messaggi */}
      {activeChat ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isCurrentUser = message.senderId === getUserId();
                  return (
                    <div
                      key={message.id || `${message.senderId}-${message.timestamp}`}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isCurrentUser
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Nessun messaggio. Inizia la conversazione!
              </div>
            )}
          </div>
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Scrivi un messaggio..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Invia
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Seleziona una chat per iniziare a messaggiare
        </div>
      )}
    </div>
  );
}