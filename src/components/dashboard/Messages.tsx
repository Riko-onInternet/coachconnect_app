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
    <div className="flex h-[calc(100vh-theme(spacing.16))] md:h-[calc(100vh-theme(spacing.8))] bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      {/* Lista chat */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Messaggi</h2>
        </div>
        <div className="overflow-y-auto flex-1">
          {chats.length > 0 ? (
            <div className="space-y-1 p-2">
              {chats.map((chat) => (
                <button
                  key={chat.userId}
                  onClick={() => setActiveChat(chat.userId)}
                  className={`w-full p-3 flex items-center gap-3 rounded-lg transition-colors ${
                    activeChat === chat.userId
                      ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold">
                    {chat.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{chat.userName}</p>
                      {chat.lastMessageTime && (
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(chat.lastMessageTime).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {chat.lastMessage || "Nessun messaggio"}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
              Nessuna chat disponibile
            </div>
          )}
        </div>
      </div>

      {/* Area messaggi */}
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold mr-3">
              {chats.find(chat => chat.userId === activeChat)?.userName.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {chats.find(chat => chat.userId === activeChat)?.userName}
            </h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto" style={{ backgroundImage: 'url("/chat-bg-pattern.png")' }}>
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isCurrentUser = message.senderId === getUserId();
                  const showDate = index === 0 || 
                    new Date(message.timestamp).toDateString() !== 
                    new Date(messages[index - 1].timestamp).toDateString();
                  
                  return (
                    <div key={message.id || `${message.senderId}-${message.timestamp}`}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                            {new Date(message.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}>
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isCurrentUser
                              ? "bg-blue-500 text-white rounded-tr-none"
                              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                          <div className="flex items-center justify-end mt-1 space-x-1">
                            <p className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            {isCurrentUser && (
                              <span className="text-xs">
                                {message.read ? 
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
                                    <path d="M18 6L7 17l-5-5"/>
                                    <path d="M22 10L13 19l-3-3"/>
                                  </svg> : 
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
                                    <path d="M20 6L9 17l-5-5"/>
                                  </svg>
                                }
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <p className="mt-2">Nessun messaggio. Inizia la conversazione!</p>
              </div>
            )}
          </div>
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div className="flex gap-2 items-center">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                title="Allega file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Scrivi un messaggio..."
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newMessage.trim()}
                title="Invia messaggio"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-300">I tuoi messaggi</h3>
          <p className="mt-2 text-center max-w-md px-4">Seleziona una chat dalla lista per visualizzare i messaggi e iniziare a conversare</p>
        </div>
      )}
    </div>
  );
}